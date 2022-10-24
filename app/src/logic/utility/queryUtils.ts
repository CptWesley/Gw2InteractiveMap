export class QueryParams<TStorage extends {}> {
    private defaultParams: TStorage;
    private url: URL;

    constructor(defaultParams: TStorage, url: URL) {
        this.defaultParams = defaultParams;
        this.url = url;

        Object.entries(defaultParams).forEach(([key, value]) => {
            const curValue = this.url.searchParams.get(key.toString());
            if (!curValue) {
                if (typeof value === 'string') {
                    this.url.searchParams.set(key.toString(), encodeURIComponent(value));
                } else {
                    this.url.searchParams.set(key.toString(), encodeURIComponent(JSON.stringify(value)));
                }
            }
        });
    }

    get<TKey extends keyof TStorage>(key: TKey): TStorage[TKey] {
        const valueEncoded = this.url.searchParams.get(key.toString());
        if (!valueEncoded) {
            return this.defaultParams[key];
        }

        const value = decodeURIComponent(valueEncoded);

        try {
            return JSON.parse(value);
        } catch {
            return value as TStorage[TKey];
        }
    }

    set<TKey extends keyof TStorage>(key: TKey, value: TStorage[TKey]): void {
        if (typeof value === 'string') {
            this.url.searchParams.set(key.toString(), encodeURIComponent(value));
        } else {
            this.url.searchParams.set(key.toString(), encodeURIComponent(JSON.stringify(value)));
        }
    }

    update<TKey extends keyof TStorage>(key: TKey, updater: (value: TStorage[TKey]) => TStorage[TKey]): void {
        const oldValue = this.get(key);
        const newValue = updater(oldValue);
        this.set(key, newValue);
    }

    push(): void {
        window.history.pushState({}, '', this.url);
    }

    replace(): void {
        window.history.replaceState({}, '', this.url);
    }
}

export function useQuery<TStorage extends {}>(defaultParams: TStorage): QueryParams<TStorage> {
    const url = new URL(window.location.href);
    const params = new QueryParams(defaultParams, url);
    return params;
}
