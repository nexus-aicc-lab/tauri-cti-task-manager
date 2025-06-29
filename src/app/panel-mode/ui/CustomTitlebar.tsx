// // CustomTitlebar.tsx

// 'use client';

// import { useEffect, useState } from 'react';
// import {
//     Pin,
//     PinOff,
//     Minus,
//     Maximize2,
//     Minimize2,
//     X,
//     BetweenHorizontalEnd,
// } from 'lucide-react';
// import MainSystemMenu from '@/widgets/titlebar/ui/MainSystemMenu';

// interface Props {
//     title: string;
//     onBackToLauncher: () => void;
//     currentSize?: { width: number; height: number }; // 🆕 크기 정보 prop
// }

// export default function CustomTitlebar({ title, currentSize }: Props) {
//     const [isMaximized, setIsMaximized] = useState(false);
//     const [isPinned, setIsPinned] = useState(false);

//     // 핀 상태 변경 함수 (백엔드 명령어 사용)
//     const changeToggleMode = async () => {
//         try {
//             const { invoke } = await import('@tauri-apps/api/core');
//             const newState = await invoke('toggle_always_on_top') as boolean;
//             setIsPinned(newState);

//             console.log(newState ? '📌 항상 위에 보이기 활성화' : '📌 항상 위에 보이기 비활성화');
//         } catch (error) {
//             console.error('❌ 핀 모드 변경 실패:', error);
//         }
//     };

//     const minimize = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         (await getCurrentWindow()).minimize();
//     };

//     const maximize = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         const win = await getCurrentWindow();
//         const max = await win.isMaximized();
//         if (max) {
//             await win.unmaximize();
//         } else {
//             await win.maximize();
//         }
//         setIsMaximized(!max);
//     };

//     const close = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         (await getCurrentWindow()).close();
//     };

//     const handleSwitchToBar = async () => {
//         try {
//             const { emit } = await import('@tauri-apps/api/event');
//             await emit('switch-mode', 'bar');
//             console.log('📤 바 모드 전환 요청 전송');
//         } catch (error) {
//             console.error('❌ 바 모드 전환 요청 실패:', error);
//         }
//     };

//     useEffect(() => {
//         (async () => {
//             try {
//                 const { invoke } = await import('@tauri-apps/api/core');
//                 const { getCurrentWindow } = await import('@tauri-apps/api/window');
//                 const win = getCurrentWindow();

//                 // 현재 창 상태 동기화
//                 setIsMaximized(await win.isMaximized());

//                 // 백엔드에서 핀 상태 확인
//                 const pinState = await invoke('get_always_on_top_state') as boolean;
//                 setIsPinned(pinState);
//             } catch (error) {
//                 console.error('❌ 창 상태 확인 실패:', error);
//             }
//         })();
//     }, []);

//     return (
//         <div
//             className="h-10 bg-gray-200 flex items-center justify-between px-4 select-none border-b border-gray-300"
//             data-tauri-drag-region
//         >
//             {/* 왼쪽 영역 */}
//             <div className="flex items-center space-x-6" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
//                 <MainSystemMenu />
//                 <div className="text-sm text-gray-800 flex items-center space-x-1 pl-4">
//                     <span>👤 이재명(NEX1011)</span>
//                 </div>
//                 {/* 🆕 크기 정보 표시 */}
//                 {currentSize && (
//                     <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
//                         📏 {currentSize.width} × {currentSize.height}px
//                     </div>
//                 )}
//             </div>

//             {/* 가운데 영역 */}
//             <div className="text-center flex-1 pointer-events-none">
//                 <span className="text-sm font-semibold text-gray-800">{title}</span>
//             </div>

//             {/* 오른쪽 영역 */}
//             <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
//                 {/* 핀 버튼 (항상 위에 보이기) */}
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         changeToggleMode();
//                     }}
//                     className={`p-1 rounded transition-colors ${isPinned
//                         ? 'text-green-600 bg-green-100 hover:bg-green-200'
//                         : 'text-red-600 bg-red-100 hover:bg-red-200'
//                         }`}
//                     title={isPinned ? '항상 위에 보이기 해제' : '항상 위에 보이기'}
//                 >
//                     {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
//                 </button>

//                 {/* 바 모드 전환 버튼 */}
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleSwitchToBar();
//                     }}
//                     className="text-gray-800 hover:text-blue-600 hover:bg-gray-300 p-1 rounded"
//                     title="바 모드로 전환"
//                 >
//                     <BetweenHorizontalEnd size={14} />
//                 </button>

//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         minimize();
//                     }}
//                     className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
//                     title="최소화"
//                 >
//                     <Minus size={14} />
//                 </button>

//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         maximize();
//                     }}
//                     className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
//                     title={isMaximized ? '복원' : '최대화'}
//                 >
//                     {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
//                 </button>

//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         close();
//                     }}
//                     className="text-gray-800 hover:text-red-600 hover:bg-gray-300 p-1 rounded"
//                     title="닫기"
//                 >
//                     <X size={14} />
//                 </button>
//             </div>
//         </div>
//     );
// }

// CustomTitlebar.tsx

'use client';

import { useEffect, useState } from 'react';
import {
    Pin,
    PinOff,
    Minus,
    Maximize2,
    Minimize2,
    X,
    BetweenHorizontalEnd,
} from 'lucide-react';
import MainSystemMenu from '@/widgets/titlebar/ui/MainSystemMenu';

interface Props {
    title: string;
    onBackToLauncher: () => void;
    currentSize?: { width: number; height: number }; // 🆕 크기 정보 prop
}

export default function CustomTitlebar({ title, currentSize }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    // 핀 상태 변경 함수 (백엔드 명령어 사용)
    const changeToggleMode = async () => {
        try {
            const { invoke } = await import('@tauri-apps/api/core');
            const newState = await invoke('toggle_always_on_top') as boolean;
            setIsPinned(newState);

            console.log(newState ? '📌 항상 위에 보이기 활성화' : '📌 항상 위에 보이기 비활성화');
        } catch (error) {
            console.error('❌ 핀 모드 변경 실패:', error);
        }
    };

    const minimize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        (await getCurrentWindow()).minimize();
    };

    const maximize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const win = await getCurrentWindow();
        const max = await win.isMaximized();
        if (max) {
            await win.unmaximize();
        } else {
            await win.maximize();
        }
        setIsMaximized(!max);
    };

    const close = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        (await getCurrentWindow()).close();
    };

    const handleSwitchToBar = async () => {
        try {
            const { emit } = await import('@tauri-apps/api/event');
            await emit('switch-mode', 'bar');
            console.log('📤 바 모드 전환 요청 전송');
        } catch (error) {
            console.error('❌ 바 모드 전환 요청 실패:', error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const { invoke } = await import('@tauri-apps/api/core');
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                const win = getCurrentWindow();

                // 현재 창 상태 동기화
                setIsMaximized(await win.isMaximized());

                // 백엔드에서 핀 상태 확인
                const pinState = await invoke('get_always_on_top_state') as boolean;
                setIsPinned(pinState);
            } catch (error) {
                console.error('❌ 창 상태 확인 실패:', error);
            }
        })();
    }, []);

    return (
        <div
            className="h-10 bg-cyan-500 flex items-center justify-between px-4 select-none border-b border-cyan-600"
            data-tauri-drag-region
        >
            {/* 왼쪽 영역 */}
            <div className="flex items-center space-x-6" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <MainSystemMenu />
                <div className="text-sm text-white flex items-center space-x-1 pl-4">
                    <span>👤 이재명(NEX1011)</span>
                </div>
                {/* 🆕 크기 정보 표시 */}
                {currentSize && (
                    <div className="text-xs text-cyan-800 bg-white bg-opacity-20 px-2 py-1 rounded">
                        📏 {currentSize.width} × {currentSize.height}px
                    </div>
                )}
            </div>

            {/* 가운데 영역 */}
            <div className="text-center flex-1 pointer-events-none">
                <span className="text-sm font-semibold text-white">{title}</span>
            </div>

            {/* 오른쪽 영역 */}
            <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                {/* 핀 버튼 (항상 위에 보이기) */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        changeToggleMode();
                    }}
                    className={`p-1 rounded transition-colors shadow-sm ${isPinned
                        ? 'text-green-700 bg-white bg-opacity-90 hover:bg-opacity-100'
                        : 'text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90'
                        }`}
                    title={isPinned ? '항상 위에 보이기 해제' : '항상 위에 보이기'}
                >
                    {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
                </button>

                {/* 바 모드 전환 버튼 */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSwitchToBar();
                    }}
                    className="text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90 hover:text-blue-600 p-1 rounded shadow-sm transition-colors"
                    title="바 모드로 전환"
                >
                    <BetweenHorizontalEnd size={14} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        minimize();
                    }}
                    className="text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90 hover:text-gray-900 p-1 rounded shadow-sm transition-colors"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        maximize();
                    }}
                    className="text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90 hover:text-gray-900 p-1 rounded shadow-sm transition-colors"
                    title={isMaximized ? '복원' : '최대화'}
                >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        close();
                    }}
                    className="text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90 hover:text-red-600 p-1 rounded shadow-sm transition-colors"
                    title="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}