import 'react-scripts';

declare type TileSource = {
    url: string,
    x: number,
    y: number,
    width: number,
    height: number,
}

declare type Vector2 = {
    x: number,
    y: number,
}

declare type DrawingContext = {
    graphics: CanvasRenderingContext2D,
    width: number,
    height: number,
    zoom: number,
    position: Vector2,
}
