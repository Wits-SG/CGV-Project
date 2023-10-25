import { Construct, GraphicsContext, PhysicsContext, PhysicsColliderFactory} from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import * as THREE from 'three';

export class Staircase extends Construct {

    private texture!: any;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext ) {
        super(graphics, physics, interactions, userInterface);
    }


    create(): void {
    }

    async load(): Promise<void> {
        try {
            this.texture = await this.graphics.loadTexture('assets/blackFloor.jpeg');
            this.texture.wrapS = THREE.RepeatWrapping;
            this.texture.wrapT = THREE.RepeatWrapping;
            this.texture.repeat.set(1,1);
        } catch(e: any) {
            console.error(e);
        }
    }

    build(): void {
        const staircasesConfig = [
            { steps: 10, radius: 3, direction: 1, xOffset: -7.5, zOffset: -8.5, rotation: false },
            { steps: 10, radius: 3, direction: -1, xOffset: 7.5, zOffset: -8.5, rotation: true }
        ];

        staircasesConfig.forEach(config => {
            this.buildStaircase(config);
        });
    }

    private buildStaircase(config: any): void {
        const stepHeight = 0.5;
        const stepLength = 4;
        const stepWidth = 1;
        const angleIncrement = config.direction * Math.PI / 2 / (config.steps - 1);
        let currentAngle = config.rotation ? 0 : -Math.PI;

        const staircaseGroup = new THREE.Group();

        for (let i = 0; i < config.steps; i++) {
            const geometry = new THREE.BoxGeometry(stepLength, stepHeight, stepWidth);
            const material = new THREE.MeshLambertMaterial({ map: this.texture });
            const step = new THREE.Mesh(geometry, material);

            const x = config.radius * Math.cos(currentAngle) + config.xOffset;
            const z = config.radius * Math.sin(currentAngle) + config.zOffset;
            const y = i * stepHeight + 0.25;

            step.position.set(x, y, z);
            step.rotation.y = -currentAngle;
            step.castShadow = true;
            staircaseGroup.add(step);
            this.physics.addStatic(step, PhysicsColliderFactory.box(3.2, 0.35, 1.2));

            currentAngle += angleIncrement;
        }
        staircaseGroup.castShadow = true;
        this.add(staircaseGroup);
        for (let step of staircaseGroup.children) {
            this.physics.addStatic(step, PhysicsColliderFactory.box(3.2, 0.35, 1.2));
        }
    }

    update(/*time?: TimeS, delta?: TimeMS*/): void {
    }

    destroy(): void {
    }
}

