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

declare type Settings = typeof import('@/logic/settingsStorage').defaultSettings;

declare type DrawingContext = {
    settings: Settings,
    expansions: Set<string>,
    graphics: CanvasRenderingContext2D,
    size: Vector2,
    zoom: number,
    position: Vector2,
    mapInfo: MapInfo,
    selected?: ISelectableEntity|undefined,
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
    selectables: SelectableCanvasEntity[],
};

declare type ObjectMap<TKey, TValue> = {
    [key: TKey]: TValue,
};

declare type WorldDataCoords = [number, number];

declare type WorldData = {
    [key: string]: MapData,
};

declare type MapData = {
    name: string, // Custom
    id: string, // Custom
    texture_dims: WorldDataCoords,
    clamped_view: WorldDataCoords[],
    regions: ObjectMap<string, Region>,
};

declare type Region = {
    name: string,
    label_coord: WorldDataCoords,
    continent_rect: WorldDataCoords[],
    bounds: Vector2[], // Custom
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

declare type PointOfInterestType = 'landmark'|'waypoint'|'vista'|'unlock';

declare type PointOfInterest = {
    name: string,
    type: PointOfInterestType,
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
    rect: [WorldDataCoords, WorldDataCoords], // Custom
    label_coord: WorldDataCoords, // Custom
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

declare type ExpansionId = 'base'|'lw2'|'hot'|'lw3'|'pof'|'lw4'|'lw5'|'eod';

declare type AdditionalRegionData = {
    id: number,
    expansion: ExpansionId,
    wikiUrl: string,
};

declare type AdditionalRegionDataMap = {
    [key: number]: AdditionalRegionData,
};

declare type ZoneType = 'zone'|'raid'|'guild'|'city';

declare type AdditionalZoneData = {
    id: number,
    expansion: ExpansionId,
    episode: number,
    type: ZoneType,
    wikiUrl: string,
};

declare type AdditionalZoneDataMap = {
    [key: number]: AdditionalZoneData,
};

declare type SelectableEntityType = 'region'|'zone'|'area'|'mastery'|'challenge'|'adventure'|'task'|PointOfInterestType;

interface ISelectableEntity {
    map: string,
    type: SelectableEntityType,
    worldPos: Vector2,
    id: string,
}

declare type SelectableCanvasEntity = {
    position: Vector2,
    size: Vector2,
    entity: ISelectableEntity,
}

declare module '*.md' {
    const content: string;
    export default content;
}

declare module '*!txt' {
    const content: string;
    export default content;
}
