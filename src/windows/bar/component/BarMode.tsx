// BarMode.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Pin, PinOff, Minus, BetweenHorizontalStart, X } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { emit } from '@tauri-apps/api/event';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import BarModeHamburgerButtonForContextMenu from './BarModeContextMenu';

const BarMode: React.FC = () => {
    const [alwaysOnTop, setAlwaysOnTop] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const win = await getCurrentWindow();
                const pinState = await win.isAlwaysOnTop();
                setAlwaysOnTop(pinState);
            } catch (error) {
                console.error('Error getting always on top state:', error);
            }
        })();
    }, []);

    const handleAlwaysOnTop = async () => {
        try {
            const win = await getCurrentWindow();
            const next = !alwaysOnTop;
            await win.setAlwaysOnTop(next);
            setAlwaysOnTop(next);
        } catch (error) {
            console.error('Error toggling always on top:', error);
        }
    };

    const handleMinimize = async () => {
        try {
            const win = await getCurrentWindow();
            await win.minimize();
        } catch (error) {
            console.error('Error minimizing window:', error);
        }
    };

    const handleClose = async () => {
        try {
            const win = await getCurrentWindow();
            await win.close();
        } catch (error) {
            console.error('Error closing window:', error);
        }
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
                    className="flex items-center gap-4 flex-1 justify-center"
                    style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
                >
                    {/* 대기중 배지 */}
                    <span
                        className="bg-[#4199E0] text-white rounded-full px-3 py-1 flex items-center gap-2 font-mono text-xs whitespace-nowrap shadow-sm hover:shadow-md transition-shadow"
                        title="대기중 상태"
                    >
                        <img
                            src="/icons/bar-mode/sandglass_for_bar_mode.svg"
                            alt="대기중 모래시계 아이콘"
                            className="w-4 h-4"
                        />
                        대기중 00:38:08
                    </span>

                    {/* 전화기 녹색 아이콘 */}
                    <span className="text-slate-600 font-medium text-xs flex items-center gap-1">
                        <img
                            src="/icons/bar-mode/green_phone_for_bar_mode.svg"
                            alt="녹색 전화기 아이콘"
                            className="w-4 h-4"
                        />
                        12:50:20(12)
                    </span>

                    {/* 전화기 갈색 아이콘 */}
                    <span className="text-slate-600 font-medium text-xs flex items-center gap-1">
                        <img
                            src="/icons/bar-mode/brown_phone_for_bar_mode.svg"
                            alt="갈색 전화기 아이콘"
                            className="w-4 h-4"
                        />
                        00:34:20(8)
                    </span>

                    {/* 커피 아이콘 */}
                    <span className="text-slate-600 font-medium text-xs flex items-center gap-1">
                        <img
                            src="/icons/bar-mode/coffe_cup_for_bar_mode.svg"
                            alt="커피 아이콘"
                            className="w-4 h-4"
                        />
                        00:00:00(0)
                    </span>
                </div>

                {/* 오른쪽 */}
                <div
                    className="flex items-center gap-3"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-600 font-medium flex items-center gap-1">
                            <img
                                src="/icons/bar-mode/timer_for_bar_mode.svg"
                                alt="타이머 아이콘"
                                className="w-4 h-4"
                            />
                            8
                        </span>
                        <span className="text-slate-600 font-medium flex items-center gap-1">
                            <img
                                src="/icons/bar-mode/cell_phone_for_bar_mode.svg"
                                alt="완료 아이콘"
                                className="w-4 h-4"
                            />
                            10
                        </span>
                    </div>

                    <div className="w-px h-4 bg-slate-300"></div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSwitchToPanelMode}
                            className="h-7 w-7 hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                            title="패널 모드로 전환"
                        >
                            <BetweenHorizontalStart size={14} />
                        </Button>
                        {/* 항상 위에 고정 버튼 */}
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