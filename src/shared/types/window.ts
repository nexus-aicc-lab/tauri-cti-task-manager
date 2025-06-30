// C:\tauri\cti-task-manager-tauri\src\shared\types\window.ts

// src/shared/types/window.ts

// 윈도우 모드 타입
export type WindowMode = 'launcher' | 'bar' | 'panel' | 'login' | 'settings';

// 윈도우 간 이벤트 타입
export interface WindowEvent {
    type: 'switch-mode' | 'open-settings' | 'open-login' | 'close';
    payload?: {
        mode?: WindowMode;
        data?: any;
    };
}

// 모드 변경 요청 인터페이스
export interface ModeChangeHandler {
    (mode: WindowMode): Promise<void>;
}