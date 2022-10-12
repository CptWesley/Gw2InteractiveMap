import 'react-scripts';

declare type TileSource = {
    url: string,
    x: number,
    y: number,
    width: number,
    height: number,
};

declare type Vector2 = {
    x: number,
    y: number,
};

declare type DrawingContext = {
    graphics: CanvasRenderingContext2D,
    width: number,
    height: number,
    zoom: number,
    position: Vector2,
    continent: number,
    floor: number,
};

declare type MapInfo = {
    continent: number,
    floor: number,
    name: string,
    width: number,
    height: number,
    minZoom: number,
    maxZoom: number,
    tileWidth: number,
    tileHeight: number,
};

declare type RawColumnInfo = number[];

declare type RawZoomInfo = {
    [key: number]: RawColumnInfo,
};

declare type RawTilesInfo = {
    [key: number]: RawZoomInfo,
};

declare type RawFloorInfo = {
    Name: string,
    MinZoom: number,
    MaxZoom: number,
    Width: number,
    Height: number,
    TileWidth: number,
    TileHeight: number,
    Tiles: RawTilesInfo,
};

declare type RawContinentInfo = {
    [key: number]: RawFloorInfo,
};

declare type RawWorldDatabaseInfo = {
    [key: number]: RawContinentInfo,
};
