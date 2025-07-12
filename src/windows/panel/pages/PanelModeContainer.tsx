import { useState, useEffect, useCallback, useRef } from "react";
import PanelModeContent from "@/windows/panel/components/PanelModeContent";
import CustomTitlebar from "../components/CustomTitlebar";

// 분리된 크기 계산 유틸리티 임포트
import {
    PANEL_WINDOW_CONFIG,
    adjustPanelWindowSize,
    loadSavedWindowSize,
    type WindowSize,
} from "@/windows/panel/utils/calculate_window";

interface PanelModePageProps {
    onBackToLauncher?: () => void;
}

export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
    const [currentSize, setCurrentSize] = useState<WindowSize>({
        width: PANEL_WINDOW_CONFIG.FIXED_WIDTH,
        height: PANEL_WINDOW_CONFIG.MIN_HEIGHT
    });
    const [isInitialized, setIsInitialized] = useState(false);

    // DOM 참조
    const mainContainerRef = useRef<HTMLDivElement>(null);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 🎯 단일 크기 조정 함수 (디바운스 포함)
    const adjustWindowSize = useCallback(async (delay: number = 200) => {
        if (!mainContainerRef.current) return;

        // 기존 타이머 클리어
        if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
        }

        // 디바운스 적용
        resizeTimeoutRef.current = setTimeout(async () => {
            const newSize = await adjustPanelWindowSize(
                mainContainerRef.current!,
                currentSize,
                {
                    windowType: 'panel-mode',
                    minHeightThreshold: 10,
                    useLogicalSize: true,
                }
            );

            if (newSize) {
                setCurrentSize(newSize);
            }
        }, delay);
    }, [currentSize]);

    // 🔄 단일 초기화 useEffect  
    useEffect(() => {
        let mounted = true;

        const initialize = async () => {
            try {
                console.log("🚀 [panel-mode] 패널 모드 초기화");

                // 저장된 크기 로드
                const savedSize = await loadSavedWindowSize('panel-mode');
                if (savedSize && mounted) {
                    setCurrentSize(savedSize);
                    console.log(`🎯 [panel-mode] 저장된 크기 사용: ${savedSize.width}x${savedSize.height}`);
                }

            } catch (error) {
                console.error("❌ [panel-mode] 초기화 실패:", error);
            } finally {
                if (mounted) {
                    setIsInitialized(true);
                    console.log("✅ [panel-mode] 초기화 완료");
                }
            }
        };

        // 50ms 후 초기화 시작
        const initTimeout = setTimeout(initialize, 50);

        // 정리 함수
        return () => {
            mounted = false;
            clearTimeout(initTimeout);
        };
    }, []); // 의존성 배열 비움 - 한 번만 실행

    // 🎯 PanelModeContent에서 계산된 크기 수신
    const handleSizeCalculated = useCallback((size: WindowSize) => {
        console.log(`📐 [panel-mode] 자식에서 계산된 크기: ${size.width}x${size.height}`);
        adjustWindowSize(100);
    }, [adjustWindowSize]);

    // 로딩 상태
    if (!isInitialized) {
        return (
            <div
                style={{
                    width: `${PANEL_WINDOW_CONFIG.FIXED_WIDTH}px`,
                    height: `${PANEL_WINDOW_CONFIG.DEFAULT_HEIGHT}px`,
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
            style={{
                width: `${PANEL_WINDOW_CONFIG.FIXED_WIDTH}px`,
                minHeight: `${PANEL_WINDOW_CONFIG.MIN_HEIGHT}px`,
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            <CustomTitlebar title="Panel Mode" />

            <div
                style={{
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    overflow: 'auto'
                }}
            >
                <PanelModeContent onSizeCalculated={handleSizeCalculated} />
            </div>
        </div>
    );
}