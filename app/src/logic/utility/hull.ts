import { Vector2 } from '@/global';
import monotoneChainConvexHull from 'monotone-chain-convex-hull';
import { vector2 } from './vector2';

export default function hull(points: Vector2[]): Vector2[] {
    if (points.length < 3) {
        return points;
    }

    const rawPoints: [number, number][] = points.map(x => [x.x, x.y]);
    const rawResult: number[][] = monotoneChainConvexHull(rawPoints);

    const result = rawResult.map(x => vector2(x[0], x[1]));
    return result;
}
