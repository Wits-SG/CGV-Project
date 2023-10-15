import * as THREE from 'three';
//@ts-ignore
import particleFire from 'three-particle-fire';
import { Construct, PhysicsColliderFactory } from '../lib';

particleFire.install({ THREE: THREE });
export class Hearth extends Construct {
    fire!: any | undefined;
    colour!: number;

    create(): void {
        this.colour = 0;
    }

    async load(): Promise<void> { }

    build(): void {
        const hearthMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const hearthGeom = new THREE.BoxGeometry(4, 8, 0.8);
        const hearth = new THREE.Mesh(hearthGeom, hearthMat);
        this.add(hearth);
        this.physics.addStatic(hearth, PhysicsColliderFactory.box(1, 2, 0.5));

        const fireGeom = new particleFire.Geometry(0.75, 2.5, 3000 );
        this.interactions.addPickupSpot(hearth, 5, (placedObject: THREE.Object3D) => {
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
            hearth.add(placedObject);

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

