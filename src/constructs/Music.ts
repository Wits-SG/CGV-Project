import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext,
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

    player: Player;
    crystal!: Crystal;
    

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, player: Player) {
        super(graphics, physics, interactions);
        this.player = player;
        this.crystal = new Crystal(this.graphics, this.physics, this.interactions);
        this.addConstruct(this.crystal);
    }
     // Check if order array size = number of instruments  --> done first for performance optimisation
            // then check if instruments are in correct order --> done second for performance optimisation
                // then spawn crystal
    checkPuzzle(puzzle:Array<Number>, userPuzzle:Array<Number>){
        const listener = new THREE.AudioListener();
        this.player.root.add( listener );
        const sound = new THREE.Audio( listener );
        const audioLoader = new THREE.AudioLoader();


        if(userPuzzle.length == puzzle.length){
            let result: boolean = true;
            for(let i=0; i<puzzle.length; i++){
                result = result && userPuzzle[i] == puzzle[i];
            }
            if(result){
                //will put victory sound here and the crystal thing
                console.log("Success!");
                this.crystal.root.position.set(0,3,0);
                audioLoader.load( 'sound/success.mp3', function( buffer ) {
                    sound.setBuffer( buffer );
                    sound.setLoop( false );
                    sound.setVolume( 0.5 );
                    
                    sound.play();
                });
                

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
        let puzzle: Array<Number> =[];
        let n: number =0;
        
        while(puzzle.length < 3){
            n = Math.floor(Math.random()*3);
            if(puzzle.indexOf(n) === -1) puzzle.push(n);
        }
        // for(let i=0; i< 3; i++){
        //     n = Math.floor(Math.random()*3);

        //     while(!puzzle.includes(n)){
        //         n = Math.floor(Math.random()*3);
        //         puzzle.push(n);
        //     }
        // }
        console.log(puzzle);
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

        // Wall and roof parameters
        //const wallMat = new THREE.MeshLambertMaterial({ map: this.wallTexture});
        const backWallGeom = new THREE.BoxGeometry(60,20,1);
        const sideWallGeom = new THREE.BoxGeometry(1,20,60);

        const backWall = new THREE.Mesh(backWallGeom);
        const sideWallLeft = new THREE.Mesh(sideWallGeom);
        const sideWallRight = new THREE.Mesh(sideWallGeom);

        sideWallLeft.position.set(-29.5,10,0);
        sideWallRight.position.set(29.5,10,0);
        backWall.position.set(0,10,30);

        this.physics.addStatic(sideWallLeft, PhysicsColliderFactory.box(1, 10, 30));
        this.physics.addStatic(sideWallRight, PhysicsColliderFactory.box(1, 10, 30));
        this.physics.addStatic(backWall, PhysicsColliderFactory.box(30, 10, 1));

        const roofLight = new THREE.PointLight(0xffffff, 2, 100 ,0);
        roofLight.position.set(0,19,0);
        const roofGeom = new THREE.PlaneGeometry(60,60);
        const roof = new THREE.Mesh(roofGeom);
        roof.rotation.set(Math.PI/2, 0, 0);
        roof.position.set(0,20,0);

        
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
        
            if(userPuzzle.length == puzzle.length){
                let result: boolean = true;
                for(let i=0; i<puzzle.length; i++){
                    result = result && userPuzzle[i] == puzzle[i];
                }
                if(result){
                    //will put victory sound here and the crystal thing
                    console.log("Success!");
                    this.crystal.root.position.set(0,3,0);
                    audioLoader.load( 'sound/success.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( false );
                        sound.setVolume( 0.5 );
                        
                        sound.play();
                    });
                    
    
                } else{
                    console.log("Wrong");
                    
                   userPuzzle =[];
                }
                
            }
            console.log(userPuzzle);
            
            
            
        });

        //PIANO
        const pianoGeom = new THREE.BoxGeometry(3, 2, 3); 
        const pianoBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        
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
                
             
            if(userPuzzle.length == puzzle.length){
                let result: boolean = true;
                for(let i=0; i<puzzle.length; i++){
                    result = result && userPuzzle[i] == puzzle[i];
                }
                if(result){
                    //will put victory sound here and the crystal thing
                    console.log("Success!");
                    this.crystal.root.position.set(0,3,0);
                    audioLoader.load( 'sound/success.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( false );
                        sound.setVolume( 0.5 );
                        
                        sound.play();
                    });
                    
    
                } else{
                    console.log("Wrong");
                    
                   userPuzzle =[];
                   
                }
                
            }
            
            console.log(userPuzzle);

                
        });

        //GRAMOPHONE
        const gramGeom = new THREE.BoxGeometry(3, 2, 3); 
        const gramBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
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
            
            
            if(userPuzzle.length == puzzle.length){
                let result: boolean = true;
                for(let i=0; i<puzzle.length; i++){
                    result = result && userPuzzle[i] == puzzle[i];
                }
                if(result){
                    //will put victory sound here and the crystal thing
                    this.crystal.root.position.set(0,3,0);
                    audioLoader.load( 'sound/success.mp3', function( buffer ) {
                        sound.setBuffer( buffer );
                        sound.setLoop( false );
                        sound.setVolume( 0.5 );
                        
                        sound.play();
                    });
                    
    
                } else{
                    
                   userPuzzle =[];
                }
                
            }
           
        });

       //STAND
       const standGeom = new THREE.BoxGeometry(2, 2, 2); 
       const standBoxMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      
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
        this.add(sideWallLeft);
        this.add(sideWallRight);
        this.add(backWall);
        this.add(roof);
    } //all geometry (where place objects)

    update() {}

    destroy() {}

}