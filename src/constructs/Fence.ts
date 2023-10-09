import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import * as THREE from 'three';

export class Fence extends Construct {
    private fenceModel!: THREE.Group;
    private numberOfFences!: number;
    private xOffset!: number;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext ) {
        super(graphics, physics, interactions, userInterface);
    }

    create(): void {
    }

    async load(): Promise<void> {
        try {
            const gltfData: any = await this.graphics.loadModel('assets/fence/scene.gltf');
            this.fenceModel = gltfData.scene;
        } catch(e: any) {
                console.error(e);
        }
    }

    build(): void {

        this.numberOfFences = 4;
        this.xOffset = 3;

        for (let i = 0; i < this.numberOfFences; i++) {
            const fenceClone = this.fenceModel.clone();

            fenceClone.scale.set(3.5, 3.5, 3);
            fenceClone.position.set(-4.6 + (i * this.xOffset), 5.5, -7.1);
            fenceClone.rotateY(Math.PI);
            this.add(fenceClone);
        }
    

    const fenceLeft = this.fenceModel.clone();

    fenceLeft.scale.set(2.2, 3.5, 3);
    fenceLeft.position.set(-6.84, 5.5, -8.47);
    fenceLeft.rotateY(Math.PI/2);
    this.add(fenceLeft);

    const fenceRight = this.fenceModel.clone();

    fenceRight.scale.set(2.2, 3.5, 3);
    fenceRight.position.set( 6.65, 5.5, -8.47);
    fenceRight.rotateY(Math.PI/2);
    this.add(fenceRight);

    // physics 

    const fenceFrontPhysics = new THREE.Mesh(new THREE.BoxGeometry(14, 2.5, 0.1) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
    fenceFrontPhysics.position.set(0, 6.7, -7.1);
    // this.graphics.add(fenceFrontPhysics);
    this.physics.addStatic(fenceFrontPhysics,PhysicsColliderFactory.box(7, 1.25 , 0.05));

    const fenceLeftPhysics = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.5, 3.2) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
    fenceLeftPhysics.position.set(6.7, 6.7, -8.5);
    //this.graphics.add(fenceLeftPhysics);
    this.physics.addStatic(fenceLeftPhysics,PhysicsColliderFactory.box(0.05, 1.25 , 1.6));

    const fenceRightPhysics = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.5, 3.2) , new THREE.MeshBasicMaterial({ color: "#0000FF" }));
    fenceRightPhysics.position.set(-6.7, 6.7, -8.5);
    //this.graphics.add(fenceRightPhysics);
    this.physics.addStatic(fenceRightPhysics,PhysicsColliderFactory.box(0.05, 1.25 , 1.6));
    }

    update(/*time?: TimeS, delta?: TimeMS*/): void {
    }

    destroy(): void {
    }
}
