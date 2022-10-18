import { ObjectMap } from '@/react-app-env';
import { filterEntry, forEachValue } from '@/logic/utility/util';

declare type WorldDataCoords = number[];

declare type WorldData = {
    [key: string]: MapData,
};

declare type MapData = {
    texture_dims: WorldDataCoords,
    clamped_view: WorldDataCoords[],
    regions: ObjectMap<string, Region>,
};

declare type Region = {
    name: string,
    label_coord: WorldDataCoords,
    continent_rect: WorldDataCoords[],
    maps: ObjectMap<string, Map>,
};

declare type Map = {
    name: string,
    min_level: number,
    max_level: number,
    default_floor: number,
    label_coord: WorldDataCoords,
    map_rect: WorldDataCoords[],
    continent_rect: WorldDataCoords[],
    points_of_interest: ObjectMap<number, PointOfInterest>,
    tasks: ObjectMap<number, Task>,
    skill_challenges: SkillChallenge[],
    adventures: ObjectMap<number, Adventure>,
    mastery_points: ObjectMap<number, MasteryPoint>,
    sectors: ObjectMap<number, Sector>,
};

declare type PointOfInterest = {
    name: string,
    type: 'landmark'|'waypoint'|'vista'|'unlock',
    floor: number,
    coord: WorldDataCoords,
    id: number,
    chat_link: string,
    icon?: string,
};

declare type Task = {
    objective: string,
    level: number,
    coord: WorldDataCoords,
    bounds: WorldDataCoords[],
    id: number,
    chat_link: string,
};

declare type SkillChallenge = {
    coord: WorldDataCoords,
    id?: string,
};

declare type Adventure = {
    coord: WorldDataCoords,
    id: string,
    name: string,
    description: string,
};

declare type MasteryPoint = {
    coord: WorldDataCoords,
    id: number,
    region: 'Tyria'|'Maguuma'|'Desert'|'Tundra'|'Unknown',
};

declare type Sector = {
    name: string,
    level: number,
    coord: WorldDataCoords,
    bounds: WorldDataCoords[],
    chat_link: string,
    id: number,
};

const allMapDataRaw: any = require('./allMapData.js');
const allMapData: any = {};
allMapDataRaw.forEach((x: any) => {
    allMapData[x.id] = x;
});

const publicMaps: Set<number> = new Set<number>(require('./openWorldMaps.js') as number[]);

function prepareData(data: MapData): MapData {
    const result = data;

    function recomputeContinentRect(map: Map): void {
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        forEachValue(map.sectors, sector => {
            sector.bounds.forEach(bound => {
                const x = bound[0];
                const y = bound[1];

                if (x < minX) {
                    minX = x;
                }

                if (x > maxX) {
                    maxX = x;
                }

                if (y < minY) {
                    minY = y;
                }

                if (y > maxY) {
                    maxY = y;
                }
            });
        });

        map.continent_rect = [
            [minX, minY],
            [maxX, maxY],
        ];
    }

    function recomputeLabelPosition(map: Map): void {
        const xMin = map.continent_rect[0][0];
        const yMin = map.continent_rect[0][1];
        const xMax = map.continent_rect[1][0];
        const yMax = map.continent_rect[1][1];
        map.label_coord = [(xMin + xMax) / 2, (yMin + yMax) / 2];
    }

    forEachValue(result.regions, region => {
        region.maps = filterEntry(region.maps, (id, map) => {
            const isVisible = publicMaps.has(parseInt(id));
            if (isVisible) {
                recomputeContinentRect(map);
                recomputeLabelPosition(map);
            }
            return isVisible;
        });
    });

    return result;
}

const worldData: WorldData = {
    'tyria': prepareData(require('./tyriaContinentData.js') as MapData),
};

export default worldData;
