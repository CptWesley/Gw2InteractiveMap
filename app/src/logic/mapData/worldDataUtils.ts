import worldData from '@/logic/mapData/worldData';
import { findValue, getValue } from '@/logic/utility/util';
import { regions, zones } from './additionalData/additionalData';

export function getRegion(map: string, id: string|number): { regionData: Region, additionalRegionData: AdditionalRegionData } {
    const idString = typeof id === 'number' ? id.toString() : id;
    const idNum = typeof id === 'string' ? parseInt(id) : id;

    const mapData = worldData[map];
    const regionData = getValue(mapData.regions, idString);
    if (!regionData) {
        throw new Error('Region data missing.');
    }

    const additionalRegionData = regions[idNum];

    return { regionData, additionalRegionData };
}

export function getZone(map: string, id: string|number): { zoneData: Zone, additionalZoneData: AdditionalZoneData } {
    const idString = typeof id === 'number' ? id.toString() : id;
    const idNum = typeof id === 'string' ? parseInt(id) : id;

    const mapData = worldData[map];
    let zoneData: Zone|undefined = undefined;

    findValue(mapData.regions, region => {
        const value = getValue(region.maps, idString);
        if (value) {
            zoneData = value;
            return true;
        }
        return false;
    });

    if (!zoneData) {
        throw new Error('Zone data missing.');
    }

    const additionalZoneData = zones[idNum];
    return { zoneData, additionalZoneData };
}

export function getArea(map: string, id: string|number): Area {
    const idString = typeof id === 'number' ? id.toString() : id;

    const mapData = worldData[map];
    let areaData: Area|undefined = undefined;

    findValue(mapData.regions, region => {
        return findValue(region.maps, zone => {
            const value = getValue(zone.sectors, idString);
            if (value) {
                areaData = value;
                return true;
            }
            return false;
        }) !== undefined;
    });

    if (!areaData) {
        throw new Error('Area data missing.');
    }

    return areaData;
}

export function getPointOfInterest(map: string, id: string|number): PointOfInterest {
    const idString = typeof id === 'number' ? id.toString() : id;

    const mapData = worldData[map];
    let poiData: PointOfInterest|undefined = undefined;

    findValue(mapData.regions, region => {
        return findValue(region.maps, zone => {
            const value = getValue(zone.points_of_interest, idString);
            if (value) {
                poiData = value;
                return true;
            }
            return false;
        }) !== undefined;
    });

    if (!poiData) {
        throw new Error('PoI data missing.');
    }

    return poiData;
}

export function getTask(map: string, id: string|number): Task {
    const idString = typeof id === 'number' ? id.toString() : id;

    const mapData = worldData[map];
    let data: Task|undefined = undefined;

    findValue(mapData.regions, region => {
        return findValue(region.maps, zone => {
            const value = getValue(zone.tasks, idString);
            if (value) {
                data = value;
                return true;
            }
            return false;
        }) !== undefined;
    });

    if (!data) {
        throw new Error('Task data missing.');
    }

    return data;
}

export function getChallenge(map: string, id: string|number): SkillChallenge {
    const idString = typeof id === 'number' ? id.toString() : id;

    const mapData = worldData[map];
    let data: SkillChallenge|undefined = undefined;

    findValue(mapData.regions, region => {
        return findValue(region.maps, zone => {
            const value = zone.skill_challenges.find(x => (x.id ?? `challenge-${Math.floor(x.coord[0])}-${Math.floor(x.coord[1])}`) === idString);
            if (value) {
                data = value;
                return true;
            }
            return false;
        }) !== undefined;
    });

    if (!data) {
        throw new Error('SkillChallenge data missing.');
    }

    return data;
}

export function getMasteryPoint(map: string, id: string|number): MasteryPoint {
    const idNum = typeof id === 'string' ? parseInt(id) : id;

    const mapData = worldData[map];
    let data: MasteryPoint|undefined = undefined;

    findValue(mapData.regions, region => {
        return findValue(region.maps, zone => {
            const value = zone.mastery_points.find(x => x.id === idNum);
            if (value) {
                data = value;
                return true;
            }
            return false;
        }) !== undefined;
    });

    if (!data) {
        throw new Error(`MasteryPoint data missing. id='${id}'`);
    }

    return data;
}
