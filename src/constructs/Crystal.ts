import * as THREE from 'three';
import { Construct } from '../lib/index';

export class Crystal extends Construct {
    crystalBody!: THREE.Mesh;

    create(): void {
        
    }
    async load() {
        
    }

    build(): void {
        const mat = new THREE.MeshLambertMaterial({ color: 0xff0000 })
        const geom = new THREE.IcosahedronGeometry(0.5, 0);


        this.crystalBody = new THREE.Mesh(geom, mat);
        this.add(this.crystalBody);

        this.interactions.addPickupObject(this.root, 5, 1, () => {});
    }

    update(): void {
        
    }
    destroy(): void {
        
    }

}