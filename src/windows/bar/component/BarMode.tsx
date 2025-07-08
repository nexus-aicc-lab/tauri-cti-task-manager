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
            const { invoke } = await import('@tauri-apps/api/core');
            const newState = await invoke('toggle_always_on_top') as boolean;
            setAlwaysOnTop(newState);

            console.log(newState ? '📌 항상 위에 보이기 활성화' : '📌 항상 위에 보이기 비활성화');
        } catch (error) {
            console.error('❌ 핀 모드 변경 실패:', error);
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
                            src="/icons/bar-mode/calling_icon_for_bar_mode.svg"
                            alt="녹색 전화기 아이콘"
                            className="w-4 h-4"
                        />
                        12:50:20(12)
                    </span>

                    {/*  */}
                    <span className="text-slate-600 font-medium text-xs flex items-center gap-1">
                        <img
                            src="/icons/bar-mode/orange_pencil_for_bar_mode.svg"
                            alt="녹색 전화기 아이콘"
                            className="w-4 h-4"
                        />
                        12:50:20(12)
                    </span>

                    {/* 전화기 갈색 아이콘 */}
                    <span className="text-slate-600 font-medium text-xs flex items-center gap-1">
                        <img
                            src="/icons/bar-mode/hourglass_for_bar_mode.svg"
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


                    |

                    <span className="text-slate-600 font-medium text-xs flex items-center gap-1">
                        <img
                            src="/icons/bar-mode/brown_phone_for_bar_mode.svg"
                            alt="커피 아이콘"
                            className="w-4 h-4"
                        />
                        8
                    </span>

                    <span className="text-slate-600 font-medium text-xs flex items-center gap-1">
                        <img
                            src="/icons/bar-mode/call_stopping_green_for_bar_mode.svg"
                            alt="커피 아이콘"
                            className="w-4 h-4"
                        />
                        10
                    </span>

                </div>

                {/* 오른쪽 */}
                <div
                    className="flex items-center gap-2"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >

                    {/* 패널 모드 전환 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSwitchToPanelMode();
                        }}
                        className="text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90 hover:text-blue-600 p-1 rounded shadow-sm transition-colors"
                        title="패널 모드로 전환"
                    >
                        <BetweenHorizontalStart size={15} />
                    </button>

                    {/* 항상 위에 고정 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAlwaysOnTop();
                        }}
                        className={`p-1 rounded transition-colors shadow-sm ${alwaysOnTop
                            ? 'text-green-700 bg-white bg-opacity-90 hover:bg-opacity-100'
                            : 'text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90'
                            }`}
                        title={alwaysOnTop ? '항상 위에 보이기 해제' : '항상 위에 보이기'}
                    >
                        {alwaysOnTop ? <Pin size={15} /> : <PinOff size={15} />}
                    </button>

                    {/* 최소화 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMinimize();
                        }}
                        className="text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90 hover:text-gray-900 p-1 rounded shadow-sm transition-colors"
                        title="최소화"
                    >
                        <Minus size={15} />
                    </button>

                    {/* 닫기 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                        className="text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-90 hover:text-red-600 p-1 rounded shadow-sm transition-colors"
                        title="닫기"
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BarMode;