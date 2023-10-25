import * as THREE from 'three'; 
import { Construct, GraphicsContext, GraphicsPrimitiveFactory, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { drawEndLevelMenu } from '../lib/UI/EndLevelMenu';
import { drawPauseMenu } from '../lib/UI/PauseMenu';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';

//@ts-expect-error
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer';
//@ts-expect-error
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass';
//@ts-expect-error
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass';
//@ts-expect-error
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader';
//@ts-expect-error
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader';
//@ts-expect-error
import { ColorCorrectionShader } from 'three/addons/shaders/ColorCorrectionShader';
//@ts-expect-error
import { FXAAShader } from 'three/addons/shaders/FXAAShader';
//@ts-expect-error
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass';
//@ts-expect-error
import { TAARenderPass } from 'three/addons/postprocessing/TAARenderPass';

const walkSpeed = 0.7;
const sprintSpeed = 1; 

const jumpHeight = 1;
const jumpSpeed = 2.7;
const jumpGravity = 1.1;

// Building the event listeners without using anonymous functions (i.e. as class methods) loses the players instance scope in
// "this". Losing that scope means that the methods are actually using the document scope instead of the player scope
// This variable will just recapture the player scope, and which can then be used by the event listener callbacks
let scope: any;

export class Player extends Construct {
    body!: THREE.Mesh; // Graphics element
    face!: THREE.Mesh;
    camera!: THREE.PerspectiveCamera;
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


    // Options
    options: {
        filters: {
            pixelShader: boolean,
            dotShader: boolean,
            rgbShiftShader: boolean,
        }
        effects: {
            fxaaShader: boolean,
            smaaShader: boolean,
            taaShader: boolean,
            taaSample: number, // from 1 to 5
        },
        video: {
            fov: number,
            farRender: number,
            fog: boolean,
            shadows: boolean,
        }
    };

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, levelConfig: {key: string, name: string, difficulty: string, numPuzzles: number}) {
        super(graphics, physics, interactions, userInterface);
        this.levelConfig = levelConfig;

        this.levelTime = 0;
        this.paused = true; // game starts off paused
        scope = this;

        this.options = {
            filters: {
                pixelShader: false,
                dotShader: false,
                rgbShiftShader: false,
            },
            effects: {
                fxaaShader: true,
                smaaShader: false,
                taaShader: false,
                taaSample: 2,
            },
            video: {
                fov: 60,
                farRender: 1000,
                fog: true,
                shadows: true,
            }
        }
    }

    create(): void {
        this.graphics.root.fog = new THREE.FogExp2(0xcccccc, 0.003);
        this.camera = new THREE.PerspectiveCamera(this.options.video.fov, window.innerWidth / window.innerHeight, 0.5, this.options.video.farRender);
        this.graphics.mainCamera = this.camera;

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

        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
        document.addEventListener('keypress', this.onKeyPress);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('pointerlockchange', this.onPointerLockChange); // This needs to exist because there is no way to capture Escape keyboard input in pointer lock mode
        document.addEventListener("pauseGame", this.onPausedGame)
        document.addEventListener("unpauseGame", this.onUnpausedGame);
        document.addEventListener("endLevel", this.onEndLevel);
    }

    async load(): Promise<void> {
    }

    build(): void {

        // Shaders
        this.applyOptions();

        // Player Geometry
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

        this.camera.rotation.set(0 , -Math.PI / 2, 0);
        this.camera.layers.enable(0);
        this.camera.layers.set(0);

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

        this.paused = false;
        // Once finished building, ask for pointer lock to begin playing
        this.graphics.renderer.domElement.requestPointerLock();
    }

    //@ts-ignore ignoring the time variable
    update(time: number, delta: number): void {
        if (!this.body) { return }

        delta = delta / 1000;
        this.levelTime += delta;

        // Do vector math (trig because idk how to use quaternions / matrices properly) to determine the walking direction of the character
        const xLocal = this.direction.f - this.direction.b; // Character facing x
        const zLocal = this.direction.r - this.direction.l; // Character facing z
        const yaw = this.body.rotation.y;
        const x = xLocal * Math.cos(2 * Math.PI - yaw) + zLocal * Math.cos(2 * Math.PI - (yaw - Math.PI / 2));
        const z = xLocal * Math.sin(2 * Math.PI - yaw) + zLocal * Math.sin(2 * Math.PI - (yaw - Math.PI / 2));
        this.physics.moveCharacter(this.root, x, 0, z, this.speed * delta);

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
        if (this.root.userData.canInteract && this.holdingObject === undefined) {
            this.userInterface.showPrompt(this.interactPrompt);
        } else {
            this.userInterface.hidePrompt(this.interactPrompt);
        }

        if (this.root.userData.canPlace && this.holdingObject !== undefined) {
            this.userInterface.showPrompt(this.placePrompt);
        } else {
            this.userInterface.hidePrompt(this.placePrompt);
        }

    }

    destroy(): void {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
        document.removeEventListener('keypress', this.onKeyPress);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange); // This needs to exist because there is no way to capture Escape keyboard input in pointer lock mode
        document.removeEventListener("pauseGame", this.onPausedGame)
        document.removeEventListener("unpauseGame", this.onUnpausedGame);
        document.removeEventListener("endLevel", this.onEndLevel);
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key == 'w' || event.key == 'W') { scope.direction.f = 1; }
        if (event.key == 's' || event.key == 'S') { scope.direction.b = 1; }
        if (event.key == 'a' || event.key == 'A') { scope.direction.l = 1; }
        if (event.key == 'd' || event.key == 'D') { scope.direction.r = 1; }
        if (event.key == 'Shift') { scope.speed = sprintSpeed }
    } 

    onKeyUp(event: KeyboardEvent) {
        if (event.key == 'w' || event.key == 'W') { scope.direction.f = 0; }
        if (event.key == 's' || event.key == 'S') { scope.direction.b = 0; }
        if (event.key == 'a' || event.key == 'A') { scope.direction.l = 0; }
        if (event.key == 'd' || event.key == 'D') { scope.direction.r = 0; }
        if (event.key == 'Shift') { scope.speed = walkSpeed }
    }

    onKeyPress(event: KeyboardEvent) {
        const worldPos = new THREE.Vector3();
        scope.root.getWorldPosition(worldPos);
        
        if (event.key == ' ') { scope.physics.jumpCharacter(scope.root); }
        if (event.key == 'b' || event.key == 'B'){
            console.log(worldPos);
        }
        if (scope.root.userData.canInteract && scope.holdingObject === undefined && !scope.paused) {
            if (event.key == 'e' || event.key == 'E') {
                scope.root.userData.onInteract();
            }
        }
        if (scope.root.userData.canPlace && scope.holdingObject !== undefined && !scope.paused) {
            if (event.key == 'q' || event.key == 'Q') {
                scope.root.userData.onPlace(scope.holdingObject);
                scope.holdingObject = undefined;
            }
        }
    }

    onMouseMove(event: MouseEvent) {
        if(scope.paused) { return }

        scope.mouse.x = event.movementX;
        scope.mouse.y = event.movementY;
    }

    onPointerLockChange() {
        if (document.pointerLockElement !== scope.graphics.renderer.domElement) {
            const pauseEvent = new Event("pauseGame");
            document.dispatchEvent(pauseEvent);
        }
    }

    onPausedGame() {
        scope.pauseMenu = drawPauseMenu(scope.userInterface, scope, scope.levelConfig.name, scope.levelConfig.key, scope.levelConfig.difficulty, scope.levelConfig.numPuzzles, scope.levelTime);
        scope.paused = true;
        scope.userInterface.showMenu(scope.pauseMenu);
        document.exitPointerLock();
    }

    onUnpausedGame() {
            scope.paused = false;
            scope.userInterface.hideMenu(scope.pauseMenu);
            scope.userInterface.removeElement(scope.pauseMenu);
            scope.graphics.renderer.domElement.requestPointerLock();
    }

    onEndLevel() {
        document.exitPointerLock();
        scope.endLevelMenu = drawEndLevelMenu(scope.userInterface, scope.levelConfig.name, scope.levelConfig.levelId, scope.levelConfig.key, scope.levelConfig.difficulty, scope.levelConfig.numPuzzles, scope.levelTime);
        scope.userInterface.showMenu(scope.endLevelMenu);

        // Performance doesnt matter here because the game is over
        setTimeout(() => scope.userInterface.hideMenu(scope.pauseMenu), 100); // eww very eww -> but has to happen because of the pointer lock weirdness where a pause is triggered when releasing the pointer
        setTimeout(() => scope.userInterface.hideMenu(scope.pauseMenu), 200); // even more eww -> race conditions so being safe
        setTimeout(() => scope.userInterface.hideMenu(scope.pauseMenu), 300); // even more eww -> race conditions so being safe
    }

    applyOptions() {
        this.graphics.resetPasses();

        if (this.options.effects.fxaaShader) {

            const fxaaPass = new ShaderPass( FXAAShader );
            const colourCorrectionPass = new ShaderPass( ColorCorrectionShader );

            const newComposer = new EffectComposer( this.graphics.renderer );
            newComposer.addPass( this.graphics.renderPass );
            newComposer.addPass( colourCorrectionPass );
            this.graphics.addComposer( newComposer );

            this.graphics.addPass( colourCorrectionPass );
            this.graphics.addPass( fxaaPass );

        }

        if (this.options.effects.smaaShader) {
            const smaaPass = new SMAAPass( 
                window.innerWidth * this.graphics.renderer.getPixelRatio(),
                window.innerHeight * this.graphics.renderer.getPixelRatio()
            );
            this.graphics.addPass( smaaPass );
        }
        
        if (this.options.effects.taaShader) {
            const taaPass = new TAARenderPass( this.graphics.root, this.graphics.mainCamera );
            taaPass.unbiased = false;
            taaPass.sampleLevel = this.options.effects.taaSample;

            this.graphics.addPass( taaPass );
        }

        if (this.options.video.fog) {
            //@ts-expect-error I know what type (FogExp2) this is but I don't have the time to sort
            // out typescript nonsense
            this.graphics.root.fog.density = 0.003
        } else {
            //@ts-expect-error
            this.graphics.root.fog.density = 0;
        }

        this.graphics.renderer.shadowMap.enabled = this.options.video.shadows;

        if (this.options.filters.pixelShader) {
            this.graphics.addPass( new RenderPixelatedPass(4, this.graphics.root, this.graphics.mainCamera ) );
        }

        if (this.options.filters.dotShader) {
            const dotPass = new ShaderPass( DotScreenShader );
            dotPass.uniforms['scale'].value = 4;

            this.graphics.addPass(dotPass);
        }

        if (this.options.filters.rgbShiftShader) {
            const shiftPass = new ShaderPass( RGBShiftShader );
            shiftPass.uniforms['amount'].value = 0.0015;

            this.graphics.addPass(shiftPass);
        }

        this.camera.fov = this.options.video.fov;
        this.camera.far = this.options.video.farRender;
        this.camera.updateProjectionMatrix();

        this.graphics.compose();
    }

}
