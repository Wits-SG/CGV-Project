import * as THREE from 'three';
import { TimeS } from './lib/types/misc.type';
import { initLevel, level} from './LevelManager';

initLevel();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

let prevTime = 0;
function mainUpdateLoop(totalTime: TimeS) {
	requestAnimationFrame( mainUpdateLoop );

  const deltaTime = (totalTime - prevTime) / 1000 as TimeS; 
  prevTime = totalTime;

  level.update(deltaTime); // Call the current scenes overriden update function

  renderer.render( level.root, camera );
}

// Start the game loop
mainUpdateLoop(0);