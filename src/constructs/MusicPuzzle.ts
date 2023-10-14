import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { Lectern } from './Lectern';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';

const numInstruments = 5;
export class MusicPuzzle extends Construct {

    carpet!: THREE.Mesh;
    lectern: Lectern;

    solution: Array<number>; // the answer
    state: Array<number>; // the currently inputted answer

    carpetTexture!: THREE.Texture;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);

        this.lectern = new Lectern(graphics, physics, interactions, userInterface, 'Music', ['Play them']);
        this.addConstruct(this.lectern);


        this.solution = [];
        this.state = [];
    }

    create(): void {
        this.lectern.root.position.set(-9, 0, -9);
        this.lectern.root.rotation.set(0, Math.PI / 4, 0)
        this.lectern.root.lookAt(this.root.position);

        for (let i = 0; i < numInstruments; ++i) {
            let nextInstrument = Math.floor(Math.random() * numInstruments);
            while ( this.solution.includes(nextInstrument, 0) ) { nextInstrument = Math.floor(Math.random() * numInstruments); }
            this.solution.push( nextInstrument );
        }
    }

    async load(): Promise<void> {

        try { this.carpetTexture = await this.graphics.loadTexture('assets/carpet.jpeg') as THREE.Texture; }
        catch { console.warn('Failed to find carpet'); }
    }

    build(): void {
        const carpetMat = new THREE.MeshPhongMaterial({ map: this.carpetTexture })
        const carpetGeom = new THREE.PlaneGeometry(22, 25);
        this.carpet = new THREE.Mesh(carpetGeom, carpetMat);
        this.carpet.rotation.set(-Math.PI / 2, 0, 0);
        this.add(this.carpet);

        const angleBetween = Math.PI / (numInstruments - 1);
        const distanceFromCenter = 9.5;

        const standMat = new THREE.MeshBasicMaterial({ color: 0x000099 });
        const standGeom = new THREE.BoxGeometry(1, 3, 1);
        const stand = new THREE.Mesh(standGeom, standMat);
        stand.position.set(-5, 1, 0);
        stand.rotation.y = this.solution[0] * angleBetween;
        this.add(stand);
        this.physics.addStatic(stand, PhysicsColliderFactory.box(0.5, 1.5, 0.5));
        this.interactions.addInteractable(stand, 3, () => {
            this.state = [];
            stand.rotation.y = this.solution[0] * angleBetween;
        });

        for (let i = 0; i < numInstruments; ++i) {
            const instrumentMat = new THREE.MeshBasicMaterial({ color: 0x009900 });
            const instrumentGeom = new THREE.BoxGeometry(2, 4, 2);
            const instrument = new THREE.Mesh(instrumentGeom, instrumentMat);
            instrument.position.set(
                distanceFromCenter * Math.sin(i * angleBetween),
                2,
                distanceFromCenter * Math.cos(i * angleBetween),
            )
            this.add(instrument);
            this.physics.addStatic(instrument, PhysicsColliderFactory.box(1, 2, 1));
            this.interactions.addInteractable(instrument, 5, () => {
                this.state.push(i);
                stand.rotation.y = this.solution[this.state.length - 1] * angleBetween;                

                if (this.state.length == numInstruments) {
                    let solved = true;
                    for (let j = 0; j < numInstruments; ++j) {
                        solved = solved && this.state[j] == this.solution[j];
                    }

                    console.log(solved);
                }
            });
        }

    }

    update(): void {}

    destroy(): void {}

}