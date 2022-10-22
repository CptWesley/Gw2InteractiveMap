import { toObjectMap } from '@/logic/utility/util';

const expansionList: Expansion[] = [
    {
        id: 'base',
        name: 'Guild Wars 2 Base Game',
        color: '#fcba03',
        wikiUrl: 'https://wiki.guildwars2.com/wiki/Main_Page',
    },
    {
        id: 'lw2',
        name: 'Living World Season 2',
        color: '#24221d',
        wikiUrl: 'https://wiki.guildwars2.com/wiki/Living_World_Season_2',
    },
    {
        id: 'hot',
        name: 'Heart of Thorns',
        color: '#00a308',
        wikiUrl: 'https://wiki.guildwars2.com/wiki/Guild_Wars_2:_Heart_of_Thorns',
    },
    {
        id: 'lw3',
        name: 'Living World Season 3',
        color: '#0e3804',
        wikiUrl: 'https://wiki.guildwars2.com/wiki/Living_World_Season_3',
    },
    {
        id: 'pof',
        name: 'Path of Fire',
        color: '#cc2a06',
        wikiUrl: 'https://wiki.guildwars2.com/wiki/Guild_Wars_2:_Path_of_Fire',
    },
    {
        id: 'lw4',
        name: 'Living World Season 4',
        color: '#870c71',
        wikiUrl: 'https://wiki.guildwars2.com/wiki/Living_World_Season_4',
    },
    {
        id: 'eod',
        name: 'End of Dragons',
        color: '#7ec1cf',
        wikiUrl: 'https://wiki.guildwars2.com/wiki/Guild_Wars_2:_End_of_Dragons',
    },
    {
        id: 'lw5',
        name: 'Icebrood Saga (Living World Season 5)',
        color: '#dea6dd',
        wikiUrl: 'https://wiki.guildwars2.com/wiki/The_Icebrood_Saga',
    },
];

export const expansions: ExpansionMap = toObjectMap(expansionList, x => x.id);
