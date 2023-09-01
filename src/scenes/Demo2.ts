import * as THREE from 'three';
import { Scene } from "../lib/types/scene.type";
import { TimeMS } from '../lib/types/misc.type';

export class Demo2 extends Scene {
    cube!: THREE.Mesh;

    constructor() {
        super('Demo 2');
    }

    build(): void {
        const geometry = new THREE.BoxGeometry( 1, 2, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        this.cube = new THREE.Mesh( geometry, material );

        this.root.add( this.cube );
    }

    update(deltaTime: TimeMS): void {
        this.cube.rotation.x += 1 * deltaTime;
        this.cube.rotation.y += 1 * deltaTime;
    }
}