import { ObjectMap, Vector2 } from '@/react-app-env';
import { filterEntry, forEachValue, getValue } from '@/logic/utility/util';
import hull from '@/logic/utility/hull';
import { findCenter, nearestPointOnEdge, v2distanceSq, vector2 } from '../utility/vector2';

declare type WorldDataCoords = [number, number];

declare type WorldData = {
    [key: string]: MapData,
};

declare type MapData = {
    id: string, // Custom
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
    sectors: ObjectMap<string, Sector>,
    bounds: Vector2[], // Custom
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

function findNearestEdge(v: Vector2, edges: { a: Vector2, b: Vector2 }[]): { pos: Vector2, distance: number }|undefined {
    let pos: Vector2|undefined = undefined;
    let distance = Number.POSITIVE_INFINITY;

    edges.forEach(e => {
        if (v2distanceSq(v, e.a) > 10 && v2distanceSq(v, e.b) > 10) {
            const nearest = nearestPointOnEdge(v, e.a, e.b);
            const curDist = v2distanceSq(v, nearest);
            if (curDist < distance) {
                pos = nearest;
                distance = curDist;
            }
        }
    });

    if (!pos) {
        return undefined;
    }

    return { pos, distance };
}

const prepared = new Set<string>();

function prepareData(data: MapData): MapData {
    if (prepared.has(data.id)) {
        return data;
    }
    prepared.add(data.id);
    const result = data;

    function recomputeSectors(map: Map): void {
        const mergeVectorDistance = 1600;
        const mergeEdgeDistance = 800;
        let totalIndex = 0;
        const vectors: { index: number, sectorId: string, vectorIndex: number, pos: Vector2 }[] = [];
        forEachValue(map.sectors, sector => {
            let localIndex = 0;
            sector.bounds.forEach(bound => {
                vectors.push({
                    index: totalIndex++,
                    sectorId: sector.id.toString(),
                    vectorIndex: localIndex++,
                    pos: vector2(bound[0], bound[1]),
                });
            });
        });

        function mergeNearbyVectors(): void {
            const remaining = new Set<number>(vectors.map(x => x.index));

            while (remaining.size > 0) {
                const index = remaining.values().next().value as number;
                remaining.delete(index);
                const vector = vectors[index];
                const nearby = [vector];
                vectors.forEach(other => {
                    if (remaining.has(other.index)) {
                        const dist = v2distanceSq(vector.pos, other.pos);
                        if (dist < mergeVectorDistance) {
                            nearby.push(other);
                            remaining.delete(other.index);
                        }
                    }
                });

                const center = findCenter(nearby.map(x => x.pos));
                nearby.forEach(x => {
                    getValue(map.sectors, x.sectorId).bounds[x.vectorIndex] = [center.x, center.y];
                    x.pos = center;
                });
            }
        }

        function mergeVectorsWithEdges(): void {
            function computeEdges(): { a: Vector2, b: Vector2 }[] {
                const edges: { a: Vector2, b: Vector2 }[] = [];
                forEachValue(map.sectors, sector => {
                    const vertices = sector.bounds.map((x) => vector2(x[0], x[1]));
                    if (vertices.length > 1) {
                        let last = vertices[0];
                        for (let i = 0; i < vertices.length; i++) {
                            const cur = vertices[i];
                            edges.push({ a: last, b: cur });
                            last = cur;
                        }
                        edges.push({ a: last, b: vertices[0] });
                    }
                });
                return edges;
            }

            function hasAnyNeighbors(v: number): boolean {
                const vectorEntry = vectors[v];

                for (let i = 0; i < vectors.length; i++) {
                    if (i === v) {
                        continue;
                    }

                    const other = vectors[i];

                    if (v2distanceSq(vectorEntry.pos, other.pos) < mergeVectorDistance) {
                        return true;
                    }
                }

                return false;
            }

            let edges = computeEdges();

            vectors.forEach(v => {
                const intersection = findNearestEdge(v.pos, edges);
                if (intersection && intersection.distance < mergeEdgeDistance && !hasAnyNeighbors(v.index)) {
                    getValue(map.sectors, v.sectorId).bounds[v.vectorIndex] = [intersection.pos.x, intersection.pos.y];
                    v.pos = intersection.pos;
                    edges = computeEdges();
                }
            });
        }

        mergeNearbyVectors();
        mergeVectorsWithEdges();
    }

    function computeBounds(map: Map): void {
        const points: Vector2[] = [];
        forEachValue(map.sectors, sector => {
            sector.bounds.forEach(bound => {
                points.push(vector2(bound[0], bound[1]));
            });
        });

        map.bounds = hull(points);
    }

    function recomputeContinentRect(map: Map): void {
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        map.bounds.forEach(bound => {
            const { x, y } = bound;

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
                recomputeSectors(map);
                computeBounds(map);
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
