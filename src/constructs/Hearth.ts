import * as THREE from 'three';
//@ts-ignore
import particleFire from 'three-particle-fire';
import { Construct, PhysicsColliderFactory } from '../lib';

particleFire.install({ THREE: THREE });
export class Hearth extends Construct {
    fire!: any | undefined;
    colour!: number;
    hearth!: THREE.Group;

    create(): void {
        this.colour = 0;
        this.root.userData.amHearth = true;
    }

    async load(): Promise<void> {
        try {//fireplace model
            const result: any = await this.graphics.loadModel('assets/fireplace/scene.gltf');
            this.hearth = result.scene;
        } catch { console.warn('Failed to fireplace'); }
     }

    build(): void {
        this.hearth.scale.set(1.5, 1.5, 1.5);
        this.add(this.hearth);
        this.physics.addStatic(this.hearth, PhysicsColliderFactory.box(3, 2, 1.5));

        const fireGeom = new particleFire.Geometry( 1, 4, 5000 );
        this.interactions.addPickupSpot(this.hearth, 5, (placedObject: THREE.Object3D) => {
            if (placedObject.userData.fireplaceColour) {

                this.fire?.removeFromParent(); // if the fire already exists, remove it so the material can be changed
                this.colour = placedObject.userData.fireplaceColour;

                const fireMat = new particleFire.Material({ color: this.colour });
                //@ts-ignore
                fireMat.setPerspective(this.graphics.mainCamera.fov, window.innerHeight);
                this.fire = new THREE.Points(fireGeom, fireMat);
                this.fire.position.set(0, 1, 0);
                this.add(this.fire); // the fire gets readded here
            }

            placedObject.position.set(0, 3, 0);
            this.add(placedObject);

            const litEvent = new Event('hearthLit');
            document.dispatchEvent(litEvent);
        });

    }

    //@ts-ignore
    update(time?: number | undefined, delta?: number | undefined): void {
        if (delta && this.fire) 
            this.fire.material.update(delta / 1000);

    }

    destroy(): void { }

    killFire() {
        this.fire?.removeFromParent(); // if the fire already exists, remove it so the material can be changed
        this.colour = 0;
    }
}

