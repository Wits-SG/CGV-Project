//@ts-ignore
import AmmoLib from './ammo/ammo.js'; 
import { Project, Scene } from './lib/index';
import { MainMenu } from './scenes/MainMenu.js';
import { LoadingScreen } from './scenes/Loading.js';
import { LevelOne } from './scenes/Level1.js';
import { LevelTwo } from './scenes/Level2.js';
import { LevelThree } from './scenes/Level3.js';



AmmoLib().then(function (result: any) {
    const sceneMap = new Map<string, typeof Scene>([
        ['mainmenu', MainMenu],
        ['loading', LoadingScreen],
        ['level1', LevelOne],
        ['level2', LevelTwo],
        ['level3', LevelThree],
    ]);

    // Ignoring unused variable
    //@ts-ignore
    const project = new Project(
        sceneMap,
        'mainmenu',
        'loading',
        {
            physicsEngine: result,
            shadows: true,
            stats: true,
        }
    );

}).catch((e: any) => console.error(e));
