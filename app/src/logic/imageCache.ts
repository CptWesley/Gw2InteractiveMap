import { Mutex } from 'async-mutex';

const mutex = new Mutex();
const cacheMaxSize = 1000;
const cache = new Map<string, Promise<HTMLImageElement>>();
const cacheLastUsed = new Map<string, number>();
let requestNumber = 0;

export async function downloadImage(url: string): Promise<HTMLImageElement> {
    await mutex.acquire();

    try {
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
    while (cache.size > cacheMaxSize) {
        let min = Number.POSITIVE_INFINITY;
        let url:string|undefined = undefined;
        cacheLastUsed.forEach((value, key) => {
            if (value < min) {
                url = key;
                min = value;
            }
        });

        if (url) {
            cache.delete(url);
        }
    }
}
