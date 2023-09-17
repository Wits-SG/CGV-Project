import * as THREE from 'three';
import { PhysicsColliderFactory, GraphicsPrimitiveFactory, Scene } from '../lib/index.js';
import { TimeS } from '../lib/w3ads/types/misc.type.js';

export class TestScene extends Scene {
  testBox!: THREE.Mesh;
  testSphere!: THREE.Mesh;
  stopBox!: THREE.Mesh;
  cobj!: THREE.Object3D;

  constructor(AmmoLib: any) {
    super(
      'Test W3ads Scene',
      AmmoLib
    );
  }

  create(): void {}

  load(): void {}

  build(): void {
    this.graphics.mainCamera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000);
    this.graphics.mainCamera.position.set(30, 20, 30);
    this.graphics.mainCamera.lookAt(0,0,0);

    this.testSphere = GraphicsPrimitiveFactory.sphere({
      position: { x: 0, y: 10, z: 0},
      rotation: { x: 0, y: 0, z: 0},
      radius: 1,
      colour: 0xff0000,
      shadows: true,
    });

    this.cobj = new THREE.Object3D();
    this.cobj.position.set(0,0,0);
    this.cobj.rotateZ(-0.2);
    this.cobj.rotateX(0.015)

    this.testBox = GraphicsPrimitiveFactory.box({
      position: {x: 0, y: 0, z: 0},
      scale: {x: 20, y: 0.1, z: 20},
      rotation: {x: 0, y: 0, z: 0},
      colour: 0x00ff00,
      shadows: true,
    });

    this.stopBox = GraphicsPrimitiveFactory.box({
      position: {x: 10, y: 1, z: 0},
      scale: {x: 0.2, y: 2, z: 20},
      rotation: {x: 0, y: 0, z: 0},
      colour: 0x0000ff,
      shadows: true,
    });

    this.cobj.add(this.testBox);
    this.cobj.add(this.stopBox);
    this.graphics.add(this.testSphere);
    this.graphics.add(this.cobj);

    this.physics.addDynamic(this.testSphere, PhysicsColliderFactory.sphere(1), {
      mass: 1,
      linearVelocity: { x: -3, y: 5, z: 0 }
    });

    this.physics.addStatic(this.testBox, PhysicsColliderFactory.box(10, 0.05, 10))
    this.physics.addStatic(this.stopBox, PhysicsColliderFactory.box(0.01, 1, 20))

    let lightHemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    lightHemisphere.color.setHSL(0.6, 0.6, 0.6);
    lightHemisphere.groundColor.setHSL(0.1, 1, 0.4);
    lightHemisphere.position.set(0, 50, 0);

    let lightDirectional = new THREE.DirectionalLight(0xffffff, 1);
    lightDirectional.color.setHSL(0.1, 1, 0.95);
    lightDirectional.position.set(-1, 1.75, 1);
    lightDirectional.position.multiplyScalar(100);

    lightDirectional.castShadow = true;

    lightDirectional.shadow.mapSize.width = 2048;
    lightDirectional.shadow.mapSize.height = 2048;

    lightDirectional.shadow.camera.left = -50;
    lightDirectional.shadow.camera.right = 50;
    lightDirectional.shadow.camera.top = 50;
    lightDirectional.shadow.camera.bottom = -50;

    this.graphics.add(lightHemisphere);
    this.graphics.add(lightDirectional);
  }

  update(): void {
    this.physics.applyCentralForceOn(this.testSphere, -0.8, 0, 0);
  }

  destroy(): void {}

}