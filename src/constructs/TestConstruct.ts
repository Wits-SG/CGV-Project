import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory } from '../lib/index';

export class TestConstruct extends Construct {

    ball!: THREE.Mesh;

    constructor(graphics: GraphicsContext, physics: PhysicsContext ) {
        super(graphics, physics);
    }

    create() {}

    load() {}

    build() {
        this.ball = GraphicsPrimitiveFactory.sphere({
            position: { x: 0, y: 0, z: 2 },
            rotation: { x: 0, y: 0, z: 0 },
            radius: 1,
            colour: 0xff0000,
            shadows: true,
        })
        this.graphics.add(this.ball);
        this.physics.addDynamic(this.ball, PhysicsColliderFactory.sphere(1), {
            mass: 1,
            linearVelocity: { x: 0, y: 0, z: 0 },
            friction: 0,
        })
    }

    update() {}

    destroy() {}
}
