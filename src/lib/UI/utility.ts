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






