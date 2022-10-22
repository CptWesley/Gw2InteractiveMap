import monotoneChainConvexHull from 'monotone-chain-convex-hull';
import { nearestPointOnEdge, v2distanceSq, vector2 } from './vector2';

export function hull(points: Vector2[]): Vector2[] {
    if (points.length < 3) {
        return points;
    }

    const rawPoints: [number, number][] = points.map(x => [x.x, x.y]);
    const rawResult: number[][] = monotoneChainConvexHull(rawPoints);

    const result = rawResult.map(x => vector2(x[0], x[1]));
    return result;
}

export function inHull(point: Vector2, hull: Vector2[]|WorldDataCoords[]): boolean {
    if (hull.length < 2) {
        return false;
    }

    if (Array.isArray(hull[0])) {
        return inHullInternal(point, (hull as WorldDataCoords[]).map(x => vector2(x[0], x[1])));
    }

    return inHullInternal(point, hull as Vector2[]);
}

function getOrientation(p: Vector2, q: Vector2, r: Vector2, error?: number): 'collinear'|'clockwise'|'counterclockwise' {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (!error) {
        error = 0.00001;
    }

    if (val < error && val > -error) {
        return 'collinear';
    }

    if (val > 0) {
        return 'clockwise';
    }

    return 'counterclockwise';
}

function inHullInternal(point: Vector2, hull: Vector2[]): boolean {
    let counter = 0;

    const farPoint = vector2(Number.POSITIVE_INFINITY, point.y);
    const edges: { v1: Vector2, v2: Vector2 }[] = [];

    for (let i = 0; i < hull.length - 1; i++) {
        edges.push({ v1: hull[i], v2: hull[i + 1] });
    }

    edges.push({ v1: hull[hull.length - 1], v2: hull[0] });

    for (let i = 0; i < edges.length; i++) {
        const { v1, v2 } = edges[i];

        const nearest = nearestPointOnEdge(point, v1, v2);
        const distToNearest = v2distanceSq(point, nearest);
        if (distToNearest < 0.001) {
            return true;
        }

        const o1 = getOrientation(point, v1, farPoint);
        const o2 = getOrientation(point, v2, farPoint);
        const o3 = getOrientation(v1, point, v2);
        const o4 = getOrientation(v1, farPoint, v2);

        if (o1 !== o2 && o3 !== o4) {
            counter++;
        }
    }

    return counter % 2 !== 0;
}
