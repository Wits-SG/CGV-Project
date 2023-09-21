import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class GraphicsContext {
    public renderer!: THREE.WebGLRenderer;
    public root: THREE.Scene;
    public mainCamera!: THREE.Camera;
    public modelLoader: GLTFLoader;

    constructor() {
        this.root = new THREE.Scene();
        this.modelLoader = new GLTFLoader();
        // TODO move this to a build method called automagically by the Scene Class
    }

    add(newObj: THREE.Object3D) {
        this.root.add(newObj);
    }

    async loadModel(url: string) {

        return new Promise((resolve, reject) => {
            this.modelLoader.load(url, data => resolve(data), undefined, reject);
        });

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
