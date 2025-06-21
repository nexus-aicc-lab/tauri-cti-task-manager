// 📄 src/shared/tauri/windows/barWindow.ts
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

let barWindow: WebviewWindow | null = null;

export const openBarWindow = async () => {
    if (barWindow && !barWindow.label) {
        await barWindow.setFocus();
        return;
    }

    barWindow = new WebviewWindow('bar', {
        url: '/bar',
        width: 600,
        height: 32,
        decorations: true,  // ✅ 닫기 버튼 표시
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: false,
    });

    barWindow.once('tauri://close-requested', () => {
        barWindow = null;
    });
};

export const closeBarWindow = async () => {
    if (barWindow) {
        await barWindow.close();
        barWindow = null;
    }
};