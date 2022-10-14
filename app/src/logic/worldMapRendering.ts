import { DrawingContext, LastDrawInfo, MapInfo, TileSource, Vector2 } from '@/react-app-env';
import { downloadImage, imageIsCached } from '@/logic/imageCache';
import { getTileSource, getTileSourceFromParent, getTileSourcesFromChildren } from '@/logic/tileService';
import { getTranslation, v2add, v2scale, vector2 } from '@/logic/vector2';
import { theme } from '@/theme';

const drawCounts = new Map<CanvasRenderingContext2D, number>();

export function drawMap(ctx: DrawingContext): LastDrawInfo {
    const oldDrawCount = drawCounts.get(ctx.graphics);
    const drawCount = oldDrawCount === undefined ? 0 : oldDrawCount + 1;
    drawCounts.set(ctx.graphics, drawCount);

    ctx.graphics.save();
    ctx.graphics.clearRect(0, 0, ctx.size.x, ctx.size.y);
    ctx.graphics.fillStyle = theme.palette.primary.dark;
    ctx.graphics.fillRect(0, 0, ctx.size.x, ctx.size.y);

    const mapInfo = ctx.mapInfo;
    const tileScale = getTileScale(ctx.zoom, mapInfo.maxZoom);
    const tileZoom = Math.max(mapInfo.minZoom, Math.min(mapInfo.maxZoom, Math.ceil(ctx.zoom)));
    const renderScale = getRenderScale(ctx.zoom, mapInfo.minZoom, mapInfo.maxZoom);
    const worldTileSize = v2scale(mapInfo.tileSize, tileScale * renderScale, tileScale * renderScale);
    const canvasWorldSize = v2scale(ctx.size, tileScale, tileScale);
    const tileDimensions = getDimensions(canvasWorldSize, worldTileSize);
    const centerTileCoords = v2scale(ctx.position, 1 / worldTileSize.x, 1 / worldTileSize.y);
    const centerCanvasTileCoords = vector2(canvasWorldSize.x / 2 / worldTileSize.x, canvasWorldSize.y / 2 / worldTileSize.y);
    const offset = getTranslation(centerTileCoords, centerCanvasTileCoords);

    const ixMin = -Math.floor(tileDimensions.x / 2);
    const ixMax = Math.ceil(tileDimensions.x / 2);
    const iyMin = -Math.floor(tileDimensions.y / 2);
    const iyMax = Math.ceil(tileDimensions.y / 2);

    function drawMap(buffer: number): void {
        const halfBuffer = buffer / 2;
        for (let ix = ixMin; ix < ixMax; ix++) {
            const tileX = Math.floor(centerTileCoords.x) + ix;
            const dw = mapInfo.tileSize.x * renderScale;
            const dx = dw * (tileX + offset.x);

            for (let iy = iyMin; iy < iyMax; iy++) {
                const tileY = Math.floor(centerTileCoords.y) + iy;
                const dh = mapInfo.tileSize.y * renderScale;
                const dy = dh * (tileY + offset.y);
                const source = getTileSource(ctx.continent, ctx.floor, tileZoom, tileX, tileY);
                if (!source) { continue; }
                const imgPromise = downloadImage(source.url);
                imgPromise.promise.then((img) => {
                    if (drawCounts.get(ctx.graphics) === drawCount) {
                        ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx - halfBuffer, dy - halfBuffer, dw + buffer, dh + buffer);
                    }
                });
            }
        }
    }

    function tryCache(source: TileSource|undefined): void {
        if (source && !imageIsCached(source.url)) {
            downloadImage(source.url);
        }
    }

    function cacheSurroundingFloors(): void {
        for (let ix = ixMin; ix < ixMax; ix++) {
            const tileX = Math.floor(centerTileCoords.x) + ix;

            for (let iy = iyMin; iy < iyMax; iy++) {
                const tileY = Math.floor(centerTileCoords.y) + iy;
                const parentSource = getTileSourceFromParent(ctx.continent, ctx.floor, tileZoom, tileX, tileY);
                tryCache(parentSource);
                getTileSourcesFromChildren(ctx.continent, ctx.floor, tileZoom, tileX, tileY)?.forEach(source => {
                    tryCache(source);
                });
            }
        }
    }

    function cacheSurroundingTiles(range: number): void {
        const xLow = ixMin - 1;
        const xHigh = ixMax;
        const yLow = iyMin - 1;
        const yHigh = iyMax;
        for (let r = 0; r < range; r++) {
            for (let iy = iyMin; iy < iyMax; iy++) {
                const tileY = Math.floor(centerTileCoords.y) + iy;
                tryCache(getTileSource(ctx.continent, ctx.floor, tileZoom, xLow - r, tileY));
                tryCache(getTileSource(ctx.continent, ctx.floor, tileZoom, xHigh + r, tileY));
            }
            for (let ix = ixMin; ix < ixMax; ix++) {
                const tileX = Math.floor(centerTileCoords.x) + ix;
                tryCache(getTileSource(ctx.continent, ctx.floor, tileZoom, tileX, yLow - r));
                tryCache(getTileSource(ctx.continent, ctx.floor, tileZoom, tileX, yHigh + r));
            }
        }
    }

    drawMap(1); // prevents visible seams
    drawMap(0); // prevents weird transitions

    cacheSurroundingFloors();
    cacheSurroundingTiles(1);

    ctx.graphics.restore();

    return {
        tileScale,
        worldTileSize,
        renderScale,
        minZoom: mapInfo.minZoom,
        maxZoom: mapInfo.maxZoom,
    };
}

export function getTileScale(zoom: number, maxZoom: number): number {
    return 2 ** (maxZoom - zoom);
}

export function getRenderScale(zoom: number, minZoom: number, maxZoom: number): number {
    const tileZoom = Math.max(minZoom, Math.min(maxZoom, Math.ceil(zoom)));
    return 2 ** (zoom - tileZoom);
}

export function getPixelWorldSize(zoom: number, minZoom: number, maxZoom: number): number {
    return getTileScale(zoom, maxZoom) * getRenderScale(zoom, minZoom, maxZoom);
}

function getDimensions(canvasWorldSize: Vector2, tileSize: Vector2): Vector2 {
    const x = Math.ceil(canvasWorldSize.x / tileSize.x / 2) * 2 + 1;
    const y = Math.ceil(canvasWorldSize.y / tileSize.y / 2) * 2 + 1;
    return vector2(x, y);
}

export function canvasToWorld(vector: Vector2, centerWorldPos: Vector2, canvasSize: Vector2, mapInfo: MapInfo, zoom: number): Vector2 {
    const tileScale = getTileScale(zoom, mapInfo.maxZoom);
    const centerFloatCanvasPos = vector2(canvasSize.x / 2, canvasSize.y / 2);
    const centerFloatWorldPos = v2scale(centerFloatCanvasPos, tileScale, tileScale);
    const centerWorldOffset = getTranslation(centerFloatWorldPos, centerWorldPos);
    const floatWorldPos = v2scale(vector, tileScale, tileScale);
    const worldPos = v2add(floatWorldPos, centerWorldOffset);
    return worldPos;
}

export function worldToCanvas(vector: Vector2, centerWorldPos: Vector2, canvasSize: Vector2, mapInfo: MapInfo, zoom: number): Vector2 {
    const tileScale = getTileScale(zoom, mapInfo.maxZoom);
    const tileScaleInv = 1 / tileScale;
    const centerFloatCanvasPos = vector2(canvasSize.x / 2, canvasSize.y / 2);
    const centerCanvasPos = v2scale(centerWorldPos, tileScaleInv, tileScaleInv);
    const centerCanvasOffset = getTranslation(centerCanvasPos, centerFloatCanvasPos);
    const worldPos = v2scale(vector, tileScaleInv, tileScaleInv);
    const canvasPos = v2add(worldPos, centerCanvasOffset);
    return canvasPos;
}
