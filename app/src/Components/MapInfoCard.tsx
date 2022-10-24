import { getArea, getMasteryPoint, getPointOfInterest, getRegion, getTask, getZone } from '@/logic/mapData/worldDataUtils';
import { style } from '@/theme';
import { ContentCopy, CenterFocusWeak } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, IconButton, Link, Tooltip, Typography } from '@mui/material';

interface IProps {
    className?: string|undefined,
    data?: ISelectableEntity|undefined,
    onGoto?: (worldPos: Vector2) => void|undefined,
}

interface ICardData {
    id: string,
    type: string,
    position: Vector2,
    name: string|undefined,
    wikiUrl?: string|undefined,
    chatLink?: string|undefined,
    minLevel?: number|undefined,
    maxLevel?: number|undefined,
    masteryTrack?: string|undefined,
}

function getMasteryTrack(region: string|undefined): { name: string, url: string }|undefined {
    switch (region) {
        case 'Tyria': return {
            name: 'Central Tyria',
            url: 'https://wiki.guildwars2.com/wiki/Central_Tyria_mastery_tracks',
        };
        case 'Maguuma': return {
            name: 'Heart of Thorns',
            url: 'https://wiki.guildwars2.com/wiki/Heart_of_Thorns_mastery_tracks',
        };
        case 'Desert': return {
            name: 'Path of Fire',
            url: 'https://wiki.guildwars2.com/wiki/Path_of_Fire_mastery_tracks',
        };
        case 'Tundra': return {
            name: 'Icebrood Saga',
            url: 'https://wiki.guildwars2.com/wiki/Icebrood_Saga_mastery_tracks',
        };
        case 'Unknown': return {
            name: 'End of Dragons',
            url: 'https://wiki.guildwars2.com/wiki/End_of_Dragons_mastery_tracks',
        };
        default: return undefined;
    }
}

function getLevelString(minLevel: number|undefined, maxLevel: number|undefined): string {
    if (minLevel === undefined) {
        if (maxLevel === undefined) {
            return '';
        }

        return maxLevel.toString();
    }

    if (maxLevel === undefined) {
        return minLevel.toString();
    }

    if (minLevel === maxLevel) {
        return minLevel.toString();
    }

    return `${minLevel} - ${maxLevel}`;
}

function getCardTypeName(type: string) {
    switch (type) {
        case 'landmark': return 'Point of Interest';
        case 'challenge': return 'Hero Challenge';
        case 'mastery': return 'Mastery Insight';
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
            minLevel: zoneData.min_level,
            maxLevel: zoneData.max_level,
        };
    } else if (entity.type === 'area') {
        const areaData = getArea(entity.map, entity.id);
        return {
            id: entity.id,
            type: entity.type,
            position: entity.worldPos,
            name: areaData.name,
            chatLink: areaData.chat_link,
            minLevel: areaData.level,
            maxLevel: areaData.level,
        };
    } else if (entity.type === 'vista' || entity.type === 'landmark' || entity.type === 'waypoint' || entity.type === 'unlock') {
        const poiData = getPointOfInterest(entity.map, entity.id);
        return {
            id: entity.id,
            type: entity.type,
            position: entity.worldPos,
            name: poiData.name,
            chatLink: poiData.chat_link,
        };
    } else if (entity.type === 'task') {
        const taskData = getTask(entity.map, entity.id);
        return {
            id: entity.id,
            type: entity.type,
            position: entity.worldPos,
            name: taskData.objective,
            chatLink: taskData.chat_link,
            minLevel: taskData.level,
            maxLevel: taskData.level,
        };
    } else if (entity.type === 'challenge') {
        return {
            id: entity.id,
            type: entity.type,
            position: entity.worldPos,
            name: 'Hero Challenge',
        };
    } else if (entity.type === 'mastery') {
        const masteryData = getMasteryPoint(entity.map, entity.id);
        return {
            id: entity.id,
            type: entity.type,
            position: entity.worldPos,
            name: 'Mastery Insight',
            masteryTrack: masteryData.region,
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
    const masteryTrackData = getMasteryTrack(data.masteryTrack);

    return (
        <div className={props.className} >
            <Card variant='outlined'>
                <CardContent>
                    <Typography variant='h4'>
                        {data.name ?? `Nameless ${getCardTypeName(data.type)}`}
                    </Typography>
                    <Typography variant='h6'>
                        {getCardTypeName(data.type)}
                    </Typography>
                    <Typography variant='body2'>
                        ID: {data.id}
                    </Typography>
                    <Typography variant='body2' hidden={!masteryTrackData}>
                        Mastery Track: <Link href={masteryTrackData?.url} target='_blank'>{masteryTrackData?.name}</Link>
                    </Typography>
                    <Typography variant='body2' hidden={!data.minLevel && !data.maxLevel}>
                        Level: {getLevelString(data.minLevel, data.maxLevel)}
                    </Typography>
                    <Typography variant='body2'>
                        Coordinates: [{Math.floor(data.position.x)}, {Math.floor(data.position.y)}]
                        <Tooltip title='Go to.'>
                            <IconButton color='primary' component='label' onClick={() => {
                                if (props.onGoto) {
                                    props.onGoto(data.position);
                                }
                            }}>
                                <CenterFocusWeak sx={{
                                    fontSize: 16,
                                    color: style.linkColor,
                                    ':hover': {
                                        color: style.linkHoverColor,
                                    },
                                }} />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <Typography variant='body2' hidden={!data.chatLink}>
                        Chat Link: {data.chatLink}
                        <Tooltip title='Copy to clipboard.'>
                            <IconButton color='primary' component='label' onClick={() => navigator.clipboard.writeText(data.chatLink ?? '')}>
                                <ContentCopy sx={{
                                    fontSize: 16,
                                    color: style.linkColor,
                                    ':hover': {
                                        color: style.linkHoverColor,
                                    },
                                }} />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                </CardContent>
                <CardActions>
                    { data.wikiUrl ?
                        <span hidden={!data.wikiUrl}>
                            <Button
                                href={data.wikiUrl}
                                target='_blank'
                                size='small'
                                sx={{
                                    ':hover': {
                                        color: style.linkHoverColor,
                                    },
                                }}>
                                    Wiki
                            </Button>
                        </span> : undefined }
                </CardActions>
            </Card>
        </div>
    );
}
