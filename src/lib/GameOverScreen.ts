import { InterfaceContext } from "./w3ads/InterfaceContext";

export const buildGameOver = (userInterface: InterfaceContext, levelKey: string, completionTime: number) => {
    const container = document.createElement('div');
    container.className = 'flex justify-center items-center gap-5'

    const panelClass = 'flex flex-col gap-5 justify-center items-center bg-stone-300 p-10 rounded-lg border-stone-950 border-2'

    const menu = document.createElement('div');
    menu.className = panelClass;
    container.appendChild(menu);

    const title = document.createElement('h1');
    title.innerText = 'You Win!';
    title.className = 'text-2xl border-b-2 border-stone-950 flex justify-center items-center';
    menu.appendChild(title);

    const time = document.createElement('p');
    time.innerHTML = `<b class='font-bold'>Difficulty:</b> ${completionTime}s`;
    time.className = 'text-md';
    menu.appendChild(time);

    const buttonClasses = 'p-2 bg-stone-100 hover:bg-stone-200 rounded-md w-64';
    const tryAgain = document.createElement('button');
    tryAgain.onclick = () => {
        userInterface.clear();
        const event = new CustomEvent("changeScene", { detail: levelKey });
        document.dispatchEvent(event);
    }
    tryAgain.textContent = 'Try again?';
    tryAgain.className = buttonClasses;
    menu.appendChild(tryAgain);

    const exit = document.createElement('button');
    exit.onclick = () => {
        userInterface.clear();
        const event = new CustomEvent("changeScene", { detail: 'mainmenu' });
        document.dispatchEvent(event);
    }
    exit.textContent = 'Exit to menu';
    exit.className = buttonClasses;
    menu.appendChild(exit);

    return container;
}