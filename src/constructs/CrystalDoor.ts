import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsContext } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';

export class CrystalDoor extends Construct {

    numCrystals: number;
    numFoundCrystals: number;
    crystalPlinths!: Array<THREE.Group>;
    exitDoor!: THREE.Group;
    plinths!: any;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, numCrystals: number) {
        super(graphics, physics, interactions, userInterface);

        this.numCrystals = numCrystals;
        this.numFoundCrystals = 0;
        this.crystalPlinths = [];
    }

    create(): void {}

    async load() {
        try {//exitdoor object
            const gltfData: any = await this.graphics.loadModel('assets/door/scene.gltf');
            this.exitDoor = gltfData.scene;
        } catch (e: any) {
            console.error(e);
        }

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Crystal_Plinths/crystal_plinth.gltf');
            this.plinths = gltfData.scene;
            this.plinths.traverse((obj: THREE.Object3D) => obj.castShadow = true);
        } catch (e: any) {
            console.log(e);
        }
    }

    build(): void {

        this.exitDoor.scale.set(6,6,6);
        this.exitDoor.position.set(0,0,0);
        this.add(this.exitDoor);

        this.interactions.addInteractable(this.root, 20, () => {
            if (this.numFoundCrystals >= this.numCrystals) {
                const endLevelEvent = new Event("endLevel");
                document.dispatchEvent(endLevelEvent);
            } else {
                console.log("Not enough crystals have been found to open the door");
            }
        })
        this.add(this.exitDoor);

        for (let i = 0; i < this.numCrystals; i++) {
            /*
            const plinthMat = new THREE.MeshLambertMaterial({
                color: 0xffffff
            });
            const plinthGeom = new THREE.BoxGeometry(1, 2, 1);
            const plinth = new THREE.Mesh(plinthGeom, plinthMat);
            */
            //this.graphics.add(plinth);
            //this.crystalPlinths.push(plinth);
            const plinth = this.plinths.clone();
            plinth.scale.set(0.2,0.15,0.2);
            this.graphics.add(plinth);
            this.crystalPlinths.push(plinth)

            // Add the spot for crystals to be placed when picked up
            this.interactions.addPickupSpot(plinth, 5, (placedObject: THREE.Object3D) => {
                plinth.add(placedObject);
                placedObject.position.set(0, 12.5, 0);
                placedObject.scale.set(4, 4, 4);


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
