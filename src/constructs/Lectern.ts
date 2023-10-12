import * as THREE from 'three';
import { Construct, GraphicsContext, PhysicsColliderFactory, PhysicsContext } from '../lib/index';
import { InteractManager } from '../lib/w3ads/InteractManager';
import { InterfaceContext } from '../lib/w3ads/InterfaceContext';
import { drawHintMenu } from '../lib/UI/HintMenu';

export class Lectern extends Construct {

    title: string;
    paragraphs: Array<string>;

    lectern!: THREE.Group;
    menuId!: number;

    constructor(graphics: GraphicsContext, physics: PhysicsContext, interactions: InteractManager, userInterface: InterfaceContext, title: string, paragraphs: Array<string>) {
        super(graphics, physics, interactions, userInterface);

        this.title = title;
        this.paragraphs = paragraphs;
    } 

    create(): void {
        this.menuId = drawHintMenu(this.userInterface, this.title, this.paragraphs);
    }

    async load() {
        const fallbackMat = new THREE.MeshLambertMaterial({ color: 0x800080 });
        const fallbackGeom = new THREE.BoxGeometry(1, 1, 1);

        try {
            const gltfData: any = await this.graphics.loadModel('assets/Lectern/lectern.gltf');
            this.lectern = gltfData.scene;
        } catch(e: any) {
            this.lectern = new THREE.Group();
            this.lectern.add(new THREE.Mesh(fallbackGeom, fallbackMat));
            console.error(e);
        }
    }

    build(): void {
        this.add(this.lectern);

        this.interactions.addInteractable(this.root, 5, () => {
            document.exitPointerLock();
            setTimeout(() => {
                this.userInterface.hideAll();
                this.userInterface.showMenu(this.menuId);
            }, 100); // eww very eww -> but has to happen because of the pointer lock weirdness where a pause is triggered when releasing the pointer
        });

        const tempMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const tempGeom = new THREE.BoxGeometry(1.75, 4.2, 1.75);
        const tempMesh = new THREE.Mesh(tempGeom, tempMat);
        tempMesh.position.set(0, 1, 0);

        this.add(tempMesh);
        this.physics.addStatic(tempMesh, PhysicsColliderFactory.box(0.75, 2, 0.75));
        tempMesh.removeFromParent();
    }

    update(): void {
        
    }
    destroy(): void {
        
    }

}