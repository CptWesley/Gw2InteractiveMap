import { Vector2 } from '@/react-app-env';

export function vector2(x: number, y: number): Vector2 {
    return { x, y };
}

export function v2translate(vector: Vector2, x: number, y: number): Vector2 {
    return vector2(vector.x + x, vector.y + y);
}

export function v2scale(vector: Vector2, x: number, y: number): Vector2 {
    return vector2(vector.x * x, vector.y * y);
}

export function v2add(v1: Vector2, v2: Vector2): Vector2 {
    return vector2(v1.x + v2.x, v1.y + v2.y);
}

export function getTranslation(from: Vector2, to: Vector2): Vector2 {
    return vector2(to.x - from.x, to.y - from.y);
}
