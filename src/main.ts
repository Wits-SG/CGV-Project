//@ts-ignore
import AmmoLib from './ammo/ammo.js'; 
import { Project, Scene } from './lib/index';
import { TestScene } from './scenes/TestScene.js';
import { SandboxScene } from './scenes/Sandbox.js';



AmmoLib().then(function (result: any) {
    const sceneMap = new Map<string, typeof Scene>([
        ['sandbox', SandboxScene], 
        ['test', TestScene],
    ]);

    // Ignoring unused variable
    //@ts-ignore
    const project = new Project(
        sceneMap,
        {
            physicsEngine: result,
            shadows: true,
        }
    );

}).catch((e: any) => console.error(e));
