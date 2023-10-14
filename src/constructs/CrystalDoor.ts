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
            const gltfData: any = await this.graphics.loadModel('assets/Chess_Plinths/chess_plinth.gltf');
            this.plinths = gltfData.scene;
        } catch (e: any) {
            console.log(e);
        }
    }

    build(): void {

        this.exitDoor.scale.set(7,7,7);
        this.exitDoor.rotation.set(0,0,0);
        this.exitDoor.position.set(0,0,26);
        this.add(this.exitDoor);

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
            /*
            const plinthMat = new THREE.MeshLambertMaterial({
                color: 0xffffff
            });
            const plinthGeom = new THREE.BoxGeometry(1, 2, 1);
            const plinth = new THREE.Mesh(plinthGeom, plinthMat);
            */
            //this.graphics.add(plinth);
            //this.crystalPlinths.push(plinth);
            this.plinths.scale.set(0.2,0.15,0.2);
            this.graphics.add(this.plinths);
            this.crystalPlinths.push(this.plinths)

            // Add the spot for crystals to be placed when picked up
            this.interactions.addPickupSpot(this.plinths, 5, (placedObject: THREE.Object3D) => {
                this.plinths.add(placedObject);
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