import * as THREE from 'three';
import { TimeS } from './misc.type';

export abstract class Level {
    public id!: string;
    public name!: string;
    public description!: string;
    public root!: THREE.Scene;

    /**
     * @description The constructor registers the scene with the SceneLoader
     * @param id - The string identifier of the Level. Will try to convert it to SCREAMING-KEBAB-CASE
     * @param name - The name of a Level
     * @param description - The description of a level
     */
    constructor(id: string, name: string, description: string) {
        id = id.trim();
        id = id.replaceAll(" ", "-");
        id = id.toUpperCase();

        this.id = id;
        this.name = name;
        this.description = description;
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