import * as THREE from 'three';
import { PhysicsContext } from "./PhysicsContext";
import { GraphicsContext } from "./GraphicsContext";
import { TimeS, TimeMS } from "./types/misc.type";

export abstract class Construct {
    public graphics: GraphicsContext;
    public physics: PhysicsContext;

    public root: THREE.Object3D;

    constructor(graphics: GraphicsContext, physics: PhysicsContext) {
        this.graphics = graphics;
        this.physics = physics;
        this.root = new THREE.Object3D();
    }

    add(newObj: THREE.Object3D) {
        this.root.add(newObj);
    }

    abstract create(): void;
    abstract load(): Promise<void>;
    abstract build(): void;
    abstract update(time?: TimeS, delta?: TimeMS): void;
    abstract destroy(): void;

}
