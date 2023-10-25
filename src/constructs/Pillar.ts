import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import * as THREE from 'three';

export class Pillars extends Construct {

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext ) {
        super(graphics, physics, interactions, userInterface);
    }

    texture!: any;

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
        const height = 5;
        const radius = 0.7;
        const segments = 6; 

        const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
        const material = new THREE.MeshLambertMaterial({ map: this.texture });

        // Define positions for the pillars
        const positions = [
            { x: 6.5, z: -8 },
            { x: -6.5, z: -8 },
            { x: 6.5, z: -14 },
            { x: -6.5, z: -14 }
        ];

        // Create pillars based on the positions
        positions.forEach(pos => {
            const pillar = new THREE.Mesh(geometry, material);
            pillar.position.set(pos.x, 2.5, pos.z);
            pillar.castShadow = true;
            this.add(pillar);
            this.physics.addStatic(pillar, PhysicsColliderFactory.box(1, 2.5, 1));
        });
    }

    update(): void {
    }

    destroy(): void {
    }
}
