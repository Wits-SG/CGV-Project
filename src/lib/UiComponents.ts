import { InterfaceContext } from "./w3ads/InterfaceContext";

export const buildButton = (text: string, onclick: Function) => {
        const button = document.createElement('button');
        button.className = 'duration-400 w-64 rounded-md border-2 border-stone-950 bg-gradient-to-r from-rose-600 from-0% to-rose-400 p-2 transition ease-in-out hover:from-60% active:from-100% font-normal';
        button.onclick = () => onclick();
        button.textContent = text;

        return button;
};

export const buildSection = (title: string) => {
    const section = document.createElement('section');
    section.className = 'flex w-full flex-col items-start justify-center text-lg gap-1';

    const titleText = document.createElement('h2');
    titleText.className = 'w-full border-b-2 border-black text-left font-semibold text-2xl';
    titleText.textContent = title;

    section.appendChild(titleText);

    return section;
}

export const drawLevelMenu = (ui: InterfaceContext, playerTimes: Array<Array<{ name: string, time: number }>>): Array<number> => {
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

            for (let j = 0; j < playerTimes[i].length; ++j) {
                const player = document.createElement('li');
                player.textContent = `${playerTimes[i][j].name} - ${playerTimes[i][j].time} s`;
                itemList.appendChild(player);
            }
        
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
            const viewLeaderboard = buildButton('View leaderboard', () => {});
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

export const drawCredits = ( ui: InterfaceContext, assets: Array<{ artist: string, title: string, type: string, license: string, link: string }>, developers: Array<string>): number => {
    const { menu: creditMenu, menuId: creditMenuId } = ui.addMenu( 'Credits', false )

    const container = document.createElement('div');
    container.className = 'flex flex-row w-full h-full gap-5';

    const devSection = document.createElement('section');
    devSection.className = 'w-64'

        const devTitle = document.createElement('h2');
        devTitle.innerText = 'Developers';
        devTitle.className = 'text-xl border-b-2 border-black flex justify-center items-center w-full'
        devSection.appendChild(devTitle);

        const devList = document.createElement('ul');
        devList.className = 'p-3 flex flex-col justify-center items-start gap-1'
        devSection.appendChild(devList);
        for (let dev of developers) {
            const devP = document.createElement('li');
            devP.innerText = dev;
            devP.className = 'text-md'
            devList.appendChild(devP);
        }

    const assetSection = document.createElement('section');
    assetSection.className = 'w-fit';

        const assetTitle = document.createElement('h2');
        assetTitle.innerText = 'Assets';
        assetTitle.className = 'text-xl border-b-2 border-black flex justify-center items-center w-full'
        assetSection.appendChild(assetTitle);

        const assetsList = document.createElement('ul');
        assetsList.className = 'p-3 flex flex-col justify-start items-start gap-1 max-h-[80vh] overflow-y-auto'
        assetSection.appendChild(assetsList);
        for (let asset of assets) {
            const assetP = document.createElement('li');
            assetP.innerHTML = `<a href='${asset.link}' class='text-rose-500 underline' >${asset.title}<a> - ${asset.artist} - ${asset.type} - ${asset.license}`;
            assetsList.appendChild(assetP);
        }

    const close = buildButton( 'Close', () => ui.hideMenu(creditMenuId) );
    container.appendChild(devSection);
    container.appendChild(assetSection);

    creditMenu.appendChild(container);
    creditMenu.appendChild(close);
    return creditMenuId;

}

export const drawHowToPlay = (ui: InterfaceContext): number => {
    const { menu, menuId } = ui.addMenu('How to Play', false);

    const objectiveSection = buildSection('Objective');
        const objectiveContext = document.createElement('p');
        objectiveContext.className = 'w-[45vw]';
        objectiveContext.textContent = 'You\'ve been trapped in a magic library! You must quickly escape before the wizard comes back and finds you here. Find all the magic crystals to unlock the main library door.';

        const objectiveDescription = document.createElement('p');
        objectiveDescription.className = 'w-[45vw]';
        objectiveDescription.textContent = 'Solve all the puzzles, collect the required amount of crystals. Place a crystal on one of the plinths by the door. Once all the crystals have been found, the door will unlock.'


        objectiveSection.appendChild(objectiveContext);
        objectiveSection.appendChild(objectiveDescription)
    menu.appendChild(objectiveSection);

    const puzzles = [
        { name: 'Office', description: 'Every magic library needs a wizard, and every wizard needs an office, maybe they\'ve left something useful laying around.', solution: 'Search the room to find the crystal.' },
        { name: 'Mirror', description: 'Magic mirrors are a staple, they can even show us whats really there, even if it doesn\'t seem like anything is.', solution: 'Use the mirror to find invisibile obstacles you can jump on to reach the crystal.' },
        { name: 'Chess', description: 'Chess is a game for the intellectually inclined, and our wizard here thinks himself very smart. So smart he\'s forgotten how his statues are stored...', solution: 'Place the pieces on the plinths, in the order they were on the board, read left to right.'},
        { name: 'Music', description: 'Music can calm the soul and guide us through many complex subjects, but only if the musicians have someone to guide them.', solution: 'Play the instruments in order. The conductors stand will face towards the next instrument to be played.' }
    ];

    for (let puzzle of puzzles) {
        const puzzleSection = buildSection(puzzle.name);

        const description = document.createElement('p');
        description.textContent = puzzle.description;

        const solution = document.createElement('p');
        solution.textContent = puzzle.solution;

        const hideButton = document.createElement('button');
        const revealButton = document.createElement('button');

        hideButton.className = 'text-md w-fit border-b-2 border-rose-400 hover:border-rose-500';
        hideButton.textContent = 'Hide Solution';
        hideButton.onclick = () => {
            puzzleSection.appendChild(revealButton);
            puzzleSection.removeChild(solution);
            puzzleSection.removeChild(hideButton);
        }

        revealButton.className = 'text-md w-fit border-b-2 border-rose-400 hover:border-rose-500';
        revealButton.textContent = 'Reveal Solution - Spoilers!'
        revealButton.onclick = () => { 
            puzzleSection.removeChild(revealButton);
            puzzleSection.appendChild(hideButton);
            puzzleSection.appendChild(solution) 
        };

        puzzleSection.appendChild(description);
        puzzleSection.appendChild(revealButton);
        menu.appendChild(puzzleSection);
    }

    const close = buildButton( 'Close', () => ui.hideMenu(menuId) );
    menu.appendChild(close);

    return menuId;
}


export const drawControls = (ui: InterfaceContext): number => {
    const { menu, menuId } = ui.addMenu('Controls', false);

    const moveControls = [ 
        { description: 'Walk forward', key: 'w' },
        { description: 'Walk backward', key: 's' },
        { description: 'Strafe left', key: 'a' },
        { description: 'Strafe right', key: 'd' },
        { description: 'Look around', key: 'mouse' },
        { description: 'Interact', key: 'e' },
        { description: 'Place', key: 'q' },
    ];

    const table = document.createElement('table');
    table.className = 'w-52 table-auto text-left';
    table.innerHTML = '<thead class="border-b-2 border-black"><tr><th class="border-x-2 border-black px-2">Description</th><th class="border-x-2 border-black px-2">Key</th></tr></thead>';

    const tbody = document.createElement('tbody');
    for (let control of moveControls) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="border-x-2 border-black px-2">${control.description}</td><td class="border-x-2 border-black px-2">${control.key}</td>`;
        tbody.appendChild(tr);
    }

    table.append(tbody);

    const close = buildButton( 'Close', () => ui.hideMenu(menuId) );

    menu.appendChild(table);
    menu.appendChild(close);

    return menuId;
}

export const drawPauseMenu = (ui: InterfaceContext, level: number, difficulty: string, numPuzzles: number, currentTime: number): number => {
    const { menu: pauseMenu, menuId: pauseMenuId } = ui.addMenu('Paused', false);

    const informationSection = buildSection('Information');
        const levelP = document.createElement('p');
        levelP.innerHTML = `<b class="font-semibold">Level</b>: ${level}`;
        const timeP = document.createElement('p');
        timeP.innerHTML = `<b class="font-semibold">Current Time</b>: ${currentTime} s`;
        const difficultyP = document.createElement('p');
        difficultyP.innerHTML = `<b class="font-semibold">Difficulty</b>: ${difficulty}`;
        const puzzlesP = document.createElement('p');
        puzzlesP.innerHTML = `<b class="font-semibold">Number of puzzles</b>: ${numPuzzles}`;

        informationSection.appendChild(levelP);
        informationSection.appendChild(timeP);
        informationSection.appendChild(difficultyP);
        informationSection.appendChild(puzzlesP);

    const howToMenuId = drawHowToPlay(ui);
    const controlsMenuId = drawControls(ui);

    const howSection = buildSection('');
    const howToPlayButton = buildButton('How to play', () => ui.showMenu(howToMenuId));
    const controlsButton = buildButton('Controls', () => ui.showMenu(controlsMenuId));

    howSection.appendChild(howToPlayButton);
    howSection.appendChild(controlsButton);

    const playSection = buildSection('');

    pauseMenu.appendChild(informationSection);
    pauseMenu.appendChild(howSection);
    pauseMenu.appendChild(playSection);

    return pauseMenuId;
}

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