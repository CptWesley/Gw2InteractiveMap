import { getArea, getRegion, getZone } from '@/logic/mapData/worldDataUtils';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import React from 'react';

interface IProps {
    className?: string|undefined,
    data?: ISelectableEntity|undefined,
}

interface ICardData {
    id: string,
    type: string,
    position: Vector2,
    name: string|undefined,
    wikiUrl?: string|undefined,
}

function getCardTypeName(type: string) {
    switch (type) {
        case 'landmark': return 'Point of Interest';
        case 'challenge': return 'Skill Challenge';
        case 'mastery': return 'Mastery Point';
        default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
}

function getCardData(entity: ISelectableEntity): ICardData {
    if (entity.type === 'region') {
        const { regionData, additionalRegionData } = getRegion(entity.map, entity.id);
        return {
            id: entity.id,
            type: entity.type,
            position: entity.worldPos,
            name: regionData.name,
            wikiUrl: additionalRegionData.wikiUrl,
        };
    } else if (entity.type === 'zone') {
        const { zoneData, additionalZoneData } = getZone(entity.map, entity.id);
        return {
            id: entity.id,
            type: entity.type,
            position: entity.worldPos,
            name: zoneData.name,
            wikiUrl: additionalZoneData.wikiUrl,
        };
    } else if (entity.type === 'area') {
        const areaData = getArea(entity.map, entity.id);
        return {
            id: entity.id,
            type: entity.type,
            position: entity.worldPos,
            name: areaData.name,
        };
    }

    return {
        id: entity.id,
        type: entity.type,
        position: entity.worldPos,
        name: 'UNKNOWN',
    };
}

export default function MapInfoCard(props: IProps) {
    if (!props.data) {
        return <div className={props.className} hidden={true} />;
    }

    const data = getCardData(props.data);

    return (
        <div className={props.className} >
            <Card variant='outlined'>
                <CardContent>
                    <Typography variant='h4'>
                        {data.name}
                    </Typography>
                    <Typography variant='h6'>
                        {getCardTypeName(data.type)}
                    </Typography>
                    <Typography variant='body2'>
                        ID: {data.id}
                    </Typography>
                    <Typography variant='body2'>
                        Coordinates: [{Math.floor(data.position.x)}, {Math.floor(data.position.y)}]
                    </Typography>
                </CardContent>
                <CardActions>
                    <div hidden={!data.wikiUrl}>
                        <Button size='small' hidden={!data.wikiUrl}>Wiki</Button>
                    </div>
                </CardActions>
            </Card>
        </div>
    );
}
