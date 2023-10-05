import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, 
    PhysicsColliderFactory } from '../lib/index';
    
export class MusicConstruct extends Construct{
    floor!: THREE.Mesh
    carpet!: THREE.MeshLambertMaterial;
    carpetData!: any;

    //Music instruments
    guitar!: THREE.Group;
    cello!: THREE.Group;
    piano!: THREE.Group;
    conductorStand!: THREE.Group;

    constructor(graphics: GraphicsContext, physics: PhysicsContext) {
        super(graphics, physics);
    }

    create() {}

    async load():Promise<void>{ //

    
        try{ //Carpet
            this.carpetData = await this.graphics.loadTexture('public/assets/music/carpet2.png');
        }catch(e){
            console.error(e);
        }

        try {//guitar object
            const gltfData: any = await this.graphics.loadModel('public/assets/music/acoustic_guitar/scene.gltf');
            this.guitar = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }
    }

    build() {
        const geometry = new THREE.BoxGeometry(60,60,1);
       
        //carpet plane 
        
        this.carpet = new THREE.MeshLambertMaterial({ map: this.carpetData, side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, this.carpet);
        this.floor.rotation.set(Math.PI/2,0,0);
        this.floor.position.set(0,0,0);
        this.graphics.add(this.floor);


        //Add guitar
        const tempGuitar = this.guitar.clone();
        tempGuitar.position.set(-15.5, -7.5, -0.6);
        tempGuitar.rotation.set(-Math.PI/2, Math.PI/4, 0);
        tempGuitar.scale.set(0.2,0.2,0.2);
        this.floor.add(tempGuitar);



        // Add point lights at the corners of board
        const cornerLight1 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight1.position.set(-20, -20, -20); // Adjust the position as per your needs
        this.floor.add(cornerLight1);

        const cornerLight2 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight2.position.set(20, -10, -10); 
        this.floor.add(cornerLight2);

        const cornerLight3 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight3.position.set(-15, 15, -10); 
        this.floor.add(cornerLight3);

        const cornerLight4 = new THREE.PointLight(0xffffff, 500, 100);
        cornerLight4.position.set(15, 15, -10); 
        this.floor.add(cornerLight4);

        const middleLight = new THREE.PointLight(0xffffff, 500, 100);
        middleLight.position.set(0,0,-10);
        this.floor.add(middleLight);
        



    } //all geometry (where place objects)

    update() {}

    destroy() {}

}