export class InterfaceContext {
    root: HTMLDivElement;
    elements: Array<HTMLElement>;

    constructor() {
        this.root = document.createElement('div');
        this.root.className = 'flex flex-col gap-5 justify-center items-start w-screen h-screen fixed top-0 left-0 z-10 p-10';
        this.elements = [];
        document.body.appendChild(this.root);
    }

    addElement(element: HTMLElement, time: number | undefined) {

        this.elements.push(element);
        this.root.appendChild(element);

        if (time !== undefined) {
            setTimeout(() => {
                this.removeElement(element);
            }, time);
        }
    }

    removeElement(element: HTMLElement) {
        this.elements = this.elements.filter(el => el != element);
        try {
            this.root.removeChild(element);
        } catch (e: any) {
            // DO nothing if the node cant be found
        }
    }

    clear() {
        for (let el of this.elements) {
            this.removeElement(el);
        }
    }

}