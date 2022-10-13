import { useEffect, useRef } from 'react';
import { DrawingContext, Vector2 } from '@/react-app-env';
import { drawMap, getTileScale } from '@/logic/worldMapRendering';
import { makeStyles } from '@/theme';
import { vector2 } from '@/logic/vector2';
import { useQuery } from '@/logic/queryUtils';
import { getMapInfo } from '@/logic/tileService';

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
    const query = useQuery(defaultQueryParams);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scrollingMap = useRef<{ pointerId: number, position: Vector2, threshold: boolean }>();

    const result = (
        <div className={classes.container}>
            <canvas
                className={classes.worldMap}
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
            />
        </div>
    );

    function redraw() {
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
            zoom: query.get('zoom'),
            position: {
                x: query.get('x'),
                y: query.get('y'),
            },
            continent: query.get('continent'),
            floor: query.get('floor'),
        };

        drawMap(drawingContext);
    }

    function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
        scrollingMap.current = {
            pointerId: e.pointerId,
            position: { x: e.pageX, y: e.pageY },
            threshold: false,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
        if (scrollingMap.current && scrollingMap.current.pointerId === e.pointerId) {
            const dX = e.pageX - scrollingMap.current.position.x;
            const dY = e.pageY - scrollingMap.current.position.y;
            const dragAllowed = scrollingMap.current.threshold || Math.abs(dX) > 3 || Math.abs(dY) > 3;
            if (dragAllowed) {
                if (!scrollingMap.current.threshold) {
                    scrollingMap.current.threshold = true;
                }
                const mapInfo = getMapInfo(query.get('continent'), query.get('floor'));
                const tileScale = getTileScale(query.get('zoom'), mapInfo.maxZoom);
                query.update('x', x => x - dX * tileScale);
                query.update('y', y => y - dY * tileScale);
                redraw();
                scrollingMap.current.position.x = e.pageX;
                scrollingMap.current.position.y = e.pageY;
            }
        }
    }

    function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
        if (scrollingMap.current && scrollingMap.current.pointerId === e.pointerId) {
            e.currentTarget.releasePointerCapture(e.pointerId);
            scrollingMap.current = undefined;
            query.replace();
        }
    }

    useEffect(redraw, [canvasRef]);
    useEffect(() => {
        query.replace();
        window.addEventListener('resize', redraw);
        return () => window.removeEventListener('resize', redraw);
    }, []);

    return result;
}
