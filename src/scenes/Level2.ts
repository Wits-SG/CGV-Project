import { MainLibraryConstruct } from "../constructs/MainLibraryRoom";
import { Player } from "../constructs/Player";
import { Scene } from "../lib";

export class LevelTwo extends Scene {
    player: Player;
    library: MainLibraryConstruct;

    constructor(AmmoLib: any) {
        super(
            'MainMenu',
            AmmoLib
        );

        const levelConfig = {
            key: 'level2',
            name: '2',
            difficulty: 'Medium',
            numPuzzles: 3,
            levelId: 'f39a8262-ee35-4e9a-92a4-0e43848a7d74',
        };

        this.player = new Player(this.graphics, this.physics, this.interactions, this.userInterface, levelConfig);
        this.addConstruct(this.player);

        this.library = new MainLibraryConstruct(this.graphics, this.physics, this.interactions, this.userInterface, 3, this.player);
        this.addConstruct(this.library);
    }

    create(): void {}

    async load(): Promise<void> {}

    build(): void {}

    update(): void {}

    destroy(): void {}

}