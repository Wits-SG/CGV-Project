import * as THREE from 'three';
import { Scene } from '../lib';
import { CrystalDoor } from '../constructs/CrystalDoor';
//@ts-expect-error
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { Crystal } from '../constructs/Crystal';

export class LoadingScreen extends Scene {

    camera!: THREE.PerspectiveCamera;
    loading!: number;
    numCrystals: number;
    door: CrystalDoor;
    crystals: Array<Crystal>;



    constructor(AmmoLib: any) {
        super(
            'Loading',
            AmmoLib
        );

        this.numCrystals = Math.floor(Math.random() * 16);

        if (this.numCrystals < 3) {
            this.numCrystals = 3;
        }

        this.door = new CrystalDoor(this.graphics, this.physics, this.interactions, this.userInterface, this.numCrystals);
        this.addConstruct(this.door);

        this.crystals = [];
        for (let i = 0; i < this.numCrystals; ++i) {
            this.crystals.push(
                new Crystal(this.graphics, this.physics, this.interactions, this.userInterface)
            );
            this.addConstruct(this.crystals[i]);
        }
    }

    create(): void {

        this.loading = this.userInterface.addPrompt(`<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_P7sC{transform-origin:center;animation:spinner_svv2 .75s infinite linear}@keyframes spinner_svv2{100%{transform:rotate(360deg)}}</style><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" class="spinner_P7sC"/></svg>`)

    }

    async load(): Promise<void> {}

    build(): void {
        this.userInterface.showPrompt(this.loading);
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
        this.graphics.mainCamera = this.camera;
        this.graphics.mainCamera.position.set(5, 7, 5);
        this.graphics.mainCamera.lookAt(0, 0, 0);

        const floorMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const floorGeom = new THREE.BoxGeometry(30, 1, 30);
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.castShadow = true;
        floor.receiveShadow = true;

        const light = new THREE.PointLight(0xffffff, 0.8, 40, 0);
        light.position.set(0, 20, 0);

        this.graphics.add(light);
        this.graphics.add(floor);

        this.door.root.position.set(0, 0, -29);

        const angleBetween = 2 * Math.PI / this.numCrystals;
        const distanceFromCenter = 7;
        for (let i = 0; i < this.numCrystals; ++i) {
            const x = distanceFromCenter * Math.sin(i * angleBetween);
            const z = distanceFromCenter * Math.cos(i * angleBetween);

            this.door.crystalPlinths[i].position.set(
                x,
                2,
                z
            );
            this.crystals[i].root.position.set(x, 4, z);
        }

    }


    //@ts-ignore
    update(time: number, delta: number): void {
        this.camera.position.x = 9 * Math.sin(time / 5)
        this.camera.position.z = 9 * Math.cos(time / 5);
        this.camera.lookAt(0, 0, 0);

        for (let i = 0; i < this.numCrystals; ++i) {
            this.crystals[i].root.rotateX(0.05 * delta * Math.PI / 180);
            this.crystals[i].root.rotateY(0.05 * delta * Math.PI / 180);
            this.crystals[i].root.rotateZ(0.05 * delta * Math.PI / 180);
        }
    }

    destroy(): void {
    }

}