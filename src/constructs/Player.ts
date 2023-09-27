import * as THREE from 'three'; 
import { Construct, GraphicsPrimitiveFactory, PhysicsColliderFactory } from "../lib";

export class Player extends Construct {
    body!: THREE.Mesh; // Graphics element
    face!: THREE.Mesh;
    phybody!: any; // Physics rigid body

    create(): void {
    }

    async load(): Promise<void> {
    }

    build(): void {
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const bodyGeometry = new THREE.CapsuleGeometry(1, 2, 10, 10);
        this.body = new THREE.Mesh(bodyGeometry, bodyMat);
        this.setPosition(0, 1, 0);

        this.face = GraphicsPrimitiveFactory.box({
            position: { x: 0.9, y: 1.4, z: 0 },
            scale: { x: 0.2, y: 0.4, z: 0.4 }, 
            rotation: { x: 0, y: 0, z: 0 },
            colour: 0xff0000,
            shadows: true
        })

        this.physics.addDynamic(this.body, PhysicsColliderFactory.box(1, 2, 1), {
            linearVelocity: { x: 0, y: 0, z: 0},
            mass: 10,
            friction: 5
        });
        this.phybody = this.body.userData.physicsBody;

        this.body.add(this.face);
        this.graphics.add(this.body);
    }

    update(time?: number | undefined, delta?: number | undefined): void {
        
    }

    destroy(): void {
    }

    setPosition(x: number, y: number, z: number) {
        this.body.position.set(x, y, z);
    }
}