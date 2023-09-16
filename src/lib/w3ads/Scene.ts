import { TimeMS, TimeS } from './types/misc.type';
import { PhysicsContext } from './PhysicsContext';
import { GraphicsContext } from './GraphicsContext';

export abstract class Scene {
    public sceneKey: string;    
    public graphics: GraphicsContext;
    public physics: PhysicsContext;

    constructor( key: string) {
        this.sceneKey = key;
        this.graphics = new GraphicsContext();
        this.physics= new PhysicsContext({
            gravity: { x: 0, y: -10, z:0 },
        });
    }

    // Lifecycle
    _create(): void {

        this.create();
    }

    _load(): void {

        this.load();
    }

    _buiid(): void {

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