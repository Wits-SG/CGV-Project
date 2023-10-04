import * as THREE from 'three'; 
import { Construct, GraphicsPrimitiveFactory, PhysicsColliderFactory } from "../lib";

export class Player extends Construct {
    body!: THREE.Mesh; // Graphics element
    face!: THREE.Mesh;
    camera!: THREE.Camera;

    direction!: { f: number, b: number, l: number, r: number }
    speed: number = 0.2;

    sensitivity: number = 0.2 * Math.PI / 180; // Angle change per unit = 1 degree

    create(): void {
        this.direction = { f: 0, b: 0, l: 0, r: 0 };
        this.root.userData.canInteract = false;
        this.physics.addInteracting(this.root);

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key == 'w' || event.key == 'W') { this.direction.f = 1; }
            if (event.key == 's' || event.key == 'S') { this.direction.b = 1; }
            if (event.key == 'a' || event.key == 'A') { this.direction.l = 1; }
            if (event.key == 'd' || event.key == 'D') { this.direction.r = 1; }
            if (event.key == ' ') { this.physics.jumpCharacter(this.body); }
            if (event.key == 'Shift') { this.speed = 0.4 }
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key == 'w' || event.key == 'W') { this.direction.f = 0; }
            if (event.key == 's' || event.key == 'S') { this.direction.b = 0; }
            if (event.key == 'a' || event.key == 'A') { this.direction.l = 0; }
            if (event.key == 'd' || event.key == 'D') { this.direction.r = 0; }
            if (event.key == 'Shift') { this.speed = 0.2 }
        });
        document.addEventListener('keypress', (event: KeyboardEvent) => {
            if (this.root.userData.canInteract) {
                if (event.key == 'e' || event.key == 'E') {
                    this.root.userData.onInteract();
                }
            }
        });
        document.addEventListener('mousemove', (event: MouseEvent) => {

            // character orientation and screen orientation are flipped
            const rotateAmountX = (-1 * event.movementX) * this.sensitivity;
            const rotateAmountY = (-1 * event.movementY) * this.sensitivity;

            const maxAngle = Math.PI / 4 + Math.PI / 6;
            const minAngle = -Math.PI / 6;

            this.body.rotation.y = (this.body.rotation.y + rotateAmountX) % (2 * Math.PI);
            let totalY = this.face.rotation.z + rotateAmountY % (Math.PI);

            if (totalY >= maxAngle) {
                totalY = maxAngle;
            }

            if (totalY <= minAngle) {
                totalY = minAngle;
            }

            this.face.rotation.z = totalY;
        });

        document.addEventListener('click', async () => {
            await this.graphics.renderer.domElement.requestPointerLock();
        })
    }

    async load(): Promise<void> {
    }

    build(): void {
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const bodyGeometry = new THREE.CapsuleGeometry(1, 1.8, 10, 10);
        this.body = new THREE.Mesh(bodyGeometry, bodyMat);
        this.body.rotation.set(0, 0.8, 0);

        this.face = GraphicsPrimitiveFactory.box({
            position: { x: 0.9, y: 1.4, z: 0 },
            scale: { x: 0.2, y: 0.4, z: 0.4 }, 
            rotation: { x: 0, y: 0, z: 0 },
            colour: 0xff0000,
            shadows: false 
        })

        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.5, 2000);
        this.camera.rotation.set(0 , -Math.PI / 2, 0);
        this.camera.layers.enable(0);
        this.camera.layers.set(0);
        this.graphics.mainCamera = this.camera;

        this.face.add(this.camera);
        this.body.add(this.face);
        this.add(this.body);

        this.body.layers.set(1);
        this.face.layers.set(1);

        this.physics.addCharacter(this.root, PhysicsColliderFactory.box(1, 2, 1), {
            jump: true,
            jumpHeight: 8,
            jumpSpeed: 7,
            gravity: 10,
        })
    }

    update(): void {
        const xLocal = this.direction.f - this.direction.b; // Character facing x
        const zLocal = this.direction.r - this.direction.l; // Character facing z

        // const yaw = Math.round(this.body.rotation.y * 180 / Math.PI);
        const yaw = this.body.rotation.y;
        const x = xLocal * Math.cos(2 * Math.PI - yaw) + zLocal * Math.cos(2 * Math.PI - (yaw - Math.PI / 2));
        const z = xLocal * Math.sin(2 * Math.PI - yaw) + zLocal * Math.sin(2 * Math.PI - (yaw - Math.PI / 2));

        this.physics.moveCharacter(this.root, x, 0, z, this.speed);
    }

    destroy(): void {
    }
}
