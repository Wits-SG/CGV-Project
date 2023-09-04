import * as THREE from 'three';
import { Construct } from '../lib/types/construct.type';
import { TimeS } from '../lib/types/misc.type';

export class DemoConstruct2 extends Construct {
    plane!: THREE.Mesh;

    build(): void {
        const geometryPlane = new THREE.PlaneGeometry(2, 2);
        const materialPlane = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        this.plane = new THREE.Mesh( geometryPlane, materialPlane );

        this.root.add( this.plane);
    }

    update(deltaTime: TimeS): void {
        this.plane.rotation.y += 1 * deltaTime;
    }

}