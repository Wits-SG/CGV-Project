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
    roofTexture: any;

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

    }

    async load(): Promise<void> {
        try {
            this.wallTexture = await this.graphics.loadTexture('assets/Material.001_baseColor.png');
        } catch(e: any) {
            console.error(e);
        }

        try {
            this.roofTexture = await this.graphics.loadTexture('assets/gray-scale-shot-textured-ceiling.jpg');
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

        this.mirrorCrystal.root.position.set(25, 25, 0);


        const blockPositions = [
            {x: 10, y: 2, z: 0}, {x: 10, y: 4.5, z: -15}, {x: 10, y: 7, z: -30},
            {x: 25, y: 9.5, z: -30}, {x: 40, y: 12, z: -30},
            {x: 40, y: 14.5, z: -15}, {x: 40, y: 17, z: 0}, {x: 25, y: 19.5, z: 0}
        ];
        // const blockGeom = new THREE.BoxGeometry(7, 0.6, 7);
        // const blockMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

        this.block.layers.set(1);
        for (let i = 0; i < blockPositions.length; ++i) {
            const block = this.block.clone();
            block.scale.set(0.4,0.4,0.4);
            block.position.set(
                blockPositions[i].x, blockPositions[i].y, blockPositions[i].z
            )
            block.castShadow = true;
            this.add(block);
            this.physics.addStatic(block, PhysicsColliderFactory.box(3.5, 0.6, 3.5));
        }


        const floorMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const floorGeom = new THREE.BoxGeometry(50, 1, 100);
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.position.set(25, 0, 0);

        const tempMirrorGeom = new THREE.PlaneGeometry( 98, 38 );
        this.mirror = new Reflector( tempMirrorGeom, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * devicePixelRatio,
            textureHeight: window.innerHeight * devicePixelRatio,
            color: 0xb5b5b5
        });
        const cam = this.mirror.virtualCamera;
        cam.layers.enable(1);
        this.mirror.position.set(49.9, 19, 0);
        this.mirror.rotation.set(0, -Math.PI/2, Math.PI);
        this.add(this.mirror);

        const mirrorFrameGeom = new THREE.PlaneGeometry(100, 40);
        const mirrorFrameMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const mirrorFrame = new THREE.Mesh(mirrorFrameGeom, mirrorFrameMat);
        mirrorFrame.position.set(50, 20, 0);
        mirrorFrame.rotation.set(0, -Math.PI/2, Math.PI);

        const wallMat = new THREE.MeshLambertMaterial({ map: this.wallTexture });
        const backWallGeom = new THREE.PlaneGeometry(40, 20);
        const sideWallGeom = new THREE.PlaneGeometry(50, 40);

        const entranceWallLeft = new THREE.Mesh(backWallGeom, wallMat);
        const entranceWallRight = new THREE.Mesh(backWallGeom, wallMat);

        const sideWallLeft = new THREE.Mesh(sideWallGeom, wallMat);
        const sideWallRight = new THREE.Mesh(sideWallGeom, wallMat);

        sideWallLeft.position.set(25, 20, -50);

        sideWallRight.position.set(25, 20, 50);
        sideWallRight.rotation.set(0, Math.PI, 0);

        entranceWallLeft.position.set(0, 10, -30);
        entranceWallLeft.rotation.set(0, Math.PI/2, Math.PI);
        entranceWallRight.position.set(0, 10, 30);
        entranceWallRight.rotation.set(0, Math.PI/2, Math.PI);

        const roofMat = new THREE.MeshLambertMaterial({ map: this.roofTexture });
        const roofGeom = new THREE.PlaneGeometry(54, 100);
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.rotation.set(Math.PI/2, 0.38, 0);
        roof.position.set(25, 29, 0);

        const roofLight = new THREE.PointLight(0xffffff, 4, 300, 0);
        roofLight.position.set(25, 25, 0);



        this.add(roofLight);

        this.add(entranceWallLeft);
        this.add(entranceWallRight);

        this.add(sideWallLeft);
        this.add(sideWallRight);
        this.add(mirrorFrame);
        this.add(roof);
        this.add(floor);

        this.physics.addStatic(entranceWallLeft, PhysicsColliderFactory.box(20, 10, 0.1));
        this.physics.addStatic(entranceWallRight, PhysicsColliderFactory.box(20, 10, 0.1));
        this.physics.addStatic(sideWallLeft, PhysicsColliderFactory.box(25, 20, 0.1));
        this.physics.addStatic(sideWallRight, PhysicsColliderFactory.box(25, 20, 0.1));

        this.physics.addStatic(mirrorFrame, PhysicsColliderFactory.box(50, 20, 0.1));
        this.physics.addStatic(floor, PhysicsColliderFactory.box(25, 0.5, 50));


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
