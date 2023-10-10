import { MainLibraryConstruct } from "../constructs/MainLibraryRoom";
import { Player } from "../constructs/Player";
import { Scene } from "../lib";

export class LevelThree extends Scene {
    player: Player;
    library: MainLibraryConstruct;

    constructor(AmmoLib: any) {
        super(
            'MainMenu',
            AmmoLib
        );

        const levelConfig = {
            key: 'level3',
            name: '3',
            difficulty: 'Hard',
            numPuzzles: 5,
        };

        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface, levelConfig);
        this.addConstruct(this.player);

        this.library = new MainLibraryConstruct(this.graphics, this.physics, this.interactions, this.userInterface, 5, this.player, 'level3');
        this.addConstruct(this.library);
    }

    create(): void {}

    async load(): Promise<void> {}

    build(): void {}

    update(): void {}

    destroy(): void {}

}