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
        '8f3f4b29-38a7-4b13-baa2-95fde6530d7f',
        'f39a8262-ee35-4e9a-92a4-0e43848a7d74',
        'b754a3e7-6f90-4ef6-97d3-9a8d7b4ea929'
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