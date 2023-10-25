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
import { Crystal } from './Crystal';
import { Lectern } from './Lectern';

export class OfficeConstruct extends Construct {
    floor!: THREE.Mesh;  
    wall!: THREE.Mesh;
    carpet!: THREE.Mesh;
    table!: THREE.Group;
    firePlace!: THREE.Group;
    woodenShelf!: THREE.Group;
    alchemyShelf!: THREE.Group;
    bookShelfOffice!: THREE.Group;
    cauldron!: THREE.Group;
    feather!: THREE.Group;
    wizardHat!: THREE.Group;
    floorTexture!: any;
    wallTexture!: any;
    roofTexture!: any;
    smallRoofTexture!: any;
    carpetTexture!:any;
    fence!: Fence;
    stairCase!: Staircase;
    pillars!: Pillars;
    balcony!: Balcony;

    pressureBoxes: Array<THREE.Mesh> = [];

    crystal: Crystal;
    lectern: Lectern;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext ) {
        super(graphics, physics, interactions, userInterface);

        this.lectern = new Lectern(graphics, physics, interactions, userInterface, 'The Wizard\'s Office', ['In the wizard\'s room where mysteries unwind','Objects of magic, for you to find.','From feather to cauldron, place them just right,','And the hidden crystal will come to light.']);
        this.addConstruct(this.lectern);

        this.crystal = new Crystal(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.crystal);

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
        this.crystal.root.position.set(0,70,0);

        //lecturn 
        this.lectern.root.position.set(0,0,22);
        this.lectern.root.rotateY(Math.PI);

        // pillairs
        this.pillars.root.position.set(0,0,0);
        // balcony
        this.balcony.root.position.set(0,0,0);
        // stairs
        this.stairCase.root.position.set(0,0,0);
        // fence
        this.fence.root.position.set(0,0,0);
    }

    async load(): Promise<void>{

        // LOAD MODELS //
        const fallbackMat = new THREE.MeshLambertMaterial({ color: 0x800080 });
        const fallbackGeom = new THREE.BoxGeometry(1, 1, 1);

        try {
            const gltfData: any = await this.graphics.loadModel('assets/antique_wooden_desk/scene.gltf');
            this.table = gltfData.scene;
        } catch(e: any) {
            this.table = new THREE.Group();
            this.table.add(new THREE.Mesh(fallbackGeom, fallbackMat));
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/medieval_fireplace_free/scene.gltf');
            this.firePlace = gltfData.scene;
        } catch(e: any) {
            this.firePlace = new THREE.Group();
            this.firePlace.add(new THREE.Mesh(fallbackGeom, fallbackMat));
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('/assets/wooden_shelf/scene.gltf');
            this.woodenShelf = gltfData.scene;
        } catch(e: any) {
            this.woodenShelf = new THREE.Group();
            this.woodenShelf.add(new THREE.Mesh(fallbackGeom, fallbackMat));
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/alchemy_shelf/scene.gltf');
            this.alchemyShelf = gltfData.scene;
        } catch(e: any) {
            this.alchemyShelf = new THREE.Group();
            this.alchemyShelf.add(new THREE.Mesh(fallbackGeom, fallbackMat));
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/bookshelf_office/scene.gltf');
            this.bookShelfOffice = gltfData.scene;
        } catch(e: any) {
            this.bookShelfOffice = new THREE.Group();
            this.bookShelfOffice.add(new THREE.Mesh(fallbackGeom, fallbackMat));
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/cauldron/scene.gltf');
            this.cauldron = gltfData.scene;
        } catch(e: any) {
            this.cauldron = new THREE.Group();
            this.cauldron.add(new THREE.Mesh(fallbackGeom, fallbackMat));
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/feather/scene.gltf');
            this.feather = gltfData.scene;
        } catch(e: any) {
            this.feather = new THREE.Group();
            this.feather.add(new THREE.Mesh(fallbackGeom, fallbackMat));
                console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/wizard_hat/scene.gltf');
            this.wizardHat = gltfData.scene;
        } catch(e: any) {
            this.wizardHat = new THREE.Group();
            this.wizardHat.add(new THREE.Mesh(fallbackGeom, fallbackMat));
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

    //functions for pressure boxes logic

    allBoxesCorrect(): boolean {
        for (let i = 0; i < this.pressureBoxes.length; i++) {
            const box = this.pressureBoxes[i];
            if ((i === 0 && !box.children.includes(this.feather)) ||
                (i === 1 && !box.children.includes(this.wizardHat)) ||
                (i === 2 && !box.children.includes(this.cauldron))) {
                return false;
            }
        }
        return true;
    }
    
    checkPressureBoxes(placedObject: THREE.Object3D) {
        for (let i = 0; i < this.pressureBoxes.length; i++) {
            const box = this.pressureBoxes[i];
            
            if (box.children.includes(placedObject)) {
                // check if the correct object is placed on the box
                if ((i === 0 && placedObject === this.feather) ||
                    (i === 1 && placedObject === this.wizardHat) ||
                    (i === 2 && placedObject === this.cauldron)) {
                    // if correct, change colour to green
                    (box.material as THREE.MeshLambertMaterial).color.set(0x007c00);
                    // placed object is made uniteracctable
                    placedObject.userData.canInteract = false;
                    this.interactions.interactableObjects = this.interactions.interactableObjects.filter(obj => obj.object !== placedObject);
                    // no longer a pickupspot 
                    //box.userData.canPlace = false;
                } else {
                    // if incorrect box becomes un-placable 
                    //box.userData.canPlace = false;
                }
            }
        }

            //if all boxes correct: 
            if (this.allBoxesCorrect()) {
                const listener = new THREE.AudioListener();
                const sound = new THREE.Audio(listener);
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load('sound/success.mp3.mp3', (buffer) => {
                    sound.setBuffer(buffer);
                    sound.setLoop(false);
                    sound.setVolume(1);
                    sound.play();
                });
        
                // show crystal
                this.crystal.root.position.set(0,3,5);
            }
    }
    
  
    build(): void {

        // **** BUILD BASICS **** //

        // floor

        this.floor = new THREE.Mesh(new THREE.BoxGeometry(30, 0.2, 50), new THREE.MeshLambertMaterial({ map: this.floorTexture }));
        this.floor.position.set(0,-0.1,0);
        this.floor.castShadow = true;
        this.add(this.floor);
        this.physics.addStatic(this.floor,PhysicsColliderFactory.box(15, 0.1 , 25));

        // walls

        const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 20, 50), new THREE.MeshLambertMaterial({ map: this.wallTexture }));
        wallL.position.set(-15,10,0);
        this.add(wallL);
        this.physics.addStatic(wallL,PhysicsColliderFactory.box(0.5, 10 , 25));

        const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 20, 50), new THREE.MeshLambertMaterial({ map: this.wallTexture }));
        wallR.position.set(15,10,0);
        this.add(wallR);
        this.physics.addStatic(wallR,PhysicsColliderFactory.box(0.5, 10 , 25));

        const wallB = new THREE.Mesh(new THREE.BoxGeometry(30, 20, 0.1), new THREE.MeshLambertMaterial({ map: this.wallTexture }));
        wallB.position.set(0,10,-24.95);
        this.add(wallB);
        this.physics.addStatic(wallB,PhysicsColliderFactory.box(15, 10 , 0.5));

        // const wallF = new THREE.Mesh(new THREE.BoxGeometry(30, 13.2, 0.1), new THREE.MeshBasicMaterial({ map: this.wallTexture }));
        // wallF.position.set(0,6.6,24.95);
        // this.add(wallF);
        // this.physics.addStatic(wallF,PhysicsColliderFactory.box(15, 6.6 , 0.5));

        // small room walls 

        const wallLf = new THREE.Mesh(new THREE.BoxGeometry(10, 20, 0.1), new THREE.MeshLambertMaterial({ map: this.wallTexture }));
        wallLf.position.set(10,10,-14.7);
        this.add(wallLf);
        this.physics.addStatic(wallLf,PhysicsColliderFactory.box(6, 10 , 0.5));

        const wallRf = new THREE.Mesh(new THREE.BoxGeometry(10, 20, 0.1), new THREE.MeshLambertMaterial({ map: this.wallTexture }));
        wallRf.position.set(-10,10,-14.7);
        this.add(wallRf);
        this.physics.addStatic(wallRf,PhysicsColliderFactory.box(6, 10, 0.5));

        // small room roof

        const smallRoof = new THREE.Mesh(new THREE.BoxGeometry(30, 0.5, 10.5), new THREE.MeshLambertMaterial({ map: this.smallRoofTexture }));
        smallRoof.position.set(0,5.24,-20);
        smallRoof.castShadow = true;
        this.add(smallRoof);
        this.physics.addStatic(smallRoof,PhysicsColliderFactory.box(15, 0.25 , 5.25));

        // large room roof

        const largeRoof = new THREE.Mesh(new THREE.BoxGeometry(30, 0.5, 50), new THREE.MeshLambertMaterial({ map: this.roofTexture }));
        largeRoof.position.set(0,20,0);
        largeRoof.castShadow = true;
        this.add(largeRoof);
        this.physics.addStatic(largeRoof,PhysicsColliderFactory.box(15, 0.25 , 25));

        // upper room floor

        const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(30, 0.1, 10.5), new THREE.MeshLambertMaterial({ map: this.floorTexture }));
        upperFloor.position.set(0,5.47,-20);
        upperFloor.castShadow = true;
        this.add(upperFloor);

        // invisible blocks

        const rightBlock = new THREE.Mesh(new THREE.BoxGeometry(2.5, 13.2, 6) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        rightBlock.position.set(14.1, 6.6, -11.5);
        this.add(rightBlock);
        this.physics.addStatic(rightBlock,PhysicsColliderFactory.box(2, 6.6 , 3.5));
        rightBlock.removeFromParent();

        const leftBlock = new THREE.Mesh(new THREE.BoxGeometry(2.5, 13.2, 6) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        leftBlock.position.set(-14.1, 6.6, -11.5);
        this.add(leftBlock);
        this.physics.addStatic(leftBlock,PhysicsColliderFactory.box(2, 6.6 , 3.5));
        leftBlock.removeFromParent();

        const pillarLeftBlock = new THREE.Mesh(new THREE.BoxGeometry(1, 5.8, 3) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        pillarLeftBlock.position.set(-7, 2.9 , -11);
        this.add(pillarLeftBlock);
        this.physics.addStatic(pillarLeftBlock,PhysicsColliderFactory.box(0.6, 2.9 , 1.7));
        pillarLeftBlock.removeFromParent();

        const rightPillarBlock = new THREE.Mesh(new THREE.BoxGeometry(1, 5.8, 3) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        rightPillarBlock.position.set(7, 2.9 , -11);
        this.add(rightPillarBlock);
        this.physics.addStatic(rightPillarBlock,PhysicsColliderFactory.box(0.6, 2.9 , 1.7));
        rightPillarBlock.removeFromParent();


        // Lighting

        const roomLight = new THREE.PointLight(0xfae5ac, 20,  80, 0.1);
        roomLight.position.set(0, 17, 10);
        roomLight.castShadow = true;
        this.add(roomLight);

        const backroomLight = new THREE.PointLight(0xfae5ac, 10, 40, 0.1);
        backroomLight.position.set(0, -1, -19);
        backroomLight.castShadow = true;
        this.add(backroomLight);

        const upstairsLight = new THREE.PointLight(0xfae5ac, 20, 60, 0.1);
        upstairsLight.position.set(0, 19, -19);
        upstairsLight.castShadow = true;
        this.add(upstairsLight);

        // **** BUILD MODELS **** //

        // bookShelfOffice

        this.bookShelfOffice.scale.set(2,2,2); 
        this.bookShelfOffice.position.set(14.2, 0, 20);
        this.bookShelfOffice.rotateY(-Math.PI);
        this.bookShelfOffice.castShadow = true;
        this.add(this.bookShelfOffice);

        const secondBookShelfOffice = this.bookShelfOffice.clone();
        secondBookShelfOffice.scale.set(2,2,2); 
        secondBookShelfOffice.position.set(-14.2,0,-19);
        secondBookShelfOffice.rotateY(Math.PI);
        secondBookShelfOffice.castShadow = true;
        this.add(secondBookShelfOffice);

        //  -- bookShelfOffice Physics --

        const bookShelfOfficePhysics = new THREE.Mesh(new THREE.BoxGeometry(1.35, 4.6, 3.4) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        bookShelfOfficePhysics.position.set(14.1, 2.3, 20);
        this.add(bookShelfOfficePhysics);
        this.physics.addStatic(bookShelfOfficePhysics,PhysicsColliderFactory.box(0.675, 2.3 , 1.7));
        bookShelfOfficePhysics.removeFromParent();

        const secondBookShelfOfficePhysics = new THREE.Mesh(new THREE.BoxGeometry(1.35, 4.6, 3.4) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        secondBookShelfOfficePhysics.position.set(-14.1, 2.3, -19);
        this.add(secondBookShelfOfficePhysics);
        this.physics.addStatic(secondBookShelfOfficePhysics,PhysicsColliderFactory.box(0.675, 2.3 , 1.7));
        secondBookShelfOfficePhysics.removeFromParent();

        // alchemyShelf

        this.alchemyShelf.scale.set(0.003,0.003,0.003); 
        this.alchemyShelf.position.set(14.2, 3, 7);
        this.alchemyShelf.rotateY(Math.PI);
        this.alchemyShelf.castShadow = true;
        this.add(this.alchemyShelf);

        const alchemyShelf2 = this.alchemyShelf.clone();
        alchemyShelf2.position.set(14.2, 3, -20);
        alchemyShelf2.castShadow = true;
        this.add(alchemyShelf2);

        //  -- alchemyShelf Physics --

        const alchemyShelfPhysics = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.7, 2.7) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        alchemyShelfPhysics.position.set(14.3, 3.2, 7);
        this.add(alchemyShelfPhysics);
        this.physics.addStatic(alchemyShelfPhysics,PhysicsColliderFactory.box(0.825, 1.35 , 1.35));
        alchemyShelfPhysics.removeFromParent();

        const alchemyShelf2Physics = new THREE.Mesh(new THREE.BoxGeometry(1.65, 2.7, 2.7) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        alchemyShelf2Physics.position.set(14.3, 3.2, -20);
        this.add(alchemyShelf2Physics);
        this.physics.addStatic(alchemyShelf2Physics,PhysicsColliderFactory.box(0.825, 1.35 , 1.35));
        alchemyShelf2Physics.removeFromParent();

        // firePlace

        this.firePlace.scale.set(0.01,0.01,0.01); 
        this.firePlace.position.set(0, 1.3, -23.9);
        this.firePlace.castShadow = true;
        this.add(this.firePlace);

        //  -- firePlace Physics --

        const firePlacePhysics = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3, 1) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
        firePlacePhysics.position.set(0, 1.5, -24.4);
        this.add(firePlacePhysics);
        this.physics.addStatic(firePlacePhysics,PhysicsColliderFactory.box(1.2, 1.5 , 0.5));
        firePlacePhysics.removeFromParent();

        // table

        this.table.scale.set(2,2,2); 
        this.table.position.set(0, 0, 5);
        this.table.rotateY(-Math.PI/2);
        this.table.castShadow = true;
        this.add(this.table);

        const upstairsTable = this.table.clone();
        upstairsTable.position.set(0,5.45,-20);
        upstairsTable.castShadow = true;
        this.add(upstairsTable);

         //  -- table Physics --

         const tablePhysics = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.55, 2.2) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
         tablePhysics.position.set(0, 0.82, 5);
         this.add(tablePhysics);
         this.physics.addStatic(tablePhysics,PhysicsColliderFactory.box(2.4, 1.1 , 1.3));
         tablePhysics.removeFromParent();


         const upstairsTablePhysics = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.55, 2.2) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
         upstairsTablePhysics.position.set(0, 6.25, -20);
         this.add(upstairsTablePhysics);
         this.physics.addStatic(upstairsTablePhysics,PhysicsColliderFactory.box(2.4, 1.1 , 1.3));
         upstairsTablePhysics.removeFromParent();

        // carpet

        this.carpet = new THREE.Mesh(new THREE.BoxGeometry(7, 0.01, 5), new THREE.MeshLambertMaterial({ map: this.carpetTexture }));
        this.carpet.position.set(0,0,5);
        this.carpetTexture.receiveShadow = true;
        this.add(this.carpet);
        this.physics.addStatic(this.floor,PhysicsColliderFactory.box(15, 0.1 , 25));

        const secondCarpet = this.carpet.clone();
        secondCarpet.position.set(0, 5.53, -20);
        secondCarpet.receiveShadow = true;
        this.add(secondCarpet);


         ///// Interactable Objects //////

         // initial positions

         const featherPositions = [
            { x: 0.6, y: 1.7, z: 4.2 },
            { x: 14, y: 0.2, z: 15 },
            { x: -14, y: 0.2, z: -6 },
         ];
         const selectedFeatherPosition = featherPositions[Math.floor(Math.random() * 3)];

         this.feather.scale.set(0.02,0.02,0.02); 
         this.feather.position.set(
            selectedFeatherPosition.x,
            selectedFeatherPosition.y,
            selectedFeatherPosition.z
        );
         this.feather.rotateX(Math.PI/2);
         this.add(this.feather);
         this.interactions.addPickupObject(this.feather, 4, 0.04, () => {});

         const hatPositions = [
            { x: 8, y: 6.8, z: -18 },
            { x: -13, y: 6.8, z: -15 },
            { x: 3, y: 6.8, z: -8 },
         ];
         const selectedHatPosition = hatPositions[Math.floor(Math.random() * 3)];
 
         this.wizardHat.scale.set(2.5,2.5,2.5); 
         this.wizardHat.position.set(
            selectedHatPosition.x,
            selectedHatPosition.y,
            selectedHatPosition.z
         );
         this.add(this.wizardHat);
         this.interactions.addPickupObject(this.wizardHat, 4, 2.5, () => {});

         const cauldronPositions = [
            { x: -13, y: 0, z: -23 },
            { x: 2, y: 0, z: -24 },
            { x: 13, y: 0, z: -17 },
         ];
         const selecteCauldronPositions = cauldronPositions[Math.floor(Math.random() * 3)];
 
         this.cauldron.scale.set(0.04,0.04,0.04); 
         this.cauldron.position.set(
            selecteCauldronPositions.x,
            selecteCauldronPositions.y,
            selecteCauldronPositions.z
         );
         this.add(this.cauldron);
         this.interactions.addPickupObject(this.cauldron, 3, 0.04, () => {});


        // create the pressure boxes
        for (let i = 0; i < 4; i++) {
            if( i != 3){ 
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(2, 0.2, 2),
                new THREE.MeshLambertMaterial({ color: 0x7c0000 }) // initial color: red
            );
            box.position.set(-3 +(i * 3), 0.1, 14);
            this.add(box);
            this.pressureBoxes.push(box);
            
            this.interactions.addPickupSpot(box, 3, (placedObject: THREE.Object3D) => {
                box.add(placedObject);
                placedObject.position.set(0,0.5,0);

                if ((placedObject === this.feather)){
                    placedObject.position.set(0,0.4,-0.7);
                    placedObject.scale.set(0.02,0.02,0.02); 
                } else if (placedObject == this.cauldron) {
                    placedObject.position.set(0,0.5,0);
                    placedObject.scale.set(0.04,0.04,0.04); 
                } else {
                    placedObject.position.set(0,1,3.4);
                    placedObject.scale.set(2.5,2.5,2.5) ;
                }
                    
                this.checkPressureBoxes(placedObject);
            });

        } else {
            // add a fourh pickup spot elswhere for swaps
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(2, 0.2, 2),
                new THREE.MeshLambertMaterial({ color: 0xFFA500 }) 
            );
            box.position.set(-10, 0.1, 12);
            this.add(box);
            this.interactions.addPickupSpot(box, 3, (placedObject: THREE.Object3D) => {
                box.add(placedObject);
                placedObject.position.set(0,0.5,0);
                if ((placedObject === this.feather)){
                    placedObject.position.set(0,0.4,-0.7);
                    placedObject.scale.set(0.02,0.02,0.02); 
                } else if (placedObject == this.cauldron) {
                    placedObject.position.set(0,0.5,0);
                    placedObject.scale.set(0.04,0.04,0.04); 
                } else {
                    placedObject.position.set(0,1,3.4);
                    placedObject.scale.set(2.5,2.5,2.5) ;
                }
            });
            
        }

        }

    }
    update(): void {
    }

    destroy(): void {
    }
}
