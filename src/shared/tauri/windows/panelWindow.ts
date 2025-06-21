// 📄 src-tauri/windows/panelWindow.ts
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

let panelWindow: WebviewWindow | null = null;

export const openPanelWindow = async () => {
    if (panelWindow && !panelWindow.close) {
        await panelWindow.setFocus();
        return;
    }

    panelWindow = new WebviewWindow('panel', {
        url: '/panel',
        width: 1000,
        height: 700,
        decorations: true,
        resizable: true,
        skipTaskbar: false,
    });

    panelWindow.once('tauri://close-requested', () => {
        panelWindow = null;
    });
};

export const closePanelWindow = async () => {
    if (panelWindow && !panelWindow.close) {
        await panelWindow.close();
        panelWindow = null;
    }
};
