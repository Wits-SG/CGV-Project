import { PhysicsContext } from "./PhysicsContext";
import { GraphicsContext } from "./GraphicsContext";
import { TimeS, TimeMS } from "./types/misc.type";

export abstract class Construct {
    public graphics: GraphicsContext;
    public physics: PhysicsContext;

    constructor(graphics: GraphicsContext, physics: PhysicsContext) {
        this.graphics = graphics;
        this.physics = physics;
    }

    abstract create(): void;
    abstract load(): void;
    abstract build(): void;
    abstract update(time?: TimeS, delta?: TimeMS): void;
    abstract destroy(): void;

}
