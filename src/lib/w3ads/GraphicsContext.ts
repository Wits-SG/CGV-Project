import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

//@ts-expect-error
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer';
//@ts-expect-error
import { OutputPass } from 'three/addons/postprocessing/OutputPass';
//@ts-expect-error
import { RenderPass } from 'three/addons/postprocessing/RenderPass';
//@ts-expect-error
import { Pass } from 'three/addons/postprocessing/Pass';

export class GraphicsContext {
    public renderer!: THREE.WebGLRenderer;
    public root: THREE.Scene;
    public mainCamera!: THREE.Camera;

    private modelLoader: GLTFLoader;
    private textureLoader: THREE.TextureLoader;
    private fontLoader: FontLoader;

    private passes: Array<Pass>;
    public renderPass: RenderPass;
    public composers: Array<EffectComposer>;
    public finalComposer: EffectComposer;

    constructor() {
        this.root = new THREE.Scene();
        this.modelLoader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.fontLoader = new FontLoader();

        this.composers = [];
        this.passes = [];
    }

    // This is a very confusing thing. Basically I want to only create this variable AFTER the player / scene has created a camera 
    // in its create() lifecyle hook, so it needs a function that gets called after create() but before build()
    constructRender() {
        this.renderPass = new RenderPass( this.root, this.mainCamera );
    }

    compose() {
        this.finalComposer = new EffectComposer( this.renderer );
        this.finalComposer.addPass( this.renderPass );

        for (let pass of this.passes) {
            this.finalComposer.addPass( pass );
        }

        const ouputPass = new OutputPass();
        this.finalComposer.addPass( ouputPass );
    }

    add(newObj: THREE.Object3D) {
        this.root.add(newObj);
    }

    addComposer( newComposer: EffectComposer ) {
        this.composers.push( newComposer );
    }

    addPass( newPass: Pass ) {
        this.passes.push( newPass );
    }

    removePass( pass: Pass ) {
        this.passes = this.passes.filter((p) => p != pass );
    }

    resetPasses() {
        this.passes = [];
    }

    async loadModel(url: string) {

        return new Promise((resolve, reject) => {
            this.modelLoader.load(url, data => resolve(data), undefined, reject);
        });

    }

    async loadTexture(url: string) {

        return new Promise((resolve, reject) => {
            this.textureLoader.load(url, data => resolve(data), undefined, reject);
        });

    }

    async loadFont(url: string) {
        return new Promise((resolve, reject) => {
            this.fontLoader.load(url, (data: any) => resolve(data), undefined, reject);
        })
    }
}

export class GraphicsPrimitiveFactory {

    static box(info: { 
        position: { x: number, y: number, z: number }, 
        rotation: { x: number, y: number, z: number },
        scale: { x: number, y: number, z: number },
        colour: number,
        shadows: boolean
    }) {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshLambertMaterial({ color: info.colour })
        );
        box.position.set(info.position.x, info.position.y, info.position.z);
        box.rotation.set(info.rotation.x, info.rotation.y, info.rotation.z);
        box.scale.set(info.scale.x, info.scale.y, info.scale.z);

        box.castShadow = info.shadows;
        box.receiveShadow = info.shadows;

        return box
    }

    static sphere(info: { 
        position: { x: number, y: number, z: number }, 
        rotation: { x: number, y: number, z: number },
        radius: number
        colour: number,
        shadows: boolean
    }) {
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(),
            new THREE.MeshLambertMaterial({ color: info.colour })
        );
        sphere.position.set(info.position.x, info.position.y, info.position.z);
        sphere.rotation.set(info.rotation.x, info.rotation.y, info.rotation.z);
        sphere.scale.set(info.radius, info.radius, info.radius);

        sphere.castShadow = info.shadows;
        sphere.receiveShadow = info.shadows;

        return sphere;
    }
}

export class GraphicsLightFactory {
    // Eventually
}
