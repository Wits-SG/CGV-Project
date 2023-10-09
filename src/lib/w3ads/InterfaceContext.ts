export class InterfaceContext {
    root: HTMLDivElement;
    elements: Array<HTMLElement>;

    constructor() {
        this.root = document.createElement('div');
        this.root.className = 'flex flex-col gap-5 justify-center items-center w-screen h-screen fixed top-0 left-0 z-10';
        this.elements = [];
    }

    addElement(element: HTMLElement, time: number | undefined) {

        this.elements.push(element);
        this.root.appendChild(element);

        if (time !== undefined) {
            setTimeout(() => {
                this.elements = this.elements.filter(el => el != element);
                this.root.removeChild(element);
            }, time);
        }
    }

    clearUI() {
        for (let el of this.elements) {
            this.root.removeChild(el);
        }
    }


}