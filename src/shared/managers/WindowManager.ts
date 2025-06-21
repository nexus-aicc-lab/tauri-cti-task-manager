// 📄 src/shared/managers/WindowManager.ts
import { openBarWindow, closeBarWindow } from '@/shared/tauri/windows/barWindow';
import { openPanelWindow, closePanelWindow } from '@/shared/tauri/windows/panelWindow';
import { openSettingsWindow, closeSettingsWindow } from '@/shared/tauri/windows/settingsWindow';

export const WindowManager = {
    // 윈도우 열기
    bar: openBarWindow,
    panel: openPanelWindow,
    settings: openSettingsWindow,

    // 윈도우 닫기
    close: {
        bar: closeBarWindow,
        panel: closePanelWindow,
        settings: closeSettingsWindow,
    },

    // 모든 윈도우 닫기
    closeAll: async () => {
        await Promise.all([
            closeBarWindow(),
            closePanelWindow(),
            closeSettingsWindow(),
        ]);
    },

    // 모드 전환 (한 번에 하나씩만)
    switchMode: async (mode: 'bar' | 'panel') => {
        // 다른 모드 윈도우들 닫기
        if (mode === 'bar') {
            await closePanelWindow();
        } else {
            await closeBarWindow();
        }

        // 새 모드 윈도우 열기
        await WindowManager[mode]();
    },

    // 독립 윈도우 열기 (기존 윈도우와 함께)
    openIndependent: async (type: 'settings') => {
        await WindowManager[type]();
    }
};