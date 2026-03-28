import { ipcRenderer } from 'electron'

const notify = (source: string) => {
    ipcRenderer.sendToHost('webview-click', source);
};

const attachListeners = (element: EventTarget, name: string) => {
    element.addEventListener('mousedown', () => notify(`${name}:mousedown`), true);
    element.addEventListener('click', () => notify(`${name}:click`), true);
    element.addEventListener('focus', () => notify(`${name}:focus`), true);
    element.addEventListener('pointerdown', () => notify(`${name}:pointerdown`), true);
};

attachListeners(window, 'window');
attachListeners(document, 'document');

document.addEventListener('DOMContentLoaded', () => {
    const embed = document.querySelector('embed');
    if (embed) {
        attachListeners(embed, 'embed');
    }
});
