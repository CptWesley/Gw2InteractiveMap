import { AdditionalZoneData, Area, DrawingContext, SelectableCanvasEntity, LastDrawInfo, TileSource, Vector2, Zone, Region, AdditionalRegionData } from '@/global';
import { downloadImage, imageIsCached } from '@/logic/imageCache';
import { getTileSource, getTileSourceFromParent, getTileSourcesFromChildren } from '@/logic/tileData/tileService';
import { getTranslation, v2scale, vector2 } from '@/logic/utility/vector2';
import { theme } from '@/theme';
import { getTileScale, getRenderScale, getDimensions, worldToCanvas as worldToCanvasInternal } from '@/logic/worldMapUtils';
import { icons } from '@/logic/mapIcons';
import { TrackedPromise } from '@/logic/TrackedPromise';
import worldData from '@/logic/mapData/worldData';
import { forEachValue, forEachEntry } from '@/logic/utility/util';
import { regions, zones } from './mapData/additionalData/additionalData';
import { expansions } from './mapData/additionalData/expansions';

type DrawnIcon = {
    worldPos: Vector2,
    canvasPos: Vector2,
    size: Vector2,
};

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

    function worldToCanvas(worldPos: Vector2): Vector2 {
        return worldToCanvasInternal(worldPos, ctx.position, ctx.size, ctx.mapInfo, ctx.zoom);
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
                    const source = getTileSource(ctx.mapInfo.id, tileZoom, tileX, tileY);
                    if (!source) { continue; }
                    downloadImage(source.url).now(img => {
                        tileGraphics.drawImage(img, source.x, source.y, source.width, source.height, dx - halfBuffer, dy - halfBuffer, dw + buffer, dh + buffer);
                    }).then(img => {
                        if (drawCounts.get(ctx.graphics) === drawCount) {
                            tileGraphics.drawImage(img, source.x, source.y, source.width, source.height, dx - halfBuffer, dy - halfBuffer, dw + buffer, dh + buffer);
                            combineCanvas();
                        }
                    });
                }
            }
        }

        function cacheSurroundingFloors(): void {
            for (let ix = ixMin; ix < ixMax; ix++) {
                const tileX = Math.floor(centerTileCoords.x) + ix;

                for (let iy = iyMin; iy < iyMax; iy++) {
                    const tileY = Math.floor(centerTileCoords.y) + iy;
                    const parentSource = getTileSourceFromParent(ctx.mapInfo.id, tileZoom, tileX, tileY);
                    tryCache(parentSource);
                    getTileSourcesFromChildren(ctx.mapInfo.id, tileZoom, tileX, tileY)?.forEach(source => {
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
                    tryCache(getTileSource(ctx.mapInfo.id, tileZoom, xLow - r, tileY));
                    tryCache(getTileSource(ctx.mapInfo.id, tileZoom, xHigh + r, tileY));
                }
                for (let ix = ixMin; ix < ixMax; ix++) {
                    const tileX = Math.floor(centerTileCoords.x) + ix;
                    tryCache(getTileSource(ctx.mapInfo.id, tileZoom, tileX, yLow - r));
                    tryCache(getTileSource(ctx.mapInfo.id, tileZoom, tileX, yHigh + r));
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

    function drawOverlay(): SelectableCanvasEntity[] {

        const hidden = {
            icons: ctx.zoom < ctx.settings.showIconDistanceMin || ctx.zoom >= ctx.settings.showIconDistanceMax,
            regionBorder: ctx.zoom < ctx.settings.showRegionBorderDistanceMin || ctx.zoom >= ctx.settings.showRegionBorderDistanceMax,
            regionText: ctx.zoom < ctx.settings.showRegionTextDistanceMin || ctx.zoom >= ctx.settings.showRegionTextDistanceMax,
            zoneBorder: ctx.zoom < ctx.settings.showZoneBorderDistanceMin || ctx.zoom >= ctx.settings.showZoneBorderDistanceMax,
            zoneText: ctx.zoom < ctx.settings.showZoneTextDistanceMin || ctx.zoom >= ctx.settings.showZoneTextDistanceMax,
            areaBorder: ctx.zoom < ctx.settings.showAreaBorderDistanceMin || ctx.zoom >= ctx.settings.showAreaBorderDistanceMax,
            areaText: ctx.zoom < ctx.settings.showAreaTextDistanceMin || ctx.zoom >= ctx.settings.showAreaTextDistanceMax,
        };

        function drawIcon(imgPromise: TrackedPromise<HTMLImageElement>, worldPos: Vector2, w?: number, h?: number): DrawnIcon {
            const canvasPos = worldToCanvas(worldPos);
            const width = w ?? ctx.settings.iconSize;
            const height = h ?? (w ?? ctx.settings.iconSize);
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            const minX = canvasPos.x - halfWidth;
            const maxX = canvasPos.x + halfWidth;
            const minY = canvasPos.y - halfHeight;
            const maxY = canvasPos.y + halfHeight;

            if (maxX > 0 && minX <= ctx.size.x && maxY > 0 && minY <= ctx.size.y) {
                imgPromise.now(img => {
                    overlayGraphics.drawImage(img, minX, minY, width, height);
                }).then(img => {
                    if (drawCounts.get(ctx.graphics) === drawCount) {
                        overlayGraphics.drawImage(img, minX, minY, width, height);
                        combineCanvas();
                    }
                });
            }

            return {
                worldPos,
                canvasPos: vector2(minX, minY),
                size: vector2(width, height),
            };
        }

        function drawRegionBorders(region: Region, additionalRegion: AdditionalRegionData): void {
            if (hidden.regionBorder) {
                return;
            }
            overlayGraphics.save();
            overlayGraphics.lineWidth = 3;

            const expansion = expansions[additionalRegion.expansion];
            overlayGraphics.strokeStyle = expansion.color;
            const rect = region.continent_rect;
            const startWorld = vector2(rect[0][0], rect[0][1]);
            const endWorld = vector2(rect[1][0], rect[1][1]);
            const startCanvas = worldToCanvas(startWorld);
            const endCanvas = worldToCanvas(endWorld);

            if (endCanvas.x > 0 && endCanvas.y > 0 && startCanvas.x <= ctx.size.x && startCanvas.y <= ctx.size.y && region.bounds.length > 2) {
                overlayGraphics.beginPath();
                const startWorld = worldToCanvas(region.bounds[0]);
                overlayGraphics.moveTo(startWorld.x, startWorld.y);
                for (let i = 1; i < region.bounds.length; i++) {
                    const pointWorld = region.bounds[i];
                    const canvasPoint = worldToCanvas(pointWorld);
                    overlayGraphics.lineTo(canvasPoint.x, canvasPoint.y);
                }
                overlayGraphics.closePath();
                overlayGraphics.stroke();
            }

            overlayGraphics.restore();
        }

        function drawZoneBorders(zone: Zone, additionalZone: AdditionalZoneData): void {
            if (hidden.zoneBorder) {
                return;
            }
            overlayGraphics.save();
            overlayGraphics.lineWidth = 3;

            const expansion = expansions[additionalZone.expansion];
            overlayGraphics.strokeStyle = expansion.color;
            const rect = zone.continent_rect;
            const startWorld = vector2(rect[0][0], rect[0][1]);
            const endWorld = vector2(rect[1][0], rect[1][1]);
            const startCanvas = worldToCanvas(startWorld);
            const endCanvas = worldToCanvas(endWorld);

            if (endCanvas.x > 0 && endCanvas.y > 0 && startCanvas.x <= ctx.size.x && startCanvas.y <= ctx.size.y && zone.bounds.length > 2) {
                overlayGraphics.beginPath();
                const startWorld = worldToCanvas(zone.bounds[0]);
                overlayGraphics.moveTo(startWorld.x, startWorld.y);
                for (let i = 1; i < zone.bounds.length; i++) {
                    const pointWorld = zone.bounds[i];
                    const canvasPoint = worldToCanvas(pointWorld);
                    overlayGraphics.lineTo(canvasPoint.x, canvasPoint.y);
                }
                overlayGraphics.closePath();
                overlayGraphics.stroke();
            }

            overlayGraphics.restore();
        }

        function drawAreaBorders(area: Area): void {
            if (hidden.areaBorder) {
                return;
            }
            overlayGraphics.save();
            overlayGraphics.strokeStyle = 'white';
            overlayGraphics.lineWidth = 1;

            const bounds = area.bounds;
            if (bounds.length > 1) {
                overlayGraphics.beginPath();
                const startWorld = worldToCanvas(vector2(bounds[0][0], bounds[0][1]));
                overlayGraphics.moveTo(startWorld.x, startWorld.y);
                for (let i = 1; i < bounds.length; i++) {
                    const pointWorld = vector2(bounds[i][0], bounds[i][1]);
                    const canvasPoint = worldToCanvas(pointWorld);
                    overlayGraphics.lineTo(canvasPoint.x, canvasPoint.y);
                }
                overlayGraphics.closePath();
                overlayGraphics.stroke();
            }

            overlayGraphics.restore();
        }

        function drawRegionText(id: string, region: Region): SelectableCanvasEntity[] {
            if (hidden.regionText) {
                return [];
            }
            overlayGraphics.save();
            overlayGraphics.strokeStyle = 'black';
            overlayGraphics.lineWidth = 5;
            overlayGraphics.fillStyle = 'white';
            overlayGraphics.textAlign = 'center';
            const fontSize = Math.max(1, ctx.zoom * 10);
            const quarterFontSize = fontSize / 4;
            overlayGraphics.font = `${fontSize}px Lato, sans-serif`;

            const worldPos = region.label_coord;
            if (!worldPos) { return []; }
            const canvasPos = worldToCanvas(vector2(worldPos[0], worldPos[1]));
            overlayGraphics.strokeText(region.name, canvasPos.x, canvasPos.y + quarterFontSize);
            overlayGraphics.fillText(region.name, canvasPos.x, canvasPos.y + quarterFontSize);

            const textSize = overlayGraphics.measureText(region.name);

            overlayGraphics.restore();

            return [{
                position: vector2(canvasPos.x - textSize.width / 2, canvasPos.y - quarterFontSize * 3),
                size: vector2(textSize.width, fontSize),
                entity: {
                    type: 'region',
                    id,
                    worldPos: vector2(worldPos[0], worldPos[1]),
                },
            }];
        }

        function drawZoneText(id: string, zone: Zone): SelectableCanvasEntity[] {
            if (hidden.zoneText) {
                return [];
            }
            overlayGraphics.save();
            overlayGraphics.strokeStyle = 'black';
            overlayGraphics.lineWidth = 5;
            overlayGraphics.fillStyle = 'white';
            overlayGraphics.textAlign = 'center';
            const fontSize = Math.max(1, ctx.zoom * 5);
            const quarterFontSize = fontSize / 4;
            overlayGraphics.font = `${fontSize}px Lato, sans-serif`;

            const worldPos = zone.label_coord;
            if (!worldPos) { return []; }
            const canvasPos = worldToCanvas(vector2(worldPos[0], worldPos[1]));
            overlayGraphics.strokeText(zone.name, canvasPos.x, canvasPos.y + quarterFontSize);
            overlayGraphics.fillText(zone.name, canvasPos.x, canvasPos.y + quarterFontSize);

            const textSize = overlayGraphics.measureText(zone.name);

            overlayGraphics.restore();

            return [{
                position: vector2(canvasPos.x - textSize.width / 2, canvasPos.y - quarterFontSize * 3),
                size: vector2(textSize.width, fontSize),
                entity: {
                    type: 'zone',
                    id,
                    worldPos: vector2(worldPos[0], worldPos[1]),
                },
            }];
        }

        function drawAreaText(id: string, area: Area): SelectableCanvasEntity[] {
            if (hidden.areaText) {
                return [];
            }
            overlayGraphics.save();
            overlayGraphics.strokeStyle = 'black';
            overlayGraphics.lineWidth = 5;
            overlayGraphics.fillStyle = 'white';
            overlayGraphics.textAlign = 'center';
            const fontSize = Math.max(1, ctx.zoom * 2);
            const quarterFontSize = fontSize / 4;
            overlayGraphics.font = `${fontSize}px Lato, sans-serif`;

            const worldPos = area.label_coord;
            if (!worldPos) { return []; }
            const canvasPos = worldToCanvas(vector2(worldPos[0], worldPos[1]));
            overlayGraphics.strokeText(area.name, canvasPos.x, canvasPos.y + quarterFontSize);
            overlayGraphics.fillText(area.name, canvasPos.x, canvasPos.y + quarterFontSize);

            const textSize = overlayGraphics.measureText(area.name);

            overlayGraphics.restore();

            return [{
                position: vector2(canvasPos.x - textSize.width / 2, canvasPos.y - quarterFontSize * 3),
                size: vector2(textSize.width, fontSize),
                entity: {
                    type: 'area',
                    id,
                    worldPos: vector2(worldPos[0], worldPos[1]),
                },
            }];
        }

        function drawIcons(zone: Zone): SelectableCanvasEntity[] {
            if (hidden.icons) {
                return [];
            }

            const selectables: SelectableCanvasEntity[] = [];

            forEachValue(zone.points_of_interest, poi => {
                let drawn: DrawnIcon|undefined = undefined;
                if (poi.type === 'waypoint') {
                    drawn = drawIcon(icons.waypoint.incomplete, vector2(poi.coord[0], poi.coord[1]));
                } else if (poi.type === 'landmark') {
                    drawn = drawIcon(icons.poi.incomplete, vector2(poi.coord[0], poi.coord[1]));
                } else if (poi.type === 'vista') {
                    drawn = drawIcon(icons.vista.incomplete, vector2(poi.coord[0], poi.coord[1]));
                }

                if (drawn) {
                    selectables.push({
                        position: drawn.canvasPos,
                        size: drawn.size,
                        entity: {
                            worldPos: drawn.worldPos,
                            type: poi.type,
                            id: poi.id.toString(),
                        },
                    });
                }
            });

            forEachValue(zone.tasks, task => {
                const drawn = drawIcon(icons.heart.incomplete, vector2(task.coord[0], task.coord[1]));
                if (drawn) {
                    selectables.push({
                        position: drawn.canvasPos,
                        size: drawn.size,
                        entity: {
                            worldPos: drawn.worldPos,
                            type: 'task',
                            id: task.id.toString(),
                        },
                    });
                }
            });

            zone.skill_challenges.forEach(challenge => {
                let drawn: DrawnIcon|undefined = undefined;
                if (challenge.id) {
                    const icon = challenge.id.charAt(0) === '0' ? icons.hero_challenge : icons.hero_challenge_expansion;
                    drawn = drawIcon(icon.incomplete, vector2(challenge.coord[0], challenge.coord[1]));
                } else {
                    drawn = drawIcon(icons.hero_challenge_expansion.incomplete, vector2(challenge.coord[0], challenge.coord[1]));
                }

                if (drawn) {
                    selectables.push({
                        position: drawn.canvasPos,
                        size: drawn.size,
                        entity: {
                            worldPos: drawn.worldPos,
                            type: 'challenge',
                            id: challenge.id ?? `challenge-${Math.floor(drawn.worldPos.x)}-${Math.floor(drawn.worldPos.y)}`,
                        },
                    });
                }
            });

            forEachValue(zone.adventures, adventure => {
                const drawn = drawIcon(icons.adventure.incomplete, vector2(adventure.coord[0], adventure.coord[1]));
                if (drawn) {
                    selectables.push({
                        position: drawn.canvasPos,
                        size: drawn.size,
                        entity: {
                            worldPos: drawn.worldPos,
                            type: 'adventure',
                            id: adventure.id,
                        },
                    });
                }
            });

            forEachValue(zone.mastery_points, mp => {
                const icon =
                    mp.region === 'Tyria' ? icons.mastery_tyria :
                        mp.region === 'Maguuma' ? icons.mastery_hot :
                            mp.region === 'Desert' ? icons.mastery_pof :
                                mp.region === 'Tundra' ? icons.mastery_is : icons.mastery_eod;
                const drawn = drawIcon(icon.incomplete, vector2(mp.coord[0], mp.coord[1]));
                if (drawn) {
                    selectables.push({
                        position: drawn.canvasPos,
                        size: drawn.size,
                        entity: {
                            worldPos: drawn.worldPos,
                            type: 'mastery',
                            id: mp.id.toString(),
                        },
                    });
                }
            });

            return selectables;
        }

        function draw(
            perZone1: (id: string, zone: Zone, additionalZone: AdditionalZoneData) => SelectableCanvasEntity[],
            perArea: (id: string, area: Area) => SelectableCanvasEntity[],
            perZone2: (id: string, zone: Zone, additionalZone: AdditionalZoneData) => SelectableCanvasEntity[],
            perRegion: (id: string, region: Region, additionalRegion: AdditionalRegionData) => SelectableCanvasEntity[]): SelectableCanvasEntity[] {
            const result: SelectableCanvasEntity[] = [];
            forEachEntry(worldData[ctx.mapInfo.id].regions, (regionId, region) => {
                const regionRect = region.continent_rect;
                const regionStart = worldToCanvas(vector2(regionRect[0][0], regionRect[0][1]));
                const regionEnd = worldToCanvas(vector2(regionRect[1][0], regionRect[1][1]));
                if (regionEnd.x > 0 && regionEnd.y > 0 && regionStart.x <= ctx.size.x && regionStart.y <= ctx.size.y) {
                    const additionalRegionData = regions[parseInt(regionId)];
                    forEachEntry(region.maps, (zoneId, zone) => {
                        const zoneRect = zone.continent_rect;
                        const zoneStart = worldToCanvas(vector2(zoneRect[0][0], zoneRect[0][1]));
                        const zoneEnd = worldToCanvas(vector2(zoneRect[1][0], zoneRect[1][1]));
                        if (zoneEnd.x > 0 && zoneEnd.y > 0 && zoneStart.x <= ctx.size.x && zoneStart.y <= ctx.size.y) {
                            const additionalZoneData = zones[parseInt(zoneId)];
                            if (ctx.expansions.has(additionalZoneData.expansion)) {
                                result.push(...perZone1(zoneId, zone, additionalZoneData));
                                forEachEntry(zone.sectors, (areaId, area) => {
                                    const areaRect = area.rect;
                                    const areaStart = worldToCanvas(vector2(areaRect[0][0], areaRect[0][1]));
                                    const areaEnd = worldToCanvas(vector2(areaRect[1][0], areaRect[1][1]));
                                    if (areaEnd.x > 0 && areaEnd.y > 0 && areaStart.x <= ctx.size.x && areaStart.y <= ctx.size.y) {
                                        result.push(...perArea(areaId, area));
                                    }
                                });
                                result.push(...perZone2(zoneId, zone, additionalZoneData));
                            }
                        }
                    });

                    // TODO: Improve UX of hiding expansions.
                    if (ctx.expansions.has(additionalRegionData.expansion)) {
                        result.push(...perRegion(regionId, region, additionalRegionData));
                    }
                }
            });

            return result;
        }

        overlayGraphics.clearRect(0, 0, ctx.size.x, ctx.size.y);
        return draw((id, zone, additionalZone) => {
            const drawnIcons = drawIcons(zone);
            drawZoneBorders(zone, additionalZone);
            return drawnIcons;
        }, (id, area) => {
            drawAreaBorders(area);
            const drawnText = drawAreaText(id, area);
            return drawnText;
        }, (id, zone) => {
            const drawnText = drawZoneText(id, zone);
            return drawnText;
        }, (id, region, additionalRegion) => {
            drawRegionBorders(region, additionalRegion);
            const drawnText = drawRegionText(id, region);
            return drawnText;
        });
    }

    ctx.graphics.save();
    drawAllTiles();
    const selectables = drawOverlay();
    combineCanvas();
    ctx.graphics.restore();

    return {
        tileScale,
        worldTileSize,
        renderScale,
        minZoom: mapInfo.minZoom,
        maxZoom: mapInfo.maxZoom,
        selectables,
    };
}

function tryCache(source: TileSource|undefined): void {
    if (source && !imageIsCached(source.url)) {
        downloadImage(source.url);
    }
}
