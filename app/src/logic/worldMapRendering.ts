import { DrawingContext, LastDrawInfo, TileSource } from '@/react-app-env';
import { downloadImage, imageIsCached } from '@/logic/imageCache';
import { getTileSource, getTileSourceFromParent, getTileSourcesFromChildren } from '@/logic/tileService';
import { getTranslation, v2scale, vector2 } from '@/logic/vector2';
import { theme } from '@/theme';
import { getTileScale, getRenderScale, getDimensions, worldToCanvas } from '@/logic/worldMapUtils';

const drawCounts = new Map<CanvasRenderingContext2D, number>();

export function drawMap(ctx: DrawingContext): LastDrawInfo {
    const oldDrawCount = drawCounts.get(ctx.graphics);
    const drawCount = oldDrawCount === undefined ? 0 : oldDrawCount + 1;
    drawCounts.set(ctx.graphics, drawCount);

    function createInMemoryCanvas(): CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        canvas.width = ctx.size.x;
        canvas.height = ctx.size.y;
        const renderContext = canvas.getContext('2d');
        return renderContext!;
    }

    const tileGraphics = createInMemoryCanvas();
    const overlayGraphics = createInMemoryCanvas();

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

    function combineCanvas(): void {
        ctx.graphics.drawImage(tileGraphics.canvas, 0, 0);
        ctx.graphics.drawImage(overlayGraphics.canvas, 0, 0);
    }

    function drawAllTiles(): void {
        function drawTiles(buffer: number): void {
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
                        tileGraphics.drawImage(imgPromise.result, source.x, source.y, source.width, source.height, dx - halfBuffer, dy - halfBuffer, dw + buffer, dh + buffer);
                    } else if (!imgPromise.rejected) {
                        imgPromise.promise.then((img) => {
                            if (drawCounts.get(ctx.graphics) === drawCount) {
                                tileGraphics.drawImage(img, source.x, source.y, source.width, source.height, dx - halfBuffer, dy - halfBuffer, dw + buffer, dh + buffer);
                                combineCanvas();
                            }
                        });
                    }
                }
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

        tileGraphics.clearRect(0, 0, ctx.size.x, ctx.size.y);
        tileGraphics.fillStyle = theme.palette.primary.dark;
        tileGraphics.fillRect(0, 0, ctx.size.x, ctx.size.y);

        drawTiles(1); // prevents visible seams
        drawTiles(0); // prevents weird transitions

        cacheSurroundingFloors();
        cacheSurroundingTiles(1);
    }

    function drawOverlay(): void {
        const start = vector2(50432, 24448);
        const end = vector2(56576, 37760);
        const startCanvas = worldToCanvas(start, ctx.position, ctx.size, ctx.mapInfo, ctx.zoom);
        const endCanvas = worldToCanvas(end, ctx.position, ctx.size, ctx.mapInfo, ctx.zoom);
        console.log('startCanvas:');
        console.log(startCanvas);
        console.log('endCanvas:');
        console.log(endCanvas);

        overlayGraphics.strokeStyle = 'red';
        overlayGraphics.strokeRect(ctx.size.x / 2 - 5, ctx.size.y / 2 - 5, 10, 10);
        overlayGraphics.strokeRect(startCanvas.x, startCanvas.y, endCanvas.x - startCanvas.x, endCanvas.y - startCanvas.y);
    }

    ctx.graphics.save();
    drawAllTiles();
    drawOverlay();
    combineCanvas();
    ctx.graphics.restore();

    return {
        tileScale,
        worldTileSize,
        renderScale,
        minZoom: mapInfo.minZoom,
        maxZoom: mapInfo.maxZoom,
    };
}

function tryCache(source: TileSource|undefined): void {
    if (source && !imageIsCached(source.url)) {
        downloadImage(source.url);
    }
}
