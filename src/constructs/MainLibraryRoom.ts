import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import { CrystalDoor } from './CrystalDoor';
import { Player } from './Player';
import { StatuesConstruct } from './Statues';
import { MirrorRoom } from './MirrorRoom';
import { OfficeConstruct } from './OfficeConstruct';
import { DesksConstruct } from './DesksConstruct';
import { BookShelvesConstructLeft } from './BookShelvesConstructLeft';
import { BookShelvesConstructRight } from './BookShelvesConstructRight';
import { Chandeliers } from './Chandeliers';
import { WallLights } from './WallLights';
import { Lectern } from './Lectern';

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
    ceilingTexture!: THREE.MeshLambertMaterial;
    wallsTexture!: THREE.MeshLambertMaterial;
    textureFloorData!: any;
    textureCeilingData!: any;
    textureWallsData!: any;
    character!:THREE.Mesh;

    //Library decoration constructs
    desksConstruct: DesksConstruct;
    bookShelvesConstructLeft: BookShelvesConstructLeft;
    bookShelvesConstructRight: BookShelvesConstructRight;
    chandeliersConstruct: Chandeliers;
    wallLights: WallLights;
    lectern: Lectern;

    // Game loop nonsense
    player: Player;
    numCrystals: number;
    exitDoor: CrystalDoor;

    // Puzzles
    chess: StatuesConstruct;
    mirror: MirrorRoom;
    office: OfficeConstruct;


    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, numCrystals: number, player: Player) {
        super(graphics, physics, interactions, userInterface);

        this.player = player;
        this.numCrystals = numCrystals;

        // poem for lectern from ChatGPT, thanks to Lisa :).
        this.lectern = new Lectern(this.graphics, this.physics, this.interactions, this.userInterface, 'Welcome to the Magic Library.', [
            "In a library where magic's gleam,",
            "A locked door guards secrets, it seems.",
            "To break the spell, fulfill your dream,",
            "Solve the puzzles with all your scheme.",
            "Gather crystals, each one a key,",
            "Unlock the knowledge, set it free.",
            "With rhyme and reason, you shall see,",
            "The magic library's mystery."
        ]);
       this.addConstruct(this.lectern);

        this.desksConstruct = new DesksConstruct(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.desksConstruct);

        this.bookShelvesConstructLeft = new BookShelvesConstructLeft(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.bookShelvesConstructLeft);

        this.bookShelvesConstructRight = new BookShelvesConstructRight(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.bookShelvesConstructRight);

        this.chandeliersConstruct = new Chandeliers(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.chandeliersConstruct);

        this.wallLights = new WallLights(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.wallLights);

        this.exitDoor = new CrystalDoor(this.graphics, this.physics, this.interactions, this.userInterface, this.numCrystals);
        this.addConstruct(this.exitDoor);

        this.chess = new StatuesConstruct(this.graphics, this.physics, this.interactions, this.userInterface);
       // this.addConstruct(this.chess);

        this.mirror = new MirrorRoom(this.graphics, this.physics, this.interactions, this.userInterface);
        //this.addConstruct(this.mirror);


        this.office = new OfficeConstruct(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.office);
    }

    create() {
        this.exitDoor.root.position.set(0, -12, -73);
        this.exitDoor.root.scale.set(1.15,1.15,1.15);
        this.chess.root.position.set(100, -10.5, 42.5);
        this.chess.root.rotation.set(0, Math.PI, 0);
        this.mirror.root.position.set(110, -10.5, -12.3);
        this.mirror.root.rotation.set(0, Math.PI / 2, 0);
        this.office.root.position.set(-115, -10, 0);
        this.office.root.rotation.set(0, Math.PI / 2, 0);
        this.desksConstruct.root.position.set(0,-8.75,0); 
        this.bookShelvesConstructLeft.root.position.set(-20,-10,0);
        this.bookShelvesConstructRight.root.position.set(20,-10,0);
        this.chandeliersConstruct.root.position.set(0,6,0);
        this.wallLights.root.position.set(0,0,0);
        this.lectern.root.position.set(0,-9.8,-4);
        this.lectern.root.rotation.set(0,Math.PI,0);
    }

    async load(): Promise<void>{
        try {
            this.textureFloorData = await this.graphics.loadTexture('assets/Flooring_Stone_001_COLOR.png');
        } catch(e: any) {
            console.error(e);
        }
        try {
            this.textureCeilingData = await this.graphics.loadTexture('assets/Wood_Ceiling_Coffers_001_basecolor.jpg');
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
            const z = distanceFromCenter * Math.cos(i * angleBetween);

            currentPlinth.position.set(
                x,
                -9,
                z
            );
        }
 
        const wallPositions = [[0,0,82.5], [-40,0,-48.75],[-40,0,48.75], [40,0,-47.5], [40,0,47.5], [-22.5,0,-82.5],[22.5,0,-82.5],[-65,0,15],[-65,0,-15],[65,0,12.5],[65,0,-12.5],[135,0,12.5],[135,0,-12.5],[160,0,0]];
        const wallScales = [[80, 20, 0.1],[ 67.5, 20,0.1], [67.5, 20,0.1], [70, 20,0.1], [70, 20,0.1],[35, 20,0.1],[35, 20,0.1],[50, 20,0.1],[50, 20,0.1],[50, 20,0],[50, 20,0.1],[50, 20,0],[50, 20,0.1],[25,20,0.1]];
        const wallRotations = [[0,0,0],[0,Math.PI /2,0],[0,Math.PI /2,0], [0,Math.PI /2,0],[0,Math.PI /2,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,Math.PI/2,0]];

        const floorPositions = [[0,-10,0],[100,-10,0],[-65,-10,0]];
        const floorScales = [[80, 165,0],[120, 25,0],[50, 30,0]];
    
        const ceilingPositions = [[0,10,0],[100,10,0],[-65,10,0]];
        const ceilingScales = [[80, 165,0.1],[120, 25,0.1],[50, 30,0.1]];

      this.walls = [];
       for(let i = 0; i<wallPositions.length; i++){
            const geometry = new THREE.PlaneGeometry( 1, 1);
            this.wallsTexture = new THREE.MeshLambertMaterial( { map: this.textureWallsData, side: THREE.DoubleSide } );
            const wall = new THREE.Mesh(geometry, this.wallsTexture);
            wall.scale.set(wallScales[i][0],wallScales[i][1],0.01);
            wall.position.set(wallPositions[i][0],wallPositions[i][1],wallPositions[i][2]);
            wall.rotation.set(wallRotations[i][0],wallRotations[i][1],wallRotations[i][2]);
            this.walls.push(wall);
            this.physics.addStatic(wall,PhysicsColliderFactory.box(wallScales[i][0]/2, wallScales[i][1]/2, 0.01));
            this.graphics.add(wall);
        }
        this.floors = [];
        for(let i = 0; i<3; i++){
            const geometry = new THREE.PlaneGeometry( 1,1,1);
            this.floorTexture = new THREE.MeshLambertMaterial( { map: this.textureFloorData, side: THREE.DoubleSide } );
            const floor= new THREE.Mesh(geometry, this.floorTexture)
            floor.position.set(floorPositions[i][0],floorPositions[i][1],floorPositions[i][2]);
            floor.rotation.set(Math.PI/2,0,0);
            floor.scale.set(floorScales[i][0],floorScales[i][1],0.01);
            this.floors.push(floor);
            this.physics.addStatic(floor,PhysicsColliderFactory.box(floorScales[i][0]/2,floorScales[i][1]/2, 0.01));
            floor.receiveShadow = true;
            this.add( floor);
        }

        this.ceilings = [];
        for(let i = 0; i<3; i++){
            const geometry = new THREE.PlaneGeometry( 1, 1);
            this.ceilingTexture= new THREE.MeshLambertMaterial( { map: this.textureCeilingData, side: THREE.DoubleSide } );
            const ceiling = new THREE.Mesh(geometry,this.ceilingTexture);
            ceiling.position.set(ceilingPositions[i][0],ceilingPositions[i][1],ceilingPositions[i][2]);
            ceiling.rotation.set(Math.PI/2,0,0);
            ceiling.scale.set(ceilingScales[i][0],ceilingScales[i][1],0.01);
            this.floors.push(ceiling);
            this.physics.addStatic(ceiling,PhysicsColliderFactory.box(ceilingScales[i][0]/2, ceilingScales[i][0]/2, 0.01));
            this.graphics.add( ceiling);
        }

        /*this.lightHemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff,0.5);
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
        this.graphics.add(this.lightDirectional);*/
        
    }

    update() {}

    destroy() {}
}
