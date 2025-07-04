'use client';

import React, { useEffect, useState } from 'react';
import {
    Pin, PinOff, Minus, Maximize2, Minimize2, X, Layout
} from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { emit } from '@tauri-apps/api/event';
import HamburgerButtonForSystemMenuWithDropdownStyle from '@/app/panel-mode/ui/HamburgerButtonForSystemMenuWithDropdownStyle';

interface Props {
    title: string;
}

export default function CustomTitlebar({ title }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const togglePin = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            const win = getCurrentWindow();
            const isPinnedNow = await win.isAlwaysOnTop();
            await win.setAlwaysOnTop(!isPinnedNow);
            setIsPinned(!isPinnedNow);
        } catch (err) {
            console.error('❌ 핀 토글 실패:', err);
        }
    };

    const minimize = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        (await getCurrentWindow()).minimize();
    };

    const toggleMaximize = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const win = await getCurrentWindow();
        const isMax = await win.isMaximized();
        if (isMax) await win.unmaximize();
        else await win.maximize();
        setIsMaximized(!isMax);
    };

    const close = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        (await getCurrentWindow()).close();
    };

    // 🎯 패널 모드로 전환하는 함수
    const switchToPanelMode = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await emit('switch-mode', 'panel'); // 🎯 MainPage와 동일한 방식으로 호출
            console.log('🔄 패널 모드로 전환 요청 전송');
        } catch (error) {
            console.error('❌ 패널 모드 전환 실패:', error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const win = getCurrentWindow();
                setIsMaximized(await win.isMaximized());
                setIsPinned(await win.isAlwaysOnTop());
            } catch (error) {
                console.error('❌ 상태 초기화 실패:', error);
            }
        })();
    }, []);

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
            </div>

            {/* 오른쪽: 윈도우 컨트롤 */}
            <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
                {/* 🎯 패널 모드 전환 버튼 추가 */}
                <button
                    onClick={switchToPanelMode}
                    className="text-gray-700 bg-white/80 hover:bg-white/90 hover:text-blue-600 p-0.5 rounded shadow-sm transition-colors"
                    title="패널 모드로 전환"
                >
                    <Layout size={12} />
                </button>
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