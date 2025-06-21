// 📄 src/entry.ts
import { loadViewMode } from '@/shared/lib/fs/viewModeStorage';
import { WindowManager } from '@/shared/managers/WindowManager';

export async function launchInitialWindow() {
    const mode = await loadViewMode();
    await switchViewMode(mode || 'bar');
}

export async function switchViewMode(mode: 'bar' | 'panel') {
    await WindowManager.switchMode(mode);
}

// 설정 윈도우는 독립적으로 열기
export async function openSettings() {
    await WindowManager.openIndependent('settings');
}