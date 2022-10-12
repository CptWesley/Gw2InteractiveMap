import { DrawingContext, Vector2 } from '@/react-app-env';
import { downloadImage } from '@/logic/imageCache';
import { getMapInfo, getTileSource } from '@/logic/tileService';
import { getTranslation, scale, vector2 } from '@/logic/vector2';
import { theme } from '@/theme';

const drawCounts = new Map<CanvasRenderingContext2D, number>();

export function drawMap(ctx: DrawingContext) {
    const oldDrawCount = drawCounts.get(ctx.graphics);
    const drawCount = oldDrawCount === undefined ? 0 : oldDrawCount + 1;
    drawCounts.set(ctx.graphics, drawCount);

    ctx.graphics.clearRect(0, 0, ctx.size.x, ctx.size.y);
    ctx.graphics.fillStyle = theme.palette.primary.dark;
    ctx.graphics.fillRect(0, 0, ctx.size.x, ctx.size.y);

    const mapInfo = getMapInfo(ctx.continent, ctx.floor);
    const tileScale = getTileScale(ctx.zoom, mapInfo.maxZoom);
    const worldTileSize = scale(mapInfo.tileSize, tileScale, tileScale);
    const tileZoom = Math.ceil(ctx.zoom);
    const canvasWorldSize = scale(ctx.size, tileScale, tileScale);
    const tileDimensions = getDimensions(canvasWorldSize, worldTileSize);
    const centerTileCoords = scale(ctx.position, 1 / worldTileSize.x, 1 / worldTileSize.y);
    const centerCanvasTileCoords = vector2(canvasWorldSize.x / 2 / worldTileSize.x, canvasWorldSize.y / 2 / worldTileSize.y);
    const offset = getTranslation(centerTileCoords, centerCanvasTileCoords);

    const ixMin = -Math.floor(tileDimensions.x / 2);
    const ixMax = Math.ceil(tileDimensions.x / 2);
    const iyMin = -Math.floor(tileDimensions.y / 2);
    const iyMax = Math.ceil(tileDimensions.y / 2);
    for (let ix = ixMin; ix < ixMax; ix++) {
        const tileX = Math.floor(centerTileCoords.x) + ix;
        const dw = mapInfo.tileSize.x;
        const dx = dw * (tileX + offset.x);

        for (let iy = iyMin; iy < iyMax; iy++) {
            const tileY = Math.floor(centerTileCoords.y) + iy;
            const dh = mapInfo.tileSize.y;
            const dy = dh * (tileY + offset.y);
            const source = getTileSource(ctx.continent, ctx.floor, tileZoom, tileX, tileY);
            if (!source) { continue; }
            const imgPromise = downloadImage(source.url);

            if (imgPromise.resolved) {
                const img = imgPromise.result;
                ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx - 0.5, dy - 0.5, dw + 1, dh + 1);
            } else if (!imgPromise.rejected) {
                imgPromise.promise.then((img) => {
                    if (drawCounts.get(ctx.graphics) === drawCount) {
                        ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx, dy, dw, dh);
                    }
                });
            }
        }
    }
    for (let ix = ixMin; ix < ixMax; ix++) {
        const tileX = Math.floor(centerTileCoords.x) + ix;
        const dw = mapInfo.tileSize.x;
        const dx = dw * (tileX + offset.x);

        for (let iy = iyMin; iy < iyMax; iy++) {
            const tileY = Math.floor(centerTileCoords.y) + iy;
            const dh = mapInfo.tileSize.y;
            const dy = dh * (tileY + offset.y);
            const source = getTileSource(ctx.continent, ctx.floor, tileZoom, tileX, tileY);
            if (!source) { continue; }
            const imgPromise = downloadImage(source.url);

            if (imgPromise.resolved) {
                const img = imgPromise.result;
                ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx, dy, dw, dh);
            } else if (!imgPromise.rejected) {
                imgPromise.promise.then((img) => {
                    if (drawCounts.get(ctx.graphics) === drawCount) {
                        ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx, dy, dw, dh);
                    }
                });
            }
        }
    }
}

function getTileScale(zoom: number, maxZoom: number): number {
    return 2 ** (maxZoom - zoom);
}

function getDimensions(canvasWorldSize: Vector2, tileSize: Vector2): Vector2 {
    const x = Math.ceil(canvasWorldSize.x / tileSize.x / 2) * 2 + 1;
    const y = Math.ceil(canvasWorldSize.y / tileSize.y / 2) * 2 + 1;
    return vector2(x, y);
}

/*
function canvasToWorld(pos: Vector2, power: number): Vector2 {
    return scale(pos, power, power);
}
*/
/*
function worldToCanvas(pos: Vector2, power: number): Vector2 {
    const inv = 1 / power;
    return scale(pos, inv, inv);
}

function getDimensions(canvasSize: Vector2, tileSize: Vector2): Vector2 {
    const x = Math.ceil(canvasSize.x / tileSize.x / 2) * 2 + 3;
    const y = Math.ceil(canvasSize.y / tileSize.y / 2) * 2 + 3;

    return vector2(x, y);
}

function getMinimapTilePosition(centerWorldPos: Vector2, worldPos: Vector2, canvasSize: Vector2, zoom: number, tileScale: number): Vector2 {
    // Gets the number of tiles that should be rendered in X/Y
    const dimensions = getDimensions(canvasSize.x * zoom / tileScale, canvasSize.y * zoom / tileScale);
}
*/
