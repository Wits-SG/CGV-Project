import * as THREE from 'three';
import { TimeMS, TimeS } from './lib/types/misc.type';
import { Demo1 } from './scenes/Demo1';

let scene = new Demo1;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.load();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

let prevTime = 0;
function mainUpdateLoop(totalTime: TimeS) {
	requestAnimationFrame( mainUpdateLoop );

  const deltaTime = (totalTime - prevTime) / 1000 as TimeMS; // Convert to milliseconds
  prevTime = totalTime;

  scene.update(deltaTime);
  renderer.render( scene.root, camera );
}


mainUpdateLoop(0);