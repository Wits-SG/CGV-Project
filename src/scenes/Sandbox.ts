import * as THREE from 'three';
import { GraphicsPrimitiveFactory, PhysicsColliderFactory, Scene } from '../lib';
import { Player } from '../constructs/Player';
import { Lectern } from '../constructs/Lectern';

export class SandboxScene extends Scene {
    async load(): Promise<void> {}

    lightHemisphere!: THREE.HemisphereLight;
    lightDirectional!: THREE.DirectionalLight;

    floor!: THREE.Mesh;
    player!: Player;

    lectern!: Lectern;

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

        this.lectern = new Lectern(this.graphics, this.physics, this.interactions, this.userInterface, 'Test Lectern', [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vestibulum, ipsum nec dictum fringilla, sapien nunc tincidunt justo, sit amet fringilla arcu purus non lectus. Vestibulum at est nec urna lacinia condimentum. Phasellus nec euismod justo. Fusce ut tristique quam. Nunc nec augue vel mi sollicitudin efficitur.',
            'Suspendisse vel tortor eget lorem ultricies cursus. Nunc venenatis, justo sit amet bibendum dictum, quam libero ultrices purus, a feugiat turpis nunc sed odio. Maecenas pellentesque facilisis euismod. Suspendisse id tincidunt mi, non facilisis nunc. Sed non varius orci.',
            'Praesent in orci nec mi facilisis vestibulum. Aenean aliquet, lectus eget tempus vestibulum, odio velit sagittis quam, sit amet laoreet ligula justo eget risus. Suspendisse at bibendum metus. Aenean a orci id arcu malesuada scelerisque. Sed sollicitudin ex ac libero faucibus, ac viverra nulla hendrerit.',
            'Vestibulum ac massa id justo hendrerit bibendum. Pellentesque et diam at justo tincidunt blandit. Nunc condimentum erat vitae urna ultrices, id interdum velit tincidunt. Suspendisse quis purus id augue dictum efficitur. Suspendisse potenti. Sed quis dapibus libero, at bibendum ex.'
        ]);
        this.addConstruct(this.lectern);
    }

    create(): void {
        this.lectern.root.position.set(10, 0.2, 10);
    }

    build(): void {
        this.floor = GraphicsPrimitiveFactory.box({
            position: { x: 0, y: 0, z: 0 },
            scale: { x: 300, y: 0.2, z: 300 },
            rotation: { x: 0, y: 0, z: 0 },
            colour: 0xcccccc,
            shadows: true,
        });
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
