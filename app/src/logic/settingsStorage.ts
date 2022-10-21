const settingsKeyName = 'settings';

export const defaultSettings = {
    showIconDistanceMin: 5.5,
    showIconDistanceMax: 10,
    iconSize: 24,

    showRegionBorderDistanceMin: 0,
    showRegionBorderDistanceMax: 3,
    showRegionTextDistanceMin: 0,
    showRegionTextDistanceMax: 3,

    showZoneBorderDistanceMin: 3,
    showZoneBorderDistanceMax: 10,
    showZoneTextDistanceMin: 3,
    showZoneTextDistanceMax: 5,

    showAreaBorderDistanceMin: 5,
    showAreaBorderDistanceMax: 10,
    showAreaTextDistanceMin: 5,
    showAreaTextDistanceMax: 6,

    showExpansionBase: true,
    showExpansionLw2: true,
    showExpansionHot: true,
    showExpansionLw3: true,
    showExpansionPof: true,
    showExpansionLw4: true,
    showExpansionLw5: true,
    showExpansionEod: true,

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

export function getEnabledExpansions(): Set<string> {
    const settings = getSettings();
    const result = new Set<string>();

    if (settings.showExpansionBase) { result.add('base'); }
    if (settings.showExpansionLw2) { result.add('lw2'); }
    if (settings.showExpansionHot) { result.add('hot'); }
    if (settings.showExpansionLw3) { result.add('lw3'); }
    if (settings.showExpansionPof) { result.add('pof'); }
    if (settings.showExpansionLw4) { result.add('lw4'); }
    if (settings.showExpansionLw5) { result.add('lw5'); }
    if (settings.showExpansionEod) { result.add('eod'); }

    return result;
}
