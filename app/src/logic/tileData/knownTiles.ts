import { RawMapInfo, RawWorldDatabaseInfo } from '@/global';
import tyriaTiles from './tyriaTiles';

/* eslint-disable */
export const knownTiles: RawWorldDatabaseInfo = {
  'tyria': tyriaTiles as RawMapInfo,
};
/* eslint-enable */

export function tileIsKnown(map: string, zoom: number, x: number, y: number) {
    const tiles = knownTiles[map].Tiles;
    if (!tiles[zoom] || !tiles[zoom][x]) {
        return false;
    }

    return tiles[zoom][x].includes(y);
}
