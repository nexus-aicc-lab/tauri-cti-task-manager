'use client';

import React, { useEffect, useState } from 'react';
import {
    Pin, PinOff, Minus, Maximize2, Minimize2, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { useRouter } from '@tanstack/react-router';
import HamburgerButtonForSystemMenuWithDropdownStyle from '@/app/panel-mode/ui/HamburgerButtonForSystemMenuWithDropdownStyle';

interface Props {
    title: string;
}

export default function CustomTitlebar({ title }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    const router = useRouter();

    // 🎯 브라우저 네이티브 히스토리 상태 확인 (수정된 부분)
    const updateNavigationState = () => {
        try {
            // 브라우저의 실제 히스토리 길이 확인
            const historyLength = window.history.length;

            // 기본적으로 히스토리가 있으면 뒤로 갈 수 있다고 가정
            const hasHistory = historyLength > 1;
            setCanGoBack(hasHistory);

            // 새로운 네비게이션에서는 앞으로 가기 불가능
            // (popstate 이벤트에서만 true로 설정됨)

            console.log('🧭 네비게이션 상태:', {
                historyLength,
                canGoBack: hasHistory,
                currentPath: router.state.location.pathname
            });

        } catch (error) {
            console.warn('⚠️ 네비게이션 상태 확인 실패:', error);
            setCanGoBack(false);
            setCanGoForward(false);
        }
    };

    // 🎯 네비게이션 기능들 (수정된 부분)
    const goBack = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (canGoBack) {
            console.log('🔙 뒤로가기 실행');
            window.history.back(); // 브라우저 네이티브 API 사용
        }
    };

    const goForward = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (canGoForward) {
            console.log('🔜 앞으로가기 실행');
            window.history.forward(); // 브라우저 네이티브 API 사용
        }
    };

    // 🎯 브라우저 히스토리 이벤트 처리 (수정된 부분)
    const handlePopState = (event: PopStateEvent) => {
        console.log('🔄 PopState 이벤트 감지');

        // popstate 이벤트 후 약간의 지연을 두고 상태 확인
        setTimeout(() => {
            const historyLength = window.history.length;

            // 뒤로 갈 수 있는지 확인
            setCanGoBack(historyLength > 1);

            // popstate가 발생했다는 것은 히스토리 네비게이션이 발생했다는 의미
            // 대부분의 경우 앞으로 갈 수 있음
            setCanGoForward(true);

            console.log('🧭 히스토리 변경 후 상태:', {
                historyLength,
                canGoBack: historyLength > 1,
                canGoForward: true
            });
        }, 50);
    };

    // 핀 상태 토글 (기존 코드 유지)
    const togglePin = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            const win = getCurrentWindow();
            const isPinnedNow = await win.isAlwaysOnTop();
            await win.setAlwaysOnTop(!isPinnedNow);
            setIsPinned(!isPinnedNow);
        } catch (err) {
            console.warn('❗ JS API 실패, invoke로 대체 시도:', err);
            try {
                const newState = await invoke('toggle_always_on_top') as boolean;
                setIsPinned(newState);
            } catch (fallbackErr) {
                console.error('❌ 핀 토글 실패:', fallbackErr);
            }
        }
    };

    // 최소화 (기존 코드 유지)
    const minimize = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        (await getCurrentWindow()).minimize();
    };

    // 최대화/복원 (기존 코드 유지)
    const toggleMaximize = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const win = await getCurrentWindow();
        const isMax = await win.isMaximized();
        if (isMax) await win.unmaximize();
        else await win.maximize();
        setIsMaximized(!isMax);
    };

    // 닫기 (기존 코드 유지)
    const close = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        (await getCurrentWindow()).close();
    };

    // 초기 상태 설정 (기존 코드 유지)
    useEffect(() => {
        (async () => {
            try {
                const win = getCurrentWindow();
                setIsMaximized(await win.isMaximized());
                setIsPinned(await win.isAlwaysOnTop());
            } catch (error) {
                console.warn('❗ JS API 실패, invoke로 상태 동기화 시도:', error);
                try {
                    const pinState = await invoke('get_always_on_top_state') as boolean;
                    setIsPinned(pinState);
                } catch (fallbackErr) {
                    console.error('❌ 핀 상태 확인 실패:', fallbackErr);
                }
            }
        })();

        // 초기 네비게이션 상태 설정 (수정된 부분)
        updateNavigationState();
    }, []);

    // 🎯 라우터 상태 변경 감지 (수정된 부분)
    useEffect(() => {
        // 새로운 페이지로 이동하면 앞으로 가기 불가능
        setCanGoForward(false);
        updateNavigationState();
    }, [router.state.location.pathname, router.state.location.search, router.state.location.hash]);

    // 🎯 브라우저 이벤트 리스너 등록 (수정된 부분)
    useEffect(() => {
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []); // 의존성 배열에서 불필요한 상태 제거

    return (
        <div
            className="h-6 px-4 bg-[#55BDC7] flex items-center justify-between text-white border-b border-[#55AAB7] select-none"
            data-tauri-drag-region
        >
            {/* 왼쪽: 제목 + 네비게이션 버튼들 */}
            <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <HamburgerButtonForSystemMenuWithDropdownStyle />
                <div className="text-xs font-semibold pointer-events-none" style={{ WebkitAppRegion: 'drag' } as any}>
                    {title}
                </div>

                {/* 🎯 제목 바로 오른쪽에 네비게이션 버튼들 */}
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={goBack}
                        disabled={!canGoBack}
                        className={`p-0.5 rounded transition-colors shadow-sm ${canGoBack
                            ? 'text-gray-700 bg-white/80 hover:bg-white/90 hover:text-gray-900'
                            : 'text-gray-400 bg-white/50 cursor-not-allowed'
                            }`}
                        title="뒤로 가기"
                    >
                        <ChevronLeft size={11} />
                    </button>

                    <button
                        onClick={goForward}
                        disabled={!canGoForward}
                        className={`p-0.5 rounded transition-colors shadow-sm ${canGoForward
                            ? 'text-gray-700 bg-white/80 hover:bg-white/90 hover:text-gray-900'
                            : 'text-gray-400 bg-white/50 cursor-not-allowed'
                            }`}
                        title="앞으로 가기"
                    >
                        <ChevronRight size={11} />
                    </button>
                </div>
            </div>

            {/* 오른쪽: 윈도우 컨트롤 */}
            <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <button
                    onClick={togglePin}
                    className={`p-0.5 rounded transition-colors shadow-sm ${isPinned
                        ? 'text-green-700 bg-white/90 hover:bg-white'
                        : 'text-gray-700 bg-white/80 hover:bg-white/90'
                        }`}
                    title={isPinned ? '항상 위에 보이기 해제' : '항상 위에 보이기'}
                >
                    {isPinned ? <Pin size={12} /> : <PinOff size={12} />}
                </button>

                <button
                    onClick={minimize}
                    className="text-gray-700 bg-white/80 hover:bg-white/90 hover:text-gray-900 p-0.5 rounded shadow-sm transition-colors"
                    title="최소화"
                >
                    <Minus size={12} />
                </button>

                <button
                    onClick={toggleMaximize}
                    className="text-gray-700 bg-white/80 hover:bg-white/90 hover:text-gray-900 p-0.5 rounded shadow-sm transition-colors"
                    title={isMaximized ? '복원' : '최대화'}
                >
                    {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </button>

                <button
                    onClick={close}
                    className="text-gray-700 bg-white/80 hover:bg-white/90 hover:text-red-600 p-0.5 rounded shadow-sm transition-colors"
                    title="닫기"
                >
                    <X size={12} />
                </button>
            </div>
        </div>
    );
}