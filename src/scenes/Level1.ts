import { MainLibraryConstruct } from "../constructs/MainLibraryRoom";
import { Player } from "../constructs/Player";
import { Scene } from "../lib";

export class LevelOne extends Scene {
    player: Player;
    library: MainLibraryConstruct;

    constructor(AmmoLib: any) {
        super(
            'MainMenu',
            AmmoLib
        );

        const levelConfig = {
            key: 'level1',
            name: '1',
            difficulty: 'Easy',
            numPuzzles: 1,
        };

        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface, levelConfig);
        this.addConstruct(this.player);

        this.library = new MainLibraryConstruct(this.graphics, this.physics, this.interactions, this.userInterface, 1, this.player);
        this.addConstruct(this.library);
    }

    create(): void {
        this.library.root.position.set(0,0,0);
    }

    async load(): Promise<void> {}

    build(): void {}

    update(): void {}

    destroy(): void {}

}