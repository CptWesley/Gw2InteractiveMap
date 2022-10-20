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

export function v2distanceSq(from: Vector2, to: Vector2): number {
    const translation = getTranslation(from, to);
    return translation.x * translation.x + translation.y * translation.y;
}

export function v2cross(o: Vector2, a: Vector2, b: Vector2): number {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

export function findCenter(vectors: Vector2[]): Vector2 {
    let x = 0;
    let y = 0;

    vectors.forEach(v => {
        x += v.x;
        y += v.y;
    });

    return vector2(x / vectors.length, y / vectors.length);
}

// Based on: https://stackoverflow.com/questions/5204619/how-to-find-the-point-on-an-edge-which-is-the-closest-point-to-another-point
export function nearestPointOnEdge(v: Vector2, e1: Vector2, e2: Vector2): Vector2 {
    const { x: a, y: b } = v;
    const { x: x1, y: y1 } = e1;
    const { x: x2, y: y2 } = e2;

    if (x1 === x2) {
        return vector2(x1, b);
    }

    if (y1 === y2) {
        return vector2(a, y1);
    }

    const m1 = (y2 - y1) / (x2 - x1);
    const m2 = -1 / m1;

    const x = ((m1 * x1) - (m2 * a) + b - y1) / (m1 - m2);
    const y = (m2 * (x - a)) + b;
    return vector2(x, y);
}
