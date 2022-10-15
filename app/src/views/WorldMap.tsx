import { useEffect, useRef } from 'react';
import { DrawingContext, LastDrawInfo, MapInfo, Vector2 } from '@/react-app-env';
import { drawMap } from '@/logic/worldMapRendering';
import { makeStyles } from '@/theme';
import { getTranslation, vector2 } from '@/logic/vector2';
import { useQuery } from '@/logic/queryUtils';
import { getMapInfo } from '@/logic/tileService';
import { canvasToWorld } from '@/logic/worldMapUtils';

const defaultQueryParams = {
    continent: 1,
    floor: 1,
    zoom: 2,
    x: 81920 / 2,
    y: 114688 / 2,
};

const useStyles = makeStyles()(() => {
    return {
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexFlow: 'column',
        },
        worldMap: {
            flex: 1,
            minHeight: 0,
        },
    };
});

export default function WorldMap() {
    const { classes } = useStyles();
    const queryRef = useRef(useQuery(defaultQueryParams));

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lastDrawInfoRef = useRef<LastDrawInfo>();
    const scrollingMap = useRef<{ pointerId: number, position: Vector2, threshold: boolean }>();

    const result = (
        <div className={classes.container}>
            <canvas
                className={classes.worldMap}
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onWheel={handleWheel}
            />
        </div>
    );

    function getCurrentMapInfo(): MapInfo {
        return getMapInfo(queryRef.current.get('continent'), queryRef.current.get('floor'));
    }

    function redraw(): void {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const drawingContext:DrawingContext = {
            graphics: ctx,
            size: vector2(canvas.width, canvas.height),
            zoom: queryRef.current.get('zoom'),
            position: {
                x: queryRef.current.get('x'),
                y: queryRef.current.get('y'),
            },
            continent: queryRef.current.get('continent'),
            floor: queryRef.current.get('floor'),
            mapInfo: getCurrentMapInfo(),
        };

        lastDrawInfoRef.current = drawMap(drawingContext);
    }

    function getCenterWorldPosition(): Vector2 {
        return vector2(queryRef.current.get('x'), queryRef.current.get('y'));
    }

    function getCanvasSize(): Vector2  {
        return vector2(canvasRef.current?.width ?? -1, canvasRef.current?.height ?? -1);
    }

    function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>): void {
        scrollingMap.current = {
            pointerId: e.pointerId,
            position: { x: e.pageX, y: e.pageY },
            threshold: false,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>): void {
        if (scrollingMap.current && scrollingMap.current.pointerId === e.pointerId) {
            const mapInfo = getCurrentMapInfo();
            const dX = e.pageX - scrollingMap.current.position.x;
            const dY = e.pageY - scrollingMap.current.position.y;
            const dragAllowed = scrollingMap.current.threshold || Math.abs(dX) > 3 || Math.abs(dY) > 3;
            if (dragAllowed) {
                if (!scrollingMap.current.threshold) {
                    scrollingMap.current.threshold = true;
                }

                if (lastDrawInfoRef.current) {
                    const tileScale = lastDrawInfoRef.current.tileScale;
                    queryRef.current.update('x', x => Math.max(0, Math.min(mapInfo.size.x, x - dX * tileScale)));
                    queryRef.current.update('y', y => Math.max(0, Math.min(mapInfo.size.y, y - dY * tileScale)));
                    redraw();
                }

                scrollingMap.current.position.x = e.pageX;
                scrollingMap.current.position.y = e.pageY;
            }
        }
    }

    function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>): void {
        if (scrollingMap.current && scrollingMap.current.pointerId === e.pointerId) {
            e.currentTarget.releasePointerCapture(e.pointerId);
            scrollingMap.current = undefined;
            queryRef.current.replace();
        }
    }

    function handleWheel(e: React.WheelEvent<HTMLCanvasElement>): void {
        const mapInfo = getCurrentMapInfo();
        const oldZoom = queryRef.current.get('zoom');
        const zoomDelta = e.deltaY / 300;
        const newZoomUncorrected = oldZoom - zoomDelta;
        const newZoom = !newZoomUncorrected ? 0 : Math.max(0, Math.min(mapInfo.maxZoom + 2, parseFloat(newZoomUncorrected.toPrecision(3))));
        queryRef.current.set('zoom', newZoom);

        if (canvasRef.current) {
            const mouseCanvasPos = vector2(e.clientX - canvasRef.current.offsetLeft, e.clientY - canvasRef.current.offsetTop);
            const centerWorldPos = getCenterWorldPosition();
            const canvasSize = getCanvasSize();
            const oldMouseWorldPos = canvasToWorld(mouseCanvasPos, centerWorldPos, canvasSize, mapInfo, oldZoom);
            const newMouseWorldPos = canvasToWorld(mouseCanvasPos, centerWorldPos, canvasSize, mapInfo, newZoom);
            const offset = getTranslation(newMouseWorldPos, oldMouseWorldPos);
            queryRef.current.update('x', x => Math.max(0, Math.min(mapInfo.size.x, x + offset.x)));
            queryRef.current.update('y', y => Math.max(0, Math.min(mapInfo.size.y, y + offset.y)));
        }

        queryRef.current.replace();

        redraw();
    }

    function clampPositioning(): void {
        const mapInfo = getCurrentMapInfo();
        const query = queryRef.current;
        query.update('x', x => Math.max(0, Math.min(mapInfo.size.x, x)));
        query.update('y', y => Math.max(0, Math.min(mapInfo.size.y, y)));
        query.update('zoom', z => Math.max(0, Math.min(mapInfo.maxZoom + 2, z)));
    }

    useEffect(() => {
        redraw();
        clampPositioning();
        queryRef.current.replace();
        window.addEventListener('resize', redraw);
        return () => window.removeEventListener('resize', redraw);
    }, []);

    return result;
}
