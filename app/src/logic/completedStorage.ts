import {v4 as uuidv4} from 'uuid';
import { forEachEntry, forEachValue } from './utility/util';

const storageKeyName = 'completion';

function storeAll(map: CompletionMap): void {
    const obj: any = {};
    forEachEntry(map as ObjectMap<string, CharacterCompletion>, (id, completion) => {
        obj[id] = {
            name: completion.name,
            completed: Array.from(completion.completed),
        };
    });
    const json = JSON.stringify(obj);
    localStorage.setItem(storageKeyName, json);
}

function generateDefaultSetup(): CompletionMap {
    const id = getFreshId();
    const result: CompletionMap = {};
    result[id] = {
        name: 'Default',
        completed: new Set<string>(),
    };
    storeAll(result);
    return result;
}

export function getAllCompletion(): CompletionMap {
    const retrievedJson = localStorage.getItem(storageKeyName);
    if (!retrievedJson) {
        return generateDefaultSetup();
    }

    const retrieved = JSON.parse(retrievedJson);
    if (!retrieved) {
        return generateDefaultSetup();
    }

    forEachValue(retrieved as ObjectMap<any, any>, x => {
        x.completed = new Set<string>(x.completed);
    });

    return retrieved as CompletionMap;
}

export function getCompletion(id: string): CharacterCompletion|undefined {
    const all = getAllCompletion();
    return all[id];
}

function getFreshId(): string {
    if (!localStorage.getItem(storageKeyName)) {
        return uuidv4();
    }

    const all = getAllCompletion();
    while (true) {
        const id = uuidv4();
        if (!all[id]) {
            return id;
        }
    }
}

export function createCharacterCompletion(): string {
    const all = getAllCompletion();
    const id = getFreshId();
    all[id] = {
        name: 'Unknown Character',
        completed: new Set<string>(),
    };
    storeAll(all);
    return id;
}

export function setCharacterName(id: string, name: string): void {
    const all = getAllCompletion();
    const character = all[id];
    if (!character) {
        return;
    }
    character.name = name;
    storeAll(all);
}

export function deleteCharacterCompletion(id: string): void {
    const all = getAllCompletion();
    all[id] = undefined;
    storeAll(all);
}

export function setCharacterCompleted(characterId: string, entityId: string, completed: boolean): void {
    const all = getAllCompletion();
    const character = all[characterId];
    if (!character) {
        return;
    }

    if (completed) {
        character.completed.add(entityId);
    } else {
        character.completed.delete(entityId);
    }
    storeAll(all);
}

export function getCharacterCompleted(characterId: string, entityId: string): boolean {
    const all = getAllCompletion();
    const character = all[characterId];
    if (!character) {
        return false;
    }

    return character.completed.has(entityId);
}

export function getCharacterOptions(): { text: string, value: string }[] {
    const options: { text: string, value: string }[] = [];
    forEachEntry(getAllCompletion() as ObjectMap<string, CharacterCompletion>, (id, completion) => {
        options.push({ text: completion.name, value: id });
    });
    return options;
}
