import { Scene } from "../lib/types/scene.type";
import { TimeS } from '../lib/types/misc.type';
import { DemoConstruct1 } from '../constructs/DemoConstruct1';

export class Demo1 extends Scene {
    demoConstruct!: DemoConstruct1;

    constructor() {
        super('Demo 1');
    }

    build(): void {
        this.demoConstruct = new DemoConstruct1();
        this.demoConstruct.load();

        this.root.add( this.demoConstruct.root );
    }

    update(deltaTime: TimeS): void {
        this.demoConstruct.update(deltaTime);
    }
}