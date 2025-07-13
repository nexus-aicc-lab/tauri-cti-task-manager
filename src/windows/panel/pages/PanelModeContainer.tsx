import { useState, useEffect, useCallback, useRef } from "react";
import PanelModeContent from "@/windows/panel/components/PanelModeContent";
import CustomTitlebar from "../components/CustomTitlebar";

// 분리된 크기 계산 유틸리티 임포트
import {
    PANEL_WINDOW_CONFIG,
    loadSavedWindowSize,
    createWindowSizeAdjuster,
    type WindowSize,
} from "@/windows/panel/utils/calculate_window";
import { useLoginStore } from "../store/useLoginStoreForFileSystem";
import LoginForm from "@/shared/ui/LoginForm/LoginForm";

interface PanelModePageProps {
    onBackToLauncher?: () => void;
}

export default function PanelModeContainer({ onBackToLauncher }: PanelModePageProps) {
    const [currentSize, setCurrentSize] = useState<WindowSize>({
        width: PANEL_WINDOW_CONFIG.FIXED_WIDTH,
        height: PANEL_WINDOW_CONFIG.MIN_HEIGHT
    });

    // DOM 참조
    const mainContainerRef = useRef<HTMLDivElement>(null);

    // 윈도우 크기 조정기 생성
    const windowSizeAdjuster = useRef(createWindowSizeAdjuster(200));

    // 🎯 크기 변경 핸들러
    const handleSizeChanged = useCallback((newSize: WindowSize) => {
        setCurrentSize(newSize);
    }, []);

    // 🎯 크기 조정 함수
    const adjustWindowSize = useCallback(async (delay: number = 200) => {
        await windowSizeAdjuster.current.adjustWindowSize(
            mainContainerRef.current,
            currentSize,
            handleSizeChanged
        );
    }, [currentSize, handleSizeChanged]);

    // 🔄 단일 초기화 useEffect
    useEffect(() => {
        let mounted = true;
        let resizeObserver: ResizeObserver | null = null;

        const initialize = async () => {
            try {
                console.log("🚀 [panel-mode] 패널 모드 초기화");

                // 1. 저장된 크기 로드
                const savedSize = await loadSavedWindowSize('panel-mode');
                if (savedSize && mounted) {
                    setCurrentSize(savedSize);
                    console.log(`🎯 [panel-mode] 저장된 크기 사용: ${savedSize.width}x${savedSize.height}`);
                }

                // 2. ResizeObserver 설정
                if (mainContainerRef.current && mounted) {
                    resizeObserver = new ResizeObserver(() => {
                        console.log("🔍 [panel-mode] 콘텐츠 크기 변화 감지");
                        adjustWindowSize(200);
                    });
                    resizeObserver.observe(mainContainerRef.current);
                }

                // 3. 초기 크기 조정 (단계적으로)
                if (mounted) {
                    adjustWindowSize(100);  // 즉시
                    setTimeout(() => mounted && adjustWindowSize(0), 500);   // 0.5초 후
                    setTimeout(() => mounted && adjustWindowSize(0), 1000);  // 1초 후
                }

            } catch (error) {
                console.error("❌ [panel-mode] 초기화 실패:", error);
            } finally {
                if (mounted) {
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
            windowSizeAdjuster.current.cleanup();
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, []); // 의존성 배열 비움 - 한 번만 실행

    // 🎯 PanelModeContent에서 계산된 크기 수신
    const handleSizeCalculated = useCallback((size: WindowSize) => {
        console.log(`📐 [panel-mode] 자식에서 계산된 크기: ${size.width}x${size.height}`);
        adjustWindowSize(100);
    }, [adjustWindowSize]);

    return (
        <div
            ref={mainContainerRef}
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