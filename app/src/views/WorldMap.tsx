import { useEffect, useRef } from 'react';
import { DrawingContext } from '@/react-app-env';
import { drawMap } from '@/logic/worldMapRendering';
import { makeStyles } from '@/theme';
import { vector2 } from '@/logic/vector2';
import { useQuery } from '@/logic/queryUtils';

const defaultQueryParams = {
    continent: 1,
    floor: 1,
    zoom: 2,
    x: 81920 / 2,
    y: 114688 / 2,
};

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

        const drawingContext:DrawingContext = {
            graphics: ctx,
            size: vector2(canvas.width, canvas.height),
            zoom: query.get('zoom'),
            position: {
                x: query.get('x'),
                y: query.get('y'),
            },
            continent: query.get('continent'),
            floor: query.get('floor'),
        };

        drawMap(drawingContext);
    }

    useEffect(redraw, [canvasRef]);
    useEffect(() => {
        query.push();
        window.addEventListener('resize', redraw);
        return () => window.removeEventListener('resize', redraw);
    }, []);

    return result;
}
