import { useParams } from 'react-router-dom';
import { getTileSource } from '@/logic/tileService';
import { useEffect, useRef } from 'react';
import { downloadImage } from '@/logic/imageCache';

export default function Tile() {
    const params = useParams();

    const continent = +(params.c ?? 0);
    const floor = +(params.f ?? 0);
    const zoom = +(params.z ?? 0);
    const x = +(params.x ?? 0);
    const y = +(params.y ?? 0);

    const source = getTileSource(continent, floor, zoom, x, y)!;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const result = (
        <div>
            <p>{zoom}:{x},{y}</p>
            <p>
                <img src={source.url} alt='Logo' />
            </p>
            <p>{source.url}</p>
            <p>{source.x},{source.y}</p>
            <p>{source.width}x{source.height}</p>
            <canvas width={256} height={256} ref={canvasRef}/>
        </div>
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const source2 = getTileSource(continent, floor, zoom, x + 1, y)!;
        const source3 = getTileSource(continent, floor, zoom, x + 1, y + 1)!;

        downloadImage(source2.url);
        downloadImage(source3.url);
        downloadImage(source3.url);
        downloadImage(source3.url);
        downloadImage(source.url);
        downloadImage(source2.url);

        downloadImage(source.url).promise.then(bmp => {
            ctx.drawImage(bmp, source.x, source.y, source.width, source.height, 0, 0, canvas.width, canvas.height);
        });
    }, []);

    return result;
}
