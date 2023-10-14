import { Player } from "../../constructs/Player";
import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton } from "./utility";

export const drawEffectsMenu = (ui: InterfaceContext, player: Player): number => {
    const { menu, menuId } = ui.addMenu('Effects', false);

    const close = buildButton('Close', () => {
        ui.hideMenu(menuId)
        player.applyOptions();
    });

    menu.appendChild(close);

    return menuId;
}

export const drawCharacterMenu = (ui: InterfaceContext, player: Player): number => {
    const { menu, menuId } = ui.addMenu('Character', false);

    const fovSpan = document.createElement('span');
    fovSpan.className = 'flex flex-row justify-center items-start w-full gap-3';
        const fovLabel = document.createElement('label');
        fovLabel.htmlFor = 'fov-slider';
        fovLabel.textContent = 'FOV';

        const fovSlider = document.createElement('input');
        fovSlider.className = 'accent-rose-500';
        fovSlider.type = 'range'; fovSlider.id = 'fov-slider';
        fovSlider.min = '30'; fovSlider.max = '120';
        fovSlider.value = String(player.options.video.fov);
        fovSlider.onchange = () => {
            const val = Number(fovSlider.value);
            player.options.video.fov = val;
        };

    fovSpan.appendChild(fovLabel);
    fovSpan.appendChild(fovSlider);

    const farSpan = document.createElement('span');
    farSpan.className = 'flex flex-row justify-center items-start w-full gap-3';
        const farLabel = document.createElement('label');
        farLabel.htmlFor = 'far-slider';
        farLabel.textContent = 'Far Render Distance';

        const farSlider = document.createElement('input');
        farSlider.className = 'accent-rose-500';
        farSlider.type = 'range'; farSlider.id = 'fov-slider';
        farSlider.min = '100'; farSlider.max = '2000';
        farSlider.value = String(player.options.video.farRender);
        farSlider.onchange = () => {
            const val = Number(farSlider.value);
            player.options.video.farRender = val;
        };

    farSpan.appendChild(farLabel);
    farSpan.appendChild(farSlider);

    const fogSpan = document.createElement('span');
    fogSpan.className = 'flex flex-row justify-start items-start w-full gap-3';
        const fogLabel = document.createElement('label');
        fogLabel.htmlFor = 'fog-check';
        fogLabel.textContent = 'Fog';

        const fogCheck = document.createElement('input');
        fogCheck.className = 'w-5 h-5 rounded accent-rose-500';
        fogCheck.type = 'checkbox'; fogCheck.id = 'fog-check';
        fogCheck.checked = player.options.video.fog;
        fogCheck.onchange = () => {
            player.options.video.fog = fogCheck.checked;
        }

    fogSpan.appendChild(fogLabel);
    fogSpan.appendChild(fogCheck);

    const close = buildButton('Close', () => {
        ui.hideMenu(menuId)
        player.applyOptions();
    });

    menu.appendChild(fovSpan);
    menu.appendChild(farSpan);
    menu.appendChild(fogSpan);
    menu.appendChild(close);

    return menuId;
}