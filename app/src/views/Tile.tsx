import { useParams } from 'react-router-dom';
import { getTileSource } from '@/logic/tileService';
import { useEffect, useRef } from 'react';

export default function Tile() {
    const params = useParams();

    const continent = +(params.c ?? 0);
    const floor = +(params.f ?? 0);
    const zoom = +(params.z ?? 0);
    const x = +(params.x ?? 0);
    const y = +(params.y ?? 0);

    const source = getTileSource(continent, floor, zoom, x, y);

    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        const img = new Image;
        img.src = source.url;
        img.onload = () => {
            ctx.drawImage(img, source.x, source.y, source.width, source.height, 0, 0, canvas.width, canvas.height);
        };
    }, []);

    return (
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
}
