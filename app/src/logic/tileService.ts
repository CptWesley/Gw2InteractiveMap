import { MapInfo, TileSource } from '@/react-app-env';
import { MD5, enc } from 'crypto-js';
import { knownTiles, tileIsKnown } from './knownTiles';
import { vector2 } from './vector2';

const lookupCache = new Map<string, any>();

export function getTileUrl(continent: number, floor: number, zoom: number, x: number, y: number) {
    const fileName = `World_map_tile_C${continent}_F${floor}_Z${zoom}_X${x}_Y${y}.jpg`;
    const fileNameHash = MD5(fileName);
    const hex = fileNameHash.toString(enc.Hex);
    const url = `https://wiki.guildwars2.com/images/${hex.slice(0, 1)}/${hex.slice(0, 2)}/${fileName}`;
    return url;
}

function buildMap(continent: number, floor: number) {
    const raw = knownTiles[continent][floor];
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
                if (tileIsKnown(continent, floor, zoom, x, y)) {
                    const url = getTileUrl(continent, floor, zoom, x, y);
                    const tileWidth = 256;
                    const tileHeight = 256;
                    const source:TileSource = {
                        url,
                        x: 0,
                        y: 0,
                        width: tileWidth,
                        height: tileHeight,
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
                    };
                    xResult[y] = source;
                }
            }
        }
    }

    return result;
}

function getLookup(continent: number, floor: number): any {
    const cacheKey = `${continent}-${floor}`;
    const cacheResult = lookupCache.get(cacheKey);
    if (cacheResult) {
        return cacheResult;
    }

    const result = buildMap(continent, floor);
    lookupCache.set(cacheKey, result);
    return result;
}

export function getTileSource(continent: number, floor: number, zoom: number, x: number, y: number): TileSource|undefined {
    const lookup = getLookup(continent, floor);
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

export function getMapInfo(continent: number, floor: number): MapInfo {
    const rawAll:any = knownTiles;
    const raw:any = rawAll[continent][floor];
    return {
        continent,
        floor,
        size: vector2(raw.Width, raw.Height),
        name: raw.Name,
        minZoom: raw.MinZoom,
        maxZoom: raw.MaxZoom,
        tileSize: vector2(raw.TileWidth, raw.TileHeight),
    };
}
