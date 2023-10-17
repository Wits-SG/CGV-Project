import * as THREE from 'three';
// import { Reflector } from 'three/addons/objects/Reflector';
import { Reflector } from '../lib/CustomReflector';
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { Crystal } from './Crystal';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import { Lectern } from './Lectern';


export class MirrorRoom extends Construct {
    mirrorCrystal: Crystal;
    mirror!: Reflector;

    wallTexture: any;
    floorTexture: any;

    lectern!: Lectern;

    block!: any;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);

        this.mirrorCrystal = new Crystal(graphics, physics, interactions, userInterface);
        this.addConstruct(this.mirrorCrystal);

        const title = 'Mirror Puzzle';
        const paragraphs = ["You stand in a room, crystal glistening high above. The path to your prize lies hidden in plain sight, an enigmatic challenge awaiting your might. Mirrors line the walls, and the reflection they hold offers clues to the squares, secrets untold. Leap with precision, grasp the reflection's grace; the mirror holds more information, the path it will trace."];
        this.lectern = new Lectern(graphics, physics, interactions, userInterface, title, paragraphs);
        this.addConstruct(this.lectern);
    }

    create(): void {

        this.lectern.root.position.set(4,1,-5);
        this.lectern.root.rotation.set(0, Math.PI/2 ,0);

        this.mirrorCrystal.root.position.set(45, 3, 0);
    }

    async load(): Promise<void> {
        try {
            this.wallTexture = await this.graphics.loadTexture('assets/Material.001_baseColor.png');
        } catch(e: any) {
            console.error(e);
        }

        try {
            this.floorTexture = await this.graphics.loadTexture('assets/Flooring_Stone_001_COLOR.png');
        } catch(e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Square_Plinths/square_plinths.gltf');
            this.block = gltfData.scene;
            this.block.traverse((object: THREE.Object3D ) => {
                object.layers.set(1);
            });
        } catch (e: any) {
            console.log(e);
        }
    }

    build(): void {

        const firstRowBlocks = [
            { x: 20, y: -1, z: 0 } ,{ x: 20, y: -1, z: -7.5 }, { x: 20, y: -1, z: 7.5 },
        ];
        const middleRowBlocks = [
            { x: 27.5, y: -1, z: 0 }, { x: 27.5, y: -1, z: -7.5 }, { x: 27.5, y: -1, z: 7.5 },
        ];
        const lastRowBlocks = [
            { x: 35, y: -1, z: 0 }, { x: 35, y: -1, z: -7.5 }, { x: 35, y: -1, z: 7.5 },
        ];

        // Front row
        let selectedBlock = Math.floor(Math.random() * firstRowBlocks.length);
        const firstBlock = this.block.clone();
        firstBlock.scale.set(0.5,0.5,0.5);
        firstBlock.position.set(
            firstRowBlocks[selectedBlock].x, firstRowBlocks[selectedBlock].y, firstRowBlocks[selectedBlock].z
        )
        firstBlock.castShadow = true;
        this.add(firstBlock);
        this.physics.addStatic(firstBlock, PhysicsColliderFactory.box(3.5, 0.6, 3.5));

        // middle row
        const middleUsed: Array<number> = [];
        for (let i = 0; i < 2; ++i) {
            selectedBlock = Math.floor(Math.random() * middleRowBlocks.length);
            while ( middleUsed.includes(selectedBlock) ) { selectedBlock = Math.floor(Math.random() * middleRowBlocks.length); }
            middleUsed.push( selectedBlock );
            const middleBlock = this.block.clone();
            middleBlock.scale.set(0.5,0.5,0.5);
            middleBlock.position.set(
                middleRowBlocks[selectedBlock].x, middleRowBlocks[selectedBlock].y, middleRowBlocks[selectedBlock].z
            )
            middleBlock.castShadow = true;
            this.add(middleBlock);
            this.physics.addStatic(middleBlock, PhysicsColliderFactory.box(3.5, 0.6, 3.5));
        }

        // last row
        const lastUsed: Array<number> = [];
        for (let i = 0; i < 2; ++i) {
            selectedBlock = Math.floor(Math.random() * lastRowBlocks.length);
            while ( lastUsed.includes(selectedBlock) ) { selectedBlock = Math.floor(Math.random() * lastRowBlocks.length); }
            lastUsed.push( selectedBlock );
            const lastBlock = this.block.clone();
            lastBlock.scale.set(0.5,0.5,0.5);
            lastBlock.position.set(
                lastRowBlocks[selectedBlock].x, lastRowBlocks[selectedBlock].y, lastRowBlocks[selectedBlock].z
            )
            lastBlock.castShadow = true;
            this.add(lastBlock);
            this.physics.addStatic(lastBlock, PhysicsColliderFactory.box(3.5, 0.6, 3.5));
        }

        const floorMat = new THREE.MeshLambertMaterial({ map: this.floorTexture });
        const floorGeom = new THREE.BoxGeometry(15, 10, 100);
        const floorBack = new THREE.Mesh(floorGeom, floorMat);
        const floorForward = new THREE.Mesh(floorGeom, floorMat);
        const floorBottom = new THREE.Mesh(floorGeom, floorMat);

        floorBack.position.set(7.5, -5, 10);
        floorBack.scale.set(1, 1, 0.9);
        floorForward.position.set(42.5, -5, 0);
        floorBottom.position.set(25, -15, 0);
        floorBottom.scale.set(2.5, 1, 1); // adjust to fill the whole bottom space

        const rampGeom = new THREE.BoxGeometry(10, 2, 15);
        for (let i = 0; i < 5; ++i) {
            const ramp = new THREE.Mesh(rampGeom, floorMat);
            ramp.position.set(7 - 2*i, -9.5 + 2*i, -42.5);
            this.add(ramp);
            this.physics.addStatic(ramp, PhysicsColliderFactory.box(5, 1, 7.5));
        }

        const tempMirrorGeom = new THREE.PlaneGeometry( 50, 100 );
        this.mirror = new Reflector( tempMirrorGeom, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * devicePixelRatio,
            textureHeight: window.innerHeight * devicePixelRatio,
            color: 0xb5b5b5
        });
        const cam = this.mirror.virtualCamera;
        cam.layers.enable(1);
        this.mirror.position.set(25, 40, 0);
        this.mirror.rotation.set(Math.PI / 2, 0, 0);
        this.add(this.mirror);

        const mirrorFrameGeom = new THREE.PlaneGeometry(100, 40);
        const mirrorFrameMat = new THREE.MeshLambertMaterial({ map: this.wallTexture });
        const mirrorFrame = new THREE.Mesh(mirrorFrameGeom, mirrorFrameMat);
        mirrorFrame.position.set(50, 20, 0);
        mirrorFrame.rotation.set(0, -Math.PI/2, Math.PI);

        const wallMat = new THREE.MeshLambertMaterial({ map: this.wallTexture });
        const sideWallGeom = new THREE.PlaneGeometry(50, 50);

        const sideWallLeft = new THREE.Mesh(sideWallGeom, wallMat);
        const sideWallRight = new THREE.Mesh(sideWallGeom, wallMat);

        sideWallLeft.position.set(25, 15, -50);
        sideWallRight.position.set(25, 15, 50);
        sideWallRight.rotation.set(0, Math.PI, 0);

        const backWallGeom = new THREE.PlaneGeometry(20, 100);
        const backWall = new THREE.Mesh(backWallGeom, wallMat);
        backWall.rotation.set(Math.PI/2, Math.PI/2, 0);
        backWall.position.set(0, 30, 0);

        const bottomWallGeom = new THREE.PlaneGeometry(5, 100);
        const bottomWallForward = new THREE.Mesh(bottomWallGeom, wallMat);
        const bottomWallBack = new THREE.Mesh(bottomWallGeom, wallMat);
        
        bottomWallForward.position.set(34.8, -2.5, 0);
        bottomWallForward.rotation.set(Math.PI/2, -Math.PI/2, 0);

        bottomWallBack.position.set(15.2, -2.5, 10);
        bottomWallBack.rotation.set(Math.PI/2, Math.PI/2, 0);
        bottomWallBack.scale.set(0.95, 0.9, 1);

        const roofLight = new THREE.PointLight(0xffffff, 4, 300, 0);
        roofLight.position.set(25, 25, 0);

        this.add(roofLight);

        this.add(sideWallLeft);
        this.add(sideWallRight);
        this.add(mirrorFrame);
        this.add(backWall);
        this.add(floorBack);
        this.add(floorForward);
        this.add(floorBottom)

        this.physics.addStatic(sideWallLeft, PhysicsColliderFactory.box(25, 25, 0.1));
        this.physics.addStatic(sideWallRight, PhysicsColliderFactory.box(25, 25, 0.1));

        this.physics.addStatic(mirrorFrame, PhysicsColliderFactory.box(50, 20, 0.1));
        this.physics.addStatic(floorBack, PhysicsColliderFactory.box(7.5, 5, 45));
        this.physics.addStatic(floorForward, PhysicsColliderFactory.box(7.5, 5, 50));
        this.physics.addStatic(floorBottom, PhysicsColliderFactory.box(17.5, 5, 50));


        window.addEventListener('resize', () => {
            this.mirror.getRenderTarget().setSize(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio
            );
        })

    }

    update(): void {
    }

    destroy(): void {

    }

}
