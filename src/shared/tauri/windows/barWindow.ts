// 📄 src-tauri/windows/barWindow.ts
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

let barWindow: WebviewWindow | null = null;

export const openBarWindow = async () => {
    if (barWindow && !barWindow.close) {
        await barWindow.setFocus();
        return;
    }

    barWindow = new WebviewWindow('bar', {
        url: '/bar',
        width: 600,
        height: 32,
        decorations: false,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: false,
    });

    barWindow.once('tauri://close-requested', () => {
        barWindow = null;
    });
};

export const closeBarWindow = async () => {
    if (barWindow && !barWindow.close) {
        await barWindow.close();
        barWindow = null;
    }
};
