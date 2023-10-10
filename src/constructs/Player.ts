import * as THREE from 'three'; 
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { drawPauseMenu, drawEndLevelMenu } from '../lib/UiComponents';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';

const walkSpeed = 0.05;
const sprintSpeed = 0.1;

const jumpHeight = 10;
const jumpSpeed = 5;
const jumpGravity = 10;

export class Player extends Construct {
    body!: THREE.Mesh; // Graphics element
    face!: THREE.Mesh;
    camera!: THREE.Camera;
    holdingObject: THREE.Mesh | undefined = undefined;

    direction!: { f: number, b: number, l: number, r: number }
    speed: number = walkSpeed;
    mouse: { x: number, y: number } = { x: 0, y: 0 };
    sensitivity: number = 0.2 * Math.PI / 180; // Angle change per unit = 1 degree

    paused: boolean = false; // THis is a very hacky way of implementing pause so it should be changed

    pauseMenu!: number;
    endLevelMenu!: number;
    interactPrompt!: number;
    placePrompt!: number;

    levelConfig: {
        key: string,
        name: string,
        difficulty: string,
        numPuzzles: number,
    };

    levelTime: number; // the number of seconds spent in a level - effectively this is our scoring technique

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, levelConfig: {key: string, name: string, difficulty: string, numPuzzles: number}) {
        super(graphics, physics, interactions, userInterface);
        this.levelConfig = levelConfig;

        this.levelTime = 0;
    }

    create(): void {
        this.paused = false;
        this.graphics.renderer.domElement.requestPointerLock();
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

        this.interactPrompt = this.userInterface.addPrompt('Press E to interact');
        this.placePrompt = this.userInterface.addPrompt('Press Q to place');

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key == 'w' || event.key == 'W') { this.direction.f = 1; }
            if (event.key == 's' || event.key == 'S') { this.direction.b = 1; }
            if (event.key == 'a' || event.key == 'A') { this.direction.l = 1; }
            if (event.key == 'd' || event.key == 'D') { this.direction.r = 1; }
            if (event.key == 'Shift') { this.speed = sprintSpeed }
        });
        document.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key == 'w' || event.key == 'W') { this.direction.f = 0; }
            if (event.key == 's' || event.key == 'S') { this.direction.b = 0; }
            if (event.key == 'a' || event.key == 'A') { this.direction.l = 0; }
            if (event.key == 'd' || event.key == 'D') { this.direction.r = 0; }
            if (event.key == 'Shift') { this.speed = walkSpeed }
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
            if(this.paused) { return }

            this.mouse.x = event.movementX;
            this.mouse.y = event.movementY;
        });

        // This needs to exist because there is no way to capture Escape keyboard input in pointer lock mode
        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement !== this.graphics.renderer.domElement) {
                const pauseEvent = new Event("pauseGame");
                document.dispatchEvent(pauseEvent);
            }
        });

        document.addEventListener("pauseGame", () => {
            this.pauseMenu = drawPauseMenu(this.userInterface, this.levelConfig.name, this.levelConfig.key, this.levelConfig.difficulty, this.levelConfig.numPuzzles, this.levelTime);
            this.paused = true;
            this.userInterface.showMenu(this.pauseMenu);
            document.exitPointerLock();
        })

        document.addEventListener("unpauseGame", () => {
            this.paused = false;
            this.userInterface.hideMenu(this.pauseMenu);
            this.userInterface.removeElement(this.pauseMenu);
            this.graphics.renderer.domElement.requestPointerLock();
        });

        document.addEventListener("endLevel", () => {
            document.exitPointerLock();
            this.endLevelMenu = drawEndLevelMenu(this.userInterface, this.levelConfig.name, this.levelConfig.key, this.levelConfig.difficulty, this.levelConfig.numPuzzles, this.levelTime);
            this.userInterface.showMenu(this.endLevelMenu);

            // Performance doesnt matter here because the game is over
            setTimeout(() => this.userInterface.hideMenu(this.pauseMenu), 100); // eww very eww -> but has to happen because of the pointer lock weirdness where a pause is triggered when releasing the pointer
            setTimeout(() => this.userInterface.hideMenu(this.pauseMenu), 200); // even more eww -> race conditions so being safe
            setTimeout(() => this.userInterface.hideMenu(this.pauseMenu), 300); // even more eww -> race conditions so being safe
        });
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
            jumpHeight: jumpHeight,
            jumpSpeed: jumpSpeed,
            gravity: jumpGravity,
        })

        // Once finished building, ask for pointer lock to begin playing
        this.graphics.renderer.domElement.requestPointerLock();
    }

    //@ts-ignore ignoring the time variable
    update(time: number, delta: number): void {
        if (!this.body) { return }

        this.levelTime += delta / 1000; // convert to seconds first

        // Do vector math (trig because idk how to use quaternions / matrices properly) to determine the walking direction of the character
        const xLocal = this.direction.f - this.direction.b; // Character facing x
        const zLocal = this.direction.r - this.direction.l; // Character facing z
        const yaw = this.body.rotation.y;
        const x = xLocal * Math.cos(2 * Math.PI - yaw) + zLocal * Math.cos(2 * Math.PI - (yaw - Math.PI / 2));
        const z = xLocal * Math.sin(2 * Math.PI - yaw) + zLocal * Math.sin(2 * Math.PI - (yaw - Math.PI / 2));
        this.physics.moveCharacter(this.root, x, 0, z, this.speed);

        // character orientation and screen orientation are flipped
        const rotateAmountX = (-1 * this.mouse.x) * this.sensitivity;
        const rotateAmountY = (-1 * this.mouse.y) * this.sensitivity;
        const maxAngle = Math.PI / 4 + Math.PI / 6;
        const minAngle = -Math.PI / 4 - Math.PI / 6;
        this.body.rotation.y = (this.body.rotation.y + rotateAmountX) % (2 * Math.PI);
        let totalY = this.face.rotation.z + rotateAmountY % (Math.PI);
        if (totalY >= maxAngle) { totalY = maxAngle; }
        if (totalY <= minAngle) { totalY = minAngle; }
        this.face.rotation.z = totalY;

        this.mouse = { x: 0, y: 0 }; // reset mouse input

        // The insertion and removal of these DOM nodes is causing performance hickups 
        // when nearby to interactable elements - possibly consider switching to signals
        // if (this.root.userData.canInteract && this.holdingObject === undefined) {
        //     this.userInterface.showPrompt(this.interactPrompt);
        // } else {
        //     this.userInterface.hidePrompt(this.interactPrompt);
        // }

        // if (this.root.userData.canPlace && this.holdingObject !== undefined) {
        //     this.userInterface.showPrompt(this.placePrompt);
        // } else {
        //     this.userInterface.hidePrompt(this.placePrompt);
        // }
    }

    destroy(): void {
    }
}
