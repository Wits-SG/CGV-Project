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
    }

    async load(): Promise<void> {
        try {//fireplace model
            const result: any = await this.graphics.loadModel('assets/fireplace/scene.gltf');
            this.hearth = result.scene;
        } catch { console.warn('Failed to fireplace'); }
     }

    build(): void {

        this.hearth.scale.set(6,6,6);
        this.hearth.position.set(0,0,0);
        this.add(this.hearth);
        this.physics.addStatic(this.hearth, PhysicsColliderFactory.box(1, 2, 0.5));

        const fireGeom = new particleFire.Geometry(0.75, 2.5, 3000 );
        this.interactions.addPickupSpot(this.hearth, 5, (placedObject: THREE.Object3D) => {
            if (placedObject.userData.fireplaceColour) {

                this.fire?.removeFromParent();
                this.colour = placedObject.userData.fireplaceColour;

                const fireMat = new particleFire.Material({ color: this.colour });
                //@ts-ignore
                fireMat.setPerspective(this.graphics.mainCamera.fov, window.innerHeight);
                this.fire = new THREE.Points(fireGeom, fireMat);
                this.fire.position.set(0, 0, 1);
                this.add(this.fire);
            }

            placedObject.position.set(0, 3, 0.5);
            this.hearth.add(placedObject);

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

}

