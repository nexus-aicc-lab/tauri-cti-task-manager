import { useState, useEffect, useCallback } from "react";
import { invoke } from '@tauri-apps/api/core';
import CustomTitlebar from "@/app/panel-mode/ui/CustomTitlebar";
import PanelModeContent from "@/app/panel-mode/ui/PanelModeContent";


interface PanelModePageProps {
    onBackToLauncher?: () => void;
}

export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
    const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
    const [isInitialized, setIsInitialized] = useState(false);
    // const [hasAppliedSize, setHasAppliedSize] = useState(false);
    const [initialSizeSet, setInitialSizeSet] = useState(false);

    // 🎯 최대 크기 제한 상수 (windows.rs Panel 모드 설정 반영)
    const MAX_WIDTH = 900;   // Panel 모드 최대 너비 (windows.rs와 일치)
    const MAX_HEIGHT = 800;  // 적절한 최대 높이 제한

    // 🎯 크기 적용 함수
    const applyWindowSize = useCallback(async (size: { width: number; height: number }) => {
        try {
            // 🚨 최대 크기 제한 적용
            const limitedSize = {
                width: Math.min(size.width, MAX_WIDTH),
                height: Math.min(size.height, MAX_HEIGHT)
            };

            console.log(`🔄 [panel-mode] 윈도우 크기 적용 (제한 적용): ${limitedSize.width}x${limitedSize.height}`);
            if (size.width > MAX_WIDTH || size.height > MAX_HEIGHT) {
                console.log(`⚠️ [panel-mode] 크기 제한 적용됨 - 원본: ${size.width}x${size.height}, 제한 후: ${limitedSize.width}x${limitedSize.height}`);
            }

            // 백엔드 저장 시도
            try {
                await invoke('save_window_size', {
                    width: limitedSize.width,
                    height: limitedSize.height,
                    windowType: 'panel-mode'
                });
                console.log('💾 [panel-mode] 크기 저장 완료');
            } catch (saveError) {
                console.log('ℹ️ [panel-mode] 크기 저장 함수 없음');
            }

            // 백엔드 적용 시도
            try {
                await invoke('apply_window_size', {
                    width: limitedSize.width,
                    height: limitedSize.height,
                    windowType: 'panel-mode'
                });
                console.log('🎯 [panel-mode] 크기 적용 완료');
            } catch (applyError) {
                console.log('ℹ️ [panel-mode] 크기 적용 함수 없음');
            }

            // setHasAppliedSize(true);
            console.log(`✅ [panel-mode] 크기 처리 완료: ${limitedSize.width}x${limitedSize.height}`);

        } catch (error) {
            console.error("❌ [panel-mode] 윈도우 크기 처리 실패:", error);
        }
    }, [MAX_WIDTH, MAX_HEIGHT]);

    // 🎯 PanelModeContent에서 계산된 크기 받기
    const handleSizeCalculated = useCallback((size: { width: number; height: number }) => {
        console.log(`📐 [panel-mode] 새 크기 수신: ${size.width}x${size.height}`);

        // 🚨 최대 크기 제한 미리 적용
        const limitedSize = {
            width: Math.min(size.width, MAX_WIDTH),
            height: Math.min(size.height, MAX_HEIGHT)
        };

        setCurrentSize(limitedSize);

        // 초기 설정이 완료되었거나, 크기가 현재와 다른 경우에만 적용
        if (!initialSizeSet ||
            Math.abs(limitedSize.width - currentSize.width) > 10 ||
            Math.abs(limitedSize.height - currentSize.height) > 10) {

            console.log('📏 [panel-mode] 크기 변화 감지 - 적용 시작');
            setInitialSizeSet(true);
            applyWindowSize(limitedSize);
        }
    }, [currentSize, initialSizeSet, applyWindowSize, MAX_WIDTH, MAX_HEIGHT]);

    // 📱 수동 크기 맞춤 함수
    const manualResize = useCallback(async () => {
        console.log("📐 [panel-mode] 수동 크기 맞춤 요청");

        // 수동 요청시에는 플래그들 리셋하고 강제 재계산
        // setHasAppliedSize(false);
        setInitialSizeSet(false);

        // 잠시 후 컨텐츠 재측정하도록 유도
        setTimeout(() => {
            console.log("🔄 [panel-mode] 컨텐츠 재측정 유도");
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }, []);

    // ⌨️ 키보드 단축키
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                console.log("⌨️ [panel-mode] Ctrl+R 수동 리사이즈");
                manualResize();
            }
            if (e.key === 'F5') {
                e.preventDefault();
                console.log("⌨️ [panel-mode] F5 수동 리사이즈");
                manualResize();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [manualResize]);

    // 🔄 앱 시작 시 초기화
    useEffect(() => {
        const initializePanel = async () => {
            try {
                console.log("🚀 [panel-mode] 패널 모드 초기화 시작");

                // 💡 저장된 크기가 있다면 먼저 로드
                try {
                    const savedSize = await invoke('load_window_size', {
                        windowType: 'panel-mode'
                    }) as { width: number; height: number };

                    console.log(`📋 [panel-mode] 저장된 크기 발견: ${savedSize.width}x${savedSize.height}`);

                    // 최대 크기 제한 적용
                    const limitedSize = {
                        width: Math.min(savedSize.width, MAX_WIDTH),
                        height: Math.min(savedSize.height, MAX_HEIGHT)
                    };

                    // 저장된 크기 적용
                    await invoke('apply_window_size', {
                        width: limitedSize.width,
                        height: limitedSize.height,
                        windowType: 'panel-mode'
                    });

                    setCurrentSize(limitedSize);

                } catch (error) {
                    console.log('ℹ️ [panel-mode] 저장된 크기 없음, 기본 크기로 초기화');

                    // windows.rs Panel 모드 기본 크기
                    const INITIAL_WIDTH = 900;   // Panel 모드 기본 너비
                    const INITIAL_HEIGHT = 350;  // Panel 모드 기본 높이

                    console.log(`🎯 [panel-mode] 초기 크기 설정: ${INITIAL_WIDTH}x${INITIAL_HEIGHT}`);

                    await invoke('apply_window_size', {
                        width: INITIAL_WIDTH,
                        height: INITIAL_HEIGHT,
                        windowType: 'panel-mode'
                    });

                    setCurrentSize({ width: INITIAL_WIDTH, height: INITIAL_HEIGHT });
                }

                // 잠시 대기 후 정확한 크기 재계산 유도
                setTimeout(() => {
                    console.log("🔄 [panel-mode] 정확한 크기 재계산 유도");
                    window.dispatchEvent(new Event('resize'));
                }, 200);

            } catch (error) {
                console.error("❌ [panel-mode] 패널 초기화 실패:", error);
            } finally {
                setIsInitialized(true);
                console.log("✅ [panel-mode] 패널 모드 초기화 완료");
            }
        };

        const timer = setTimeout(initializePanel, 100);
        return () => clearTimeout(timer);
    }, [MAX_WIDTH, MAX_HEIGHT]);

    if (!isInitialized) {
        return (
            <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <span className="text-sm text-gray-600">Panel 모드 초기화 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-white min-h-screen">
            <CustomTitlebar
                title="U PERSONAL"
                onBackToLauncher={onBackToLauncher || (() => { })}
                currentSize={currentSize}
            />

            {/* 🎯 컨텐츠 영역 */}
            <div className="p-2 flex flex-col">
                <PanelModeContent
                    onSizeCalculated={handleSizeCalculated}
                />
            </div>

            {/* 🔍 개발 모드 상태 정보 */}
            {/* {import.meta.env.MODE === 'development' && (
                <div className="fixed bottom-2 left-2 bg-black bg-opacity-90 text-white text-xs p-3 rounded font-mono z-50">
                    <div className="text-green-400 font-bold mb-2">🎯 [panel-mode] 크기 상태</div>

                    <div className="space-y-1">
                        <div>현재 크기: {currentSize.width}×{currentSize.height}</div>
                        <div>최대 제한: {MAX_WIDTH}×{MAX_HEIGHT}</div>
                        <div>적용 상태: {hasAppliedSize ? '✅ 완료' : '⏸️ 대기'}</div>
                        <div>초기 설정: {initialSizeSet ? '✅ 완료' : '⏸️ 대기'}</div>
                    </div>

                    <div className="text-xs mt-2 pt-2 border-t border-gray-600">
                        <div>단축키: Ctrl+R, F5 (강제 리사이즈)</div>
                        <div className="text-yellow-400">windows.rs 기본값 적용</div>
                    </div>
                </div>
            )} */}
        </div>
    );
}