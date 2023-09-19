//@ts-ignore
import AmmoLib from './ammo/ammo.js'; 
import { Project } from './lib/w3ads/Project.js';
import { TestScene } from './scenes/TestScene.js';
import { SandboxScene } from './scenes/Sandbox.js';



AmmoLib().then(function (result: any) {
  //@ts-ignore
  const project = new Project(
    [ new SandboxScene(result), new TestScene(result) ],
    {
      physicsEngine: result,
      shadows: true,
    }
  );

}).catch((e: any) => console.error(e));