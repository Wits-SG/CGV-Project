import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';

export class CrystalDoor extends Construct {

    numCrystals: number;
    numFoundCrystals: number;
    exitDoor!: THREE.Mesh;
    crystalPlinths!: Array<THREE.Mesh>;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, numCrystals: number) {
        super(graphics, physics, interactions, userInterface);

        this.numCrystals = numCrystals;
        this.numFoundCrystals = 0;
        this.crystalPlinths = [];
    }

    create(): void {}

    async load() {}

    build(): void {

        const doorMat = new THREE.MeshLambertMaterial({ color: 0x0ffff0 });
        const doorGeom = new THREE.BoxGeometry(20, 40, 1);
        this.exitDoor = new THREE.Mesh(doorGeom, doorMat);

        this.interactions.addInteractable(this.root, 20, () => {
            if (this.numFoundCrystals == this.numCrystals) {
                const endLevelEvent = new Event("endLevel");
                document.dispatchEvent(endLevelEvent);
            } else {
                console.log("Not enough crystals have been found to open the door");
            }
        })
        this.add(this.exitDoor);

        for (let i = 0; i < this.numCrystals; i++) {

            const plinthMat = new THREE.MeshLambertMaterial({
                color: 0xffffff
            });
            const plinthGeom = new THREE.BoxGeometry(1, 2, 1);
            const plinth = new THREE.Mesh(plinthGeom, plinthMat);

            this.graphics.add(plinth);
            this.crystalPlinths.push(plinth);

            // Add the spot for crystals to be placed when picked up
            this.interactions.addPickupSpot(plinth, 5, (placedObject: THREE.Object3D) => {
                plinth.add(placedObject);
                placedObject.position.set(0, 2.5, 0);
                if (
                    placedObject.userData.isCrystal != undefined && 
                    placedObject.userData.isCrystal == true && // only crystals can be placed
                    placedObject.userData.foundCrystal != undefined &&
                    placedObject.userData.foundCrystal == false // to help fix the bug about picking up and placing the same crystal
                ) {
                    placedObject.userData.foundCrystal = true;
                    this.numFoundCrystals++;    
                }
            })
        }
    }

    update(): void {}

    destroy(): void {}

}