
// src/shared/lib/fs/viewModeStorage.ts
import {
    readTextFile,
    writeTextFile,
    mkdir,             // ← here
    BaseDirectory,
} from '@tauri-apps/plugin-fs';
import type { ViewMode } from '@/shared/store/useUIStore';

const FILE_NAME = 'view-mode.json';
const DIR = BaseDirectory.AppData;

export async function loadViewMode(): Promise<ViewMode | null> {
    try {
        const content = await readTextFile(FILE_NAME, { baseDir: DIR });
        const parsed = JSON.parse(content);
        return parsed.viewMode === 'panel' ? 'panel' : 'bar';
    } catch {
        return null;
    }
}

export async function saveViewMode(mode: ViewMode): Promise<void> {
    try {
        // 1) 앱 전용 폴더가 없으면 재귀 생성
        await mkdir('', { baseDir: DIR, recursive: true });
        // 2) 파일 쓰기 (없으면 생성)
        await writeTextFile(
            FILE_NAME,
            JSON.stringify({ viewMode: mode }),
            { baseDir: DIR }
        );
    } catch (e) {
        console.error('[viewModeStorage] 저장 실패', e);
    }
}
