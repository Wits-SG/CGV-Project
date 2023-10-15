import { InterfaceContext } from "../w3ads/InterfaceContext";
import { drawHowToPlay } from "./HowToPlay";
import { drawControls } from "./Controls";
import { buildButton, buildSection } from "./utility";
import { Player } from "../../constructs/Player";
import { drawCharacterMenu, drawEffectsMenu, drawFiltersMenu } from "./Options";

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {

        return `${seconds}s`;
    }
}

export const drawPauseMenu = (ui: InterfaceContext, player: Player, levelName: string, levelKey: string, difficulty: string, numPuzzles: number, currentTime: number): number => {
    const { menu: pauseMenu, menuId: pauseMenuId } = ui.addMenu('Paused', false);

    const informationSection = buildSection('Info');
        const levelP = document.createElement('p');
        levelP.innerHTML = `<b class="font-semibold">Level</b>: ${levelName}`;
        const timeP = document.createElement('p');
        timeP.innerHTML = `<b class="font-semibold">Current Time</b>: ${formatTime(currentTime)} s`;
        const difficultyP = document.createElement('p');
        difficultyP.innerHTML = `<b class="font-semibold">Difficulty</b>: ${difficulty}`;
        const puzzlesP = document.createElement('p');
        puzzlesP.innerHTML = `<b class="font-semibold">Number of puzzles</b>: ${numPuzzles}`;

        informationSection.appendChild(levelP);
        informationSection.appendChild(timeP);
        informationSection.appendChild(difficultyP);
        informationSection.appendChild(puzzlesP);

    const effectsOptionsId = drawEffectsMenu(ui, player);
    const characterOptionsId = drawCharacterMenu(ui, player);
    const filterOptionsId = drawFiltersMenu(ui, player);

    const optionsSection = buildSection('Options'); 
        const effectsButton = buildButton('Effects', () => ui.showMenu(effectsOptionsId)); 
        const characterButton = buildButton('Video', () => ui.showMenu(characterOptionsId));
        const filtersButton = buildButton('Filters', () => ui.showMenu(filterOptionsId))

        optionsSection.appendChild(effectsButton);
        optionsSection.appendChild(characterButton);
        optionsSection.appendChild(filtersButton);

    const howToMenuId = drawHowToPlay(ui);
    const controlsMenuId = drawControls(ui);

    const howSection = buildSection('');
    const howToPlayButton = buildButton('How to play', () => ui.showMenu(howToMenuId));
    const controlsButton = buildButton('Controls', () => ui.showMenu(controlsMenuId));

    howSection.appendChild(howToPlayButton);
    howSection.appendChild(controlsButton);

    const playSection = buildSection('');

    const resume = buildButton('Resume', () => {
        const unpauseEvent = new Event("unpauseGame");
        document.dispatchEvent(unpauseEvent);
    });
    const restart = buildButton('Restart level', () => {
        const event = new CustomEvent("changeScene", { detail: levelKey });
        document.dispatchEvent(event);
    });
    const exit = buildButton('Exit to menu', () => {
        const event = new CustomEvent("changeScene", { detail: 'mainmenu' });
        document.dispatchEvent(event);
    });

    playSection.appendChild(resume);
    playSection.appendChild(restart);
    playSection.appendChild(exit);

    pauseMenu.appendChild(informationSection);
    pauseMenu.appendChild(optionsSection);
    pauseMenu.appendChild(howSection);
    pauseMenu.appendChild(playSection);

    return pauseMenuId;
}