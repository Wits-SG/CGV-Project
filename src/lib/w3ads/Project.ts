import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js'
//@ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Scene } from "./Scene";
import { TimeS, TimeMS } from './types/misc.type';

type ProjectConfig = {
    physicsEngine: any,
    shadows: boolean,
    stats: boolean,
}

export class Project {
    clock: THREE.Clock;
    renderer: THREE.WebGLRenderer;
    stats: Stats | null;
    animFrameID: any;

    config: ProjectConfig;
    scenes: Map<string, typeof Scene>;
    fallbackScene!: string;
    currentScene!: Scene;

    constructor(scenes: Map<string, typeof Scene>, fallbackScene: string, config: ProjectConfig) {
        this.config = config;
        this.scenes = scenes;
        this.fallbackScene = fallbackScene;

        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor( 0xbfd1e5 );
        this.renderer.shadowMap.enabled = config.shadows;

        this.stats = null;
        if (config.stats) {
            this.stats = new Stats();
            //@ts-expect-error .style is not really read only and this works
            this.stats.dom.style = 'position:absolute;top:0px;right:0px;';
            document.body.appendChild( this.stats.dom );
        }

        document.body.appendChild(this.renderer.domElement);

        document.addEventListener('changeScene', async (event: any) => {
            this.changeScene(event.detail !== undefined ? event.detail: '').catch((e: any) => {
                console.error(`Failed to change scene - ${e}`);
                this.changeScene(this.fallbackScene)
            });
        });

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement == this.renderer.domElement) {
                this.play();
            } else {
                this.pause();
            }
        })

        window.onresize = () => {
            // I've added the ts warnings because I can't be bothered to make this
            // handle a generic resize case. mainCamera is a Camera type but the
            // props needed to readjust sizing exist on PerspectiveCamera

            //@ts-expect-error
            this.currentScene.graphics.mainCamera.aspect = window.innerWidth / window.innerHeight;
            //@ts-expect-error
            this.currentScene.graphics.mainCamera.updateProjectionMatrix();
            this.currentScene.graphics.renderer.setSize( window.innerWidth, window.innerHeight );
        }

        const [firstScene] = scenes.keys(); 
        this.changeScene(firstScene !== undefined ? firstScene : '').catch((e: any) => {
            console.error(`Failed to load first scene - ${e}`);
            this.changeScene(this.fallbackScene);
        })


    }

    pause() {
        cancelAnimationFrame(this.animFrameID);
    }

    play() {
        if (!this.currentScene.graphics.mainCamera || !this.currentScene.graphics.root) { return; }
        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        const deltaTime = this.clock.getDelta() * 1000 as TimeMS;
        const netTime = this.clock.getElapsedTime() as TimeS;

        if (this.currentScene != null) {
            this.currentScene._update(netTime, deltaTime);
            this.renderer.render(this.currentScene.graphics.root, this.currentScene.graphics.mainCamera);
        }

        if ( this.stats != null ) {
            this.stats.update();
        }

        this.animFrameID = requestAnimationFrame(this.update.bind(this));
    }

    async changeScene(sceneKey: string) {
        cancelAnimationFrame(this.animFrameID);
        try { this.currentScene._destroy(); } catch (e: any) { console.error(`Failed to destroy scene ${this.currentScene != undefined || this.currentScene != null ? this.currentScene.sceneKey : 'NO SCENE'} - ${e}`); }

        if (sceneKey != '') {
            const sceneClass = this.scenes.get(sceneKey);
            // This should work because it'll always be populated by sub elements
            //@ts-expect-error
            this.currentScene = new sceneClass(this.config.physicsEngine);
            this.currentScene.setRenderer(this.renderer);
            this.currentScene._create();
            await this.currentScene._load();
            this.currentScene._build();
            this.play();
        }
    }

}
