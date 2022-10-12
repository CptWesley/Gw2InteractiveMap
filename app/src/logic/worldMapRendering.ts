import { DrawingContext } from '@/react-app-env';
import { getMapInfo } from './tileService';

export function drawMap(ctx: DrawingContext) {
    const mapInfo = getMapInfo(ctx.continent, ctx.floor);
    
    ctx.graphics.clearRect(0, 0, ctx.width, ctx.height);
    ctx.graphics.fillStyle = 'black';
    ctx.graphics.fillRect(0, 0, ctx.width, ctx.height);
    console.log('width: ' + ctx.width);
}
