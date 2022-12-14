import { knownTiles, tileIsKnown } from '@/logic/tileData/knownTiles';
import { vector2 } from '@/logic/utility/vector2';

const lookupCache = new Map<string, any>();

export function getTileUrl(continent: number, floor: number, zoom: number, x: number, y: number) {
    return `https://cdn.jsdelivr.net/gh/CptWesley/Gw2InteractiveMapTiles@v2/tiles/C${continent}_F${floor}_Z${zoom}_X${x}_Y${y}.webp`;
}

function buildMap(map: string) {
    const raw = knownTiles[map];
    const result:any = {};

    for (let zoom = raw.MinZoom; zoom <= raw.MaxZoom; zoom++) {
        const zoomResult:any = {};
        result[zoom] = zoomResult;
        const divisor = 256 * Math.pow(2, raw.MaxZoom - zoom);
        const width = raw.Width / divisor;
        const height = raw.Height / divisor;

        for (let x = 0; x < width; x++) {
            const xResult:any = {};
            zoomResult[x] = xResult;
            for (let y = 0; y < height; y++) {
                if (tileIsKnown(map, zoom, x, y)) {
                    const url = getTileUrl(raw.Continent, raw.Floor, zoom, x, y);
                    const tileWidth = 256;
                    const tileHeight = 256;
                    const source:TileSource = {
                        url,
                        x: 0,
                        y: 0,
                        width: tileWidth,
                        height: tileHeight,
                        offsetX: 0,
                        offsetY: 0,
                    };
                    xResult[y] = source;
                } else {
                    const parentZoom = zoom - 1;
                    const parentX = Math.floor(x / 2);
                    const parentY = Math.floor(y / 2);
                    const offsetX = x % 2;
                    const offsetY = y % 2;
                    const parent:TileSource = result[parentZoom][parentX][parentY];
                    const newWidth = parent.width / 2;
                    const newHeight = parent.height / 2;
                    const newX = parent.x + offsetX * newWidth;
                    const newY = parent.y + offsetY * newHeight;
                    const source:TileSource = {
                        url: parent.url,
                        x: newX,
                        y: newY,
                        width: newWidth,
                        height: newHeight,
                        offsetX: 0,
                        offsetY: 0,
                    };
                    xResult[y] = source;
                }
            }
        }
    }

    return result;
}

function getLookup(map: string): any {
    const cacheKey = map;
    const cacheResult = lookupCache.get(cacheKey);
    if (cacheResult) {
        return cacheResult;
    }

    const result = buildMap(map);
    lookupCache.set(cacheKey, result);
    return result;
}

export function getTileSource(map: string, zoom: number, x: number, y: number): TileSource|undefined {
    const lookup = getLookup(map);
    if (!lookup) {
        return undefined;
    }

    const lookupZoom = lookup[zoom];
    if (!lookupZoom) {
        return undefined;
    }

    const lookupX = lookupZoom[x];
    if (!lookupX) {
        return undefined;
    }

    const lookupY = lookupX[y];
    if (!lookupY) {
        return undefined;
    }

    return lookupY;
}

export function getMapInfo(map: string): MapInfo {
    const rawAll = knownTiles;
    const raw = rawAll[map];
    return {
        id: map,
        continent: raw.Continent,
        floor: raw.Floor,
        size: vector2(raw.Width, raw.Height),
        name: raw.Name,
        minZoom: raw.MinZoom,
        maxZoom: raw.MaxZoom,
        tileSize: vector2(raw.TileWidth, raw.TileHeight),
    };
}

export function getTileSourceFromParent(map: string, zoom: number, x: number, y: number): TileSource|undefined {
    const parentZoom = zoom - 1;
    const parentX = Math.floor(x / 2);
    const parentY = Math.floor(y / 2);
    const offsetX = x % 2;
    const offsetY = y % 2;
    const parent = getTileSource(map, parentZoom, parentX, parentY);
    if (!parent) {
        return undefined;
    }

    const newWidth = parent.width / 2;
    const newHeight = parent.height / 2;
    const newX = parent.x + offsetX * newWidth;
    const newY = parent.y + offsetY * newHeight;
    const source:TileSource = {
        url: parent.url,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        offsetX: 0,
        offsetY: 0,
    };

    return source;
}

export function getTileSourcesFromChildren(map: string, zoom: number, x: number, y: number): TileSource[]|undefined {
    const childrenZoom = zoom + 1;
    const childrenX = x * 2;
    const childrenY = y * 2;
    const x0y0 = getTileSource(map, childrenZoom, childrenX, childrenY);
    const x1y0 = getTileSource(map, childrenZoom, childrenX + 1, childrenY);
    const x0y1 = getTileSource(map, childrenZoom, childrenX, childrenY + 1);
    const x1y1 = getTileSource(map, childrenZoom, childrenX + 1, childrenY + 1);
    const result: TileSource[] = [];

    if (x0y0) {
        pushTileWithOffset(result, x0y0, 0, 0);
    }

    if (x1y0) {
        pushTileWithOffset(result, x1y0, x1y0.width, 0);
    }

    if (x0y1) {
        pushTileWithOffset(result, x0y1, 0, x0y1.height);
    }

    if (x1y1) {
        pushTileWithOffset(result, x1y1, x1y1.width, x1y1.height);
    }

    return result;
}

function pushTileWithOffset(array: TileSource[], source: TileSource, xOffset: number, yOffset: number): void {
    array.push({
        url: source.url,
        x: source.x,
        y: source.y,
        width: source.width,
        height: source.height,
        offsetX: xOffset,
        offsetY: yOffset,
    });
}
