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
