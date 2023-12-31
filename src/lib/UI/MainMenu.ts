import { InterfaceContext } from "../w3ads/InterfaceContext";
import { drawHowToPlay } from "./HowToPlay";
import { drawControls } from "./Controls";
import { drawLevelMenu } from "./LevelMenu";
import { drawCredits } from "./Credits";
import { buildButton, buildSection } from "./utility";

export const drawMainMenu = (ui: InterfaceContext, developers: any, assets: any) => {
    const { menu: mainMenu, menuId: mainMenuId } = ui.addMenu('The Magic Library', false);

    const subtitle = document.createElement('h2');
    subtitle.className = 'text-xl';
    subtitle.textContent = 'The Spice Girls';

    const howToMenuId = drawHowToPlay(ui);
    const controlsMenuId = drawControls(ui);

    const playSection = buildSection('');
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
            playSection.appendChild(levelButtons[i]);
        }


    const helpSection = buildSection('');
        const howToPlayButton = buildButton('How to play', () => ui.showMenu(howToMenuId));
        const controls = buildButton('Controls', () => ui.showMenu(controlsMenuId));

    helpSection.appendChild(howToPlayButton);
    helpSection.appendChild(controls);

    const creditMenuId = drawCredits(ui, assets, developers);
    const creditsSection = buildSection('');
        const creditsButton = buildButton('Credits', () => ui.showMenu(creditMenuId));
    creditsSection.appendChild(creditsButton);

    mainMenu.appendChild(subtitle);
    mainMenu.appendChild(playSection);
    mainMenu.appendChild(helpSection);
    mainMenu.appendChild(creditsSection);

    ui.showMenu(mainMenuId);
}