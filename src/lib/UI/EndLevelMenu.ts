import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton, buildSection } from "./utility";

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {

        return `${seconds}s`;
    }
}

export const drawEndLevelMenu = (ui: InterfaceContext, levelName: string, levelId: string, levelKey: string, difficulty: string, numPuzzles: number, currentTime: number): number => {
    const { menu: menu, menuId: menuId } = ui.addMenu('You Win!', false);

    const informationSection = buildSection('Information');
        const levelP = document.createElement('p');
        levelP.innerHTML = `<b class="font-semibold">Level</b>: ${levelName}`;
        const timeP = document.createElement('p');
        timeP.innerHTML = `<b class="font-semibold">Current Time</b>: ${formatTime(currentTime)} s`;
        const difficultyP = document.createElement('p');
        difficultyP.innerHTML = `<b class="font-semibold">Difficulty</b>: ${difficulty}`;
        const puzzlesP = document.createElement('p');
        puzzlesP.innerHTML = `<b class="font-semibold">Number of puzzles</b>: ${numPuzzles}`;

    const controlSection = buildSection('');
        const save = buildButton('Save run?', () => {
            const { menu: saveMenu, menuId: saveMenuId } = ui.addMenu('Save your run!', false);

            const label = document.createElement('label');
            label.className = 'w-64 text-xl';
            label.textContent = "Enter your name"
            saveMenu.appendChild(label);

            const name = document.createElement('input');
            name.id = "player-name";
            name.placeholder = "Name";
            name.className = 'w-64 rounded-md p-1 text-xl text-black';
            saveMenu.appendChild(name);

            const ok = buildButton('Save', () => {
                const run = {
                    playerName: name.value,
                    playerTime: currentTime,
                    gameDate: Date.now(),
                    levelId: levelId,
                };

                fetch('https://tml-leaderboard.vercel.app/api/games', {
                    method: "POST",
                    body: JSON.stringify(run),
                })
                    .catch( e => console.error(e) );

                ui.hideMenu(saveMenuId);
                ui.removeElement(saveMenuId);
            });
            saveMenu.appendChild(ok);

            const cancel = buildButton('Cancel', () => {
                ui.hideMenu(saveMenuId);
                ui.removeElement(saveMenuId);
            });
            saveMenu.appendChild(cancel);

            ui.showMenu(saveMenuId);
        });

        const restart = buildButton('Try again?', () => {
            const event = new CustomEvent("changeScene", { detail: levelKey });
            document.dispatchEvent(event);
        })

        const exit = buildButton('Exit to menu', () => {
            const event = new CustomEvent("changeScene", { detail: 'mainmenu' });
            document.dispatchEvent(event);
        });

        controlSection.appendChild(save);
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