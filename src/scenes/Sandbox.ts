import * as THREE from 'three';
import { GraphicsPrimitiveFactory, PhysicsColliderFactory, Scene } from '../lib';
import { PlayerConstruct } from '../player';

export class SandboxScene extends Scene {

    lightHemisphere!: THREE.HemisphereLight;
    lightDirectional!: THREE.DirectionalLight;

    floor!: THREE.Mesh;

    player: PlayerConstruct;

    constructor(AmmoLib: any) {
        super(
            'Sandbox',
            AmmoLib
        );

        this.player = new PlayerConstruct(this.graphics, this.physics);
    }

    create(): void {
        this.player.create();
    }

    load(): void {
        this.player.load();
    }

    build(): void {
        this.player.build();
        this.player.setPosition(0, 0, 0);

        this.floor = GraphicsPrimitiveFactory.box({
            position: { x: 0, y: -1, z: 0 },
            scale: { x: 1000, y: 0.1, z: 1000 },
            rotation: { x: 0, y: 0, z: 0 },
            colour: 0xc5c6d0,
            shadows: true,
        });
        
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


        this.graphics.add(this.floor);
        this.graphics.add(this.lightHemisphere);
        this.graphics.add(this.lightDirectional);

        this.physics.addStatic(this.floor, PhysicsColliderFactory.box(500, 0.05, 500))
    }

    update(): void {
        this.player.update();
    }

    destroy(): void {
    }

}