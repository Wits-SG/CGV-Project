import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton } from "./utility";

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