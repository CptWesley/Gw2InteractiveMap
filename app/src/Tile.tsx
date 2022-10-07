import { useParams } from 'react-router-dom';
import { MD5, enc } from 'crypto-js';

export default function Tile() {
    const params = useParams();

    const continent = +(params.c ?? 0);
    const floor = +(params.f ?? 0);
    const zoom = +(params.z ?? 0);
    const x = +(params.x ?? 0);
    const y = +(params.y ?? 0);

    const fileName = `World_map_tile_C${continent}_F${floor}_Z${zoom}_X${x}_Y${y}.jpg`;
    const fileNameHash = MD5(fileName);
    const hex = fileNameHash.toString(enc.Hex);
    const url = `https://wiki.guildwars2.com/images/${hex.slice(0, 1)}/${hex.slice(0, 2)}/${fileName}`;

    return (
        <div>
            <p>
                <img src={url} alt='Logo' />
            </p>
            <p>{url}</p>
        </div>
    );
}
