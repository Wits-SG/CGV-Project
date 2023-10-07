import * as THREE from 'three';
// import { Reflector } from 'three/addons/objects/Reflector';
import { Reflector } from '../lib/CustomReflector';
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { Crystal } from './Crystal';
import { InteractManager } from '../lib/w3ads/InteractManager';


export class MirrorRoom extends Construct {
    mirrorCrystal: Crystal;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager) {
        super(graphics, physics, interactions);

        this.mirrorCrystal = new Crystal(graphics, physics, interactions);
        this.addConstruct(this.mirrorCrystal);
    }

    create(): void {

    }

    async load(): Promise<void> {

    }

    build(): void {

        this.mirrorCrystal.root.position.set(25, 25, 0);

        const blockPositions = [
            {x: 10, y: 2, z: 0}, {x: 10, y: 4.5, z: -15}, {x: 10, y: 7, z: -30},
            {x: 25, y: 9.5, z: -30}, {x: 40, y: 12, z: -30},
            {x: 40, y: 14.5, z: -15}, {x: 40, y: 17, z: 0}, {x: 25, y: 19.5, z: 0}
        ];
        const blockGeom = new THREE.BoxGeometry(7, 0.4, 7);
        const blockMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });

        for (let i = 0; i < blockPositions.length; ++i) {
            const block = new THREE.Mesh(blockGeom, blockMat);
            block.position.set(
                blockPositions[i].x, blockPositions[i].y, blockPositions[i].z
            )
            // block.layers.set(1);
            block.castShadow = true;
            block.layers.set(1);
            this.add(block);
            this.physics.addStatic(block, PhysicsColliderFactory.box(3.5, 0.2, 3.5));
        }

        const floorMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const floorGeom = new THREE.BoxGeometry(50, 1, 100);
        const floor = new THREE.Mesh(floorGeom, floorMat);
        floor.position.set(25, 0, 0);

        const tempMirrorGeom = new THREE.PlaneGeometry(98, 38);
        const mirror = new Reflector( tempMirrorGeom, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0xb5b5b5
        });
        const cam = mirror.virtualCamera;
        cam.layers.enable(1);
        mirror.position.set(49.9, 20, 0);
        mirror.rotation.set(0, -Math.PI/2, Math.PI);
        this.add(mirror);

        const mirrorFrameGeom = new THREE.PlaneGeometry(100, 40);
        const mirrorFrameMat = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        const mirrorFrame = new THREE.Mesh(mirrorFrameGeom, mirrorFrameMat);
        mirrorFrame.position.set(50, 20, 0);
        mirrorFrame.rotation.set(0, -Math.PI/2, Math.PI);

        const wallMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const backWallGeom = new THREE.PlaneGeometry(100, 20);
        const sideWallGeom = new THREE.PlaneGeometry(50, 40);
        const entranceWall = new THREE.Mesh(backWallGeom, wallMat);
        const sideWallLeft = new THREE.Mesh(sideWallGeom, wallMat);
        const sideWallRight = new THREE.Mesh(sideWallGeom, wallMat);

        sideWallLeft.position.set(25, 20, -50);

        sideWallRight.position.set(25, 20, 50);
        sideWallRight.rotation.set(0, Math.PI, 0);

        entranceWall.position.set(0, 10, 0);
        entranceWall.rotation.set(0, Math.PI/2, Math.PI);

        const roofMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const roofGeom = new THREE.PlaneGeometry(54, 100);
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.rotation.set(Math.PI/2, 0.38, 0);
        roof.position.set(25, 29, 0);

        const roofLight = new THREE.PointLight(0xffffff, 1, 20, 0);
        roofLight.position.set(25, 25, 0);

        this.physics.addStatic(entranceWall, PhysicsColliderFactory.box(50, 10, 0.1));
        this.physics.addStatic(sideWallLeft, PhysicsColliderFactory.box(25, 20, 0.1));
        this.physics.addStatic(sideWallRight, PhysicsColliderFactory.box(25, 20, 0.1));

        this.physics.addStatic(mirrorFrame, PhysicsColliderFactory.box(50, 20, 0.1));
        this.physics.addStatic(floor, PhysicsColliderFactory.box(25, 0.5, 50));

        this.add(roofLight);
        this.add(entranceWall);
        this.add(sideWallLeft);
        this.add(sideWallRight);
        this.add(mirrorFrame);
        this.add(roof);
        this.add(floor);

    }

    update(): void {

    }

    destroy(): void {

    }

}
