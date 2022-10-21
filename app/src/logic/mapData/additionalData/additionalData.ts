import { AdditionalZoneDataMap, AdditionalZoneData, AdditionalRegionDataMap, AdditionalRegionData } from '@/global';
import { toObjectMap } from '@/logic/utility/util';
import additionalZoneData from './additionalZoneData';
import additionalRegionData from './additionalRegionData';

export const zones: AdditionalZoneDataMap = toObjectMap(additionalZoneData as AdditionalZoneData[], x => x.id);
export const regions: AdditionalRegionDataMap = toObjectMap(additionalRegionData as AdditionalRegionData[], x => x.id);
