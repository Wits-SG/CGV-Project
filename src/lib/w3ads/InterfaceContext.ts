export class InterfaceContext {
    root: HTMLDivElement;
    promptRoot: HTMLDivElement;
    menuRoot: HTMLDivElement;
    elements: Array<HTMLElement>;

    constructor() {
        this.root = document.createElement('div');
        this.root.className = 'fixed left-0 top-0 z-10 grid h-screen w-screen grid-rows-[1fr_200px]';


        this.menuRoot = document.createElement('div');
        this.menuRoot.className = 'row-span-1 row-start-1 flex flex-row items-start justify-start gap-5 p-5';
        this.root.appendChild(this.menuRoot);

        this.promptRoot = document.createElement('div');
        this.promptRoot.className = 'row-span-1 row-start-2 flex flex-col items-center justify-center gap-1 p-2';
        this.root.appendChild(this.promptRoot);

        this.elements = [];
        document.body.appendChild(this.root);
    }

    hideAll() {
        this.menuRoot.replaceChildren();
        this.promptRoot.replaceChildren();
    }

    addPrompt(innerHtml: string): number {
        const promptId = this.elements.length;
        this.elements.push( document.createElement('div') );
        this.elements[promptId].className = 'flex h-10 items-center justify-center rounded-md border-2 border-black bg-gradient-to-r from-sky-400 to-sky-700 p-2 text-white';

        const text = document.createElement('p');
        text.className = 'text-2xl flex justify-center items-center w-full h-full';
        text.innerHTML = innerHtml;

        this.elements[promptId].appendChild(text);

        return promptId;
    }

    showPrompt(promptId: number) {
        this.promptRoot.appendChild(this.elements[promptId]);
    };

    hidePrompt(promptId: number) {
        try {
            this.promptRoot.removeChild(this.elements[promptId]);
        } catch {
            // do nothing if node not found
        }
    }

    addMenu( title: string, row: boolean ): { menu: HTMLElement, menuId: number } {
        const menuId = this.elements.length;
        this.elements.push( document.createElement('div') );
        this.elements[menuId].className = `flex flex-${row ? 'row' : 'col'} items-center justify-center gap-4 rounded-md border-2 border-stone-950 bg-gradient-to-b from-sky-400 to-sky-700 p-5 text-white`;

        const titleElement = document.createElement('h1');
        this.elements[menuId].appendChild(titleElement);
        titleElement.className = 'w-full border-b-4 border-black py-2 text-center text-3xl font-bold';
        titleElement.textContent = title;

        return {
            menu: this.elements[menuId],
            menuId: menuId,
        }
    }

    showMenu(menuId: number) {
        this.menuRoot.appendChild(this.elements[menuId]);
    }

    hideMenu(menuId: number) {
        try {
            this.menuRoot.removeChild(this.elements[menuId]);
        } catch {
            // do nothing if node not found
        }
    }

}