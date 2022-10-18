import { ObjectMap } from '@/react-app-env';

export function forEachEntry<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (key: TKey, value: TValue) => void): void {
    Object.entries(obj).forEach((entry) => {
        action(<TKey>entry[0], <TValue>entry[1]);
    });
}

export function forEachKey<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (key: TKey) => void): void {
    forEachEntry(obj, (k) => {
        action(k);
    });
}

export function forEachValue<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (value: TValue) => void): void {
    forEachEntry(obj, (k, v) => {
        action(v);
    });
}

export function mapEntry<TKeyIn, TValueIn, TKeyOut, TValueOut>(obj: ObjectMap<TKeyIn, TValueIn>, action: (key: TKeyIn, value: TValueIn) => { key: TKeyOut, value: TValueOut }): ObjectMap<TKeyOut, TValueOut> {
    const result: any = {};
    Object.entries(obj).forEach((entry) => {
        const { key, value } = action(<TKeyIn>entry[0], <TValueIn>entry[1]);
        result[key] = value;
    });
    return result as ObjectMap<TKeyOut, TValueOut>;
}

export function mapKey<TKeyIn, TValueIn, TKeyOut>(obj: ObjectMap<TKeyIn, TValueIn>, action: (key: TKeyIn) => TKeyOut): ObjectMap<TKeyOut, TValueIn> {
    return mapEntry(obj, (k, v) => {
        return { key: action(k), value: v };
    });
}

export function mapValue<TKeyIn, TValueIn, TValueOut>(obj: ObjectMap<TKeyIn, TValueIn>, action: (value: TValueIn) => TValueOut): ObjectMap<TKeyIn, TValueOut> {
    return mapEntry(obj, (k, v) => {
        return { key: k, value: action(v) };
    });
}

export function filterEntry<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (key: TKey, value: TValue) => boolean): ObjectMap<TKey, TValue> {
    const result: any = {};
    Object.entries(obj).forEach((entry) => {
        const key = entry[0] as TKey;
        const value = entry[1] as TValue;
        if (action(key, value)) {
            result[key] = value;
        }
    });
    return result as ObjectMap<TKey, TValue>;
}

export function filterKey<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (key: TKey) => boolean): ObjectMap<TKey, TValue> {
    return filterEntry(obj, (k) => {
        return action(k);
    });
}

export function filterValue<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (value: TValue) => boolean): ObjectMap<TKey, TValue> {
    return filterEntry(obj, (k, v) => {
        return action(v);
    });
}

export function filterMapEntry<TKeyIn, TValueIn, TKeyOut, TValueOut>(obj: ObjectMap<TKeyIn, TValueIn>, action: (key: TKeyIn, value: TValueIn) => { key: TKeyOut, value: TValueOut }|undefined): ObjectMap<TKeyOut, TValueOut> {
    const result: any = {};
    Object.entries(obj).forEach((entry) => {
        const transformed = action(<TKeyIn>entry[0], <TValueIn>entry[1]);
        if (transformed !== undefined) {
            result[transformed.key] = transformed.value;
        }
    });
    return result as ObjectMap<TKeyOut, TValueOut>;
}

export function filterMapKey<TKeyIn, TValueIn, TKeyOut>(obj: ObjectMap<TKeyIn, TValueIn>, action: (key: TKeyIn) => TKeyOut|undefined): ObjectMap<TKeyOut, TValueIn> {
    return filterMapEntry(obj, (k, v) => {
        const newKey = action(k);
        if (newKey === undefined) {
            return undefined;
        }
        return { key: newKey, value: v };
    });
}

export function filterMapValue<TKeyIn, TValueIn, TValueOut>(obj: ObjectMap<TKeyIn, TValueIn>, action: (value: TValueIn) => TValueOut|undefined): ObjectMap<TKeyIn, TValueOut> {
    return filterMapEntry(obj, (k, v) => {
        const newValue = action(v);
        if (newValue === undefined) {
            return undefined;
        }
        return { key: k, value: newValue };
    });
}
