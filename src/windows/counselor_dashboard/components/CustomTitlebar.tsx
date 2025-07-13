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
import HamburgerButtonForSystemMenuWithDropdownStyle from '@/app/panel-mode/ui/HamburgerButtonForSystemMenuWithDropdownStyle';

interface UserInfo {
    id: string;
    username: string;
    email: string;
    department: string;
    role: string;
    profileImage?: string;
}

interface Props {
    title: string;
    currentSize?: { width: number; height: number };
    user?: UserInfo | null;
}

export default function CustomTitlebar({ title, currentSize, user }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    console.log("user in CustomTitlebar:", user);


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

                setIsMaximized(await win.isMaximized());
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
                <HamburgerButtonForSystemMenuWithDropdownStyle />
                <div className="text-sm text-white flex items-center space-x-1 pl-4">
                    {user ? (
                        <span>👤 {user.username}({user.id}) - {user.department}</span>
                    ) : (
                        <span>👤 로그인 필요</span>
                    )}
                </div>
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