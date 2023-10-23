import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { InteractManager } from "../lib/w3ads/InteractManager";
import { InterfaceContext } from "../lib/w3ads/InterfaceContext";
import { Lectern } from './Lectern';
import { Crystal } from './Crystal';
import { Hearth } from './Hearth';

let scope: any; // see Player.ts comment on scope
const numColours = 3;
const numFireplaces = 4;
const objectPlacedScales = [1, 0.2, 0.3]; // scale of the model on the table
const objectInHandScales = [1, 0.3, 0.3]; // scale of objects in hand
export class HearthObjects extends Construct {

    lectern: Lectern;
    crystal: Crystal;

    hearths: Array<Hearth>;
    objectModels: Array<THREE.Group | undefined>;

    carpetTexture!: THREE.Texture;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, hearths: Array<Hearth>) {
        super(graphics, physics, interactions, userInterface);

        scope = this;
        this.hearths = hearths;

        this.lectern = new Lectern(graphics, physics, interactions, userInterface, 'Hearth and Home', [
            'Amidst the tomes and shelves so wide,',
            'Three objects wait, secrets to confide.',
            'Choose just one, your fate\'s decree,',
            'To all the fireplaces, carry what you see.',
            'Place it at each hearth, in quiet mirth,',
            'Unlock the library\'s secrets, gain a crystal\'s worth.'
        ]);
        this.addConstruct(this.lectern);

        this.crystal = new Crystal(graphics, physics, interactions, userInterface);
        this.addConstruct(this.crystal);

        this.objectModels = [];
        /*
        for (let i = 0; i < 3; ++i) {
            this.objectModels.push(undefined);
        }*/
    }

    create(): void {
        this.lectern.root.position.set(-2.8, 0, 9);
        this.crystal.root.position.set(0, -100, 0);

        document.addEventListener('hearthLit', this.onHearthLit);
    }

    async load(): Promise<void> {

        try { this.carpetTexture = await this.graphics.loadTexture('assets/carpet.jpeg') as THREE.Texture; }
        catch { console.warn('Failed to find carpet'); }

        try {//sword model
            const result: any = await this.graphics.loadModel('assets/sword/scene.gltf');
            this.objectModels[0] = result.scene;
            this.objectModels[0]?.scale.setScalar(objectPlacedScales[0]);
        } catch { console.warn('Failed to load sword'); }

        try {//potion model
            const result: any = await this.graphics.loadModel('assets/potion/scene.gltf');
            this.objectModels[1] = result.scene;
            this.objectModels[1]?.scale.setScalar(objectPlacedScales[1]);
        } catch { console.warn('Failed to load potion'); }

        try {//flower mdoel
            const result: any = await this.graphics.loadModel('assets/flower/scene.gltf');
            this.objectModels[2] = result.scene;
            this.objectModels[2]?.scale.setScalar(objectPlacedScales[2]);
        } catch { console.warn('Failed to load flower'); }
    }

    build(): void {
        const objectColours = [
            0x009308, // Green
            0x99ccff, // Blue
            0x72158f // Purple
        ];

        const carpetMat = new THREE.MeshLambertMaterial({ map: this.carpetTexture })
        const carpetGeom = new THREE.PlaneGeometry(13, 25);
        const carpet = new THREE.Mesh(carpetGeom, carpetMat);
        carpet.position.set(1, 0, 0);
        carpet.rotation.set(-Math.PI / 2, 0, 0);
        this.add(carpet);

        const angleBetween = Math.PI / 4;
        const distanceFromCenter = 12;
        const tableOffset = Math.PI / 4; // just help centering the tables
        const tableMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const tableGeom = new THREE.BoxGeometry(2, 1.5, 2);
        for (let i = 0; i < numColours; ++i) {
            const table = new THREE.Mesh(tableGeom, tableMat);
            table.position.set(
                -7 + distanceFromCenter * Math.sin(i * angleBetween + tableOffset),
                1,
                distanceFromCenter * Math.cos(i * angleBetween + tableOffset),
            );
            table.rotation.set(0, Math.PI / 4 + i * Math.PI / 4 , 0);
            this.add(table);
            this.physics.addStatic(table, PhysicsColliderFactory.box(2.5, 0.75, 1));
            this.interactions.addPickupSpot(table, 4, (placedObject: THREE.Object3D) => {
                placedObject.position.set(0, 1, 0);
                placedObject.scale.setScalar(objectPlacedScales[i]);
                table.add(placedObject);
            });

            for (let j = 0; j < numFireplaces; ++j) {
                const objectModel = this.objectModels[i]; // Get the object model for this iteration
                if (objectModel) {
                    const clonedModel = objectModel.clone(); // Clone the object model
                    clonedModel.position.set(0, 1, 0);
                    table.add(clonedModel);
                    clonedModel.userData.fireplaceColour = objectColours[i];
                    this.interactions.addPickupObject(clonedModel, 5, objectInHandScales[i], () => {
                        if (clonedModel.parent?.userData.amHearth) {
                            for (let k = 0; k < this.hearths.length; ++k) { 
                                // search through all hearths and find the current one
                                if (this.hearths[k].root === clonedModel.parent) {
                                    this.hearths[k].killFire();
                                    break;
                                }
                            }
                        }
                    });
                }
            }
        }

    }

    update(): void {}

    destroy(): void {
        document.removeEventListener('hearthLit', this.onHearthLit)
    }

    onHearthLit() {
        console.log(scope.hearths);

        if (scope.hearths.length == 1) {
            scope.crystal.root.position.set(0, 5, 0);
        }

        for (let i = 1; i < scope.hearths.length; ++i) {
            if (scope.hearths[i].colour != scope.hearths[i - 1].colour) {
                return;
            }
        }

        scope.crystal.root.position.set(0, 5, 0);
    }

}