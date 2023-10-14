import * as THREE from 'three';
import { Construct } from '../lib/index';

export class Crystal extends Construct {
    crystalBody!: THREE.Mesh;
    glowTexture!: any;
    glowSprite!: THREE.Sprite;

    create(): void {
        
    }

    
    async load() {
        try {
            this.glowTexture = await this.graphics.loadTexture('assets/glow.png');
        } catch {
            console.error('Failed to fetch glow texture');
        }
    }

    build(): void {
        const colour = new THREE.Color;
        colour.setHSL( Math.random(), 1, 0.3 );
        const mat = new THREE.MeshLambertMaterial({ color: colour, emissive: colour})
        const geom = new THREE.IcosahedronGeometry(0.5, 0);

        this.crystalBody = new THREE.Mesh(geom, mat);
        this.add(this.crystalBody);

        const glowMat = new THREE.SpriteMaterial({ map: this.glowTexture, blending: THREE.AdditiveBlending, transparent: true, color: mat.color,  });
        this.glowSprite = new THREE.Sprite( glowMat );
        this.glowSprite.scale.set(4, 4, 0.1);
        this.crystalBody.add(this.glowSprite);

        this.interactions.addPickupObject(this.root, 5, 1, () => {});
        this.root.userData.isCrystal = true;
        this.root.userData.foundCrystal = false;
    }

    update(): void {
        this.glowSprite.lookAt(this.graphics.mainCamera.position);        
    }

    destroy(): void {
        
    }

}