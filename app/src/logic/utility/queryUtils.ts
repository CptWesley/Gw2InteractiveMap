import { useSearchParams } from 'react-router-dom';

export class QueryParams<TStorage extends {}> {
    private defaultParams: TStorage;
    private searchParams: URLSearchParams;
    private setSearchParams: (searchParams: string, options?: {
        replace?: boolean;
        state?: any;
    }) => void;

    constructor(defaultParams: TStorage, searchParams: URLSearchParams, setSearchParams: (searchParams: string) => void) {
        this.defaultParams = defaultParams;
        this.searchParams = searchParams;
        this.setSearchParams = setSearchParams;

        Object.entries(defaultParams).forEach(([key, value]) => {
            const curValue = this.searchParams.get(key.toString());
            if (!curValue) {
                if (typeof value === 'string') {
                    this.searchParams.set(key.toString(), encodeURIComponent(value));
                } else {
                    this.searchParams.set(key.toString(), encodeURIComponent(JSON.stringify(value)));
                }
            }
        });
    }

    get<TKey extends keyof TStorage>(key: TKey): TStorage[TKey] {
        const valueEncoded = this.searchParams.get(key.toString());
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
            this.searchParams.set(key.toString(), encodeURIComponent(value));
        } else {
            this.searchParams.set(key.toString(), encodeURIComponent(JSON.stringify(value)));
        }
    }

    update<TKey extends keyof TStorage>(key: TKey, updater: (value: TStorage[TKey]) => TStorage[TKey]): void {
        const oldValue = this.get(key);
        const newValue = updater(oldValue);
        this.set(key, newValue);
    }

    push(): void {
        this.setSearchParams(this.searchParams.toString());
    }

    replace(): void {
        this.setSearchParams(this.searchParams.toString(), { replace: true });
    }
}

export function useQuery<TStorage extends {}>(defaultParams: TStorage): QueryParams<TStorage> {
    const [searchParams, setSearchParams] = useSearchParams();
    const params = new QueryParams(defaultParams, searchParams, setSearchParams);
    return params;
}
