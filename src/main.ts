import * as THREE from 'three';
import { TimeMS, TimeS } from './lib/types/misc.type';
import { changeScene, initScene, scene } from './SceneLoader';

initScene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

let prevTime = 0;
let switchFlag = false;
function mainUpdateLoop(totalTime: TimeS) {
	requestAnimationFrame( mainUpdateLoop );

  const deltaTime = (totalTime - prevTime) / 1000 as TimeMS; // Convert to milliseconds
  prevTime = totalTime;

  scene.update(deltaTime);

  if (!switchFlag && totalTime % 10000 >= 5000) {
    changeScene('demo 2');
    switchFlag = true;
  } else if (switchFlag && totalTime % 10000 < 5000) {
    changeScene('demo 1');
    switchFlag = false;
  }

  renderer.render( scene.root, camera );
}


mainUpdateLoop(0);