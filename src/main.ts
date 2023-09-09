import AmmoLib from './ammo/ammo.js';
import * as THREE from 'three';
import { initLevel, level} from './LevelManager';
import { initPhysics, physUpdate } from './PhysicsManager';
import { TimeS } from './types/misc.type';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

// God bless the smart people
// https://github.com/gonnavis/three.js/commit/1227b9243d4be885e385aa54d93ad1cda1bef6fe#diff-44c2e6e2da946b542740c4150509969870d935e3bcc60832663d116bd50c1779
// https://discourse.threejs.org/t/how-to-convert-ammo-js-to-es6-module/30633/2

AmmoLib().then(function (result: any) {
  initialize(result);
}).catch((e: any) => console.log(e));

function initialize(Ammo: any) {
  initPhysics(Ammo);
  initLevel();

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  renderer.setClearColor( 0xbfd1e5 );
  renderer.shadowMap.enabled = true;

  camera.position.z = 10;

  let controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 2, 0 );
  controls.update();

  mainUpdateLoop();
}

function mainUpdateLoop() {
	requestAnimationFrame( mainUpdateLoop );

  const deltaTime = clock.getDelta() as TimeS;

  physUpdate(deltaTime);
  level.update(deltaTime); // Call the current scenes overriden update function

  renderer.render( level.root, camera );
}