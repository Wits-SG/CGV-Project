import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Scene } from "./Scene";
import { TimeS, TimeMS } from './types/misc.type';

type ProjectConfig = {
    physicsEngine: any,
    shadows: boolean,
}

export class Project {
    clock: THREE.Clock;
    renderer: THREE.WebGLRenderer;
    animFrameID: any;

    config: ProjectConfig;
    scenes: Array<Scene>;
    currentScene!: Scene;

    constructor(scenes: Array<Scene>, config: ProjectConfig) {
        this.config = config;
        this.scenes = scenes;

        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor( 0xbfd1e5 );
        this.renderer.shadowMap.enabled = config.shadows;
        document.body.appendChild(this.renderer.domElement);

        for(let scene of this.scenes) {
            scene.setRenderer(this.renderer);
        }

        this.renderer.domElement.addEventListener('click', async () => {

            // await this.renderer.domElement.requestPointerLock();
            this.play();
        });

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement == this.renderer.domElement) {
                this.play();
            } else {
                this.pause();
            }
        })

        this.changeScene(scenes.length > 0 ? scenes[0].sceneKey : '').catch((e: any) => {
            console.error(`Failed to load first scene - ${e}`);
        })
            this.play();
    }

    pause() {
        cancelAnimationFrame(this.animFrameID);
    }

    play() {
        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        const deltaTime = this.clock.getDelta() * 1000 as TimeMS;
        const netTime = this.clock.getElapsedTime() as TimeS;

        if (this.currentScene != null) {
            this.currentScene._update(netTime, deltaTime);
            this.renderer.render(this.currentScene.graphics.root, this.currentScene.graphics.mainCamera);
        }

        this.animFrameID = requestAnimationFrame(this.update.bind(this));
    }

    async changeScene(sceneKey: string) {
        cancelAnimationFrame(this.animFrameID);
        try { this.currentScene._destroy(); } catch (e: any) { console.error(`Failed to destroy scene ${this.currentScene != undefined || this.currentScene != null ? this.currentScene.sceneKey : 'NO SCENE'} - ${e}`); }
        
        if (sceneKey != '') {
            for (let scene of this.scenes) {
                if (sceneKey === scene.sceneKey) {
                    this.currentScene = scene;
                    this.currentScene._create();
                    this.currentScene._load();
                    this.currentScene._build();
                    return;
                }
            }
        }
    }

}
