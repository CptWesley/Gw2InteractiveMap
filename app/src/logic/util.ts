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
