import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, GraphicsPrimitiveFactory, 
    PhysicsColliderFactory } from '../lib/index';
import { Player } from './Player';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { Crystal } from './Crystal';
export class MusicConstruct extends Construct{

   

    floor!: THREE.Mesh;
    carpetData!: any;

    //Music instruments
    guitar!: THREE.Group;
    gram!: THREE.Group;
    piano!: THREE.Group;
    conductorStand!: THREE.Group;
    phone!: THREE.Group;

    player!: Player;
    crystal!: Crystal;
    

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager) {
        super(graphics, physics, interactions);
        this.player = new Player(this.graphics, this.physics, this.interactions);
        this.addConstruct(this.player);
        this.crystal = new Crystal(this.graphics, this.physics, this.interactions);
        this.addConstruct(this.crystal);
        
    }
     // Check if order array size = number of instruments  --> done first for performance optimisation
            // then check if instruments are in correct order --> done second for performance optimisation
                // then spawn crystal
    checkPuzzle(puzzle:Array<Number>, userPuzzle:Array<Number>){

        if(userPuzzle.length == puzzle.length){
            let result: boolean = true;
            for(let i=0; i<puzzle.length; i++){
                result = result && userPuzzle[i] == puzzle[i];
            }
            if(result){
                //will put victory sound here and the crystal thing
                console.log("Success!");
                this.crystal.root.position.set(0,3,0);
            } else{
                console.log("Wrong");
                userPuzzle =[];
            }
        }
    }

    create() {}

    async load():Promise<void>{ //
        
    
        try{ //Carpet
            this.carpetData = await this.graphics.loadTexture('assets/music/carpet2.png');
        }catch(e){
            console.error(e);
        }

        try {//guitar object
            const gltfData: any = await this.graphics.loadModel('assets/music/acoustic_guitar/scene.gltf');
            this.guitar = gltfData.scene;
            this.guitar.userData.instrumentid = 0;
        } catch (e: any) {
            console.error(e);
        }

        try {//piano object
            const gltfData: any = await this.graphics.loadModel('assets/music/piano_low_poly/scene.gltf');
            this.piano = gltfData.scene;
            this.piano.userData.instrumentid = 1;
        } catch (e: any) {
            console.error(e);
        }

        try {//gramophone object
            const gltfData: any = await this.graphics.loadModel('assets/music/gramophone/scene.gltf');
            this.gram = gltfData.scene;
            this.gram.userData.instrumentid = 2;
        } catch (e: any) {
            console.error(e);
        }

        try {//stand object
            const gltfData: any = await this.graphics.loadModel('assets/music/manhasset_music_stand/scene.gltf');
            this.conductorStand = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }


    }

    build() {
        
        this.crystal.root.position.set(0,-10,0);
        const puzzle = [0, 1, 2];
        let userPuzzle: Array<Number> = [];
        
        
        // create an AudioListener and add it to the camera
        const listener = new THREE.AudioListener();
        this.player.root.add( listener );

        // create a global audio source
        const sound = new THREE.Audio( listener );

        // load a sound and set it as the Audio object's buffer
        const audioLoader = new THREE.AudioLoader();


        
        const geometry = new THREE.BoxGeometry(60,1,60);
        
        //carpet plane 
        
        const carpet = new THREE.MeshLambertMaterial({ map: this.carpetData, side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, carpet);
        this.floor.position.set(0,0,0);
        this.physics.addStatic(this.floor, PhysicsColliderFactory.box(30, 0.5, 30)); 


        
        //Guitar
        const guitarGeom = new THREE.BoxGeometry(3, 2, 3); 
        const guitarBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const guitarBox = new THREE.Mesh(guitarGeom, guitarBoxMat);
        guitarBox.position.set(-10, 1, 4);
        
        this.guitar.position.set(-10,1,4);
        this.guitar.scale.set(0.05,0.05,0.05);
        this.guitar.rotation.set(0,3*Math.PI/4,0);
        this.floor.add(this.guitar);
        
        this.physics.addStatic(guitarBox, PhysicsColliderFactory.box(1.5, 1, 1.5));

        this.interactions.addInteractable(guitarBox, 5, () => {
            // Play sound, and add instrument to order array

           
            audioLoader.load( 'sound/guitar-riff-159089.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( false );
                sound.setVolume( 0.5 );
                sound.play();
            });
            
            if(!userPuzzle.includes(this.guitar.userData.instrumentid)){
                userPuzzle.push(this.guitar.userData.instrumentid);
            }
            
            this.checkPuzzle(puzzle, userPuzzle);
            
            
        });

        //PIANO
        const pianoGeom = new THREE.BoxGeometry(3, 2, 3); 
        const pianoBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const pianoBoxMatBlue = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const pianoBox = new THREE.Mesh(pianoGeom, pianoBoxMat);
        pianoBox.position.set(0, 1, 4);

        this.piano.position.set(0,1,4);
        this.piano.scale.set(0.5,0.5,0.5);
        this.piano.rotation.set(0, -Math.PI/2,0);
        this.floor.add(this.piano);
        //this.floor.add(pianoBox);
        this.physics.addStatic(pianoBox, PhysicsColliderFactory.box(1.5, 1, 1.5));

        
        this.interactions.addInteractable(this.piano, 5, () => {
            // Play sound, and add instrument to order array

            
            audioLoader.load( 'sound/piano-g-6200.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( false );
                sound.setVolume( 0.5 );
                 sound.play();
            });
            if(!userPuzzle.includes(this.piano.userData.instrumentid)){
                userPuzzle.push(this.piano.userData.instrumentid);
            }
                
             
            this.checkPuzzle(puzzle, userPuzzle);
                

                
        });

        //GRAMOPHONE
        const gramGeom = new THREE.BoxGeometry(3, 2, 3); 
        const gramBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const gramBoxMatBlue = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const gramBox = new THREE.Mesh(gramGeom, gramBoxMat);
        gramBox.position.set(10, 1, 4);
        this.gram.position.set(10,1,4);
        this.gram.scale.set(5,5,5);
        this.gram.rotation.set(0,3*Math.PI/4,0);
        //this.floor.add(gramBox);
        this.floor.add(this.gram);

        this.physics.addStatic(gramBox, PhysicsColliderFactory.box(1.5, 1, 1.5));
        
        this.interactions.addInteractable(gramBox, 5, () => {
            // Play sound, and add instrument to order array

           
            audioLoader.load( 'sound/129109437-vintage-tunes-no3-016.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( false );
                sound.setVolume( 0.5 );
                
                sound.play();
            });
            
            if(!userPuzzle.includes(this.gram.userData.instrumentid)){
                userPuzzle.push(this.gram.userData.instrumentid);
            }
            
            
            this.checkPuzzle(puzzle,userPuzzle);
            


           
        });

       //STAND
       const standGeom = new THREE.BoxGeometry(2, 2, 2); 
       const standBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
       const standBoxMatBlue = new THREE.MeshLambertMaterial({ color: 0x0000ff });
       const standBox = new THREE.Mesh(standGeom, standBoxMat);
       standBox.position.set(0, 1, -8);
       this.conductorStand.position.set(0 , 1 ,-8);
       this.conductorStand.scale.set(0.1,0.1,0.1)
       this.floor.add(this.conductorStand);
       //this.floor.add(standBox)
       
       this.physics.addStatic(standBox, PhysicsColliderFactory.box(1, 1, 1));

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

        

        this.add(this.floor);
    } //all geometry (where place objects)

    update() {}

    destroy() {}

}