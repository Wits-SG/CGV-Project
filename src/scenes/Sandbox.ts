import * as THREE from 'three';
import { Scene } from '../lib';
//@ts-expect-error
import { OrbitControls } from 'three/addons/controls/OrbitControls';
//import { TimeS } from '../lib/w3ads/types/misc.type';
//import { MainLibraryConstruct } from '../constructs/MainLibraryRoom';
import { StatuesConstruct } from '../constructs/Statues';
import { Player } from '../constructs/Player';

export class SandboxScene extends Scene {

    lightHemisphere!: THREE.HemisphereLight;
    lightDirectional!: THREE.DirectionalLight;

    floor!: THREE.Mesh;
    walls!: Array<THREE.Mesh>;
    ballKinematic!: THREE.Mesh;
    //testConstruct: TestConstruct;
    //k!: THREE.Mesh;
    //mainLibrary!: MainLibraryConstruct;
    statueRoom!: StatuesConstruct;

    player!: Player;
    controls: any;

    constructor(AmmoLib: any) {
        super(
            'Sandbox',
            AmmoLib
        );

       // this.testConstruct = new TestConstruct(this.graphics, this.physics);
       // this.addConstruct(this.testConstruct);
        // this.mainLibrary = new MainLibraryConstruct(this.graphics,this.physics);
        // this.addConstruct(this.mainLibrary);

        this.statueRoom = new StatuesConstruct(this.graphics, this.physics, this.interactions);
        this.addConstruct(this.statueRoom);

        this.player = new Player(this.graphics, this.physics, this.interactions);
        this.addConstruct(this.player);
    };


    create(): void {
    }

    async load(): Promise<void> {
        // const gltfData: any = await this.graphics.loadModel('assets/officer-k/scene.gltf');
        // this.k = gltfData.scene;
    }

    build(): void {
        // this.graphics.mainCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
        // this.graphics.mainCamera.position.set(5, 5, 5);
        // this.graphics.mainCamera.lookAt(0, 0, 0);
        // this.controls = new OrbitControls(this.graphics.mainCamera, this.graphics.renderer.domElement);
        this.player.root.position.set(0, 30, 0);

        //this.statueRoom.root.scale.set(0.2,0.2,0.2);

        this.lightHemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
        this.lightHemisphere.color.setHSL(0.6, 0.6, 0.6);
        this.lightHemisphere.groundColor.setHSL(0.1, 1, 0.4);
        this.lightHemisphere.position.set(0, 50, 0);
        
        this.lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
        this.lightDirectional.color.setHSL(0.1, 1, 0.95);
        this.lightDirectional.position.set(-1, 1.75, 1);
        this.lightDirectional.position.multiplyScalar(100);
        this.lightDirectional.castShadow = true;
        this.lightDirectional.shadow.mapSize.width = 2048;
        this.lightDirectional.shadow.mapSize.height = 2048;

        this.lightDirectional.shadow.camera.left = -50;
        this.lightDirectional.shadow.camera.right = 50;
        this.lightDirectional.shadow.camera.top = 50;
        this.lightDirectional.shadow.camera.bottom = -50;


        //this.graphics.add(this.floor);
        this.graphics.add(this.lightHemisphere);
        this.graphics.add(this.lightDirectional);
        // this.graphics.add(this.k);

        //this.physics.addStatic(this.floor, PhysicsColliderFactory.box(500, 0.05, 500))
    }

    //@ts-ignore
    update(time: number, delta: number): void {

    }

    destroy(): void {
    }

}
