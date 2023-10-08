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

        this.door = new CrystalDoor(this.graphics, this.physics, this.interactions, this.numCrystals);
        this.addConstruct(this.door);

        this.crystals = [];
        for (let i = 0; i < this.numCrystals; ++i) {
            this.crystals.push(
                new Crystal(this.graphics, this.physics, this.interactions)
            );
            this.addConstruct(this.crystals[i]);
        }

        this.levelMenus = [];
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

        this.container = document.createElement('div');
        this.container.className = 'flex justify-start items-center w-screen h-screen fixed top-0 left-0 z-10 p-10';
        document.body.appendChild(this.container);

        const panelClass = 'flex flex-col gap-5 justify-center items-center bg-stone-300 p-10 rounded-lg border-stone-950 border-2'

        this.root = document.createElement('div');
        this.root.className = 'flex justify-start items-start gap-5';
        this.container.appendChild(this.root);

        this.menu = document.createElement('div');
        this.menu.className = panelClass;
        this.root.appendChild(this.menu);

        this.credits = document.createElement('div');
        this.credits.className = panelClass;

        this.credits = document.createElement('div');
        this.credits.className = panelClass;

        this.drawMenu();
        this.drawCredits();
        for (let i = 0; i < 3; ++i) {
            this.levelMenus.push( document.createElement('div') );
            this.levelMenus[i].className = panelClass;
            this.drawLevelMenu(i);
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
                this.root.appendChild(this.levelMenus[i]);
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
                'Lisa Godwin', 'Brendan Griffiths', 'Yonatan Oudmayer', 'Nihal Ranchod', 'Zach Schwark', 'Ashlea Smith'
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
                // { artist: '', title: '', type: '', license: '', link: '' },
                { artist: 'Nihal Ranchod', title: 'Chess Plinths', type: 'Model', license: 'None (made for project)', link: '' },
                { artist: 'flithycent', title: 'bookshelf', type: 'Model', license: 'CC-BY-4.0', link: 'https://sketchfab.com/3d-models/bookshelf-3c782b0787cc41f1b5974dbd7a1f8f53' },
                { artist: 'FlukierJupiter', title: 'Wooden Table', type: 'Model', license: 'CC-BY-4.0', link: 'https://sketchfab.com/3d-models/wooden-table-0dc1c7d6cbab4d74bef7c4f82abf2caf' },
                { artist: 'sergeilihandristov', title: 'Desk lamp', type: 'Model', license: 'CC-BY-4.0', link: 'https://sketchfab.com/3d-models/desk-lamp-ac5135b505694287a64b4370ea2cda8d' },
                { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Pawn', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-pawn-3443007498c54b5b9a31a08697a3b1b3' },
                { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Knight', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-knight-112534cb4cbb47588c2cf566441f37fc' },
                { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Bishop', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-bishop-75681488e5fe457280813781cf3d15c1' },
                { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Rook', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-rook-cbd416e785f64648bff3675fd45b3594' },
                { artist: 'marcelo.medeirossilva', title: 'Low Poly Chess - Queen', type: 'Model', license: 'CC-BY-NC-SA-4.0', link: 'https://sketchfab.com/3d-models/low-poly-chess-queen-ab958c61eb2a405aa7a7b0cec91c79b0' },
            ];
            const assetsList = document.createElement('ul');
            assetsList.className = 'p-3 flex flex-col justify-start items-start gap-1 max-h-44 overflow-y-scroll'
            assets.appendChild(assetsList);
            for (let asset of allAssets) {
                console.log(asset);
                const assetP = document.createElement('li');
                assetP.innerHTML = `<a href='${asset.link}' class='text-sky-700 underline' >${asset.title}<a> - ${asset.artist} - ${asset.type} - ${asset.license}`;
                assetsList.appendChild(assetP);
            }

        const closeCredits = document.createElement('button');
        closeCredits.innerText = 'Close Credits';
        closeCredits.className = 'w-32 bg-stone-100 hover:bg-stone-200 rounded-md p-2';
        closeCredits.onclick = () => { this.root.removeChild(this.credits); }
        this.credits.appendChild(closeCredits);
    }

    drawLevelMenu(level: number) {
        const difficulties = ['easy', 'medium', 'hard'];
        const numPuzzles = [1, 3, 5];
        const levelRoot = this.levelMenus[level];

        const title = document.createElement('h1');
        title.innerText = `Level ${level + 1}`;
        title.className = 'text-4xl';
        levelRoot.appendChild(title);
        
        const description = document.createElement('h2');
        description.innerText = 'Description';
        description.className = 'text-xl border-b-2 border-stone-950 flex justify-center items-center'
        levelRoot.appendChild(description);

        const difficulty = document.createElement('p');
        difficulty.innerHTML = `<b class='font-bold'>Difficulty:</b> ${difficulties[level]}`;
        difficulty.className = 'text-md';
        levelRoot.appendChild(difficulty);

        const puzzles = document.createElement('p');
        puzzles.innerHTML = `<b class='font-bold'>Number of puzzles:</b> ${numPuzzles[level]}`;
        puzzles.className = 'text-md';
        levelRoot.appendChild(puzzles);

        const leaderboardTitle = document.createElement('h2');
        leaderboardTitle.innerText = 'Leaderboard';
        leaderboardTitle.className = 'text-xl border-b-2 border-stone-950 flex justify-center items-center'
        levelRoot.appendChild(leaderboardTitle);

        const playLevel = document.createElement('button');
        playLevel.innerText = `Play Level ${level + 1}`;
        playLevel.className = 'w-32 bg-stone-100 hover:bg-stone-200 rounded-md p-2';
        levelRoot.appendChild(playLevel);

        const closeLevel = document.createElement('button');
        closeLevel.innerText = 'Close';
        closeLevel.className = 'w-16 bg-stone-100 hover:bg-stone-200 rounded-md p-2';
        closeLevel.onclick = () => this.root.removeChild(levelRoot);
        levelRoot.appendChild(closeLevel);
    }
}