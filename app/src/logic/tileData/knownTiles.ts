import { RawMapInfo, RawWorldDatabaseInfo } from '@/react-app-env';

/* eslint-disable */
export const knownTiles: RawWorldDatabaseInfo = {
  'tyria': require('./tyriaTiles.js') as RawMapInfo,
};
/* eslint-enable */

export function tileIsKnown(map: string, zoom: number, x: number, y: number) {
    const tiles = knownTiles[map].Tiles;
    if (!tiles[zoom] || !tiles[zoom][x]) {
        return false;
    }

    return tiles[zoom][x].includes(y);
}
