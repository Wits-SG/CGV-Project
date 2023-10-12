import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton } from "./utility";

const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    if (minutes > 1) {
        return `${minutes}m ${seconds}s`;
    } else {

        return `${seconds}s`;
    }
}

export const drawLevelMenu = (ui: InterfaceContext, levelIds: Array<string>): Array<number> => {
    const result = [];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const numPuzzles = [1, 3, 5];

    for (let i = 0; i < 3; ++i) {
        const { menu: levelMenu, menuId: levelId } = ui.addMenu(`Level ${i + 1}`, false);

        const infoSection = document.createElement('section');
        infoSection.className = 'flex w-full flex-col items-start justify-center text-lg gap-1';

            const description = document.createElement('h2');
            description.className = 'w-full border-b-2 border-black text-left font-semibold text-2xl';
            description.textContent = 'Information';

            const difficulty = document.createElement('p');
            difficulty.innerHTML = `<b class="font-semibold">Difficulty</b>: ${difficulties[i]}`
            const numPuzzle = document.createElement('p');
            numPuzzle.innerHTML = `<b class="font-semibold">Number of puzzles</b>: ${numPuzzles[i]}`

            infoSection.appendChild(description);
            infoSection.appendChild(difficulty);
            infoSection.appendChild(numPuzzle);

        const leaderboardSection = document.createElement('section');
        leaderboardSection.className = 'flex w-full flex-col items-start justify-center text-lg';

            const leaderboard = document.createElement('h2');
            leaderboard.className = 'w-full border-b-2 border-black text-left font-semibold text-2xl';
            leaderboard.textContent = 'Leaderboard';

            const itemList = document.createElement('ol');
            itemList.className = 'w-full list-inside list-decimal';

            fetch(`https://tml-leaderboard.vercel.app/api/games?level_id=${levelIds[i]}&num_games=3`)
                .then(async result => {
                    const json = await result.json();

                    for (let j = 0; j < json.length; ++j) {
                        const player = document.createElement('li');
                        player.textContent = `${json[j].playerName} - ${formatTime(json[j].playerTime)}`
                        itemList.appendChild(player);
                    }
                })
                .catch( error => {
                    console.log(error);
                    const noPlayersFound = document.createElement('li');
                    noPlayersFound.textContent = 'No Players Found';
                    itemList.appendChild(noPlayersFound)
                });

            leaderboardSection.appendChild(leaderboard);
            leaderboardSection.appendChild(itemList);

        const seperator = document.createElement('hr');
        seperator.className = 'w-full border-t-2 border-black';

        const buttonSection = document.createElement('section');
        buttonSection.className = 'flex w-full flex-col items-center justify-center text-lg gap-2';

            const playLevel = buildButton(`Play Level ${i + 1}`, () => {
                const event = new CustomEvent("changeScene", { detail: `level${i + 1}`});
                document.dispatchEvent(event);
            });
            const viewLeaderboard = buildButton('View leaderboard', () => location.href = 'https://tml-leaderboard.vercel.app/');
            const close = buildButton(`Close`, () => {
                ui.hideMenu( levelId );
            });

            buttonSection.appendChild(playLevel);
            buttonSection.appendChild(viewLeaderboard);
            buttonSection.appendChild(close);

        levelMenu.appendChild(infoSection)
        levelMenu.appendChild(leaderboardSection);
        levelMenu.appendChild(seperator);
        levelMenu.appendChild(buttonSection);

        result.push(levelId);
    }

    return result;
}