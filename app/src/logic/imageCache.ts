import { sortBy } from 'lodash';
import { track, TrackedPromise } from '@/logic/TrackedPromise';

const cacheMaxSize = 5000;
const cacheKeepSize = 4000;
const cache = new Map<string, TrackedPromise<HTMLImageElement>>();
const cacheLastUsed = new Map<string, number>();
let requestNumber = 0;

export function downloadImage(url: string): TrackedPromise<HTMLImageElement> {
    cacheLastUsed.set(url, requestNumber);
    requestNumber++;

    const cacheResult = cache.get(url);
    if (cacheResult) {
        return cacheResult;
    }

    const downloadResult = track(innerDownloadImage(url));
    cache.set(url, downloadResult);
    trimCache();
    return downloadResult;
}

export function imageIsCached(url: string): boolean {
    return cacheLastUsed.has(url);
}

async function innerDownloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image;
        img.src = url;
        img.addEventListener('load', () => {
            resolve(img);
        });
        img.addEventListener('error', reject);
    });
}

function trimCache() {
    if (cache.size < cacheMaxSize) {
        return;
    }

    const deleteCount = cache.size - cacheKeepSize;
    const entries = Array.from(cacheLastUsed.entries());
    const sorted = sortBy(entries, [(entry: [string, number]) =>entry[1]]);

    for (let i = 0; i < deleteCount; i++) {
        const entry = sorted[i];
        cache.delete(entry[0]);
        cacheLastUsed.delete(entry[0]);
    }
}
