import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
//@ts-expect-error
import { OrbitControls } from 'three/addons/controls/OrbitControls';
//import { TimeS } from '../lib/w3ads/types/misc.type';
import { Staircase } from '../constructs/Staircase';
import { Pillars } from '../constructs/Pillar';
import { Balcony } from '../constructs/Balcony';
import { Fence } from './Fence';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';

export class OfficeConstruct extends Construct {
    floor!: THREE.Mesh;  
    wall!: THREE.Mesh;
    carpet!: THREE.Mesh;
    table!: THREE.Group;
    firePlace!: THREE.Group;
    woodenShelf!: THREE.Group;
    alchemyShelf!: THREE.Group;
    bookShelfOffice!: THREE.Group;
    floorTexture!: any;
    wallTexture!: any;
    roofTexture!: any;
    smallRoofTexture!: any;
    carpetTexture!:any;
    fence!: Fence;
    stairCase!: Staircase;
    pillars!: Pillars;
    balcony!: Balcony;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext ) {
        super(graphics, physics, interactions, userInterface);

        this.pillars = new Pillars(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.pillars);

        this.stairCase = new Staircase(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.stairCase);

        this.balcony = new Balcony(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.balcony);

        this.fence = new Fence(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.fence);

    }

    create(): void {
    }

    async load(): Promise<void>{

        // LOAD MODELS //

        try {
            const gltfData: any = await this.graphics.loadModel('assets/antique_wooden_desk/scene.gltf');
            this.table = gltfData.scene;
        } catch(e: any) {
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/fence/scene.gltf');
            this.fence = gltfData.scene;
        } catch(e: any) {
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/medieval_fireplace_free/scene.gltf');
            this.firePlace = gltfData.scene;
        } catch(e: any) {
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('/assets/wooden_shelf/scene.gltf');
            this.woodenShelf = gltfData.scene;
        } catch(e: any) {
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/alchemy_shelf/scene.gltf');
            this.alchemyShelf = gltfData.scene;
        } catch(e: any) {
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/bookshelf_office/scene.gltf');
            this.bookShelfOffice = gltfData.scene;
        } catch(e: any) {
                console.error(e);
        }
         
        // LOAD TEXTURES //

        try {
            this.floorTexture = await this.graphics.loadTexture('assets/woodFloor.jpeg');
            this.floorTexture.wrapS = THREE.RepeatWrapping;
            this.floorTexture.wrapT = THREE.RepeatWrapping;
            this.floorTexture.repeat.set(10, 10);
        } catch(e: any) {
            console.error(e);
        }

        try {
            this.wallTexture = await this.graphics.loadTexture('assets/brownBricks.jpeg');
            this.wallTexture.wrapS = THREE.RepeatWrapping;
            this.wallTexture.wrapT = THREE.RepeatWrapping;
            this.wallTexture.repeat.set(5, 5);
        } catch(e: any) {
            console.error(e);
        }

        try {
            this.roofTexture = await this.graphics.loadTexture('assets/roof_tile.jpg');
            this.roofTexture.wrapS = THREE.RepeatWrapping;
            this.roofTexture.wrapT = THREE.RepeatWrapping;
            this.roofTexture.repeat.set(5, 10);
        } catch(e: any) {
            console.error(e);
        }

        try {
            this.smallRoofTexture = await this.graphics.loadTexture('assets/roof_tile.jpg');
            this.smallRoofTexture.wrapS = THREE.RepeatWrapping;
            this.smallRoofTexture.wrapT = THREE.RepeatWrapping;
            this.smallRoofTexture.repeat.set(4, 3);
        } catch(e: any) {
            console.error(e);
        }

        try {
            this.carpetTexture = await this.graphics.loadTexture('assets/carpet.jpeg');
        } catch(e: any) {
            console.error(e);
        }

    }

  
    build(): void {

        // **** BUILD BASICS **** //

        // floor

        this.floor = new THREE.Mesh(new THREE.BoxGeometry(30, 0.2, 50), new THREE.MeshBasicMaterial({ map: this.floorTexture }));
        this.floor.position.set(0,-0.1,0);
        this.add(this.floor);
        this.physics.addStatic(this.floor,PhysicsColliderFactory.box(15, 0.1 , 25));

        // walls

        const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 13.2, 50), new THREE.MeshBasicMaterial({ map: this.wallTexture }));
        wallL.position.set(-15,6.6,0);
        this.add(wallL);
        this.physics.addStatic(wallL,PhysicsColliderFactory.box(0.5, 6.6 , 25));

        const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 13.2, 50), new THREE.MeshBasicMaterial({ map: this.wallTexture }));
        wallR.position.set(15,6.6,0);
        this.add(wallR);
        this.physics.addStatic(wallR,PhysicsColliderFactory.box(0.5, 6.6 , 25));

        const wallB = new THREE.Mesh(new THREE.BoxGeometry(30, 13.2, 0.1), new THREE.MeshBasicMaterial({ map: this.wallTexture }));
        wallB.position.set(0,6.6,-24.95);
        this.graphics.add(wallB);
        this.physics.addStatic(wallB,PhysicsColliderFactory.box(15, 6.6 , 0.5));

        const wallF = new THREE.Mesh(new THREE.BoxGeometry(30, 13.2, 0.1), new THREE.MeshBasicMaterial({ map: this.wallTexture }));
        wallF.position.set(0,6.6,24.95);
        this.graphics.add(wallF);
        this.physics.addStatic(wallF,PhysicsColliderFactory.box(15, 6.6 , 0.5));

        // small room walls 

        const wallLf = new THREE.Mesh(new THREE.BoxGeometry(10, 13.2, 0.1), new THREE.MeshBasicMaterial({ map: this.wallTexture }));
        wallLf.position.set(10,6.6,-14.7);
        this.add(wallLf);
        this.physics.addStatic(wallLf,PhysicsColliderFactory.box(6, 6.6 , 0.5));

        const wallRf = new THREE.Mesh(new THREE.BoxGeometry(10, 13.2, 0.1), new THREE.MeshBasicMaterial({ map: this.wallTexture }));
        wallRf.position.set(-10,6.6,-14.7);
        this.add(wallRf);
        this.physics.addStatic(wallRf,PhysicsColliderFactory.box(6, 6.6 , 0.5));

        // small room roof

        const smallRoof = new THREE.Mesh(new THREE.BoxGeometry(30, 0.5, 10.5), new THREE.MeshBasicMaterial({ map: this.smallRoofTexture }));
        smallRoof.position.set(0,5.24,-20);
        this.graphics.add(smallRoof);
        this.physics.addStatic(smallRoof,PhysicsColliderFactory.box(15, 0.25 , 5.25));

        // large room roof

        const largeRoof = new THREE.Mesh(new THREE.BoxGeometry(30, 0.5, 50), new THREE.MeshBasicMaterial({ map: this.roofTexture }));
        largeRoof.position.set(0,13.45,0);
        this.graphics.add(largeRoof);
        this.physics.addStatic(largeRoof,PhysicsColliderFactory.box(15, 0.25 , 25));

        // upper room floor

        const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(30, 0.1, 10.5), new THREE.MeshBasicMaterial({ map: this.floorTexture }));
        upperFloor.position.set(0,5.47,-20);
        this.graphics.add(upperFloor);

        // **** BUILD MODELS **** //

        // bookShelfOffice

        this.bookShelfOffice.scale.set(2,2,2); 
        this.bookShelfOffice.position.set(14.2, 0, 20);
        this.bookShelfOffice.rotateY(-Math.PI);
        this.graphics.add(this.bookShelfOffice);

        const secondBookShelfOffice = this.bookShelfOffice.clone();
        secondBookShelfOffice.scale.set(2,2,2); 
        secondBookShelfOffice.position.set(-14.2,0,-19);
        secondBookShelfOffice.rotateY(Math.PI);
        this.graphics.add(secondBookShelfOffice);

        //  -- bookShelfOffice Physics --

        const bookShelfOfficePhysics = new THREE.Mesh(new THREE.BoxGeometry(1.35, 4.6, 3.4) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        bookShelfOfficePhysics.position.set(14.1, 2.3, 20);
        //this.graphics.add(bookShelfOfficePhysics);
        this.physics.addStatic(bookShelfOfficePhysics,PhysicsColliderFactory.box(0.675, 2.3 , 1.7));

        const secondBookShelfOfficePhysics = new THREE.Mesh(new THREE.BoxGeometry(1.35, 4.6, 3.4) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        secondBookShelfOfficePhysics.position.set(-14.1, 2.3, -19);
        //this.graphics.add(secondBookShelfOfficePhysics);
        this.physics.addStatic(secondBookShelfOfficePhysics,PhysicsColliderFactory.box(0.675, 2.3 , 1.7));

        // woodenShelf 

        this.woodenShelf.scale.set(3,2,3); 
        this.woodenShelf.position.set(-13.9, 0, -23);
        this.woodenShelf.rotateY(Math.PI/2);
        this.graphics.add(this.woodenShelf);

        const secondShelf = this.woodenShelf.clone();
        secondShelf.position.set(13.9, 0, 0);
        secondShelf.rotateY(-Math.PI);
        this.graphics.add(secondShelf);

        const thirdShelf = this.woodenShelf.clone();
        thirdShelf.scale.set(5,2,3);
        thirdShelf.position.set(-13.9, 0, 8);
        //thirdShelf.rotateY(Math.PI);
        this.graphics.add(thirdShelf);

        //  -- woodenShelf Physics --

        const woodenShelfPhysics = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 3.5) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        woodenShelfPhysics.position.set(13.9, 2.5, 0);
        // this.graphics.add(woodenShelfPhysics);
        this.physics.addStatic(woodenShelfPhysics,PhysicsColliderFactory.box(0.725, 2.5 , 1.75));

        const secondWoodenShelfPhysics = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 3.5) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        secondWoodenShelfPhysics.position.set(-13.9, 2.5, -23);
        // this.graphics.add(secondWoodenShelfPhysics);
        this.physics.addStatic(secondWoodenShelfPhysics,PhysicsColliderFactory.box(0.725, 2.5 , 1.75));

        const thirdWoodenShelfPhysics = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 5) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        thirdWoodenShelfPhysics.position.set(-13.9, 2.5, 8);
        // this.graphics.add(thirdWoodenShelfPhysics);
        this.physics.addStatic(thirdWoodenShelfPhysics,PhysicsColliderFactory.box(0.725, 2.5 , 2.5));

        // alchemyShelf

        this.alchemyShelf.scale.set(0.003,0.003,0.003); 
        this.alchemyShelf.position.set(14.2, 3, 7);
        this.alchemyShelf.rotateY(Math.PI);
        this.graphics.add(this.alchemyShelf);

        const alchemyShelf2 = this.alchemyShelf.clone();
        alchemyShelf2.position.set(14.2, 3, -20);
        this.graphics.add(alchemyShelf2);

        //  -- alchemyShelf Physics --

        const alchemyShelfPhysics = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.7, 2.7) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        alchemyShelfPhysics.position.set(14.3, 3.2, 7);
        //this.graphics.add(alchemyShelfPhysics);
        this.physics.addStatic(alchemyShelfPhysics,PhysicsColliderFactory.box(0.825, 1.35 , 1.35));

        const alchemyShelf2Physics = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.7, 2.7) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        alchemyShelf2Physics.position.set(14.3, 3.2, -20);
        //this.graphics.add(alchemyShelf2Physics);
        this.physics.addStatic(alchemyShelf2Physics,PhysicsColliderFactory.box(0.825, 1.35 , 1.35));

        // firePlace

        this.firePlace.scale.set(0.01,0.01,0.01); 
        this.firePlace.position.set(0, 1.3, -23.9);
        this.graphics.add(this.firePlace);

        //  -- firePlace Physics --

        const firePlacePhysics = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3, 1) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        firePlacePhysics.position.set(0, 1.5, -24.4);
        // this.graphics.add(firePlacePhysics);
        this.physics.addStatic(firePlacePhysics,PhysicsColliderFactory.box(1.2, 1.5 , 0.5));

        // table

        this.table.scale.set(2,2,2); 
        this.table.position.set(0, 0, 5);
        this.table.rotateY(-Math.PI/2);
        this.graphics.add(this.table);

        const upstairsTable = this.table.clone();
        upstairsTable.position.set(0,5.45,-20);
        this.add(upstairsTable);

         //  -- table Physics --

         const tablePhysics = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.55, 2.2) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
         tablePhysics.position.set(0, 0.82, 5);
        //  this.graphics.add(tablePhysics);
         this.physics.addStatic(tablePhysics,PhysicsColliderFactory.box(2.4, 1.1 , 1.3));

         const upstairsTablePhysics = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.55, 2.2) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
         upstairsTablePhysics.position.set(0, 6.25, -20);
        //  this.graphics.add(upstairsTablePhysics);
         this.physics.addStatic(upstairsTablePhysics,PhysicsColliderFactory.box(2.4, 1.1 , 1.3));

        // carpet

        this.carpet = new THREE.Mesh(new THREE.BoxGeometry(7, 0.01, 5), new THREE.MeshBasicMaterial({ map: this.carpetTexture }));
        this.carpet.position.set(0,0,5);
        this.add(this.carpet);
        this.physics.addStatic(this.floor,PhysicsColliderFactory.box(15, 0.1 , 25));

        const secondCarpet = this.carpet.clone();
        secondCarpet.position.set(0, 5.53, -20);
        this.add(secondCarpet);

        // **** BUILD CONSTRUCTS **** //

        // pillars
        this.pillars.root.position.set(0,0,0);

        // balcony
        this.balcony.root.position.set(0,0,0);

        // stairs
        this.stairCase.root.position.set(0,0,0);

    }

    update(): void {
    }

    destroy(): void {
    }
}
