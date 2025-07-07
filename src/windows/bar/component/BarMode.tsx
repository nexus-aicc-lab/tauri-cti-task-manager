'use client';

import React, { useState, useEffect } from 'react';
import {
    Pin,
    PinOff,
    Minus,
    BetweenHorizontalStart,
    X,
    Menu,
} from 'lucide-react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { emit } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

const BarMode = () => {
    const [alwaysOnTop, setAlwaysOnTop] = useState(false);

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

    // 🆕 F10 키보드 단축키 추가
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F10') {
                e.preventDefault();
                handleShowTrayMenu();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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

    // 🆕 위치 기반 컨텍스트 메뉴 (햄버거 버튼 클릭)
    const handleShowContextMenu = async (event: React.MouseEvent) => {
        try {
            const rect = event.currentTarget.getBoundingClientRect();

            // 더 정교한 위치 계산
            // 버튼의 왼쪽 가장자리에서 시작하여 약간 오른쪽으로 이동
            const x = rect.left + 0; // 버튼 왼쪽에서 8px 오른쪽

            // 버튼 아래에 여백을 두고 메뉴 표시
            const y = rect.bottom + 13; // 버튼 아래 8px

            // 또는 다른 위치 옵션들:
            // const x = rect.left + rect.width / 2; // 버튼 중앙
            // const y = rect.top + rect.height + 5; // 버튼 바로 아래

            await invoke('show_context_menu_at_position', { x, y });
            console.log(`📋 위치 기반 컨텍스트 메뉴 열기: (${x}, ${y})`);
        } catch (error) {
            console.error('컨텍스트 메뉴 열기 실패:', error);
            // 실패시 기본 트레이 메뉴로 fallback
            handleShowTrayMenu();
        }
    };

    // 🆕 기본 트레이 메뉴 (F10 키 또는 fallback)
    const handleShowTrayMenu = async () => {
        try {
            await invoke('show_tray_context_menu');
            console.log('📋 트레이 컨텍스트 메뉴 열기');
        } catch (error) {
            console.error('트레이 메뉴 열기 실패:', error);
        }
    };

    return (
        <div
            className="w-full h-11 flex items-center bg-white text-sm font-sans text-gray-700 cursor-move"
            style={{ backgroundColor: '#F6FBFA' }}
            data-tauri-drag-region
        >
            <div className="w-full flex items-center justify-between px-4 py-2">
                {/* 왼쪽 - 햄버거 메뉴 + 로그온/로그오프 상태 */}
                <div
                    className="flex items-center gap-2"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    {/* 🆕 햄버거 메뉴 버튼 - 위치 기반 메뉴 */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShowContextMenu}
                        className="h-7 w-7 hover:bg-gray-100"
                        title="메뉴 (F10)"
                    >
                        <Menu size={14} />
                    </Button>

                    {/* 구분선 */}
                    <div className="w-px h-4 bg-gray-300"></div>

                    {/* 로그온 상태 */}
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 font-medium">LogOn</span>
                    <span className="text-xs text-gray-500 font-mono">08:02:40</span>
                </div>

                {/* 가운데 - 상태 배지들 */}
                <div className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap">
                        👤 대기중 00:38:08
                    </span>
                    <span className="bg-teal-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap">
                        📞 12:50:20(12)
                    </span>
                    <span className="bg-orange-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap">
                        ✏️ 00:34:20(8)
                    </span>
                    <span className="bg-blue-600 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap">
                        🕐 12:00:34(15)
                    </span>
                    <span className="bg-purple-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap">
                        ☕ 00:00:00(0)
                    </span>
                </div>

                {/* 오른쪽 - 통계 및 컨트롤 */}
                <div
                    className="flex items-center gap-2"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    <div className="flex items-center gap-1 text-xs">
                        <span className="bg-amber-100 text-amber-800 rounded-full px-2 py-1 flex items-center gap-1 font-mono">
                            🕒 8
                        </span>
                        <span className="bg-green-100 text-green-800 rounded-full px-2 py-1 flex items-center gap-1 font-mono">
                            ✅ 10
                        </span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleSwitchToPanelMode}
                            className="h-7 w-7 hover:bg-gray-100"
                            title="패널 모드로 전환"
                        >
                            <BetweenHorizontalStart size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleAlwaysOnTop}
                            className={cn(
                                'h-7 w-7 hover:bg-gray-100',
                                alwaysOnTop ? 'text-green-600' : 'text-gray-500'
                            )}
                            title={alwaysOnTop ? '항상 위에 해제' : '항상 위에 고정'}
                        >
                            {alwaysOnTop ? <Pin size={14} /> : <PinOff size={14} />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleMinimize}
                            className="h-7 w-7 hover:bg-gray-100"
                            title="최소화"
                        >
                            <Minus size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleClose}
                            className="h-7 w-7 hover:bg-red-100 hover:text-red-500"
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