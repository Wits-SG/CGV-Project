import * as THREE from 'three';
import { TimeMS, TimeS } from './types/misc.type';
import { PhysicsContext } from './PhysicsContext';
import { GraphicsContext } from './GraphicsContext';
import { Construct } from './Construct';

export abstract class Scene {
    public sceneKey: string;    
    public graphics: GraphicsContext;
    public physics: PhysicsContext;

    public constructs: Array<Construct>;

    constructor( key: string, AmmoLib: any ) {
        this.sceneKey = key;
        this.graphics = new GraphicsContext();
        this.physics= new PhysicsContext(AmmoLib, {
            gravity: { x: 0, y: -10, z:0 },
        });
        this.constructs = [];
    }

    setRenderer(renderer: THREE.WebGLRenderer) {
        this.graphics.renderer = renderer;
    }

    // Lifecycle
    _create(): void {
        this.create();

        for (let construct of this.constructs) {
            construct.create();
        }
    }

    async _load() {
        await this.load();

        for (let construct of this.constructs) {
            await construct.load();
        }
    }

    _build(): void {
        this.build();

        for (let construct of this.constructs) {
            construct.build();
        }
    }

    _update(time: TimeS, delta: TimeMS): void {
        this.physics.update(delta);

        this.update(time, delta);

        for (let construct of this.constructs) {
            construct.update(time, delta);
        }
    }

    _destroy() {
        for (let construct of this.constructs) {
            construct.destroy();
        }

        this.destroy();
    }

    // Lifecycle Hooks
    abstract create(): void;
    abstract load() : Promise<void>; 
    abstract build(): void;
    abstract update(time?: TimeS, delta?: TimeS): void;
    abstract destroy(): void;

    addConstruct(newConstruct: Construct) {
        this.constructs.push(newConstruct);
    }
}
