import { DrawingContext, LastDrawInfo, Vector2 } from '@/react-app-env';
import { downloadImage } from '@/logic/imageCache';
import { getMapInfo, getTileSource } from '@/logic/tileService';
import { getTranslation, scale, vector2 } from '@/logic/vector2';
import { theme } from '@/theme';

const drawCounts = new Map<CanvasRenderingContext2D, number>();

export function drawMap(ctx: DrawingContext): LastDrawInfo {
    const oldDrawCount = drawCounts.get(ctx.graphics);
    const drawCount = oldDrawCount === undefined ? 0 : oldDrawCount + 1;
    drawCounts.set(ctx.graphics, drawCount);

    ctx.graphics.clearRect(0, 0, ctx.size.x, ctx.size.y);
    ctx.graphics.fillStyle = theme.palette.primary.dark;
    ctx.graphics.fillRect(0, 0, ctx.size.x, ctx.size.y);

    const mapInfo = getMapInfo(ctx.continent, ctx.floor);
    const tileScale = getTileScale(ctx.zoom, mapInfo.maxZoom);
    const tileZoom = Math.max(mapInfo.minZoom, Math.min(mapInfo.maxZoom, Math.ceil(ctx.zoom)));
    const renderScale = 2 ** (ctx.zoom - tileZoom);
    const worldTileSize = scale(mapInfo.tileSize, tileScale * renderScale, tileScale * renderScale);
    const canvasWorldSize = scale(ctx.size, tileScale, tileScale);
    const tileDimensions = getDimensions(canvasWorldSize, worldTileSize);
    const centerTileCoords = scale(ctx.position, 1 / worldTileSize.x, 1 / worldTileSize.y);
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

                if (imgPromise.resolved) {
                    const img = imgPromise.result;
                    ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx - halfBuffer, dy - halfBuffer, dw + buffer, dh + buffer);
                } else if (!imgPromise.rejected) {
                    imgPromise.promise.then((img) => {
                        if (drawCounts.get(ctx.graphics) === drawCount) {
                            ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx - halfBuffer, dy - halfBuffer, dw + buffer, dh + buffer);
                        }
                    });
                }
            }
        }
    }

    drawMap(1); // prevents visible seams
    drawMap(0); // prevents weird transitions

    ctx.graphics.strokeStyle = 'red';
    ctx.graphics.strokeRect(ctx.size.x / 2 - 5, ctx.size.y / 2 - 5, 10, 10);

    return {
        tileScale,
    };
}

export function getTileScale(zoom: number, maxZoom: number): number {
    return 2 ** (maxZoom - zoom);
}

function getDimensions(canvasWorldSize: Vector2, tileSize: Vector2): Vector2 {
    const x = Math.ceil(canvasWorldSize.x / tileSize.x / 2) * 2 + 1;
    const y = Math.ceil(canvasWorldSize.y / tileSize.y / 2) * 2 + 1;
    return vector2(x, y);
}
