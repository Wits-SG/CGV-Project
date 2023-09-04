import * as THREE from 'three';
import { Construct } from '../lib/types/construct.type';
import { TimeS } from '../lib/types/misc.type';
import { DemoConstruct2 } from './DemoConstruct2';

export class DemoConstruct1 extends Construct {
    sphere!: THREE.Mesh;
    cube!: THREE.Mesh;
    demoSubConstruct!: DemoConstruct2;

    build(): void {
        const geometrySphere = new THREE.SphereGeometry(0.2);
        const materialSphere = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.sphere = new THREE.Mesh( geometrySphere, materialSphere);
        this.sphere.position.x = 2;

        const geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
        const materialCube = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometryCube, materialCube );

        this.demoSubConstruct = new DemoConstruct2();
        this.demoSubConstruct.load();
        this.demoSubConstruct.root.position.z -= 1;
        this.demoSubConstruct.root.scale.addScalar(1.4);

        this.cube.add( this.sphere );
        this.root.add( this.demoSubConstruct.root );
        this.root.add( this.cube );
    }

    update(deltaTime: TimeS): void {
        this.cube.rotation.x += 1 * deltaTime;
        this.cube.rotation.y += 1 * deltaTime;
        this.demoSubConstruct.root.rotation.z += 0.2 * deltaTime;
    }

}