import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory} from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import * as THREE from 'three';

export class Balcony extends Construct {
    private texture: any;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext ) {
        super(graphics, physics, interactions, userInterface);
    }

    create(): void {
    }

    async load(): Promise<void> {
        try {
            this.texture = await this.graphics.loadTexture('assets/marble.jpeg');
            this.texture.wrapS = THREE.RepeatWrapping;
            this.texture.wrapT = THREE.RepeatWrapping;
            this.texture.repeat.set(1, 1);
        } catch(e: any) {
            console.error(e);
        }
    }

    build(): void {
        const geometry = new THREE.BoxGeometry(15, 0.5, 8.4);
        const material = new THREE.MeshLambertMaterial({ map: this.texture });
        const balcony = new THREE.Mesh(geometry, material);
        balcony.position.set(0, 5.25, -11);
        balcony.castShadow = true;
        this.add(balcony);
        this.physics.addStatic(balcony,PhysicsColliderFactory.box(8, 0.25 , 4.7));
    }

    update(/*time?: TimeS, delta?: TimeMS*/): void {
    }

    destroy(): void {
    }
}
