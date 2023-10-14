import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton } from "./utility";

export const drawHintMenu = (ui: InterfaceContext, title: string, paragraphs: Array<string>): number => {
    const { menu , menuId } = ui.addMenu(title, false);

    menu.classList.add('w-1/2');

    for (let paragraph of paragraphs) {
        const p = document.createElement('p');
        p.textContent = paragraph;

        menu.appendChild(p);
    }

    const close = buildButton( 'Close', () => { 
        const unpauseEvent = new Event("unpauseGame");
        document.dispatchEvent(unpauseEvent);
        ui.hideMenu(menuId) 
    } );
    menu.appendChild(close);

    return menuId;
}