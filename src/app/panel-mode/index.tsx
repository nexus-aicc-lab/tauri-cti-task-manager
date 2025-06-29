import { useState, useEffect, useCallback } from "react";
import { invoke } from '@tauri-apps/api/core';
import CustomTitlebar from "./ui/CustomTitlebar";
import PanelModeContent from "./ui/PanelModeContent";

interface PanelModePageProps {
    onBackToLauncher?: () => void;
}

export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
    const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasAppliedSize, setHasAppliedSize] = useState(false);
    const [initialSizeSet, setInitialSizeSet] = useState(false);

    // 🎯 최대 크기 제한 상수
    const MAX_WIDTH = 900;
    const MAX_HEIGHT = 800; // 필요시 높이도 제한 가능

    // 🎯 크기 적용 함수
    const applyWindowSize = useCallback(async (size: { width: number; height: number }) => {
        try {
            // 🚨 최대 크기 제한 적용
            const limitedSize = {
                width: Math.min(size.width, MAX_WIDTH),
                height: Math.min(size.height, MAX_HEIGHT)
            };

            console.log(`🔄 윈도우 크기 적용 (제한 적용): ${limitedSize.width}x${limitedSize.height}`);
            if (size.width > MAX_WIDTH || size.height > MAX_HEIGHT) {
                console.log(`⚠️ 크기 제한 적용됨 - 원본: ${size.width}x${size.height}, 제한 후: ${limitedSize.width}x${limitedSize.height}`);
            }

            // 백엔드 저장 시도
            try {
                await invoke('save_window_size', {
                    width: limitedSize.width,
                    height: limitedSize.height
                });
                console.log('💾 크기 저장 완료');
            } catch (saveError) {
                console.log('ℹ️ 크기 저장 함수 없음');
            }

            // 백엔드 적용 시도
            try {
                await invoke('apply_window_size', {
                    width: limitedSize.width,
                    height: limitedSize.height
                });
                console.log('🎯 크기 적용 완료');
            } catch (applyError) {
                console.log('ℹ️ 크기 적용 함수 없음');
            }

            setHasAppliedSize(true);
            console.log(`✅ 크기 처리 완료: ${limitedSize.width}x${limitedSize.height}`);

        } catch (error) {
            console.error("❌ 윈도우 크기 처리 실패:", error);
        }
    }, [MAX_WIDTH, MAX_HEIGHT]);

    // 🎯 PanelModeContent에서 계산된 크기 받기
    const handleSizeCalculated = useCallback((size: { width: number; height: number }) => {
        console.log(`📐 새 크기 수신: ${size.width}x${size.height}`);

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

            console.log('📏 크기 변화 감지 - 적용 시작');
            setInitialSizeSet(true);
            applyWindowSize(limitedSize);
        }
    }, [currentSize, initialSizeSet, applyWindowSize, MAX_WIDTH, MAX_HEIGHT]);

    // 📱 수동 크기 맞춤 함수
    const manualResize = useCallback(async () => {
        console.log("📐 수동 크기 맞춤 요청");

        // 수동 요청시에는 플래그들 리셋하고 강제 재계산
        setHasAppliedSize(false);
        setInitialSizeSet(false);

        // 잠시 후 컨텐츠 재측정하도록 유도
        setTimeout(() => {
            console.log("🔄 컨텐츠 재측정 유도");
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }, []);

    // ⌨️ 키보드 단축키
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                console.log("⌨️ Ctrl+R 수동 리사이즈");
                manualResize();
            }
            if (e.key === 'F5') {
                e.preventDefault();
                console.log("⌨️ F5 수동 리사이즈");
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
                console.log("🚀 패널 모드 초기화 시작");

                // 💡 새로고침 시 최소 크기로 먼저 설정하여 스크롤 방지
                try {
                    const INITIAL_WIDTH = Math.min(900, MAX_WIDTH); // 최대 크기 제한 적용
                    const INITIAL_HEIGHT = 500;

                    console.log(`🎯 초기 최소 크기 설정: ${INITIAL_WIDTH}x${INITIAL_HEIGHT}`);

                    await invoke('apply_window_size', {
                        width: INITIAL_WIDTH,
                        height: INITIAL_HEIGHT
                    });

                    // 잠시 대기 후 정확한 크기 재계산 유도
                    setTimeout(() => {
                        console.log("🔄 정확한 크기 재계산 유도");
                        window.dispatchEvent(new Event('resize'));
                    }, 200);

                } catch (error) {
                    console.log('ℹ️ 초기 크기 설정 함수 없음');
                }

            } catch (error) {
                console.error("❌ 패널 초기화 실패:", error);
            } finally {
                setIsInitialized(true);
                console.log("✅ 패널 모드 초기화 완료");
            }
        };

        const timer = setTimeout(initializePanel, 100);
        return () => clearTimeout(timer);
    }, [MAX_WIDTH]);

    if (!isInitialized) {
        return (
            <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <span className="text-sm text-gray-600">패널 초기화 중...</span>
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
                    showTopBoxes={true}
                    showBottomBox={true}
                />
            </div>

            {/* 🔍 개발 모드 상태 정보 */}
            {/* {import.meta.env.MODE === 'development' && (
                <div className="fixed bottom-2 left-2 bg-black bg-opacity-90 text-white text-xs p-3 rounded font-mono z-50">
                    <div className="text-green-400 font-bold mb-2">🎯 크기 상태</div>

                    <div className="space-y-1">
                        <div>현재 크기: {currentSize.width}×{currentSize.height}</div>
                        <div>최대 제한: {MAX_WIDTH}×{MAX_HEIGHT}</div>
                        <div>적용 상태: {hasAppliedSize ? '✅ 완료' : '⏸️ 대기'}</div>
                        <div>초기 설정: {initialSizeSet ? '✅ 완료' : '⏸️ 대기'}</div>
                    </div>

                    <div className="text-xs mt-2 pt-2 border-t border-gray-600">
                        <div>단축키: Ctrl+R, F5 (강제 리사이즈)</div>
                        <div className="text-yellow-400">최대 넓이 제한 모드</div>
                    </div>
                </div>
            )} */}
        </div>
    );
}