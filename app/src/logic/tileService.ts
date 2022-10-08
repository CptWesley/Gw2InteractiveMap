import { TileSource } from '@/react-app-env';
import { MD5, enc } from 'crypto-js';
import knownTiles, { tileIsKnown } from './knownTiles';

export function getTileUrl(continent: number, floor: number, zoom: number, x: number, y: number) {
    const fileName = `World_map_tile_C${continent}_F${floor}_Z${zoom}_X${x}_Y${y}.jpg`;
    const fileNameHash = MD5(fileName);
    const hex = fileNameHash.toString(enc.Hex);
    const url = `https://wiki.guildwars2.com/images/${hex.slice(0, 1)}/${hex.slice(0, 2)}/${fileName}`;
    return url;
}

function buildMap() {
    const result:any = {};
    const continent = knownTiles.Id;
    const floor = knownTiles.Floor;

    for (let zoom = knownTiles.MinZoom; zoom <= knownTiles.MaxZoom; zoom++) {
        const zoomResult:any = {};
        result[zoom] = zoomResult;
        const divisor = 256 * Math.pow(2, knownTiles.MaxZoom - zoom);
        const width = knownTiles.Width / divisor;
        const height = knownTiles.Height / divisor;

        for (let x = 0; x < width; x++) {
            const xResult:any = {};
            zoomResult[x] = xResult;
            for (let y = 0; y < height; y++) {
                if (tileIsKnown(continent, floor, zoom, x, y)) {
                    const url = getTileUrl(continent, floor, zoom, x, y);
                    const tileX = x;
                    const tileY = y;
                    const tileWidth = 256;
                    const tileHeight = 256;
                    const source:TileSource = {
                        url,
                        x: tileX,
                        y: tileY,
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

const lookup = buildMap();

export function getTileSource(continent: number, floor: number, zoom: number, x: number, y: number): TileSource {
    return lookup[zoom][x][y];
}
