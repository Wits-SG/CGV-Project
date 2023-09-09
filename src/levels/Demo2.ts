import * as THREE from 'three';
import { Level } from "../types/level.type";
import { TimeS } from '../types/misc.type';
import { changeLevel } from '../LevelManager';

export class Demo2 extends Level {
    cube!: THREE.Mesh;
    netTime: TimeS = 0;

    constructor() {
        super('Demo 2', 'Demo 2', '');
    }

    build(): void {
        const geometry = new THREE.BoxGeometry( 1, 2, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        this.cube = new THREE.Mesh( geometry, material );

        this.netTime = 0;

        this.root.add( this.cube );
    }

    update(deltaTime: TimeS): void {
        this.cube.rotation.x += 1 * deltaTime;
        this.cube.rotation.y += 1 * deltaTime;
        this.netTime += deltaTime;

        if (this.netTime >= 5) {
            changeLevel('DEMO-1');
        }
    }
}