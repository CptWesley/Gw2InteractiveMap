import { AdditionalZoneDataMap, AdditionalZoneData, AdditionalRegionDataMap, AdditionalRegionData } from '@/global';
import { toObjectMap } from '@/logic/utility/util';

export const zones: AdditionalZoneDataMap = toObjectMap(require('./additionalZoneData.js') as AdditionalZoneData[], x => x.id);
export const regions: AdditionalRegionDataMap = toObjectMap(require('./additionalRegionData.js') as AdditionalRegionData[], x => x.id);
