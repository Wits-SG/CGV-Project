import { Scene } from "./lib/types/scene.type";
import { Demo1 } from "./scenes/Demo1";
import { Demo2 } from "./scenes/Demo2";

export let scene!: Scene; // Current scene object
export let currentScene: string; // Current scene string identifier

// A list of all avaliable scenes - should be dynamically updated by scene constructors in the future
const availableScenes: Array<string> = [
    'DEMO-1', 'DEMO-2'
];
/**
 * @description The actual scene swticher. Should never be called outside of changeScene and this file
 * @returns null
 */
const sceneLoader = () => {
    if (currentScene == 'DEMO-1') {
        scene = new Demo1;
        scene.load();
        return;
    }

    if (currentScene == 'DEMO-2') {
        scene = new Demo2;
        scene.load();
        return;
    }

    throw new Error("Unreachable - No Scene was loaded");
}

/**
 * @description Change the currently loaded scene to the specified one - in future should also handle a loading screen transition
 * @param newScene - The string identifier of a scene. Will try be converted to SCREAMING-KEBAB-CASE
 * @returns null
 */
export const changeScene = (newScene: string) => {
    newScene = newScene.trim();
    newScene = newScene.replace(' ', '-');
    newScene = newScene.toUpperCase();

    if (availableScenes.includes(newScene)) {
        currentScene = newScene;
        sceneLoader();
        return;
    }
    throw new Error(`Undefined scene was tried to load - ${newScene} does not exist`);
}

/**
 * @description Initilizes the scene to some default so its not null. Called only once at the start of the program
 */
export const initScene = () => {
    changeScene(availableScenes[0]);
}