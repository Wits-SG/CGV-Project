import { Level } from "./lib/types/level.type";
import { Demo1 } from "./levels/Demo1";
import { Demo2 } from "./levels/Demo2";

export let level!: Level; // Current level object

// A list of all avaliable levels 
const availableLevels: Array<Level> = [
    new Demo1(), new Demo2()
];

/**
 * @description Change the currently loaded level to the specified one - in future should also handle a loading screen transition
 * @param levelID - The string identifier of a level. Will try be converted to SCREAMING-KEBAB-CASE
 * @returns null
 */
export const changeLevel = (levelID: string) => {
    levelID = levelID.trim();
    levelID = levelID.replaceAll(" ", "-");
    levelID = levelID.toUpperCase();

    for (let availableLevel of availableLevels) {
        if (levelID === availableLevel.id) {
            level = availableLevel;
            level.load();
            return;
        }
    }
}

/**
 * @description Initilizes the scene to some default so its not null. Called only once at the start of the program
 */
export const initLevel = () => {
    changeLevel(availableLevels[0].id);
}