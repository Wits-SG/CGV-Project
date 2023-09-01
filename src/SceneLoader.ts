import { Scene } from "./lib/types/scene.type";
import { Demo1 } from "./scenes/Demo1";
import { Demo2 } from "./scenes/Demo2";

export let scene!: Scene;
export let currentScene: string;

const availableScenes: Array<string> = [
    'DEMO-1', 'DEMO-2'
];
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

export const initScene = () => {
    changeScene(availableScenes[0]);
}