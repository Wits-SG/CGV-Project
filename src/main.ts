//@ts-ignore
import AmmoLib from './ammo/ammo.js'; 
import * as THREE from 'three';
import { TimeS, TimeMS } from './types/misc.type';
import { PhysicsColliderFactory, Scene } from './lib/index.js';
import { Project } from './lib/w3ads/Project.js';

// God bless the smart people
// https://github.com/gonnavis/three.js/commit/1227b9243d4be885e385aa54d93ad1cda1bef6fe#diff-44c2e6e2da946b542740c4150509969870d935e3bcc60832663d116bd50c1779
// https://discourse.threejs.org/t/how-to-convert-ammo-js-to-es6-module/30633/2


class W3adScene extends Scene {
  testBox!: THREE.Mesh;
  testSphere!: THREE.Mesh;

  constructor(AmmoLib: any) {
    super(
      'Test W3ads Scene',
      AmmoLib,
      new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    );
  }

  create(): void {}

  load(): void {}

  build(): void {
    this.testSphere = this.graphics.addSphere({
      position: { x: 0, y: 10, z: 0},
      radius: 1,
      colour: 0xff0000,
      shadows: true,
    });

    this.testBox = this.graphics.addBox({
      position: {x: 0.7, y: 0, z: 0},
      scale: {x: 20, y: 0.1, z: 20},
      rotation: {x: 0.2, y: 0, z: 0},
      colour: 0x00ff00,
      shadows: true,
    });

    this.physics.addDynamic(this.testSphere, PhysicsColliderFactory.sphere(1), {
      mass: 1,
      linearVelocity: { x: 0, y: 20, z: 0 }
    });

    this.physics.addStatic(this.testBox, PhysicsColliderFactory.box(10, 0.05, 10))

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
  }

  destroy(): void {}

}

let project: Project;
const update = () => {
      const deltaTime = project.clock.getDelta() * 1000 as TimeMS;
      const netTime = project.clock.getElapsedTime() as TimeS;

      if (project.currentScene != null) {
          project.currentScene._update(netTime, deltaTime);
          project.renderer.render(project.currentScene.graphics.root, project.currentScene.graphics.mainCamera);
      }

      project.animFrameID = requestAnimationFrame(update);
  }

AmmoLib().then(function (result: any) {
  project = new Project(
    [ new W3adScene(result) ],
    {
      shadows: true,
    }
  );

  update();
}).catch((e: any) => console.error(e));