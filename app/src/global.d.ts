import 'react-scripts';
import { Settings } from '@/logic/settingsStorage';

declare type TileSource = {
    url: string,
    x: number,
    y: number,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
};

declare type Vector2 = {
    x: number,
    y: number,
};

declare type DrawingContext = {
    settings: Settings,
    expansions: Set<string>,
    graphics: CanvasRenderingContext2D,
    size: Vector2,
    zoom: number,
    position: Vector2,
    mapInfo: MapInfo,
};

declare type MapInfo = {
    id: string,
    continent: number,
    floor: number,
    name: string,
    size: Vector2,
    minZoom: number,
    maxZoom: number,
    tileSize: Vector2,
};

declare type RawColumnInfo = number[];

declare type RawZoomInfo = {
    [key: number]: RawColumnInfo,
};

declare type RawTilesInfo = {
    [key: number]: RawZoomInfo,
};

declare type RawMapInfo = {
    Continent: number,
    Floor: number,
    Name: string,
    MinZoom: number,
    MaxZoom: number,
    Width: number,
    Height: number,
    TileWidth: number,
    TileHeight: number,
    Tiles: RawTilesInfo,
};

declare type RawWorldDatabaseInfo = {
    [key: string]: RawMapInfo,
};

declare type LastDrawInfo = {
    tileScale: number,
    worldTileSize: Vector2,
    renderScale: number,
    minZoom: number,
    maxZoom: number,
};

declare type ObjectMap<TKey, TValue> = {
    [key: TKey]: TValue,
};

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
    maps: ObjectMap<string, Zone>,
};

declare type Zone = {
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
    sectors: ObjectMap<string, Area>,
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

declare type Area = {
    name: string,
    level: number,
    coord: WorldDataCoords,
    bounds: WorldDataCoords[],
    rect: [WorldDataCoords, WorldDataCoords],
    label_coord: WorldDataCoords,
    chat_link: string,
    id: number,
};

declare type Expansion = {
    id: string,
    name: string,
    color: string,
    wikiUrl: string,
};

declare type ExpansionMap = {
    [key: string]: Expansion,
}

declare type AdditionalZoneData = {
    id: number,
    expansion: string,
    episode: number,
    wikiUrl: string,
};

declare type AdditionalZoneDataMap = {
    [key: number]: AdditionalZoneData,
};

interface ISelectableEntity {
    type: string,
    position: Vector2,
    size: Vector2,
    id: string,
}
