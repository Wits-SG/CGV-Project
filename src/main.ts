//@ts-ignore
import AmmoLib from './ammo/ammo.js'; 
import { TimeS, TimeMS } from './lib/w3ads/types/misc.type';
import { Project } from './lib/w3ads/Project.js';
import { TestScene } from './scenes/TestScene.js';


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
    [ new TestScene(result) ],
    {
      physicsEngine: result,
      shadows: true,
    }
  );

  update();
}).catch((e: any) => console.error(e));