import * as THREE from 'three';
import { TimeMS } from './misc.type';

export abstract class Scene {
    public name: string;
    public root!: THREE.Scene;

    constructor(name: string) {
        this.name = name;
    }

    load(): void {
        this.root = new THREE.Scene();
        this.build();
    }

    abstract build(): void;
    abstract update(deltaTime: TimeMS): void;
}