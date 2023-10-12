import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton, buildSection } from "./utility";

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