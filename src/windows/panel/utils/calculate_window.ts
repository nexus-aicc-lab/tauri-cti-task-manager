// C:\tauri\cti-task-pilot\src\windows\panel\utils\calculate_window.ts

// C:\tauri\cti-task-pilot\src\windows\panel\utils\calculate_window.ts

import { invoke } from '@tauri-apps/api/core';

/**
 * 패널 윈도우 크기 설정
 */
export const PANEL_WINDOW_CONFIG = {
    FIXED_WIDTH: 780,
    DEFAULT_HEIGHT: 420,
    MIN_HEIGHT: 300,
} as const;

/**
 * 윈도우 크기 정보
 */
export interface WindowSize {
    width: number;
    height: number;
}

/**
 * DPI 스케일링 정보
 */
export interface DPIInfo {
    devicePixelRatio: number;
    scaleFactor: number;
}

/**
 * 크기 조정 옵션
 */
export interface SizeAdjustOptions {
    windowType?: string;
    minHeightThreshold?: number;
    useLogicalSize?: boolean;
}

/**
 * DPI 스케일링 정보 가져오기
 */
export function getDPIInfo(): DPIInfo {
    const devicePixelRatio = window.devicePixelRatio || 1;
    return {
        devicePixelRatio,
        scaleFactor: devicePixelRatio,
    };
}

/**
 * DOM 요소의 콘텐츠 높이 측정
 */
export function measureContentHeight(
    element: HTMLElement,
    defaultHeight: number = PANEL_WINDOW_CONFIG.DEFAULT_HEIGHT
): number {
    if (!element) return defaultHeight;

    const rect = element.getBoundingClientRect();

    // DOM이 아직 렌더링되지 않았으면 기본값 반환
    if (rect.height === 0) {
        return defaultHeight;
    }

    // 실제 콘텐츠 높이 (스크롤 높이 기준)
    const contentHeight = Math.max(
        element.scrollHeight,
        element.offsetHeight,
        rect.height
    );

    console.log(`📐 [panel-calculator] 콘텐츠 높이 측정: ${contentHeight}px`);
    return contentHeight;
}

/**
 * 기본 윈도우 크기 계산 (스케일링 적용 전)
 */
export function calculateBaseSize(
    contentElement: HTMLElement,
    config = PANEL_WINDOW_CONFIG
): WindowSize {
    const baseWidth = config.FIXED_WIDTH;
    const contentHeight = measureContentHeight(contentElement, config.DEFAULT_HEIGHT);
    const baseHeight = Math.max(contentHeight, config.MIN_HEIGHT);

    return {
        width: baseWidth,
        height: baseHeight,
    };
}

/**
 * DPI 스케일링 적용된 최종 크기 계산
 */
export function calculateScaledSize(
    baseSize: WindowSize,
    dpiInfo: DPIInfo = getDPIInfo()
): WindowSize {
    const finalWidth = Math.round(baseSize.width * dpiInfo.scaleFactor);
    const finalHeight = Math.round(baseSize.height * dpiInfo.scaleFactor);

    console.log(`📐 [panel-calculator] 크기 계산:`);
    console.log(`  - Base: ${baseSize.width}x${baseSize.height}`);
    console.log(`  - Scaled: ${finalWidth}x${finalHeight} (ratio: ${dpiInfo.scaleFactor})`);

    return {
        width: finalWidth,
        height: finalHeight,
    };
}

/**
 * 크기 변화가 의미있는지 확인
 */
export function shouldUpdateSize(
    newSize: WindowSize,
    currentSize: WindowSize,
    threshold: number = 10
): boolean {
    const widthDiff = Math.abs(newSize.width - currentSize.width);
    const heightDiff = Math.abs(newSize.height - currentSize.height);

    return widthDiff > threshold || heightDiff > threshold;
}

/**
 * Tauri API를 통한 윈도우 크기 적용
 */
export async function applyWindowSize(
    size: WindowSize,
    baseSize: WindowSize,
    options: SizeAdjustOptions = {}
): Promise<boolean> {
    const { windowType = 'panel-mode', useLogicalSize = true } = options;

    try {
        // 1. 커스텀 백엔드 함수 시도
        try {
            await invoke('apply_window_size', {
                width: size.width,
                height: size.height,
                windowType,
            });
            console.log(`✅ [panel-calculator] 백엔드로 크기 적용: ${size.width}x${size.height}`);
            return true;
        } catch (applyError) {
            console.log(`ℹ️ [panel-calculator] 백엔드 함수 없음, Tauri API 시도`);
        }

        // 2. LogicalSize 시도 (DPI 스케일링 자동 처리)
        if (useLogicalSize) {
            try {
                const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
                const { LogicalSize } = await import('@tauri-apps/api/window');
                const currentWindow = getCurrentWebviewWindow();

                await currentWindow.setSize(new LogicalSize(baseSize.width, baseSize.height));
                console.log(`✅ [panel-calculator] LogicalSize로 크기 적용: ${baseSize.width}x${baseSize.height}`);
                return true;
            } catch (logicalError) {
                console.log(`⚠️ [panel-calculator] LogicalSize 실패, PhysicalSize 시도`);
            }
        }

        // 3. PhysicalSize로 재시도 (DPI 스케일링 수동 적용)
        try {
            const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
            const { PhysicalSize } = await import('@tauri-apps/api/window');
            const currentWindow = getCurrentWebviewWindow();

            await currentWindow.setSize(new PhysicalSize(size.width, size.height));
            console.log(`✅ [panel-calculator] PhysicalSize로 크기 적용: ${size.width}x${size.height}`);
            return true;
        } catch (physicalError) {
            console.error(`❌ [panel-calculator] PhysicalSize도 실패:`, physicalError);
            return false;
        }

    } catch (error) {
        console.error("❌ [panel-calculator] 크기 적용 실패:", error);
        return false;
    }
}

/**
 * 저장된 윈도우 크기 로드
 */
export async function loadSavedWindowSize(
    windowType: string = 'panel-mode'
): Promise<WindowSize | null> {
    try {
        const savedSize = await invoke('load_window_size', {
            windowType,
        }) as WindowSize;

        const height = Math.max(PANEL_WINDOW_CONFIG.MIN_HEIGHT, savedSize.height);

        console.log(`🎯 [panel-calculator] 저장된 크기 로드: ${PANEL_WINDOW_CONFIG.FIXED_WIDTH}x${height}`);

        return {
            width: PANEL_WINDOW_CONFIG.FIXED_WIDTH,
            height,
        };
    } catch (error) {
        console.log('ℹ️ [panel-calculator] 저장된 크기 없음, 기본값 사용');
        return null;
    }
}

/**
 * 패널 윈도우 크기 조정 (메인 함수)
 */
export async function adjustPanelWindowSize(
    contentElement: HTMLElement,
    currentSize: WindowSize,
    options: SizeAdjustOptions = {}
): Promise<WindowSize | null> {
    if (!contentElement) {
        console.warn('⚠️ [panel-calculator] 콘텐츠 요소가 없습니다');
        return null;
    }

    try {
        // 1. DPI 정보 가져오기
        const dpiInfo = getDPIInfo();
        console.log(`📺 [panel-calculator] DPI 정보: devicePixelRatio=${dpiInfo.devicePixelRatio}`);

        // 2. 기본 크기 계산
        const baseSize = calculateBaseSize(contentElement);

        // 3. 스케일링 적용된 크기 계산
        const scaledSize = calculateScaledSize(baseSize, dpiInfo);

        // 4. 크기 변화 확인
        if (!shouldUpdateSize(scaledSize, currentSize, options.minHeightThreshold)) {
            console.log('ℹ️ [panel-calculator] 크기 변화 없음, 업데이트 스킵');
            return currentSize;
        }

        // 5. 윈도우 크기 적용
        const success = await applyWindowSize(scaledSize, baseSize, options);

        if (success) {
            return scaledSize;
        } else {
            console.error('❌ [panel-calculator] 크기 적용 실패');
            return null;
        }

    } catch (error) {
        console.error("❌ [panel-calculator] 크기 조정 실패:", error);
        return null;
    }
}

/**
 * 디바운스된 크기 조정 함수 생성
 */
export function createDebouncedSizeAdjuster(
    delay: number = 200
): (
    contentElement: HTMLElement,
    currentSize: WindowSize,
    onSizeChanged?: (newSize: WindowSize) => void,
    options?: SizeAdjustOptions
) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (contentElement, currentSize, onSizeChanged, options) => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(async () => {
            const newSize = await adjustPanelWindowSize(contentElement, currentSize, options);
            if (newSize && onSizeChanged) {
                onSizeChanged(newSize);
            }
        }, delay);
    };
}