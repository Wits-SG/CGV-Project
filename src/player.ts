import * as THREE from 'three';
import { GraphicsContext, PhysicsColliderFactory, PhysicsContext } from './lib';

export class PlayerConstruct {
    graphics: GraphicsContext;
    physics: PhysicsContext;

    camera!: THREE.PerspectiveCamera;
    body!: THREE.Mesh;

    moveSpeed = 100;
    jumpSpeed = 8;

    position: { x: number, y: number, z: number };
    cameraOffset: { x: number, y: number, z: number } = { x: 0, y: 2, z: 5 };

    constructor(graphics: GraphicsContext, physics: PhysicsContext) {
        this.graphics = graphics;
        this.physics = physics;
        this.position = { x: 0, y: 0, z: 0 };
    }

    create() {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key == 'w') {
                this.physics.setLinearVelocityOn(this.body, 0, 0, this.moveSpeed);
                return;
            }

            if (event.key == 'a') {
                this.physics.setLinearVelocityOn(this.body, this.moveSpeed, 0, 0);
                return;
            }

            if (event.key == 's') {
                this.physics.setLinearVelocityOn(this.body, 0, 0, -this.moveSpeed);
                return;
            }

            if (event.key == 'd') {
                this.physics.setLinearVelocityOn(this.body, -this.moveSpeed, 0, 0);
                return;
            }

            if (event.key == ' ') {
                this.physics.setLinearVelocityOn(this.body, 0, this.jumpSpeed, 0);
                return;
            }
        });
    }

    load() {}

    build() {
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
        
        const bodyGeometry = new THREE.CapsuleGeometry(1, 2, 10, 20);
        const bodyMaterial = new THREE.MeshLambertMaterial({
            color: 0x049ef4
        });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);

        this.graphics.add(this.body);
        this.graphics.mainCamera = this.camera;

        this.physics.addDynamic(this.body, PhysicsColliderFactory.box(1, 2, 1), {
            mass: 10,
            linearVelocity: { x: 0, y: 0, z: 0},
            friction: 2
        });
    }

    update() {
        this.setPosition(
            this.body.position.x, 
            this.body.position.y, 
            this.body.position.z
        );
        this.camera.position.set(
            this.position.x + this.cameraOffset.x,
            this.position.y + this.cameraOffset.y,
            this.position.z + this.cameraOffset.z,
        );
        this.camera.lookAt(
            this.position.x, this.position.y, this.position.z
        );
    }

    destroy() {}

    setPosition(x: number, y: number, z: number) {
        this.position = { x: x, y: y, z: z };
    }
}
