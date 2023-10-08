import * as THREE from 'three';
import { Scene } from '../lib';
import { CrystalDoor } from '../constructs/CrystalDoor';
//@ts-expect-error
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { Crystal } from '../constructs/Crystal';

export class MainMenu extends Scene {

    camera!: THREE.PerspectiveCamera;

    container!: HTMLDivElement;
    root!: HTMLDivElement;
    menu!: HTMLDivElement;
    credits!: HTMLDivElement;

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

        this.container = document.createElement('div');
        this.container.className = 'flex justify-start items-center w-screen h-screen fixed top-0 left-0 z-10 p-10';
        document.body.appendChild(this.container);

        this.root = document.createElement('div');
        this.root.className = 'flex justify-start items-start gap-5';
        this.container.appendChild(this.root);

        this.menu = document.createElement('div');
        this.menu.className = 'flex flex-col gap-5 justify-center items-center bg-stone-300 p-10 rounded-lg border-stone-950 border-2'
        this.root.appendChild(this.menu);

        this.credits = document.createElement('div');
        this.credits.className = 'flex flex-col gap-5 justify-center items-center bg-stone-300 p-10 rounded-lg border-stone-950 border-2 p-5'

        this.drawMenu();
        this.drawCredits();

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
        document.body.removeChild(this.container);
    }

    drawMenu() {
        const title = document.createElement('h1');
        title.className = 'text-4xl';
        title.innerText = 'The Magic Library';
        this.menu.appendChild(title);

        const group = document.createElement('h2');
        group.className = 'text-xl';
        group.innerText = 'The Spice Girls';
        this.menu.appendChild(group);

        const buttonClasses = 'p-2 bg-stone-100 hover:bg-stone-200 rounded-md w-64';

        for (let i = 0; i < 3; ++i) {
            const levelButton = document.createElement('button');
            levelButton.className = buttonClasses;
            levelButton.innerText = `Level ${i + 1}`;
            levelButton.onclick =  () => {
                this.changeScene(`level-${i + 1}`);
            };
            this.menu.appendChild(levelButton);
        }

        const sandbox = document.createElement('button');
        sandbox.className = buttonClasses;
        sandbox.innerText = 'Play Sandbox';
        sandbox.onclick =  () => {
            this.changeScene('sandbox');
        };

        this.menu.appendChild(sandbox);

        const showCredits = document.createElement('button');
        showCredits.className = buttonClasses;
        showCredits.innerText = 'Credits';
        showCredits.onclick =  () => {
            this.root.appendChild(this.credits);
        };
        this.menu.appendChild(showCredits);
    }

    drawCredits() {
        const title = document.createElement('h1');
        title.innerText = 'Credits';
        title.className = 'text-4xl';
        this.credits.appendChild(title);

        const content = document.createElement('div');
        content.className = 'flex justify-center items-start gap-5'
        this.credits.appendChild(content);

        // Developer Credits
            const developers = document.createElement('section');
            developers.className = 'w-[10vw]'
            content.appendChild(developers);

            const devTitle = document.createElement('h2');
            devTitle.innerText = 'Developers';
            devTitle.className = 'text-xl border-b-2 border-stone-950 flex justify-center items-center'
            developers.appendChild(devTitle);

            const devNames = [
                'Lisa Godwin', 'Brendan Griffiths', 'Nihal Ranchod', 'Zach Schwark', 'Ashlea Smith'
            ];
            const devList = document.createElement('ul');
            devList.className = 'p-3 flex flex-col justify-center items-start gap-1'
            developers.appendChild(devList);
            for (let dev of devNames) {
                const devP = document.createElement('li');
                devP.innerText = dev;
                devP.className = 'text-md'
                devList.appendChild(devP);
            }

        // Asset Credits
            const assets = document.createElement('section');
            assets.className = 'w-[25vw]'
            content.appendChild(assets);

            const assetTitle = document.createElement('h2');
            assetTitle.innerText = 'Assets';
            assetTitle.className = 'text-xl border-b-2 border-stone-950 flex justify-center items-center'
            assets.appendChild(assetTitle);

            const allAssets = [
                { artist: 'Okapiguy', title: 'Victorian Bookshelf', type: 'Model', license: 'CC-BY-NC-4.0', link: 'https://sketchfab.com/3d-models/victorian-bookshelf-9f548046646f404782b8838ec14932f8' },
                { artist: 'FlukierJupiter', title: 'Wooden Table', type: 'Model', license: 'CC-BY-4.0' },
            ];
            const assetsList = document.createElement('ul');
            assetsList.className = 'p-3 flex flex-col justify-center items-start gap-1'
            assets.appendChild(assetsList);
            for (let asset of allAssets) {
                const assetP = document.createElement('li');
                assetP.innerHTML = `<a href='${asset.link}' class='text-sky-700 underline' >${asset.title}<a> - ${asset.artist} - ${asset.type} - ${asset.license}`;
                assetsList.appendChild(assetP);
            }
    }
}