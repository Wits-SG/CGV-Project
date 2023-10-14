import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from "../lib";
import { Lectern } from './Lectern';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import { Crystal } from './Crystal';

const numInstruments = 5;
const standAngleOffset = Math.PI;
export class MusicPuzzle extends Construct {

    carpet!: THREE.Mesh;
    lectern: Lectern;
    crystal: Crystal;

    solution: Array<number>; // the answer
    state: Array<number>; // the currently inputted answer

    carpetTexture!: THREE.Texture;
    standModel!: THREE.Group;
    standAngles: Array<number>;

    instrumentModels: Array<THREE.Group | undefined>;
    instrumentSounds: Array<any>;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext) {
        super(graphics, physics, interactions, userInterface);

        this.lectern = new Lectern(graphics, physics, interactions, userInterface, 'Music', ['Play them']);
        this.addConstruct(this.lectern);

        this.crystal = new Crystal(graphics, physics, interactions, userInterface);
        this.addConstruct(this.crystal);

        this.solution = [];
        this.state = [];

        this.instrumentModels = [];
        this.instrumentSounds = [];
        for (let i = 0; i < numInstruments; ++i) {
            this.instrumentModels.push(undefined);
            this.instrumentSounds.push(undefined);
        }

        this.standAngles = [];
    }

    create(): void {
        this.crystal.root.position.set(0, -10, 0);

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

        try { 
            const result: any = await this.graphics.loadModel('assets/music_stand/scene.gltf');
            this.standModel = result.scene; 
            // this.standModel.rotation.set(0, Math.PI + 2 * Math.PI / 4, 0);
        }
        catch { console.warn('Failed to find stand model'); }

        try {
            const result: any = await this.graphics.loadModel('assets/piano_low_poly/scene.gltf');
            this.instrumentModels[2] = result.scene;
            this.instrumentModels[2]?.scale.set(0.4, 0.4, 0.4);
        } catch { console.warn('Failed to find piano model'); }

        try {
            const result: any = await this.graphics.loadModel('assets/classical_guitar/scene.gltf');
            this.instrumentModels[0] = result.scene;
            this.instrumentModels[0]?.scale.set(0.3, 0.3, 0.3);
            this.instrumentModels[0]?.rotation.set(0, Math.PI, 0);
        } catch { console.warn('Failed to find guitar model'); }

        try {
            const result: any = await this.graphics.loadModel('assets/djembe/scene.gltf');
            this.instrumentModels[1] = result.scene;
            this.instrumentModels[1]?.scale.setScalar(0.8);
        } catch { console.warn('Failed to find djembe model'); }

        try {
            const result: any = await this.graphics.loadModel('assets/lute/scene.gltf');
            this.instrumentModels[3] = result.scene;
            this.instrumentModels[3]?.scale.setScalar(2);
            this.instrumentModels[3]?.rotation.set(0, -Math.PI / 4, 0);
        } catch { console.warn('Failed to find lute model'); }

        try {
            const result: any = await this.graphics.loadModel('assets/saxophone/scene.gltf');
            this.instrumentModels[4] = result.scene;
            this.instrumentModels[4]?.rotation.set(0, Math.PI / 2, 0);
        } catch { console.warn('Failed to find saxophone model'); }
    }

    build(): void {
        const carpetMat = new THREE.MeshLambertMaterial({ map: this.carpetTexture })
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
        this.standModel.position.set(-5, 1, 0);
        this.standModel.scale.setScalar(2);
        this.standModel.rotation.y = standAngleOffset + this.solution[0] * angleBetween;
        this.add(this.standModel);
        this.physics.addStatic(stand, PhysicsColliderFactory.box(0.5, 1.5, 0.5));
        this.interactions.addInteractable(stand, 3, () => {
            this.state = [];
            stand.rotation.y = this.solution[0] * angleBetween;
            this.standModel.rotation.y = standAngleOffset + this.solution[0] * angleBetween;
        });
        stand.removeFromParent(); // hide collision box

        for (let i = 0; i < numInstruments; ++i) {
            let width = 1;
            let height = 0;

            switch (i) {
                case 0: 
                    height = 2;
                    break;
                case 1:
                    height = 2;
                    break;
                case 2:
                    width = 5;
                    break;
                case 3:
                    height = 2;
                    break;
                case 4:
                    break;
            }

            const instrumentMat = new THREE.MeshBasicMaterial({ color: 0x009900 });
            const instrumentGeom = new THREE.BoxGeometry(2, 4, width);
            const instrument = new THREE.Mesh(instrumentGeom, instrumentMat);
            instrument.position.set(
                distanceFromCenter * Math.sin(i * angleBetween),
                2,
                distanceFromCenter * Math.cos(i * angleBetween),
            )
            this.add(instrument);

            if (this.instrumentModels[i] !== undefined) {
                this.instrumentModels[i]?.position.set(
                    distanceFromCenter * Math.sin(i * angleBetween),
                    height,
                    distanceFromCenter * Math.cos(i * angleBetween),
                );
                //@ts-ignore
                this.add(this.instrumentModels[i]);
            }

            this.physics.addStatic(instrument, PhysicsColliderFactory.box(1, 2, width / 2));
            this.interactions.addInteractable(instrument, 5, () => {
                this.state.push(i);
                stand.rotation.y = this.solution[this.state.length - 1] * angleBetween;                
                this.standModel.rotation.y = standAngleOffset + this.solution[this.state.length] * angleBetween;

                if (this.state.length == numInstruments) {
                    let solved = true;
                    for (let j = 0; j < numInstruments; ++j) {
                        solved = solved && this.state[j] == this.solution[j];
                    }

                    if (solved) {
                        // Puzzle is solved
                        this.crystal.root.position.set(0, 2, 0);

                    } else {
                        // Reset the puzzle
                        this.state = [];
                        stand.rotation.y = this.solution[0] * angleBetween;
                    }
                }
            });
            instrument.removeFromParent();
        }

    }

    update(): void {}

    destroy(): void {}

}