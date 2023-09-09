import * as THREE from 'three';
import { TimeS } from './misc.type';

export abstract class Construct {
    public root!: THREE.Object3D;

    constructor() {}

    load(): void {
        this.root = new THREE.Object3D();
        this.build();
    }

    abstract build(): void;

    abstract update(deltaTime: TimeS): void;
}