import * as THREE from 'three';
import { TimeMS, TimeS } from './types/misc.type';
import { PhysicsContext } from './PhysicsContext';
import { GraphicsContext } from './GraphicsContext';

export abstract class Scene {
    public sceneKey: string;    
    public graphics: GraphicsContext;
    public physics: PhysicsContext;

    constructor( key: string, AmmoLib: any ) {
        this.sceneKey = key;
        this.graphics = new GraphicsContext();
        this.physics= new PhysicsContext(AmmoLib, {
            gravity: { x: 0, y: -10, z:0 },
        });
    }

    setRenderer(renderer: THREE.WebGLRenderer) {
        this.graphics.renderer = renderer;
    }

    // Lifecycle
    _create(): void {
        this.create();
    }

    _load(): void {

        this.load();
    }

    _build(): void {

        this.build();
    }

    _update(time: TimeS, delta: TimeMS): void {
        this.physics.update(delta);

        this.update(time, delta);
    }

    _destroy() {
        this.destroy();
    }

    // Lifecycle Hooks
    abstract create(): void;
    abstract load(): void;
    abstract build(): void;
    abstract update(time?: TimeS, delta?: TimeS): void;
    abstract destroy(): void;
}