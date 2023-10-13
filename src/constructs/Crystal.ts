import * as THREE from 'three';
import { Construct } from '../lib/index';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass';

const bloomVertexShader = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }';
const bloomFragmentShader = 'uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; void main() { gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4(1.0) * texture2D( bloomTexture, vUv ) ); }';

const BLOOM = 2;

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
        const mat = new THREE.MeshLambertMaterial({ color: 0xff0000 })
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