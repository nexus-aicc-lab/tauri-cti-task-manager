'use client';

import React, { useEffect, useState } from 'react';
import {
    Pin, PinOff, Minus, Maximize2, Minimize2, X
} from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/core';

interface Props {
    title: string;
}

export default function CustomTitlebar({ title }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

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
    }, []);

    return (
        <div
            className="h-6 px-4 bg-[#55BDC7] flex items-center justify-between text-white border-b border-[#55AAB7] select-none"
            data-tauri-drag-region
        >
            <div className="text-xs font-semibold pointer-events-none">{title}</div>
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