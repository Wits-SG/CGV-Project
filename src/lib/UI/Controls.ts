import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton } from "./utility";

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