// C:\tauri\cti-task-manager-tauri\src\shared\utils\windowManager.ts

// src/shared/utils/windowManager.ts
import { emit } from '@tauri-apps/api/event';
import type { WindowMode } from '../types/window';

/**
 * 윈도우 모드 전환 요청
 */
export const requestModeSwitch = async (mode: WindowMode): Promise<void> => {
    try {
        await emit('switch-mode', mode);
        console.log(`📤 모드 전환 요청 전송: ${mode}`);
    } catch (error) {
        console.error('❌ 모드 전환 요청 실패:', error);
        throw error;
    }
};

/**
 * 설정 창 열기 요청
 */
export const requestOpenSettings = async (): Promise<void> => {
    try {
        await emit('open-settings');
        console.log('📤 설정 창 열기 요청 전송');
    } catch (error) {
        console.error('❌ 설정 창 열기 요청 실패:', error);
        throw error;
    }
};

/**
 * 로그인 창 열기 요청
 */
export const requestOpenLogin = async (): Promise<void> => {
    try {
        await emit('open-login');
        console.log('📤 로그인 창 열기 요청 전송');
    } catch (error) {
        console.error('❌ 로그인 창 열기 요청 실패:', error);
        throw error;
    }
};

/**
 * 현재 창 닫기
 */
export const closeCurrentWindow = async (): Promise<void> => {
    try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const currentWindow = getCurrentWindow();
        await currentWindow.close();
        console.log('📤 현재 창 닫기 요청 전송');
    } catch (error) {
        console.error('❌ 창 닫기 실패:', error);
        throw error;
    }
};