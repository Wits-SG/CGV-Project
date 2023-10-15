import * as THREE from 'three';
import { PhysicsColliderFactory, Scene } from '../lib';
import { Player } from '../constructs/Player';
import { MusicPuzzle } from '../constructs/MusicPuzzle';

export class SandboxScene extends Scene {
    async load(): Promise<void> {}

    lightHemisphere!: THREE.HemisphereLight;
    lightDirectional!: THREE.DirectionalLight;

    floor!: THREE.Mesh;
    player!: Player;

    music: MusicPuzzle;

    constructor(AmmoLib: any) {
        super(
            'Sandbox',
            AmmoLib
        );

        const levelConfig = {
            key: 'sandbox',
            name: 'Sandbox',
            difficulty: 'none',
            numPuzzles: 0
        }
        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface, levelConfig);
        this.addConstruct(this.player);

        this.music = new MusicPuzzle(this.graphics, this.physics, this.interactions, this.userInterface);
        this.addConstruct(this.music);
    }

    create(): void {
        this.music.root.position.set(0, 0.3, 0);
    }

    build(): void {
       /* this.floor = GraphicsPrimitiveFactory.box({
            position: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 0.2, z: 1},
            rotation: { x: 0, y: 0, z: 0 },
            colour: 0xcccccc,
            shadows: true,
        });*/
        this.graphics.add(this.floor);
        this.physics.addStatic(this.floor, PhysicsColliderFactory.box( 150, 0.1, 150 ));
        
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


        this.graphics.add(this.lightHemisphere);
        this.graphics.add(this.lightDirectional);
    }

    update(): void {
    }

    destroy(): void {
    }

}
