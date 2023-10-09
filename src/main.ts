//@ts-ignore
import AmmoLib from './ammo/ammo.js'; 
import { Project, Scene } from './lib/index';
import { SandboxScene } from './scenes/Sandbox.js';
import { MainMenu } from './scenes/MainMenu.js';
import { LevelOne } from './scenes/Level1.js';



AmmoLib().then(function (result: any) {
    const sceneMap = new Map<string, typeof Scene>([
        ['mainmenu', MainMenu],
        ['level1', LevelOne],
        ['sandbox', SandboxScene], 
    ]);

    // Ignoring unused variable
    //@ts-ignore
    const project = new Project(
        sceneMap,
        'mainmenu',
        {
            physicsEngine: result,
            shadows: true,
            stats: true,
        }
    );

}).catch((e: any) => console.error(e));
