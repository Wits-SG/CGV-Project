import * as THREE from 'three';
import { Scene } from '../lib';
import { CrystalDoor } from '../constructs/CrystalDoor';
//@ts-expect-error
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { Crystal } from '../constructs/Crystal';
import { drawMainMenu } from '../lib/UI/MainMenu';

export class MainMenu extends Scene {

    camera!: THREE.PerspectiveCamera;

    container!: HTMLDivElement;
    root!: HTMLDivElement;
    menu!: HTMLDivElement;
    credits!: HTMLDivElement;
    levelMenus!: Array<HTMLDivElement>;

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

        this.door = new CrystalDoor(this.graphics, this.physics, this.interactions, this.userInterface, this.numCrystals);
        this.addConstruct(this.door);

        this.crystals = [];
        for (let i = 0; i < this.numCrystals; ++i) {
            this.crystals.push(
                new Crystal(this.graphics, this.physics, this.interactions, this.userInterface)
            );
            this.addConstruct(this.crystals[i]);
        }

        this.levelMenus = [];
    }

    create(): void {
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
        this.graphics.mainCamera = this.camera;

        const developers = [
            'Lisa Godwin', 'Brendan Griffiths', 'Yonatan Oudmayer', 'Nihal Ranchod', 'Zach Schwark', 'Ashlea Smith'
        ]
        const assets = [
            // { artist: '', title: '', type: '', license: '', link: '' },
            { artist: 'Nihal Ranchod', title: 'Chess Plinths', type: 'Model', license: 'None (made for project)', link: '' },
            { artist: 'Brendan Griffihs', title: 'Lectern', type: 'Model', license: 'None (made for project)', link: '' },
            { artist: 'flithycent', title: 'bookshelf', type: 'Model', license: 'CC-BY-4.0', link: 'https://sketchfab.com/3d-models/bookshelf-3c782b0787cc41f1b5974dbd7a1f8f53' },
            { artist: 'FlukierJupiter', title: 'Wooden Table', type: 'Model', license: 'CC-BY-4.0', link: 'https://sketchfab.com/3d-models/wooden-table-0dc1c7d6cbab4d74bef7c4f82abf2caf' },
            { artist: 'sergeilihandristov', title: 'Desk lamp', type: 'Model', license: 'CC-BY-4.0', link: 'https://sketchfab.com/3d-models/desk-lamp-ac5135b505694287a64b4370ea2cda8d' },
            { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Pawn', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-pawn-3443007498c54b5b9a31a08697a3b1b3' },
            { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Knight', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-knight-112534cb4cbb47588c2cf566441f37fc' },
            { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Bishop', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-bishop-75681488e5fe457280813781cf3d15c1' },
            { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Rook', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-rook-cbd416e785f64648bff3675fd45b3594' },
            { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Queen', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-queen-ab958c61eb2a405aa7a7b0cec91c79b0' },
            { artist: 'Joao Paulo', title: 'Wood 27', type: 'Material', license: 'CC0', link: 'https://3dtextures.me/2022/05/21/wood-027/' },
        ];
        drawMainMenu(this.userInterface, developers, assets);
    }

    async load(): Promise<void> {
    }

    build(): void {

        // Scene
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
            const glowScale = new THREE.Vector3(0.5, 0.5, 1);
            this.crystals[i].glowSprite.scale.multiply(glowScale); // the glow is here is not the same as in the level
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