import * as THREE from 'three';
import { TimeS } from './misc.type';

export abstract class Scene {
    public name!: string;
    public root!: THREE.Scene;

    /**
     * @description The constructor registers the scene with the SceneLoader
     * @param name - The string identifier of the Scene. Will try to convert it to SCREAMING-KEBAB-CASE
     */
    constructor(name: string) {
        name = name.trim();
        name = name.replaceAll(" ", "-");
        name = name.toUpperCase();
        this.name = name;
    }

    /**
     * @description A load function called once per scene. It handles any and all instatntion required by a Scene to function
     */
    load(): void {
        this.root = new THREE.Scene();
        this.build();
    }

    /**
     * @description An abstract method that gets overridden by child classes. It will act as the scene builder, allowing for the scene to be customized in a secure environment
     */
    abstract build(): void;

    /**
     * @description An abstract method called every frame. Must be overridden to correctly animate the scene
     * @param deltaTime - The amount of time in S since the last frame
     */
    abstract update(deltaTime: TimeS): void;
}