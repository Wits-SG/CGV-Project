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
export class HearthObjects extends Construct {

    lectern: Lectern;
    crystal: Crystal;

    hearths: Array<Hearth>;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, hearths: Array<Hearth>) {
        super(graphics, physics, interactions, userInterface);

        scope = this;
        this.hearths = hearths;

        this.lectern = new Lectern(graphics, physics, interactions, userInterface, 'Hearth and Home', [
            'In a place with colors three, a crystal key you seek to free.',
            'Match the objects to their hearths of hue, to unlock the door, it\'s up to you.'
        ]);
        this.addConstruct(this.lectern);

        this.crystal = new Crystal(graphics, physics, interactions, userInterface);
        this.addConstruct(this.crystal);
    }

    create(): void {
        this.lectern.root.position.set(-2.8, 0, -9);
        this.lectern.root.rotation.set(0, Math.PI, 0);
        this.crystal.root.position.set(0, -100, 0);

        document.addEventListener('hearthLit', this.onHearthLit);
    }

    async load(): Promise<void> {}

    build(): void {
        const objectColours = [0x009308, 0x99ccff, 0x72158f]

        const carpetMat = new THREE.MeshLambertMaterial({ color: 0xff0000 })
        const carpetGeom = new THREE.PlaneGeometry(10, 25);
        const carpet = new THREE.Mesh(carpetGeom, carpetMat);
        carpet.position.set(1, 0, 0);
        carpet.rotation.set(-Math.PI / 2, 0, 0);
        this.add(carpet);

        const angleBetween = Math.PI / 4;
        const distanceFromCenter = 12;
        const tableOffset = Math.PI / 4; // just help centering the tables
        const tableMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
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
                placedObject.scale.setScalar(1);
                table.add(placedObject);
            });

            const itemMat = new THREE.MeshBasicMaterial({ color: objectColours[i] })
            const itemGeom = new THREE.BoxGeometry(0.25, 0.25, 0.25);
            for (let j = 0; j < numFireplaces; ++j) {
                const item = new THREE.Mesh(itemGeom, itemMat);
                item.position.set(0, 1, 0);
                table.add(item);
                item.userData.fireplaceColour = objectColours[i];

                this.interactions.addPickupObject(item, 5, 2, () => {});
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