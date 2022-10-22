export function getValue<TKey, TValue>(obj: ObjectMap<TKey, TValue>, key: TKey): TValue|undefined {
    return (obj as any)[key] as TValue|undefined;
}

export function setValue<TKey, TValue>(obj: ObjectMap<TKey, TValue>, key: TKey, value: TValue): void {
    (obj as any)[key] = value;
}

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

export function findEntry<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (key: TKey, value: TValue) => boolean): { key: TKey, value: TValue }|undefined {
    const entries = Object.entries(obj);
    for (let i = 0; i < entries.length; i++) {
        const entry = { key: entries[i][0] as TKey, value: entries[i][1] as TValue };
        if (action(entry.key, entry.value)) {
            return entry;
        }
    }

    return undefined;
}

export function findKey<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (key: TKey) => boolean): TKey|undefined {
    const result = findEntry(obj, (k) => {
        return action(k);
    });

    if (!result) {
        return undefined;
    }

    return result.key;
}

export function findValue<TKey, TValue>(obj: ObjectMap<TKey, TValue>, action: (value: TValue) => boolean): TValue|undefined {
    const result = findEntry(obj, (k, v) => {
        return action(v);
    });

    if (!result) {
        return undefined;
    }

    return result.value;
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

export function toObjectMap<TKey, TValue>(list: TValue[], getKey: (element: TValue) => TKey): ObjectMap<TKey, TValue> {
    const result:any = {};
    list.forEach(x => {
        result[getKey(x)] = x;
    });

    return result;
}
