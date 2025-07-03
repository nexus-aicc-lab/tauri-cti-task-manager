// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//     Pin, PinOff, Minus, Maximize2, Minimize2, X
// } from 'lucide-react';
// import { getCurrentWindow } from '@tauri-apps/api/window';
// import { invoke } from '@tauri-apps/api/core';

// interface Props {
//     title: string;
// }

// export default function CustomTitlebar({ title }: Props) {
//     const [isMaximized, setIsMaximized] = useState(false);
//     const [isPinned, setIsPinned] = useState(false);

//     // 핀 상태 토글
//     const togglePin = async (e?: React.MouseEvent) => {
//         e?.stopPropagation();
//         try {
//             const win = getCurrentWindow();
//             const isPinnedNow = await win.isAlwaysOnTop();
//             await win.setAlwaysOnTop(!isPinnedNow);
//             setIsPinned(!isPinnedNow);
//         } catch (err) {
//             console.warn('❗ JS API 실패, invoke로 대체 시도:', err);
//             try {
//                 const newState = await invoke('toggle_always_on_top') as boolean;
//                 setIsPinned(newState);
//             } catch (fallbackErr) {
//                 console.error('❌ 핀 토글 실패:', fallbackErr);
//             }
//         }
//     };

//     // 최소화
//     const minimize = async (e?: React.MouseEvent) => {
//         e?.stopPropagation();
//         (await getCurrentWindow()).minimize();
//     };

//     // 최대화/복원
//     const toggleMaximize = async (e?: React.MouseEvent) => {
//         e?.stopPropagation();
//         const win = await getCurrentWindow();
//         const isMax = await win.isMaximized();
//         if (isMax) await win.unmaximize();
//         else await win.maximize();
//         setIsMaximized(!isMax);
//     };

//     // 닫기
//     const close = async (e?: React.MouseEvent) => {
//         e?.stopPropagation();
//         (await getCurrentWindow()).close();
//     };

//     // 초기 상태 설정
//     useEffect(() => {
//         (async () => {
//             try {
//                 const win = getCurrentWindow();
//                 setIsMaximized(await win.isMaximized());
//                 setIsPinned(await win.isAlwaysOnTop());
//             } catch (error) {
//                 console.warn('❗ JS API 실패, invoke로 상태 동기화 시도:', error);
//                 try {
//                     const pinState = await invoke('get_always_on_top_state') as boolean;
//                     setIsPinned(pinState);
//                 } catch (fallbackErr) {
//                     console.error('❌ 핀 상태 확인 실패:', fallbackErr);
//                 }
//             }
//         })();
//     }, []);

//     return (
//         <div
//             className="h-6 px-4 bg-[#55BDC7] flex items-center justify-between text-white border-b border-[#55AAB7] select-none"
//             data-tauri-drag-region
//         >
//             <div className="text-xs font-semibold pointer-events-none">{title}</div>
//             <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
//                 <button
//                     onClick={togglePin}
//                     className={`p-0.5 rounded transition-colors shadow-sm ${isPinned
//                         ? 'text-green-700 bg-white/90 hover:bg-white'
//                         : 'text-gray-700 bg-white/80 hover:bg-white/90'
//                         }`}
//                     title={isPinned ? '항상 위에 보이기 해제' : '항상 위에 보이기'}
//                 >
//                     {isPinned ? <Pin size={12} /> : <PinOff size={12} />}
//                 </button>

//                 <button
//                     onClick={minimize}
//                     className="text-gray-700 bg-white/80 hover:bg-white/90 hover:text-gray-900 p-0.5 rounded shadow-sm transition-colors"
//                     title="최소화"
//                 >
//                     <Minus size={12} />
//                 </button>

//                 <button
//                     onClick={toggleMaximize}
//                     className="text-gray-700 bg-white/80 hover:bg-white/90 hover:text-gray-900 p-0.5 rounded shadow-sm transition-colors"
//                     title={isMaximized ? '복원' : '최대화'}
//                 >
//                     {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
//                 </button>

//                 <button
//                     onClick={close}
//                     className="text-gray-700 bg-white/80 hover:bg-white/90 hover:text-red-600 p-0.5 rounded shadow-sm transition-colors"
//                     title="닫기"
//                 >
//                     <X size={12} />
//                 </button>
//             </div>
//         </div>
//     );
// }

'use client';

import React, { useEffect, useState } from 'react';
import {
    Pin, PinOff, Minus, Maximize2, Minimize2, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';
import { useRouter } from '@tanstack/react-router';

interface Props {
    title: string;
}

export default function CustomTitlebar({ title }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    // 🎯 히스토리 추적을 위한 상태
    const [historyIndex, setHistoryIndex] = useState(0);
    const [maxHistoryIndex, setMaxHistoryIndex] = useState(0);

    const router = useRouter();

    // 🎯 네비게이션 기능들
    const goBack = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (canGoBack) {
            console.log('🔙 뒤로가기 실행');
            router.history.back();
            // 히스토리 인덱스 업데이트
            const newIndex = Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            updateNavigationButtons(newIndex, maxHistoryIndex);
        }
    };

    const goForward = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (canGoForward) {
            console.log('🔜 앞으로가기 실행');
            router.history.forward();
            // 히스토리 인덱스 업데이트
            const newIndex = Math.min(maxHistoryIndex, historyIndex + 1);
            setHistoryIndex(newIndex);
            updateNavigationButtons(newIndex, maxHistoryIndex);
        }
    };

    // 🔍 네비게이션 버튼 상태 업데이트
    const updateNavigationButtons = (currentIndex: number, maxIndex: number) => {
        setCanGoBack(currentIndex > 0);
        setCanGoForward(currentIndex < maxIndex);

        console.log('🧭 네비게이션 상태 업데이트:', {
            currentIndex,
            maxIndex,
            canGoBack: currentIndex > 0,
            canGoForward: currentIndex < maxIndex
        });
    };

    // 🔍 네비게이션 상태 확인 (개선된 버전)
    const updateNavigationState = () => {
        try {
            // 새 페이지로 네비게이션 된 경우 (뒤로/앞으로가 아닌 일반 네비게이션)
            const currentPath = router.state.location.pathname + router.state.location.search + router.state.location.hash;

            // 현재 위치가 히스토리의 끝이 아니라면 (즉, 새로운 페이지로 이동한 경우)
            // maxHistoryIndex를 현재 위치로 업데이트
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setMaxHistoryIndex(newIndex);

            updateNavigationButtons(newIndex, newIndex);

            console.log('🧭 새 페이지 네비게이션:', {
                currentPath,
                newIndex,
                historyLength: window.history.length
            });
        } catch (error) {
            console.warn('⚠️ 네비게이션 상태 확인 실패:', error);
            // 폴백: 기본적인 히스토리 길이 체크
            const hasHistory = window.history.length > 1;
            setCanGoBack(hasHistory);
            setCanGoForward(false);
        }
    };

    // 🎯 브라우저 히스토리 이벤트 처리
    const handlePopState = (event: PopStateEvent) => {
        console.log('🔄 PopState 이벤트 감지');

        // popstate는 뒤로/앞으로 버튼으로 인한 네비게이션
        // 이 경우 히스토리 인덱스를 추정해야 함
        setTimeout(() => {
            // 간단한 추정: 현재 히스토리 길이와 이전 상태 비교
            const currentHistoryLength = window.history.length;

            // 실제로는 더 정교한 추적이 필요하지만,
            // 기본적으로 뒤로 갔다가 앞으로 갈 수 있도록 설정
            if (historyIndex > 0) {
                setCanGoForward(true);
            }

            updateNavigationButtons(historyIndex, maxHistoryIndex);
        }, 10);
    };

    // 핀 상태 토글
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

    // 최소화
    const minimize = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        (await getCurrentWindow()).minimize();
    };

    // 최대화/복원
    const toggleMaximize = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const win = await getCurrentWindow();
        const isMax = await win.isMaximized();
        if (isMax) await win.unmaximize();
        else await win.maximize();
        setIsMaximized(!isMax);
    };

    // 닫기
    const close = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        (await getCurrentWindow()).close();
    };

    // 초기 상태 설정
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

        // 초기 네비게이션 상태 설정
        setHistoryIndex(0);
        setMaxHistoryIndex(0);
        setCanGoBack(false);
        setCanGoForward(false);
    }, []);

    // 🎯 라우터 상태 변경 감지 (location 변경 시)
    useEffect(() => {
        updateNavigationState();
    }, [router.state.location.pathname, router.state.location.search, router.state.location.hash]);

    // 🎯 브라우저 이벤트 리스너 등록
    useEffect(() => {
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [historyIndex, maxHistoryIndex]);

    return (
        <div
            className="h-6 px-4 bg-[#55BDC7] flex items-center justify-between text-white border-b border-[#55AAB7] select-none"
            data-tauri-drag-region
        >
            {/* 왼쪽: 제목 + 네비게이션 버튼들 */}
            <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
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