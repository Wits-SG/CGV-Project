import * as THREE from 'three';
import { GraphicsPrimitiveFactory, PhysicsColliderFactory, Scene } from '../lib';
//@ts-expect-error
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { TimeS } from '../lib/w3ads/types/misc.type';
import { TestConstruct } from '../constructs/TestConstruct';
import { MainLibraryConstruct } from '../constructs/MainLibraryRoom';

export class SandboxScene extends Scene {

    lightHemisphere!: THREE.HemisphereLight;
    lightDirectional!: THREE.DirectionalLight;

    floor!: THREE.Mesh;
    walls!: Array<THREE.Mesh>;
    ballKinematic!: THREE.Mesh;
    //testConstruct: TestConstruct;
    mainLibraryConstruct: MainLibraryConstruct;

    controls!: OrbitControls;

    constructor(AmmoLib: any) {
        super(
            'Sandbox',
            AmmoLib
        );

       // this.testConstruct = new TestConstruct(this.graphics, this.physics);
       // this.addConstruct(this.testConstruct);
        this.mainLibraryConstruct = new MainLibraryConstruct(this.graphics, this.physics);
        this.addConstruct(this.mainLibraryConstruct);

    }

    create(): void {
        //this.player.create();
    }

    load(): void {
        //this.player.load();
    }

    build(): void {
       // this.player.build();
       // this.player.setPosition(0, 0, 5);
        this.graphics.mainCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
        this.graphics.mainCamera.position.set(20, 100, 20);
        this.graphics.mainCamera.lookAt(0, 0, 0);
        this.controls = new OrbitControls(this.graphics.mainCamera, this.graphics.renderer.domElement);

      /* this.floor = GraphicsPrimitiveFactory.box({
            position: { x: 0, y: -1, z: 0 },
            scale: { x: 1000, y: 0.1, z: 1000 },
            rotation: { x: 0, y: 0, z: 0 },
            colour: 0x98fb98,
            shadows: true,
        });

        this.walls = [];
        for (let i = 0; i < 4; ++i) {
            this.walls.push(
                GraphicsPrimitiveFactory.box({
                    position: { x: 0, y: 0, z: i * 10 + 10 },
                    scale: { x: 40, y: 2, z: 0.2 },
                    rotation: { x: 0, y: 0, z: 0 },
                    colour: 0x0000ff,
                    shadows: true,
                })
            );

            this.physics.addStatic(this.walls[i], PhysicsColliderFactory.box(20, 1, 0.1));
            this.graphics.add(this.walls[i]);
        }
        for (let i = 4; i < 8; ++i) {
            this.walls.push(
                GraphicsPrimitiveFactory.box({
                    position: { x: 0, y: 0, z: (i - 4) * -10 - 10 },
                    scale: { x: 40, y: 2, z: 0.2 },
                    rotation: { x: 0, y: 0, z: 0 },
                    colour: 0x0000ff,
                    shadows: true,
                })
            );

            this.physics.addStatic(this.walls[i], PhysicsColliderFactory.box(20, 1, 0.1));
            this.graphics.add(this.walls[i]);
        }
        this.walls.push(
            GraphicsPrimitiveFactory.box({
                position: { x: 25, y: 0, z: 0 },
                scale: { x: 0.2, y: 2, z: 80 },
                rotation: { x: 0, y: 0, z: 0 },
                colour: 0x0000ff,
                shadows: true,
            })
        );
        this.physics.addStatic(this.walls[8], PhysicsColliderFactory.box(0.1, 1, 40));
        this.graphics.add(this.walls[8]);

        this.walls.push(
            GraphicsPrimitiveFactory.box({
                position: { x: -25, y: 0, z: 0 },
                scale: { x: 0.2, y: 2, z: 80 },
                rotation: { x: 0, y: 0, z: 0 },
                colour: 0x0000ff,
                shadows: true,
            })
        );
        this.physics.addStatic(this.walls[9], PhysicsColliderFactory.box(0.1, 1, 40));
        this.graphics.add(this.walls[9]);*/

        /*this.ballKinematic = GraphicsPrimitiveFactory.sphere({
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            radius: 1,
            colour: 0xff0000,
            shadows: true,
        })
        this.graphics.add(this.ballKinematic);
        this.physics.addKinematic(this.ballKinematic, PhysicsColliderFactory.sphere(1), {
            mass: 1,
            linearVelocity: { x: 0, y: 0, z: 1 },
            friction: 0,
        })*/


        
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

        //this.physics.addStatic(this.floor, PhysicsColliderFactory.box(500, 0.05, 500))
    }

    update(time: TimeS): void {
        // this.player.update();
        //this.physics.moveKinematic(this.ballKinematic, 0, 0, 0.1 * Math.sin(time));
    }

    destroy(): void {
    }

}
