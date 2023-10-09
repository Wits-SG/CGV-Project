import * as THREE from 'three'; 
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { buildPauseMenu } from '../lib/PauseMenu';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';

export class Player extends Construct {
    body!: THREE.Mesh; // Graphics element
    face!: THREE.Mesh;
    camera!: THREE.Camera;
    holdingObject: THREE.Mesh | undefined = undefined;

    direction!: { f: number, b: number, l: number, r: number }
    speed: number = 0.05;

    sensitivity: number = 0.2 * Math.PI / 180; // Angle change per unit = 1 degree

    paused: boolean = false; // THis is a very hacky way of implementing pause so it should be changed
    pauseMenu!: HTMLDivElement;

    levelKey: string;

    interactPrompt!: HTMLParagraphElement;
    placePrompt!: HTMLParagraphElement;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, levelKey: string) {
        super(graphics, physics, interactions, userInterface);
        this.levelKey = levelKey;
    }

    create(): void {
        this.paused = false;
        this.graphics.renderer.domElement.requestPointerLock();
        this.pauseMenu = buildPauseMenu(this.graphics, this.userInterface, this.levelKey);
        this.direction = { f: 0, b: 0, l: 0, r: 0 };
        this.root.userData.canInteract = false;
        this.interactions.addInteracting(this.root, (object: THREE.Mesh) => {
            const inHandScale = object.userData.inHandScale;
            object.removeFromParent();
            object.position.set(2, -1.5, 2);
            object.scale.setScalar(inHandScale);
            this.holdingObject = object;
            this.face.add(object);
        });

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (this.paused) { return }

            if (event.key == 'w' || event.key == 'W') { this.direction.f = 1; }
            if (event.key == 's' || event.key == 'S') { this.direction.b = 1; }
            if (event.key == 'a' || event.key == 'A') { this.direction.l = 1; }
            if (event.key == 'd' || event.key == 'D') { this.direction.r = 1; }
            if (event.key == 'Shift') { this.speed = 0.1 }
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if (this.paused) { return }

            if (event.key == 'w' || event.key == 'W') { this.direction.f = 0; }
            if (event.key == 's' || event.key == 'S') { this.direction.b = 0; }
            if (event.key == 'a' || event.key == 'A') { this.direction.l = 0; }
            if (event.key == 'd' || event.key == 'D') { this.direction.r = 0; }
            if (event.key == 'Shift') { this.speed = 0.05 }
        });
        document.addEventListener('keypress', (event: KeyboardEvent) => {
            
            const worldPos = new THREE.Vector3();
            this.root.getWorldPosition(worldPos);
            
            if (event.key == ' ') { this.physics.jumpCharacter(this.root); }
            if (event.key == 'b' || event.key == 'B'){
                console.log(worldPos);
            }
            if (this.root.userData.canInteract && this.holdingObject === undefined && !this.paused) {
                if (event.key == 'e' || event.key == 'E') {
                    this.root.userData.onInteract();
                }
            }
            if (this.root.userData.canPlace && this.holdingObject !== undefined && !this.paused) {
                if (event.key == 'q' || event.key == 'Q') {
                    this.root.userData.onPlace(this.holdingObject);
                    this.holdingObject = undefined;
                }
            }
        });

        document.addEventListener('mousemove', (event: MouseEvent) => {
            if (this.paused) { return }

            // character orientation and screen orientation are flipped
            const rotateAmountX = (-1 * event.movementX) * this.sensitivity;
            const rotateAmountY = (-1 * event.movementY) * this.sensitivity;

            const maxAngle = Math.PI / 4 + Math.PI / 6;
            const minAngle = -Math.PI / 4 - Math.PI / 6;

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

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement == this.graphics.renderer.domElement) {
                this.paused = false;
                this.userInterface.removeElement(this.pauseMenu);
            } else {
                this.paused = true;
                this.userInterface.addElement(this.pauseMenu, undefined); //undefined means no time limit on ui element
            }
        });

        this.interactPrompt = document.createElement('p');
        this.interactPrompt.innerHTML = 'Press E to interact';
        this.interactPrompt.className = 'text-4xl p-2 absolute left-[40%] bottom-[10%] bg-stone-100 text-stone-950 rounded-md flex justify-center items-center w-1/10 border-stone-950 border-2';

        this.placePrompt = document.createElement('p');
        this.placePrompt.innerHTML = 'Press Q to place object';
        this.placePrompt.className = 'text-4xl p-2 absolute left-[40%] bottom-[20%] bg-stone-100 text-stone-950 rounded-md flex justify-center items-center w-1/10 border-stone-950 border-2';
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

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.5, 2000);
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

        if (this.root.userData.canInteract && this.holdingObject === undefined) {
            this.userInterface.addElement(this.interactPrompt, undefined);
        } else {
            this.userInterface.removeElement(this.interactPrompt);
        }

        if (this.root.userData.canPlace && this.holdingObject !== undefined) {
            this.userInterface.addElement(this.placePrompt, undefined);
        } else {
            this.userInterface.removeElement(this.placePrompt);
        }
    }

    destroy(): void {
    }
}
