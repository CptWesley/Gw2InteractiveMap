import { DrawingContext } from '@/react-app-env';

export function drawMap(ctx: DrawingContext) {
    ctx.graphics.clearRect(0, 0, ctx.width, ctx.height);
    ctx.graphics.fillStyle = 'blue';
    ctx.graphics.fillRect(0, 0, ctx.width, ctx.height);
    console.log('width: ' + ctx.width);
}
