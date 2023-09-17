import * as THREE from 'three';
import { GraphicsContext, PhysicsColliderFactory, PhysicsContext } from './lib';

export class PlayerConstruct {
    graphics: GraphicsContext;
    physics: PhysicsContext;

    camera!: THREE.PerspectiveCamera;
    body!: THREE.Mesh;

    moveSpeed = 100;
    jumpSpeed = 8;

    constructor(graphics: GraphicsContext, physics: PhysicsContext) {
        this.graphics = graphics;
        this.physics = physics;
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
        this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 20, 0);
        this.camera.lookAt(0, 0, 0);
        
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
        // this.camera.position.set(
        //     this.body.position.x, this.body.position.y, this.body.position.z
        // );
        // console.log(this.camera.position)
    }

    destroy() {}

    setPosition(x: number, y: number, z: number) {
        this.body.position.set(x, y ,z);
        this.camera.position.set(x, y , z);
    }
}