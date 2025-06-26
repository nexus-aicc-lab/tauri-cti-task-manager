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
import HamburgerButtonForSystemMenuWithDropdownStyle from './HamburgerButtonForSystemMenuWithDropdownStyle';

interface Props {
    title: string;
    onBackToLauncher: () => void;
}

export default function CustomTitlebar({ title, onBackToLauncher }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    // pin 상태 변경 함수
    const changeToggleMode = () => {
        setIsPinned((prev) => !prev);
        console.log(isPinned ? '📌 핀 해제됨' : '📌 핀 설정됨');
    };


    useEffect(() => {
        (async () => {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const win = getCurrentWindow();
            setIsMaximized(await win.isMaximized());
        })();
    }, []);

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

    return (
        <div
            className="h-10 bg-gray-200 flex items-center justify-between px-4 select-none border-b border-gray-300"
            data-tauri-drag-region
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
            {/* 왼쪽 영역 */}
            <div className="flex items-center space-x-3">
                <HamburgerButtonForSystemMenuWithDropdownStyle />
                <div className="text-sm text-gray-800 flex items-center space-x-1">
                    <span>👤 이재명(NEX1011)</span>
                    {/* <span className="bg-blue-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">2</span> */}
                </div>
            </div>

            {/* 가운데 영역 */}
            <div className="text-center flex-1 pointer-events-none">
                <span className="text-sm font-semibold text-gray-800">{title}</span>
            </div>

            {/* 오른쪽 영역 */}
            <div className="flex items-center space-x-1">
                <button
                    onClick={
                        // 핀 상태 변경, with chage toggle mode
                        (e) => {
                            e.stopPropagation();
                            changeToggleMode();
                        }

                    }
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title="핀 고정"
                >
                    {/* <Pin size={14} /> */}
                    {isPinned ?
                        <Pin size={14} color='green' /> : <PinOff size={14} color='red' />
                    }
                </button>
                {/* 바 모드 전환 버튼 */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSwitchToBar();
                    }}
                    className="text-gray-800 hover:text-blue-600 hover:bg-gray-300 p-1 rounded"
                    title="바 모드로 전환"
                >
                    <BetweenHorizontalEnd size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        minimize();
                    }}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        maximize();
                    }}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title={isMaximized ? '복원' : '최대화'}
                >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        close();
                    }}
                    className="text-gray-800 hover:text-red-600 hover:bg-gray-300 p-1 rounded"
                    title="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}