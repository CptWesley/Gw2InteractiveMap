import { DrawingContext } from '@/react-app-env';
import { downloadImage } from '@/logic/imageCache';
import { getMapInfo, getTileSource } from '@/logic/tileService';

const drawCounts = new Map<CanvasRenderingContext2D, number>();

export function drawMap(ctx: DrawingContext) {
    const oldDrawCount = drawCounts.get(ctx.graphics);
    const drawCount = oldDrawCount === undefined ? 0 : oldDrawCount + 1;
    drawCounts.set(ctx.graphics, drawCount);

    const mapInfo = getMapInfo(ctx.continent, ctx.floor);
    const realZoom = mapInfo.maxZoom - ctx.zoom;
    const power = Math.pow(2, realZoom);
    const tileWidth = mapInfo.tileWidth * power;
    const tileHeight = mapInfo.tileHeight * power;
    const mapWorldWidth = ctx.width * power;
    const mapWorldHeight = ctx.height * power;
    const tileZoom = Math.ceil(ctx.zoom);
    const xTiles = Math.ceil(mapWorldWidth / tileWidth);
    const yTiles = Math.ceil(mapWorldHeight / tileHeight);

    ctx.graphics.clearRect(0, 0, ctx.width, ctx.height);
    ctx.graphics.fillStyle = 'black';
    ctx.graphics.fillRect(0, 0, ctx.width, ctx.height);

    for (let x = 0; x < xTiles; x++) {
        for (let y = 0; y < yTiles; y++) {
            const source = getTileSource(ctx.continent, ctx.floor, tileZoom, x, y);
            if (!source) { continue; }
            const imgPromise = downloadImage(source.url);

            const dx = mapInfo.tileWidth * x;
            const dy = mapInfo.tileHeight * y;
            const dw = mapInfo.tileWidth;
            const dh = mapInfo.tileHeight;

            if (imgPromise.resolved) {
                const img = imgPromise.result;
                ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx, dy, dw, dh);
            } else {
                imgPromise.promise.then((img) => {
                    if (drawCounts.get(ctx.graphics) === drawCount) {
                        ctx.graphics.drawImage(img, source.x, source.y, source.width, source.height, dx, dy, dw, dh);
                    }
                });
            }
        }
    }
}
