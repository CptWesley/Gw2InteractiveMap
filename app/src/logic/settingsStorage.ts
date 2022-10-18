const settingsKeyName = 'settings';

export const defaultSettings = {
    showIconDistanceMin: 5.5,
    showIconDistanceMax: 10,
    iconSize: 24,
    showMapBorderDistanceMin: 0,
    showMapBorderDistanceMax: 10,
    showMapTextDistanceMin: 0,
    showMapTextDistanceMax: 5.5,
    dummy: true,
};

export declare type Settings = typeof defaultSettings;

export function getSettings(): Settings {
    const retrievedJson = localStorage.getItem(settingsKeyName);
    if (!retrievedJson) {
        return defaultSettings;
    }

    const retrieved = JSON.parse(retrievedJson);
    if (!retrieved) {
        return defaultSettings;
    }
    Object.entries(defaultSettings).forEach(([key, value]) => {
        if (!(key in retrieved)) {
            retrieved[key] = value;
        }
    });

    return retrieved as Settings;
}

export function getSetting<TKey extends keyof Settings>(key: TKey): Settings[TKey] {
    return getSettings()[key];
}

export function updateSettings(action: (settings: Settings) => void, onSettingsChanged?: () => void): void {
    const settings = getSettings();
    const oldJson = JSON.stringify(settings);
    action(settings);
    const newJson = JSON.stringify(settings);

    if (oldJson === newJson) {
        return;
    }

    localStorage.setItem(settingsKeyName, JSON.stringify(settings));

    if (onSettingsChanged) {
        onSettingsChanged();
    }
}

export function updateSetting<TKey extends keyof Settings>(key: TKey, updater: (value: Settings[TKey]) => Settings[TKey], onSettingsChanged?: () => void): void {
    updateSettings(settings => {
        settings[key] = updater(settings[key]);
    },
    onSettingsChanged);
}

export function setSetting<TKey extends keyof Settings>(key: TKey, value: Settings[TKey], onSettingsChanged?: () => void): void {
    updateSetting(key, () => value, onSettingsChanged);
}
