import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from '@tauri-apps/api/core';
import PanelModeContent from "@/app/panel-mode/ui/PanelModeContent";
import CustomTitlebar from "../components/CustomTitlebar";

interface PanelModePageProps {
    onBackToLauncher?: () => void;
}

export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
    const [currentSize, setCurrentSize] = useState({ width: 780, height: 300 });
    const [isInitialized, setIsInitialized] = useState(false);

    // DOM 참조
    const mainContainerRef = useRef<HTMLDivElement>(null);

    // 🎯 고정된 크기 설정
    const FIXED_WIDTH = 780;     // 고정 가로 크기
    const DEFAULT_HEIGHT = 420;  // 기본 세로 크기
    const MIN_HEIGHT = 300;      // 최소 세로 크기

    // 🎯 콘텐츠 높이 측정 (간소화)
    const measureContentHeight = useCallback(() => {
        if (!mainContainerRef.current) return DEFAULT_HEIGHT;

        const element = mainContainerRef.current;
        const rect = element.getBoundingClientRect();

        // DOM이 아직 렌더링되지 않았으면 기본값 반환
        if (rect.height === 0) {
            return DEFAULT_HEIGHT;
        }

        // 실제 콘텐츠 높이 (스크롤 높이 기준)
        const contentHeight = Math.max(
            element.scrollHeight,
            element.offsetHeight,
            rect.height
        );

        console.log(`📐 [panel-mode] 콘텐츠 높이: ${contentHeight}`);
        return contentHeight;
    }, [DEFAULT_HEIGHT]);

    // 🎯 윈도우 크기 조정 (DPI 스케일링 고려 + 콘텐츠 맞춤형)
    const adjustWindowSize = useCallback(async () => {
        if (!mainContainerRef.current) return;

        try {
            // 🎯 DPI 스케일링 정보 확인
            const devicePixelRatio = window.devicePixelRatio || 1;
            const scaleFactor = devicePixelRatio;

            console.log(`📺 [panel-mode] DPI 정보: devicePixelRatio=${devicePixelRatio}, scaleFactor=${scaleFactor}`);

            // 고정 가로, 콘텐츠에 따라 자동 세로
            const baseWidth = FIXED_WIDTH;
            const baseContentHeight = measureContentHeight();

            // 최소 높이만 보장 (콘텐츠에 맞춤)
            const baseHeight = Math.max(baseContentHeight, MIN_HEIGHT);

            // 🎯 스케일링 적용된 최종 크기
            const finalWidth = Math.round(baseWidth * scaleFactor);
            const finalHeight = Math.round(baseHeight * scaleFactor);

            console.log(`📐 [panel-mode] 크기 조정:`);
            console.log(`  - Base: ${baseWidth}x${baseHeight}`);
            console.log(`  - Scaled: ${finalWidth}x${finalHeight} (ratio: ${scaleFactor})`);

            // 크기 변화가 있을 때만 업데이트
            const heightDiff = Math.abs(finalHeight - currentSize.height);
            if (heightDiff > 10) {
                setCurrentSize({ width: finalWidth, height: finalHeight });

                // Tauri API로 크기 적용 (LogicalSize 우선)
                try {
                    await invoke('apply_window_size', {
                        width: finalWidth,
                        height: finalHeight,
                        windowType: 'panel-mode'
                    });
                    console.log(`✅ [panel-mode] 백엔드로 크기 적용: ${finalWidth}x${finalHeight}`);
                } catch (applyError) {
                    console.log(`ℹ️ [panel-mode] 백엔드 함수 없음, Tauri API 시도`);
                    try {
                        const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
                        const { LogicalSize } = await import('@tauri-apps/api/window');
                        const currentWindow = getCurrentWebviewWindow();

                        // LogicalSize로 설정 (DPI 스케일링 자동 처리)
                        await currentWindow.setSize(new LogicalSize(baseWidth, baseHeight));
                        console.log(`✅ [panel-mode] LogicalSize로 크기 적용: ${baseWidth}x${baseHeight}`);
                    } catch (tauriError) {
                        console.error(`❌ [panel-mode] LogicalSize 실패:`, tauriError);

                        // PhysicalSize로 재시도 (DPI 스케일링 수동 적용)
                        try {
                            const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
                            const { PhysicalSize } = await import('@tauri-apps/api/window');
                            const currentWindow = getCurrentWebviewWindow();
                            await currentWindow.setSize(new PhysicalSize(finalWidth, finalHeight));
                            console.log(`✅ [panel-mode] PhysicalSize로 크기 적용: ${finalWidth}x${finalHeight}`);
                        } catch (physicalError) {
                            console.error(`❌ [panel-mode] PhysicalSize도 실패:`, physicalError);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("❌ [panel-mode] 크기 조정 실패:", error);
        }
    }, [currentSize.height, FIXED_WIDTH, MIN_HEIGHT, measureContentHeight]);

    // 🎯 콘텐츠 변화 감지 (간소화)
    useEffect(() => {
        if (!mainContainerRef.current) return;

        let resizeTimeout: NodeJS.Timeout | null = null;

        // 디바운스된 크기 조정
        const debouncedAdjust = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                adjustWindowSize();
            }, 200);
        };

        // ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
            console.log("🔍 [panel-mode] 콘텐츠 크기 변화 감지");
            debouncedAdjust();
        });

        resizeObserver.observe(mainContainerRef.current);

        // 초기 크기 조정
        const initialTimeouts = [
            setTimeout(() => adjustWindowSize(), 100),
            setTimeout(() => adjustWindowSize(), 500),
            setTimeout(() => adjustWindowSize(), 1000)
        ];

        return () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeObserver.disconnect();
            initialTimeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, [adjustWindowSize]);

    // 🎯 PanelModeContent에서 크기 수신
    const handleSizeCalculated = useCallback((size: { width: number; height: number }) => {
        console.log(`📐 [panel-mode] 외부 크기 수신: ${size.width}x${size.height}`);
        setTimeout(() => adjustWindowSize(), 100);
    }, [adjustWindowSize]);

    // 🔄 초기화
    useEffect(() => {
        const initializePanel = async () => {
            try {
                console.log("🚀 [panel-mode] 패널 모드 초기화");

                // 저장된 크기 로드 시도
                try {
                    const savedSize = await invoke('load_window_size', {
                        windowType: 'panel-mode'
                    }) as { width: number; height: number };

                    const height = Math.max(MIN_HEIGHT, savedSize.height);
                    setCurrentSize({ width: FIXED_WIDTH, height });

                    await invoke('apply_window_size', {
                        width: FIXED_WIDTH,
                        height: height,
                        windowType: 'panel-mode'
                    });

                    console.log(`🎯 [panel-mode] 저장된 크기 적용: ${FIXED_WIDTH}x${height}`);
                } catch (error) {
                    console.log('ℹ️ [panel-mode] 기본 크기 사용');
                    setCurrentSize({ width: FIXED_WIDTH, height: MIN_HEIGHT });
                }

            } catch (error) {
                console.error("❌ [panel-mode] 초기화 실패:", error);
            } finally {
                setIsInitialized(true);
                console.log("✅ [panel-mode] 초기화 완료");
            }
        };

        setTimeout(initializePanel, 50);
    }, [FIXED_WIDTH, DEFAULT_HEIGHT, MIN_HEIGHT]);

    if (!isInitialized) {
        return (
            <div
                style={{
                    width: `${FIXED_WIDTH}px`,
                    height: `${DEFAULT_HEIGHT}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        border: '2px solid #e5e7eb',
                        borderTop: '2px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 8px'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Panel 모드 초기화 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={mainContainerRef}
            style={{
                width: `${FIXED_WIDTH}px`,
                minHeight: `${MIN_HEIGHT}px`,
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            <CustomTitlebar
                title="Panel Mode"
            />

            <div
                style={{
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    overflow: 'auto'
                }}
            >
                <PanelModeContent
                    onSizeCalculated={handleSizeCalculated}
                />
            </div>
        </div>
    );
}