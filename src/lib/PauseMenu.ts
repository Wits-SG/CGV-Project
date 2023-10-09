import { GraphicsContext } from ".";
import { InterfaceContext } from "./w3ads/InterfaceContext";

export const buildPauseMenu = (graphics: GraphicsContext, userInterface: InterfaceContext, levelKey: string): HTMLDivElement => {
    const container = document.createElement('div');
    container.className = 'flex justify-start items-start gap-5'

    const panelClass = 'flex flex-col gap-5 justify-center items-center bg-stone-300 p-10 rounded-lg border-stone-950 border-2'

    const menu = document.createElement('div');
    menu.className = panelClass;
    container.appendChild(menu);

    const title = document.createElement('h1');
    title.innerText = 'Paused';
    title.className = 'text-xl border-b-2 border-stone-950 flex justify-center items-center';
    menu.appendChild(title);

    const controls = document.createElement('div');
    controls.className = panelClass;

    const buttons = [
        { text: 'Controls', callback: () => {
            container.appendChild(controls);
        } },
        { text: 'Resume', callback: () => {
            graphics.renderer.domElement.requestPointerLock();
        } },
        { text: 'Restart level', callback: () => {
            userInterface.clear();
            const event = new CustomEvent("changeScene", { detail: levelKey });
            document.dispatchEvent(event);
        } },
        { text: 'Exit to menu', callback: () => {
            userInterface.clear();
            const event = new CustomEvent("changeScene", { detail: 'mainmenu' });
            document.dispatchEvent(event);
        } }
    ]

    const buttonClasses = 'p-2 bg-stone-100 hover:bg-stone-200 rounded-md w-64';
    for (let btn of buttons) {
        const button = document.createElement('button');
        button.onclick = btn.callback;
        button.textContent = btn.text;
        button.className = buttonClasses;
        menu.appendChild(button);
    }

    const controlsTitle = document.createElement('h1');
    controlsTitle.textContent = 'Controls';
    controlsTitle.className = 'text-xl border-b-2 border-stone-950 flex justify-center items-center';
    controls.appendChild(controlsTitle);

    const controlsList = [
        { description: 'Walk Forward', key: 'w' },
        { description: 'Walk Backward', key: 's' },
        { description: 'Strafe Left', key: 'a' },
        { description: 'Strafe Right', key: 'd' },
        { description: 'Sprint', key: 'shift' },
        { description: 'Look around', key: 'mouse' },
        { description: 'Interact', key: 'e' },
        { description: 'Place object', key: 'q' },
    ]

    const controlItemList = document.createElement('ul');
    controlItemList.className = 'p-3 flex flex-col justify-start items-start gap-1'
    controls.appendChild(controlItemList);

    for (let c of controlsList) {
        const controlP = document.createElement('li');
        controlP.innerHTML = `${c.description}:  ${c.key}`;
        controlItemList.appendChild(controlP);
    }

    const controlsClose = document.createElement('button');
    controlsClose.className = 'p-2 bg-stone-100 hover:bg-stone-200 rounded-md w-32';
    controlsClose.textContent = 'Close';
    controlsClose.onclick = () => {
        container.removeChild(controls);
    }
    controls.appendChild(controlsClose);

    return container;
}