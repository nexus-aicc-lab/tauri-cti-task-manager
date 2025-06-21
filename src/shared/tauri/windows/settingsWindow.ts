// 📄 src/shared/tauri/windows/settingsWindow.ts
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

let settingsWin: WebviewWindow | null = null;

export const openSettingsWindow = async (x?: number, y?: number) => {
    if (settingsWin && !settingsWin.close) {
        await settingsWin.setFocus();
        return;
    }

    settingsWin = new WebviewWindow('settings', {
        url: '/settings',
        x,
        y,
        width: 400,
        height: 300,
        skipTaskbar: true,
        decorations: true,
        resizable: false,
    });

    settingsWin.once('tauri://close-requested', () => {
        settingsWin = null;
    });
};

export const closeSettingsWindow = async () => {
    if (settingsWin && !settingsWin.close) {
        await settingsWin.close();
        settingsWin = null;
    }
};
