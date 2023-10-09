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

        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface, 'level1');
        this.addConstruct(this.player);

        this.library = new MainLibraryConstruct(this.graphics, this.physics, this.interactions, this.userInterface, 1, this.player, 'level1');
        this.addConstruct(this.library);
    }

    create(): void {}

    async load(): Promise<void> {}

    build(): void {}

    update(): void {}

    destroy(): void {}

}