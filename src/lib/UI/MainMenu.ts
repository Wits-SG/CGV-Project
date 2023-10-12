import { InterfaceContext } from "../w3ads/InterfaceContext";
import { drawHowToPlay } from "./HowToPlay";
import { drawControls } from "./Controls";
import { drawLevelMenu } from "./LevelMenu";
import { drawCredits } from "./Credits";
import { buildButton } from "./utility";

export const drawMainMenu = (ui: InterfaceContext, developers: any, assets: any) => {
    const { menu: mainMenu, menuId: mainMenuId } = ui.addMenu('The Magic Library', false);

    const subtitle = document.createElement('h2');
    subtitle.className = 'text-xl';
    subtitle.textContent = 'The Spice Girls';

    const howToMenuId = drawHowToPlay(ui);
    const controlsMenuId = drawControls(ui);

    const sandboxButton = buildButton('Play Sandbox', () => {
        const event = new CustomEvent("changeScene", { detail: `sandbox`});
        document.dispatchEvent(event);
    });
    const howToPlayButton = buildButton('How to play', () => ui.showMenu(howToMenuId));
    const controls = buildButton('Controls', () => ui.showMenu(controlsMenuId));

    const seperatorOne = document.createElement('hr');
    seperatorOne.className = 'w-full border-t-2 border-black';
    const seperatorTwo = document.createElement('hr');
    seperatorTwo.className = 'w-full border-t-2 border-black';

    const levelMenuIds = drawLevelMenu(ui, [
        [{ name: 'Player 1', time: 60 },
        { name: 'Player 2', time: 120 },
        { name: 'Player 3', time: 180 },
        { name: 'Player 4', time: 240 }],
        [{ name: 'Player 1', time: 120 },
        { name: 'Player 2', time: 180 },
        { name: 'Player 3', time: 240 },
        { name: 'Player 4', time: 300 }],
        [{ name: 'Player 1', time: 180 },
        { name: 'Player 2', time: 240 },
        { name: 'Player 3', time: 300 },
        { name: 'Player 4', time: 360 }],
    ]);
    const levelButtons: Array<HTMLButtonElement> = [];

    for (let i = 0; i < 3; ++i) {
        const button = buildButton(`Level ${i + 1}`, () => {
            ui.showMenu(levelMenuIds[i]);
        });
        levelButtons.push(button);
    }


    const creditMenuId = drawCredits(ui, assets, developers);
    const creditsButton = buildButton('Credits', () => ui.showMenu(creditMenuId));

    mainMenu.appendChild(subtitle);
    mainMenu.appendChild(sandboxButton);

    for (let i = 0; i < 3; ++i) {
        mainMenu.appendChild(levelButtons[i]);
    }

    mainMenu.appendChild(seperatorOne)
    mainMenu.appendChild(howToPlayButton);
    mainMenu.appendChild(controls);

    mainMenu.appendChild(seperatorTwo)
    mainMenu.appendChild(creditsButton);

    ui.showMenu(mainMenuId);
}