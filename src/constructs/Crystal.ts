import * as THREE from 'three';
import { Construct } from '../lib/index';

export class Crystal extends Construct {
    crystalBody!: THREE.Mesh;

    create(): void {
        
    }
    
    async load() {
        
    }

    build(): void {
        const colour = new THREE.Color;
        colour.setHSL( Math.random(), 1, 0.3 );
        const mat = new THREE.MeshLambertMaterial({ color: colour, emissive: colour})
        const geom = new THREE.IcosahedronGeometry(0.5, 0);

        this.crystalBody = new THREE.Mesh(geom, mat);
        this.add(this.crystalBody);

        this.interactions.addPickupObject(this.root, 5, 1, () => {});
        this.root.userData.isCrystal = true;
        this.root.userData.foundCrystal = false;
    }

    update(): void {
        
    }

    destroy(): void {
        
    }

}