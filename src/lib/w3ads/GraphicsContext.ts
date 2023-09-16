import * as THREE from 'three';

export class GraphicsContext {
    public root: THREE.Scene;
    public mainCamera: THREE.Camera;

    constructor(camera: THREE.Camera) {
        this.root = new THREE.Scene();
        this.mainCamera = camera;
    }

    add(newObj: THREE.Object3D) {
        this.root.add(newObj);
    }

    addBox(info: { 
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
        return box;
    }

    addSphere(info: { 
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