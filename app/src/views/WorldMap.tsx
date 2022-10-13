import { useEffect, useRef } from 'react';
import { DrawingContext } from '@/react-app-env';
import { drawMap } from '@/logic/worldMapRendering';
import { makeStyles } from '@/theme';
import { vector2 } from '@/logic/vector2';

const useStyles = makeStyles()(() => {
    return {
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexFlow: 'column',
        },
        worldMap: {
            flex: 1,
            minHeight: 0,
        },
    };
});

export default function WorldMap() {
    const { classes } = useStyles();
    const query = useQuery(defaultQueryParams);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const result = (
        <div className={classes.container}>
            <canvas className={classes.worldMap} ref={canvasRef}/>
        </div>
    );

    function redraw() {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const position = vector2(81920 / 2, 114688 / 2);

        const drawingContext:DrawingContext = {
            graphics: ctx,
            size: vector2(canvas.width, canvas.height),
            zoom: 2,
            position,
            continent: 1,
            floor: 1,
        };

        drawMap(drawingContext);
    }

    useEffect(redraw, [canvasRef]);
    useEffect(() => {
        window.addEventListener('resize', redraw);
        return () => window.removeEventListener('resize', redraw);
    }, []);

    return result;
}
