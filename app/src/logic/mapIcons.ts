import { downloadImage } from '@/logic/imageCache';
import { TrackedPromise } from '@/logic/TrackedPromise';

declare type IconImages = {
    incomplete: TrackedPromise<HTMLImageElement>,
    complete: TrackedPromise<HTMLImageElement>,
};

declare type IconTypeName = keyof typeof iconsRaw;

declare type IconImagesMap = {
    [key in IconTypeName]: IconImages;
};

const iconsRaw = {
    'vista': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/0/02/Vista_empty_%28map_icon%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/f/ff/Vista_%28map_icon%29.png'),
    },
    'poi': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/2/2e/Point_of_interest_%28undiscovered%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/7/70/Point_of_interest_%28map_icon%29.png'),
    },
    'waypoint': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/8/8d/Locked_waypoint_%28map_icon%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/d/d2/Waypoint_%28map_icon%29.png'),
    },
    'heart': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/2/23/Renown_Heart_empty_%28map_icon%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/6/6e/Renown_Heart_%28map_icon%29.png'),
    },
    'hero_challenge': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/6/69/Hero_Challenge_empty_%28map_icon%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/6/66/Hero_Challenge_%28map_icon%29.png'),
    },
    'hero_challenge_expansion': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/9/91/Hero_Challenge_empty_%28Heart_of_Thorns_map_icon%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/8/81/Hero_Challenge_%28Heart_of_Thorns_map_icon%29.png'),
    },
    'adventure': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/1/13/Adventure_%28map_icon%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/1/13/Adventure_%28map_icon%29.png'),
    },
    'mastery_tyria': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/1/1c/Mastery_point_%28none%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/b/b7/Mastery_point_%28Central_Tyria%29.png'),
    },
    'mastery_hot': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/1/1c/Mastery_point_%28none%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/8/84/Mastery_point_%28Heart_of_Thorns%29.png'),
    },
    'mastery_pof': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/1/1c/Mastery_point_%28none%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/4/41/Mastery_point_%28Path_of_Fire%29.png'),
    },
    'mastery_is': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/1/1c/Mastery_point_%28none%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/2/25/Mastery_point_%28Icebrood_Saga%29.png'),
    },
    'mastery_eod': {
        incomplete: downloadImage('https://wiki.guildwars2.com/images/1/1c/Mastery_point_%28none%29.png'),
        complete: downloadImage('https://wiki.guildwars2.com/images/b/b6/Mastery_point_%28End_of_Dragons%29.png'),
    },
};

export const icons: IconImagesMap = iconsRaw;
