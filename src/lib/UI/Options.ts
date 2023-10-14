import { Player } from "../../constructs/Player";
import { InterfaceContext } from "../w3ads/InterfaceContext";
import { buildButton, buildSection } from "./utility";

export const drawEffectsMenu = (ui: InterfaceContext, player: Player): number => {
    const { menu, menuId } = ui.addMenu('Effects', false);

    const aaSection = buildSection('Anti-Aliasing');

        const fxaaSpan = document.createElement('span');
        fxaaSpan.className = 'flex flex-row justify-start items-start w-full gap-3';
            const fxaaLabel = document.createElement('label');
            fxaaLabel.htmlFor = 'fxaa-check';
            fxaaLabel.textContent = 'FXAA';

            const fxaaCheck = document.createElement('input');
            fxaaCheck.className = 'w-5 h-5 rounded accent-rose-500';
            fxaaCheck.type = 'checkbox'; fxaaCheck.id = 'fxaa-check';
            fxaaCheck.checked = player.options.effects.fxaaShader;
            fxaaCheck.onchange = () => {
                player.options.effects.fxaaShader = fxaaCheck.checked;
            }

        fxaaSpan.appendChild(fxaaLabel);
        fxaaSpan.appendChild(fxaaCheck);

        const smaaSpan = document.createElement('span');
        smaaSpan.className = 'flex flex-row justify-start items-start w-full gap-3';
            const smaaLabel = document.createElement('label');
            smaaLabel.htmlFor = 'smaa-check';
            smaaLabel.textContent = 'SMAA';

            const smaaCheck = document.createElement('input');
            smaaCheck.className = 'w-5 h-5 rounded accent-rose-500';
            smaaCheck.type = 'checkbox'; smaaCheck.id = 'smaa-check';
            smaaCheck.checked = player.options.effects.smaaShader;
            smaaCheck.onchange = () => {
                player.options.effects.smaaShader = smaaCheck.checked;
            }

        smaaSpan.appendChild(smaaLabel);
        smaaSpan.appendChild(smaaCheck);
        
        const taaSpan = document.createElement('span');
        taaSpan.className = 'flex flex-row justify-start items-start w-full gap-3';
            const taaLabel = document.createElement('label');
            taaLabel.htmlFor = 'taa-check';
            taaLabel.textContent = 'TAA';

            const taaCheck = document.createElement('input');
            taaCheck.className = 'w-5 h-5 rounded accent-rose-500';
            taaCheck.type = 'checkbox'; taaCheck.id = 'taa-check';
            taaCheck.checked = player.options.effects.taaShader;
            taaCheck.onchange = () => {
                player.options.effects.taaShader = taaCheck.checked;
            }

        taaSpan.appendChild(taaLabel);
        taaSpan.appendChild(taaCheck);

        const taaRG = buildSection('TAA Levels');
        for (let i = 0; i < 5; ++i) {
            const taaLevelSpan = document.createElement('span');
            taaLevelSpan.className = 'w-full flex flex-row justify-start items-start gap-1';

            const taaSampleRadioButton = document.createElement('input');
            taaSampleRadioButton.type = 'radio'; taaSampleRadioButton.name = 'taaSample';
            taaSampleRadioButton.className = 'accent-rose-500 w-5 h-5';
            taaSampleRadioButton.onchange = () => {
                player.options.effects.taaSample = i + 1;
            }

            if (player.options.effects.taaSample == i + 1) {
                taaSampleRadioButton.checked = true;
            }

            const taaSampleText = document.createElement('p');
            taaSampleText.textContent = `TAA Sample level ${i + 1}`;

            taaLevelSpan.appendChild(taaSampleRadioButton);
            taaLevelSpan.appendChild(taaSampleText)
            taaRG.appendChild(taaLevelSpan);
        }

    aaSection.appendChild(fxaaSpan);
    aaSection.appendChild(smaaSpan);
    aaSection.appendChild(taaSpan);
    aaSection.appendChild(taaRG);


    const close = buildButton('Close', () => {
        ui.hideMenu(menuId)
        player.applyOptions();
    });

    menu.appendChild(aaSection);
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