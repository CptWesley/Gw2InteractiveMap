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
                this.searchParams.set(key.toString(), JSON.stringify(value));
            }
        });
    }

    get<TKey extends keyof TStorage>(key: TKey): TStorage[TKey] {
        const value = this.searchParams.get(key.toString())!;
        if (value) {
            return JSON.parse(value);
        }

        return this.defaultParams[key];
    }

    set<TKey extends keyof TStorage>(key: TKey, value: TStorage[TKey]): void {
        this.searchParams.set(key.toString(), JSON.stringify(value));
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
