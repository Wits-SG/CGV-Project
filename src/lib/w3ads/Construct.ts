import * as THREE from 'three';
import { PhysicsContext } from "./PhysicsContext";
import { GraphicsContext } from "./GraphicsContext";
import { TimeS, TimeMS } from "./types/misc.type";
import { InteractManager } from './InteractManager';
import { InterfaceContext } from './InterfaceContext';

export abstract class Construct {
    public graphics: GraphicsContext;
    public physics: PhysicsContext;
    public userInterface: InterfaceContext; 
    public interactions: InteractManager;

    public root: THREE.Object3D;
    public constructs: Array<Construct>;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        this.graphics = graphics;
        this.physics = physics;
        this.interactions = interactions;
        this.userInterface = userInterface;
        this.root = new THREE.Object3D();
        this.constructs = [];
    }

    _create(): void {
        this.create();

        for (let construct of this.constructs) {
            construct._create();
        }
    }

    async _load() {
        await this.load();

        for (let construct of this.constructs) {
            await construct._load();
        }
    }

    _build(): void {
        for (let construct of this.constructs) {
            construct._build();
        }

        this.build();
    }

    _update(time: TimeS, delta: TimeMS): void {
        this.physics.update(delta);

        this.update(time, delta);

        for (let construct of this.constructs) {
            construct._update(time, delta);
        }
    }

    _destroy() {
        for (let construct of this.constructs) {
            construct._destroy();
        }

        this.destroy();
    }

    abstract create(): void;
    abstract load(): Promise<void>;
    abstract build(): void;
    abstract update(time?: TimeS, delta?: TimeMS): void;
    abstract destroy(): void;

    addConstruct(newConstruct: Construct) {
        this.constructs.push(newConstruct);
        this.add(newConstruct.root);
    }

    add(newObj: THREE.Object3D) {
        this.root.add(newObj);
    }

}
