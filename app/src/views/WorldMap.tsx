import { useEffect, useRef, useState } from 'react';
import { DrawingContext, LastDrawInfo, MapInfo, Vector2 } from '@/global';
import { drawMap } from '@/logic/worldMapRendering';
import { makeStyles, theme } from '@/theme';
import { getTranslation, v2equal, vector2 } from '@/logic/utility/vector2';
import { useQuery } from '@/logic/utility/queryUtils';
import { getMapInfo } from '@/logic/tileData/tileService';
import { canvasToWorld as canvasToWorldInternal, getLocation } from '@/logic/worldMapUtils';
import { Fab, Tooltip, Typography } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import React from 'react';
import SettingsDrawer from '@/Components/SettingsDrawer';
import { getEnabledExpansions, getSettings } from '@/logic/settingsStorage';
import { debounce, throttle } from 'lodash-es';

const defaultQueryParams = {
    map: 'tyria',
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
            position: 'relative',
        },
        worldMap: {
            flex: 1,
            minHeight: 0,
        },
        settingsDrawer: {
            minHeight: 0,
        },
        settingsOpenButton: {
            position: 'absolute',
            left: '8px',
            top: '12px',
        },
        mousePositionText: {
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontSize: 20,
            textShadow: '1px 1px rgba(0, 0, 0, 0.8)',
        },
    };
});

export default function WorldMap() {
    const { classes } = useStyles();
    const queryRef = useRef(useQuery(defaultQueryParams));

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePositionText, setMousePositionText] = useState<string>('Unknown');
    const lastDrawInfoRef = useRef<LastDrawInfo>();
    const scrollingMap = useRef<{ pointerId: number, position: Vector2, threshold: boolean }>();
    const [settingsOpenState, setSettingsOpenState] = React.useState(false);

    const updateLocationTextDebounced = useRef(debounce(updateLocationText, 150));
    const updateLocationTextThrottled = useRef(throttle(updateLocationText, 100));
    const lastMouseWorldPos = useRef(vector2(0, 0));

    const result = (
        <div
            ref={containerRef}
            className={classes.container}>
            <canvas
                ref={canvasRef}
                className={classes.worldMap}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onWheel={handleWheel}
            />
            <Tooltip title='Open Settings'>
                <Fab
                    className={classes.settingsOpenButton}
                    hidden={settingsOpenState}
                    size='small'
                    style={{
                        backgroundColor: theme.palette.primary.light,
                    }}
                    onClick={() => setSettingsOpenState(true)}>
                    <ChevronRight />
                </Fab>
            </Tooltip>
            <SettingsDrawer
                container={containerRef.current}
                open={settingsOpenState}
                onCloseButtonPressed={() => setSettingsOpenState(false)}
                onSettingsChanged={handleSettingsChanged}
            />
            <Typography
                className={classes.mousePositionText}>
                {mousePositionText}
            </Typography>
        </div>
    );

    function getCurrentMapInfo(): MapInfo {
        return getMapInfo(queryRef.current.get('map'));
    }

    function handleSettingsChanged(): void {
        redraw();
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
            settings: getSettings(),
            expansions: getEnabledExpansions(),
            graphics: ctx,
            size: vector2(canvas.width, canvas.height),
            zoom: queryRef.current.get('zoom'),
            position: {
                x: queryRef.current.get('x'),
                y: queryRef.current.get('y'),
            },
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

    function canvasToWorld(canvasPos: Vector2): Vector2 {
        const centerWorldPos = getCenterWorldPosition();
        const canvasSize = getCanvasSize();
        return canvasToWorldInternal(canvasPos, centerWorldPos, canvasSize, getCurrentMapInfo(), queryRef.current.get('zoom'));
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
        if (!canvasRef.current) {
            return;
        }

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
        } else {
            const canvasBoundaries = canvasRef.current.getBoundingClientRect();
            const mouseCanvasPos = vector2(e.clientX - canvasBoundaries.left, e.clientY - canvasBoundaries.top);
            const mouseWorldPos = canvasToWorld(mouseCanvasPos);
            updateLocationTextThrottled.current(mouseWorldPos);
            updateLocationTextDebounced.current(mouseWorldPos);
        }
    }

    function updateLocationText(pos: Vector2): void {
        if (v2equal(pos, lastMouseWorldPos.current)) {
            return;
        }

        lastMouseWorldPos.current = pos;

        console.log('Foo');

        const location = getLocation(queryRef.current.get('map'), pos);
        let locationString = location.map.name;

        if (location.zone) {
            locationString += ` / ${location.zone.name}`;

            if (location.area) {
                locationString += ` / ${location.area.name}`;
            }
        }

        setMousePositionText(`${locationString} [${Math.floor(pos.x)}, ${Math.floor(pos.y)}]`);
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
        const zoomDelta = e.deltaY / 400;
        const newZoomUncorrected = oldZoom - zoomDelta;
        const newZoom = !newZoomUncorrected ? 0 : Math.max(0, Math.min(mapInfo.maxZoom + 2, parseFloat(newZoomUncorrected.toPrecision(3))));
        queryRef.current.set('zoom', newZoom);

        if (canvasRef.current) {
            const canvasBoundaries = canvasRef.current.getBoundingClientRect();
            const mouseCanvasPos = vector2(e.clientX - canvasBoundaries.left, e.clientY - canvasBoundaries.top);
            const centerWorldPos = getCenterWorldPosition();
            const canvasSize = getCanvasSize();
            const oldMouseWorldPos = canvasToWorldInternal(mouseCanvasPos, centerWorldPos, canvasSize, mapInfo, oldZoom);
            const newMouseWorldPos = canvasToWorldInternal(mouseCanvasPos, centerWorldPos, canvasSize, mapInfo, newZoom);
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
