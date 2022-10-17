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
    settings: Settings
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
