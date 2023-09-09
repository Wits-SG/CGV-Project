import * as THREE from 'three';
import { Ammo, registerRigidObject, registerDynamicRigidObject } from '../PhysicsManager';
import { Level } from '../types/level.type';

export class PhysicsDemo extends Level {
    lightHemisphere!: THREE.HemisphereLight;
    lightDirectional!: THREE.DirectionalLight;

    blockPlane!: THREE.Mesh;
    ball!: THREE.Mesh;

    constructor() {
        super('Physics Demo', 'Physics Demo', '');
    }

    build(): void {

        this.root.background = new THREE.Color( 0xbfd1e5 );

        this.lightHemisphere = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
        this.lightHemisphere.color.setHSL( 0.6, 0.6, 0.6 );
        this.lightHemisphere.groundColor.setHSL( 0.1, 1, 0.4 );
        this.lightHemisphere.position.set(0, 50, 0);

        this.lightDirectional = new THREE.DirectionalLight( 0xffffff, 1 );
        this.lightDirectional.color.setHSL( 0.1, 1, 0.95 );
        this.lightDirectional.position.set( -1, 1.75, 1 );
        this.lightDirectional.position.multiplyScalar( 100 );

        this.lightDirectional.castShadow = true;

        this.lightDirectional.shadow.mapSize.width = 2048;
        this.lightDirectional.shadow.mapSize.height = 2048;

        this.lightDirectional.shadow.camera.left = -50;
        this.lightDirectional.shadow.camera.right = 50;
        this.lightDirectional.shadow.camera.top = 50;
        this.lightDirectional.shadow.camera.bottom = -50;

        this.blockPlane = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0xaaaaaa }));
        this.blockPlane.position.set(0, -5, 0);
        this.blockPlane.scale.set(50, 1, 50);
        this.blockPlane.castShadow = true;
        this.blockPlane.receiveShadow = true;

        this.ball = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        this.ball.position.set(0, 10, 0);
        this.ball.castShadow = true;
        this.ball.receiveShadow = true;

        registerRigidObject( this.blockPlane, 0, 0.05, new Ammo.btBoxShape( new Ammo.btVector3(25, 0.5, 25) ) );
        registerDynamicRigidObject( this.ball, 100, 0.05, new Ammo.btSphereShape( 2 ) );

        this.root.add( this.lightHemisphere );
        this.root.add( this.lightDirectional );
        this.root.add( this.blockPlane );
        this.root.add( this.ball );
    }

    update(): void {}

}