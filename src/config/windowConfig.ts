// src/config/windowConfig.ts

// 창 크기 설정을 한 곳에서 관리
export const WINDOW_CONFIG = {
    bar: {
        height: 32,        // 바 모드 전체 창 높이 (타이틀바와 동일)
        titlebarHeight: 32, // 타이틀바 높이
        width: 1000,
        resizable: true,
        visible: true,
    },
    panel: {
        height: 200,
        titlebarHeight: 36, // 타이틀바 높이
        width: 900
    }
} as const;

// Tailwind 클래스와 매핑
export const TITLEBAR_CLASSES = {
    bar: 'h-8',    // 32px (h-8 = 2rem = 32px)
    panel: 'h-9'   // 36px (h-9 = 2.25rem = 36px)
} as const;