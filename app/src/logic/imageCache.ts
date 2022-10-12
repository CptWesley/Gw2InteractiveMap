import { Mutex } from 'async-mutex';
import { sortBy } from 'lodash';

const mutex = new Mutex();
const cacheMaxSize = 1200;
const cacheKeepSize = 1000;
const cache = new Map<string, Promise<HTMLImageElement>>();
const cacheLastUsed = new Map<string, number>();
let requestNumber = 0;

export async function downloadImage(url: string): Promise<HTMLImageElement> {
    await mutex.acquire();

    try {
        trimCache();
        cacheLastUsed.set(url, requestNumber);
        requestNumber++;

        const cacheResult = cache.get(url);
        if (cacheResult) {
            return cacheResult;
        }

        const downloadResult = innerDownloadImage(url);
        cache.set(url, downloadResult);
        trimCache();
        return downloadResult;
    } finally {
        mutex.release();
    }
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
