import { Level } from "../types/level.type";
import { TimeS } from '../types/misc.type';
import { DemoConstruct1 } from '../constructs/DemoConstruct1';
import { changeLevel } from "../LevelManager";

export class Demo1 extends Level {
    demoConstruct!: DemoConstruct1;
    netTime: TimeS = 0;

    constructor() {
        super('Demo 1', 'Demo 1', '');
    }

    build(): void {
        this.demoConstruct = new DemoConstruct1();
        this.demoConstruct.load();

        this.netTime = 0;

        this.root.add( this.demoConstruct.root );
    }

    update(deltaTime: TimeS): void {
        this.demoConstruct.update(deltaTime);
        this.netTime += deltaTime;

        if (this.netTime >= 5) {
            changeLevel('DEMO-2')
        }
    }
}