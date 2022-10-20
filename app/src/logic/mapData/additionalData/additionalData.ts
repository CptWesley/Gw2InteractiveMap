import { AdditionalZoneDataMap, AdditionalZoneData } from '@/global';
import { toObjectMap } from '@/logic/utility/util';

export const zones: AdditionalZoneDataMap = toObjectMap(require('./additionalZoneData.js') as AdditionalZoneData[], x => x.id);
