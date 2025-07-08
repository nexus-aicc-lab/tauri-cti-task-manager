// BarMode.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Pin, PinOff, Minus, BetweenHorizontalStart, X } from 'lucide-react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { emit } from '@tauri-apps/api/event';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import BarModeHamburgerButtonForContextMenu from './BarModeContextMenu';

const BarMode: React.FC = () => {
    const [alwaysOnTop, setAlwaysOnTop] = useState(false);
    const hamburgerRef = useRef<HTMLButtonElement>(null); // 여전히 부모 ref는 사용하지 않음

    useEffect(() => {
        (async () => {
            try {
                const win = getCurrentWebviewWindow();
                const pinState = await win.isAlwaysOnTop();
                setAlwaysOnTop(pinState);
            } catch (error) {
                console.error('Error getting always on top state:', error);
            }
        })();
    }, []);

    const handleAlwaysOnTop = async () => {
        try {
            const win = getCurrentWebviewWindow();
            const next = !alwaysOnTop;
            await win.setAlwaysOnTop(next);
            setAlwaysOnTop(next);
        } catch (error) {
            console.error('Error toggling always on top:', error);
        }
    };

    const handleMinimize = async () => {
        await getCurrentWebviewWindow().minimize();
    };

    const handleClose = async () => {
        await getCurrentWebviewWindow().close();
    };

    const handleSwitchToPanelMode = async () => {
        try {
            await emit('switch-mode', 'panel');
            console.log('📤 패널 모드 전환 이벤트 전송');
        } catch (error) {
            console.error('❌ 패널 전환 실패:', error);
        }
    };

    return (
        <div
            className="w-full h-11 flex items-center bg-[#F6FBFA] text-sm font-sans text-slate-700 select-none border-b border-slate-200"
            data-tauri-drag-region
        >
            <div className="w-full flex items-center justify-between px-3 py-2">
                {/* 왼쪽 */}
                <div className="flex items-center gap-2">
                    <BarModeHamburgerButtonForContextMenu />
                    <div className="w-px h-4 bg-slate-300"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-600 font-medium">LogOn</span>
                        <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                            08:02:40
                        </span>
                    </div>
                </div>

                {/* 가운데 (드래그 영역) */}
                <div
                    className="flex items-center gap-2 flex-1 justify-center"
                    style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
                >
                    <span className="bg-blue-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap shadow-sm hover:shadow-md transition-shadow">
                        👤 대기중 00:38:08
                    </span>
                    <span className="bg-teal-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap shadow-sm hover:shadow-md transition-shadow">
                        📞 12:50:20(12)
                    </span>
                    <span className="bg-orange-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap shadow-sm hover:shadow-md transition-shadow">
                        ✏️ 00:34:20(8)
                    </span>
                    <span className="bg-blue-600 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap shadow-sm hover:shadow-md transition-shadow">
                        🕐 12:00:34(15)
                    </span>
                    <span className="bg-purple-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap shadow-sm hover:shadow-md transition-shadow">
                        ☕ 00:00:00(0)
                    </span>
                </div>

                {/* 오른쪽 */}
                <div
                    className="flex items-center gap-2"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    <div className="flex items-center gap-1 text-xs">
                        <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-1 flex items-center gap-1 font-mono shadow-sm hover:shadow-md transition-shadow">
                            🕒 8
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 rounded-full px-2 py-1 flex items-center gap-1 font-mono shadow-sm hover:shadow-md transition-shadow">
                            ✅ 10
                        </span>
                    </div>

                    <div className="w-px h-4 bg-slate-300"></div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSwitchToPanelMode}
                            className="h-7 w-7 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                            title="패널 모드로 전환"
                        >
                            <BetweenHorizontalStart size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleAlwaysOnTop}
                            className={cn(
                                'h-7 w-7 hover:bg-slate-100 transition-colors',
                                alwaysOnTop
                                    ? 'text-emerald-600 hover:text-emerald-700'
                                    : 'text-slate-500 hover:text-slate-700'
                            )}
                            title={alwaysOnTop ? '항상 위에 해제' : '항상 위에 고정'}
                        >
                            {alwaysOnTop ? <Pin size={14} /> : <PinOff size={14} />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleMinimize}
                            className="h-7 w-7 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                            title="최소화"
                        >
                            <Minus size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="h-7 w-7 hover:bg-red-100 hover:text-red-600 text-slate-600 transition-colors"
                            title="닫기"
                        >
                            <X size={14} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarMode;