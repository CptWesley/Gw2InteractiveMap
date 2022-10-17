import { ObjectMap } from '@/react-app-env';

declare type WorldDataCoords = number[];

declare type WorldData = {
    [key: string]: MapData,
};

declare type MapData = {
    texture_dims: WorldDataCoords,
    clamped_view: WorldDataCoords[],
    regions: ObjectMap<number, Region>,
};

declare type Region = {
    name: string,
    label_coord: WorldDataCoords,
    continent_rect: WorldDataCoords[],
    maps: ObjectMap<number, Map>,
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

const worldData: WorldData = {
    'tyria': require('./tyriaData.js') as MapData,
};

export default worldData;
