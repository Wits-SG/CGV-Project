import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton, buildSection } from "./utility";

export const drawEndLevelMenu = (ui: InterfaceContext, levelName: string, levelKey: string, difficulty: string, numPuzzles: number, currentTime: number): number => {
    const { menu: menu, menuId: menuId } = ui.addMenu('You Win!', false);

    const informationSection = buildSection('Information');
        const levelP = document.createElement('p');
        levelP.innerHTML = `<b class="font-semibold">Level</b>: ${levelName}`;
        const timeP = document.createElement('p');
        timeP.innerHTML = `<b class="font-semibold">Current Time</b>: ${Math.floor(currentTime)} s`;
        const difficultyP = document.createElement('p');
        difficultyP.innerHTML = `<b class="font-semibold">Difficulty</b>: ${difficulty}`;
        const puzzlesP = document.createElement('p');
        puzzlesP.innerHTML = `<b class="font-semibold">Number of puzzles</b>: ${numPuzzles}`;

    const controlSection = buildSection('');
        const restart = buildButton('Try again?', () => {
            const event = new CustomEvent("changeScene", { detail: levelKey });
            document.dispatchEvent(event);
        })

        const exit = buildButton('Exit to menu', () => {
            const event = new CustomEvent("changeScene", { detail: 'mainmenu' });
            document.dispatchEvent(event);
        });

        controlSection.appendChild(restart);
        controlSection.appendChild(exit);

        informationSection.appendChild(levelP);
        informationSection.appendChild(timeP);
        informationSection.appendChild(difficultyP);
        informationSection.appendChild(puzzlesP);

    menu.appendChild(informationSection);
    menu.appendChild(controlSection);

    return menuId;

}