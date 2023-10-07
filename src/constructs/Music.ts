import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, 
    PhysicsColliderFactory } from '../lib/index';
import { Player } from './Player';
import { InteractManager } from '../lib/w3ads/InteractManager';
    
export class MusicConstruct extends Construct{

   

    floor!: THREE.Mesh;
    carpet!: THREE.MeshLambertMaterial;
    carpetData!: any;

    //Music instruments
    guitar!: THREE.Group;
    gram!: THREE.Group;
    piano!: THREE.Group;
    conductorStand!: THREE.Group;
    phone!: THREE.Group;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager) {
        super(graphics, physics, interactions);

        
    }

    create() {}

    async load():Promise<void>{ //

    
        try{ //Carpet
            this.carpetData = await this.graphics.loadTexture('assets/music/carpet2.png');
        }catch(e){
            console.error(e);
        }

        // try {//guitar object
        //     const gltfData: any = await this.graphics.loadModel('assets/music/acoustic_guitar/scene.gltf');
        //     this.guitar = gltfData.scene;
        // } catch (e: any) {
        //     console.error(e);
        // }

        // try {//piano object
        //     const gltfData: any = await this.graphics.loadModel('assets/music/piano_low_poly/scene.gltf');
        //     this.piano = gltfData.scene;
        // } catch (e: any) {
        //     console.error(e);
        // }

        // try {//gramophone object
        //     const gltfData: any = await this.graphics.loadModel('assets/music/gramophone/scene.gltf');
        //     this.gram = gltfData.scene;
        // } catch (e: any) {
        //     console.error(e);
        // }

        try {//gramophone object
            const gltfData: any = await this.graphics.loadModel('assets/music/manhasset_music_stand/scene.gltf');
            this.conductorStand = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        // try {//phone object
        //     const gltfData: any = await this.graphics.loadModel('assets/phone/scene.gltf');
        //     this.phone = gltfData.scene;
        // } catch (e: any) {
        //     console.error(e);
        // }


    }

    build() {
        const geometry = new THREE.BoxGeometry(60,1,60);
       
        //carpet plane 
        
        this.carpet = new THREE.MeshLambertMaterial({ map: this.carpetData, side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, this.carpet);
        this.floor.position.set(0,0,0);
        this.physics.addStatic(this.floor, PhysicsColliderFactory.box(30, 0.5, 30)); 


        //phone
        // const tempPhone = this.phone.clone();
        // tempPhone.position.set(0, 10, -2);
        // tempPhone.rotation.set(-Math.PI/2, Math.PI/4, 0);
        // tempPhone.scale.set(1,1,1);
        // 
        // this.floor.add(tempPhone);

        const guitarGeom = new THREE.BoxGeometry(3, 2, 3); 
        const guitarBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const guitarBoxMatBlue = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const guitarBox = new THREE.Mesh(guitarGeom, guitarBoxMat);
        guitarBox.position.set(0, 2, 25);
        guitarBox.rotation.set(0, Math.PI/4, 0);
        this.floor.add(guitarBox);
        this.physics.addStatic(guitarBox, PhysicsColliderFactory.box(1.5, 1, 1.5));

        this.interactions.addInteractable(guitarBox, 5, () => {
            // Play sound, and add instrument to order array

            if (guitarBox.material == guitarBoxMat)
                guitarBox.material = guitarBoxMatBlue;
            else
                guitarBox.material = guitarBoxMat;


            // Check if order array size = number of instruments  --> done first for performance optimisation
            // then check if instruments are in correct order --> done second for performance optimisation
            // then spawn crystal
        })

        // this.conductorStand.position.set(0, 2, 25);
        // this.floor.add(this.conductorStand);
        // phoneBox.removeFromParent();
        // this.add(phoneBox);

        //Add guitar
        // const tempGuitar = this.guitar.clone();
        // tempGuitar.position.set(-20.5, -10.5, -0.6);
        // tempGuitar.rotation.set(-Math.PI/2, Math.PI/4, 0);
        // tempGuitar.scale.set(0.2,0.2,0.2);
        // this.floor.add(this.guitar);

        // const tempPiano = this.piano.clone();
        // tempPiano.position.set(-1.5, -15.5, -0.6);
        // tempPiano.rotation.set(-Math.PI/2, Math.PI/2, 0);
        // tempPiano.scale.set(1.5,1.5,1.5);
        // this.floor.add(tempPiano);

        // const tempGram = this.gram.clone();
        // tempGram.position.set(20, -15, 0);
        // tempGram.rotation.set(-Math.PI/2, -3*Math.PI/4, 0);
        // tempGram.scale.set(15,15,15);
        // this.floor.add(tempGram);

        // const tempStand = this.conductorStand.clone();
        // tempStand.position.set(0,5,-1);
        // tempStand.rotation.set(-Math.PI/2,Math.PI, 0);
        // tempStand.scale.set(0.5,0.5,0.5);
        // this.floor.add(tempStand);

        // // Add point lights at the corners of board
        // const cornerLight1 = new THREE.PointLight(0xffffff, 500, 100);
        // cornerLight1.position.set(-20, -20, -20); // Adjust the position as per your needs
        // this.floor.add(cornerLight1);

        // const cornerLight2 = new THREE.PointLight(0xffffff, 500, 100);
        // cornerLight2.position.set(20, -10, -10); 
        // this.floor.add(cornerLight2);

        // const cornerLight3 = new THREE.PointLight(0xffffff, 500, 100);
        // cornerLight3.position.set(-15, 15, -10); 
        // this.floor.add(cornerLight3);

        // const cornerLight4 = new THREE.PointLight(0xffffff, 500, 100);
        // cornerLight4.position.set(15, 15, -10); 
        // this.floor.add(cornerLight4);

        // const middleLight = new THREE.PointLight(0xffffff, 500, 100);
        // middleLight.position.set(0,0,-10);
        // this.floor.add(middleLight);



        this.add(this.floor);
    } //all geometry (where place objects)

    update() {}

    destroy() {}

}