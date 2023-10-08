import * as THREE from 'three';
import { Scene } from '../lib';
import { CrystalDoor } from '../constructs/CrystalDoor';
//@ts-expect-error
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { Crystal } from '../constructs/Crystal';

export class MainMenu extends Scene {

    root!: HTMLDivElement;
    camera!: THREE.PerspectiveCamera;

    numCrystals: number;
    door: CrystalDoor;
    crystals: Array<Crystal>;

    constructor(AmmoLib: any) {
        super(
            'MainMenu',
            AmmoLib
        );

        this.numCrystals = Math.floor(Math.random() * 16);

        if (this.numCrystals < 3) {
            this.numCrystals = 3;
        }

        this.door = new CrystalDoor(this.graphics, this.physics, this.interactions, this.numCrystals);
        this.addConstruct(this.door);

        this.crystals = [];
        for (let i = 0; i < this.numCrystals; ++i) {
            this.crystals.push(
                new Crystal(this.graphics, this.physics, this.interactions)
            );
            this.addConstruct(this.crystals[i]);
        }
    }

    create(): void {
    }

    async load(): Promise<void> {
    }

    build(): void {
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
        this.graphics.mainCamera = this.camera;
        this.graphics.mainCamera.position.set(5, 7, 5);
        this.graphics.mainCamera.lookAt(0, 0, 0);

        const floorMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const floorGeom = new THREE.BoxGeometry(30, 1, 30);
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.castShadow = true;
        floor.receiveShadow = true;

        const light = new THREE.PointLight(0xffffff, 0.4, 5, 0);
        light.position.set(0, 20, 0);

        this.graphics.add(light);
        this.graphics.add(floor);

        this.door.root.position.set(0, 0, -29);

        const angleBetween = 2 * Math.PI / this.numCrystals;
        const distanceFromCenter = 5;
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

        this.root = document.createElement('div');
        this.root.className = 'flex justify-start items-center w-screen h-screen fixed top-0 left-0 z-10 p-20';
        document.body.appendChild(this.root);

        const parent = document.createElement('div');
        parent.className = 'flex flex-col gap-5 justify-center items-center bg-zinc-100 p-10 rounded-lg'
        this.root.appendChild(parent);

        const title = document.createElement('h1');
        title.className = 'text-4xl';
        title.innerText = 'CGV Project';
        parent.appendChild(title);

        const group = document.createElement('h2');
        group.className = 'text-xl';
        group.innerText = 'The Spice Girls';
        parent.appendChild(group);

        const buttonClasses = 'p-2 bg-zinc-200 rounded-md w-64';

        for (let i = 0; i < 3; ++i) {
            const levelButton = document.createElement('button');
            levelButton.className = buttonClasses;
            levelButton.innerText = `Level ${i + 1}`;
            levelButton.onclick =  () => {
                this.changeScene(`level-${i + 1}`);
            };
            parent.appendChild(levelButton);
        }

        const sandbox = document.createElement('button');
        sandbox.className = buttonClasses;
        sandbox.innerText = 'Play Sandbox';
        sandbox.onclick =  () => {
            this.changeScene('sandbox');
        };

        parent.appendChild(sandbox);

        const credits = document.createElement('button');
        credits.className = buttonClasses;
        credits.innerText = 'Credits';
        credits.onclick =  () => {
        };
        parent.appendChild(credits);

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
        document.body.removeChild(this.root);
    }

}