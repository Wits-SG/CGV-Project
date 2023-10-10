import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import { CrystalDoor } from './CrystalDoor';
import { Player } from './Player';
import { StatuesConstruct } from './Statues';
import { MirrorRoom } from './MirrorRoom';
import { MusicConstruct } from './Music';
import { OfficeConstruct } from './OfficeConstruct';

export class MainLibraryConstruct extends Construct {

    lightHemisphere!: THREE.HemisphereLight;
    lightDirectional!: THREE.DirectionalLight;
    walls!: Array<THREE.Mesh>;
    floors!: Array<THREE.Mesh>;
    ceilings!: Array<THREE.Mesh>;
    bookShelfs!: Array<THREE.Group>;
    FbookShelfs!: Array<THREE.Group>;
    bookshelf!: THREE.Group;
    floorTexture!: THREE.MeshBasicMaterial;
    ceilingTexture!: THREE.MeshBasicMaterial;
    wallsTexture!: THREE.MeshBasicMaterial;
    textureFloorData!: any;
    textureCeilingData!: any;
    textureWallsData!: any;
    character!:THREE.Mesh;
    table!: THREE.Group;
    tables!: Array<THREE.Group>;
    Lamp!: THREE.Group;
    TableGeometry!: THREE.BufferGeometry;
    TableMaterial!: THREE.MeshNormalMaterial;

    // Game loop nonsense
    player: Player;
    numCrystals: number;
    exitDoor: CrystalDoor;

    // Puzzles
    chess: StatuesConstruct;
    mirror: MirrorRoom;
    music: MusicConstruct;
    office: OfficeConstruct;


    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, numCrystals: number, player: Player) {
        super(graphics, physics, interactions, userInterface);

        this.player = player;
        this.numCrystals = numCrystals;

        this.exitDoor = new CrystalDoor(this.graphics, this.physics, this.interactions, this.userInterface, this.numCrystals);
        this.addConstruct(this.exitDoor);

        this.chess = new StatuesConstruct(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.chess);

        this.mirror = new MirrorRoom(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.mirror);

        this.music = new MusicConstruct(this.graphics, this.physics, this.interactions, this.userInterface, this.player);
        this.addConstruct(this.music);

        this.office = new OfficeConstruct(this.graphics, this.physics, this.interactions, this.userInterface);
        // this.addConstruct(this.office);
    }

    /*      const tempBookShelf = this.bookshelf.clone();
            tempBookShelf.rotation.set(0,Math.PI/4,0);
            tempBookShelf.scale.set(3,3,3);
            tempBookShelf.position.set(bookShelfsVertices[i][0],bookShelfsVertices[i][1],bookShelfsVertices[i][2]);
            this.physics.addStatic(tempBookShelf,PhysicsColliderFactory.box(1, 1,1));
            this.graphics.add(tempBookShelf);
            this.bookShelfs.push(tempBookShelf);*/




    drawTables(TableGeometry:THREE.BufferGeometry){
        const position = new THREE.Vector3();
		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3();
        const matrix = new THREE.Matrix4();

        matrix.compose( position, quaternion, scale );

        const mesh = new THREE.InstancedMesh( TableGeometry, this.TableMaterial, 40);
        position.z = -100;
        for ( let i = 0; i < 40; i ++ ) {
            if(i<20){
                position.x = -2.5;
                position.y = -8.75;
                position.z = position.z+20;
                scale.x = scale.y = scale.z = 0.025;
                //quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0),Math.PI);
                quaternion.setFromEuler(new THREE.Euler( 0, Math.PI/2, Math.PI, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
            }
            if(i>=20){
                if(i==20){position.z = -100;}
                position.x = 2.5;
                position.y = -8.75;
                position.z = position.z+20;
                scale.x = scale.y = scale.z = 0.025;
                //quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0),Math.PI);
                quaternion.setFromEuler(new THREE.Euler( 0, Math.PI/2, Math.PI, 'XYZ' ));
                matrix.compose( position, quaternion, scale );
                mesh.setMatrixAt( i, matrix );
            }
        }
        this.physics.addStatic(mesh,PhysicsColliderFactory.box(2, 2, 2));
        this.graphics.add(mesh);
    }



    create() {
        this.exitDoor.root.position.set(0, 0 , -113.5);
        this.chess.root.position.set(100, -10.5, 43.3);
        this.chess.root.rotation.set(0, Math.PI, 0);
        this.mirror.root.position.set(110, -11, -12);
        this.mirror.root.rotation.set(0, Math.PI / 2, 0);
        this.music.root.position.set(190, -11, 0);
        this.music.root.rotation.set(0, Math.PI / 2, 0);
        this.office.root.position.set(-180, -11, 0);
        this.office.root.rotation.set(0, Math.PI / 2, 0);

    }

    async load(): Promise<void>{
        /*try {
            const gltfData: any = await this.graphics.loadModel('assets/BookShelf/scene.gltf');
            this.bookshelf = gltfData.scene;
        } catch(e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Desk_Lamp/scene.gltf');
            this.Lamp = gltfData.scene;
        } catch(e: any) {
            console.error(e);
        }


        try {
            var glTFGeometry = new THREE.BufferGeometry();
            var gltfMaterial = new THREE.MeshNormalMaterial();
            const gltfData: any = await this.graphics.loadModel('assets/wooden_table/scene.gltf');
            this.table = gltfData.scene;
            gltfData.scene.traverse(function (child:any){
                if( child.isMesh){
                    //child.material.envMap = envMap;
                    gltfMaterial = child.material
                    glTFGeometry = child.geometry;
                }
            })
            this.TableGeometry=glTFGeometry;
            this.TableMaterial = gltfMaterial;
        } catch(e: any) {
                console.error(e);
        }*/

        try {
            this.textureFloorData = await this.graphics.loadTexture('assets/Poured_Concrete/ConcretePoured001_COL_2K_METALNESS.png');
        } catch(e: any) {
            console.error(e);
        }
        try {
            this.textureCeilingData = await this.graphics.loadTexture('assets/colorful-mexican-architecture-urban-landscape.jpg');
            this.textureCeilingData.wrapS = this.textureCeilingData.wrapT = THREE.RepeatWrapping;
            this.textureCeilingData.repeat.set(1, 6);
        } catch(e: any) {
            console.error(e);
        }
        try {
            this.textureWallsData = await this.graphics.loadTexture('assets/Material.001_baseColor.png');
            this.textureWallsData.wrapS = this.textureCeilingData.wrapT = THREE.RepeatWrapping;
            this.textureWallsData.repeat.set(4, 1);
        } catch(e: any) {
            console.error(e);
        }
    }

    build() {
        const distanceFromCenter = 10;
        const angleBetween = 2 * Math.PI / this.numCrystals;
        for (let i = 0; i < this.numCrystals; ++i) {
            const currentPlinth = this.exitDoor.crystalPlinths[i];
            const x = distanceFromCenter * Math.sin(i * angleBetween);
            const z = distanceFromCenter * Math.cos(i * angleBetween) - 100;

            currentPlinth.position.set(
                x,
                -9,
                z
            );
        }

        // this.music.root.position.set(140, -8, 0);

        const vertices = [[0,0,112.5], [-40,0,-62.5],[-40,0,62.5], [40,0,-62.5], [40,0,62.5], [-22.5,0,-112.5],[22.5,0,-112.5],[-65,0,12.5],[-65,0,-12.5],[65,0,12.5],[65,0,-12.5],[-135,0,12.5],[-135,0,-12.5],[135,0,12.5],[135,0,-12.5]];
        const scaleArr = [[80, 20, 0.1],[ 100, 20,0.1], [100, 20,0.1], [ 100, 20,0.1], [100, 20,0.1],[35, 20,0.1],[35, 20,0.1],[50, 20,0.1],[50, 20,0.1],[50, 20,0],[50, 20,0.1],[50, 20,0.1],[50, 20,0.1],[50, 20,0],[50, 20,0.1]];
        const rotation = [[0,0,0],[0,Math.PI /2,0],[0,Math.PI /2,0], [0,Math.PI /2,0],[0,Math.PI /2,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

        const floorVertices = [[0,-10,0],[100,-10,0],[-100,-10,0]];
        const floorScale = [[80, 225,0],[120, 25,0],[120, 25,0]];
    
        const ceilingVertices = [[0,10,0],[100,10,0],[-100,10,0]];
        const ceilingScale = [[80, 225,0.1],[120, 25,0.1],[120, 25,0.1]];

       // const bookShelfsVertices = [[-15,-10,100], [-25,-10,90],[-25,-10,80],[-25,-10,70],[-25,-10,60],[-25,-10,50], [-25,-10,40],[-25,-10,30],[-25,-10,20],
       // [-18.5,-10,100], [-18.5,-10,90],[-18.5,-10,80],[-18.5,-10,70],[-18.5,-10,60],[-18.5,-10,70],[-18.5,-10,60],[-18.5,-10,50], [-18.5,-10,40],[-18.5,-10,30],[-18.5,-10,20],
       // [25,-10,100], [25,-10,90],[25,-10,80],[25,-10,70],[25,-10,60], [25,-10,50], [25,-10,40],[25,-10,30],[25,-10,20],
       // [18.5,-10,100], [18.5,-10,90],[18.5,-10,80],[18.5,-10,70],[18.5,-10,60], [18.5,-10,50], [18.5,-10,40],[18.5,-10,30],[18.5,-10,20],

     //   [-25,-10,-100], [-25,-10,-90],[-25,-10,-80],[-25,-10,-70],[-25,-10,-60],[-25,-10,-50], [-25,-10,-40],[-25,-10,-30],[-25,-10,-20],
     //   [-18.5,-10,-100], [-18.5,-10,-90],[-18.5,-10,-80],[-18.5,-10,-70],[-18.5,-10,-60],[-18.5,-10,-70],[-18.5,-10,-60],[-18.5,-10,-50], [-18.5,-10,-40],[-18.5,-10,-30],[-18.5,-10,-20],
     //   [25,-10,-100], [25,-10,-90],[25,-10,-80],[25,-10,-70],[25,-10,-60], [25,-10,-50], [25,-10,-40],[25,-10,-30],[25,-10,-20],
     //   [18.5,-10,-100], [18.5,-10,-90],[18.5,-10,-80],[18.5,-10,-70],[18.5,-10,-60], [18.5,-10,-50], [18.5,-10,-40],[18.5,-10,-30],[18.5,-10,-20]
      //  ];

        // const tableVertices = [[-2,111.5,100], [-2,111.5,90],[-2,111.5,80],[-2,111.5,70],[-2,111.5,60],[-2,111.5,50], [-2,111.5,40],[-2,111.5,30],[-2,111.5,20],
        // [2,111.5,100], [2,111.5,90],[2,111.5,80],[2,111.5,70],[2,111.5,60],[2,111.5,50], [2,111.5,40],[2,111.5,30],[2,111.5,20],
        // [-2,111.5,-100], [-2,111.5,-90],[-2,111.5,-80],[-2,111.5,-70],[-2,111.5,-60],[-2,111.5,-50], [-2,111.5,-40],[-2,111.5,-30],[-2,111.5,-20],
        // [2,111.5,-100], [2,111.5,-90],[2,111.5,-80],[2,111.5,-70],[2,111.5,-60],[2,111.5,-50], [2,111.5,-40],[2,111.5,-30],[2,111.5,-20],
        // ];

      this.walls = [];
       for(let i = 0; i<vertices.length; i++){
            const geometry = new THREE.PlaneGeometry( 1, 1);
            this.wallsTexture = new THREE.MeshBasicMaterial( { map: this.textureWallsData, side: THREE.DoubleSide } );
            const wall = new THREE.Mesh(geometry, this.wallsTexture);
            wall.scale.set(scaleArr[i][0],scaleArr[i][1],0.01);
            wall.position.set(vertices[i][0],vertices[i][1],vertices[i][2]);
            wall.rotation.set(rotation[i][0],rotation[i][1],rotation[i][2]);
            this.walls.push(wall);
            this.physics.addStatic(wall,PhysicsColliderFactory.box(scaleArr[i][0]/2, scaleArr[i][1]/2, 0.01));
            this.graphics.add(wall);
        }
        this.floors = [];
        for(let i = 0; i<3; i++){
            const geometry = new THREE.PlaneGeometry( 1,1,1);
            this.floorTexture = new THREE.MeshBasicMaterial( { map: this.textureFloorData, side: THREE.DoubleSide } );
            const floor= new THREE.Mesh(geometry,this.floorTexture);
            floor.position.set(floorVertices[i][0],floorVertices[i][1],floorVertices[i][2]);
            floor.rotation.set(Math.PI/2,0,0);
           //floor.scale.set(floorScale[i][0],floorScale[i][1],floorScale[i][2]);
            floor.scale.set(floorScale[i][0],floorScale[i][1],0.01);
            this.floors.push(floor);
            this.physics.addStatic(floor,PhysicsColliderFactory.box(floorScale[i][0]/2,floorScale[i][1]/2, 0.01));
            this.graphics.add( floor);
        }
        /*this.bookShelfs = [];
        for ( let i = 0; i<1; i++){
            const tempBookShelf = this.bookshelf.clone();
            tempBookShelf.rotation.set(0,0,0);
            //tempBookShelf.scale.set(0.05,0.05,0.05);
            tempBookShelf.position.set(0,0,0);
            this.physics.addStatic(tempBookShelf,PhysicsColliderFactory.box(1, 21, 6));
            this.graphics.add(tempBookShelf);
            this.bookShelfs.push(tempBookShelf);
        }*/

       /* this.FbookShelfs = [];
        for ( let i = 0; i<bookShelfsVertices.length; i++){
            const tempBookShelf = this.bookshelf.clone();
            tempBookShelf.position.set(bookShelfsVertices[i][0],bookShelfsVertices[i][1]+475,bookShelfsVertices[i][2]+2);
            tempBookShelf.rotation.set(0,-Math.PI/2,0);
            tempBookShelf.scale.set(2.25,2.25,2.25);
            this.physics.addStatic(tempBookShelf,PhysicsColliderFactory.box(2.25/2, 2.25/2, 1.1));
            this.graphics.add(tempBookShelf);
            this.bookShelfs.push(tempBookShelf);
        }*/


        //this.drawTables(this.TableGeometry);

       /*this.tables = [];
        for ( let i = 0; i < 1; i++){
            const tempTable= this.table.clone();
            tempTable.position.set(0, 0, 0);
            tempTable.rotation.set(0, 0, 0);
            tempTable.scale.set(2,2,2);
            this.physics.addStatic(tempTable,PhysicsColliderFactory.box(1, 1, 1));
            this.graphics.add(tempTable);
            this.tables.push(tempTable);
        }*/

        this.ceilings = [];
        for(let i = 0; i<3; i++){
            const geometry = new THREE.PlaneGeometry( 1, 1);
            this.ceilingTexture= new THREE.MeshBasicMaterial( { map: this.textureCeilingData, side: THREE.DoubleSide } );
            const ceiling = new THREE.Mesh(geometry,this.ceilingTexture);
            ceiling.position.set(ceilingVertices[i][0],ceilingVertices[i][1],ceilingVertices[i][2]);
            ceiling.rotation.set(Math.PI/2,0,0);
            ceiling.scale.set(ceilingScale[i][0],ceilingScale[i][1],0.01);
            this.floors.push(ceiling);
            this.physics.addStatic(ceiling,PhysicsColliderFactory.box(ceilingScale[i][0]/2, ceilingScale[i][0]/2, 0.01));
            this.graphics.add( ceiling);
        }
       // const tempLamp= this.Lamp.clone();
        //tempLamp.position.set(-1.5,-8.25,22);
        //tempLamp.scale.set(2,2,2);
        //this.physics.addStatic(tempLamp,PhysicsColliderFactory.box(1, 1,1));
       // this.graphics.add(tempLamp);

        this.lightHemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff,0.5);
        this.lightHemisphere.color.setHSL(0.6, 0.6, 0.6);
        this.lightHemisphere.groundColor.setHSL(0.1, 1, 0.4);
        this.lightHemisphere.position.set(0, 100, 0);
        
        this.lightDirectional = new THREE.DirectionalLight(0xffffff, 0.5);
        this.lightDirectional.color.setHSL(0.1, 1, 0.95);
        this.lightDirectional.position.set(0, 20, 100);
        this.lightDirectional.position.multiplyScalar(100);
        this.lightDirectional.castShadow = true;
        this.lightDirectional.shadow.mapSize.width = 2048;
        this.lightDirectional.shadow.mapSize.height = 2048;

        this.lightDirectional.shadow.camera.left = -50;
        this.lightDirectional.shadow.camera.right = 50;
        this.lightDirectional.shadow.camera.top = 50;
        this.lightDirectional.shadow.camera.bottom = -50;

        this.graphics.add(this.lightHemisphere);
        this.graphics.add(this.lightDirectional);
        
    }

    // Box collider dimensions are half the dimensions of the actual object
    // so a threejs box of { width: 20, height: 50, depth: 2} has a collider of { 10, 25, 1 }

    update() {}

    destroy() {}
}
