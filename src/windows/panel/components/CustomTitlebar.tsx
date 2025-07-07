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
            className="w-full h-11 flex items-center bg-white text-sm font-sans text-gray-700 cursor-move"
            style={{ backgroundColor: '#F6FBFA' }}
            data-tauri-drag-region // 🎯 드래그 가능한 영역 설정
        >
            <div className="w-full flex items-center justify-between px-4 py-2">
                {/* 왼쪽 - 햄버거 메뉴 */}
                <div
                    className="flex items-center gap-2"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} // 🎯 드래그 방지 설정
                >
                    <button
                        className="h-7 w-7 hover:bg-gray-100"
                        title="메뉴"
                    >
                        <Menu size={14} />
                    </button>
                </div>

                {/* 가운데 - 상태 배지들 */}
                <div className="flex items-center gap-2 flex-1 justify-center pointer-events-none">
                    <span className="bg-blue-500 text-white rounded-full px-3 py-1 flex items-center gap-1 font-mono text-xs whitespace-nowrap">
                        👤 대기중 00:38:08
                    </span>
                </div>

                {/* 오른쪽 - 컨트롤 버튼들 */}
                <div
                    className="flex items-center gap-2"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} // 🎯 드래그 방지 설정
                >
                    <button
                        onClick={handleSwitchToPanelMode}
                        className="h-7 w-7 hover:bg-gray-100"
                        title="패널 모드로 전환"
                    >
                        <BetweenHorizontalStart size={14} />
                    </button>
                    <button
                        onClick={handleAlwaysOnTop}
                        className={`h-7 w-7 hover:bg-gray-100 ${alwaysOnTop ? 'text-green-600' : 'text-gray-500'
                            }`}
                        title={alwaysOnTop ? '항상 위에 해제' : '항상 위에 고정'}
                    >
                        {alwaysOnTop ? <Pin size={14} /> : <PinOff size={14} />}
                    </button>
                    <button
                        onClick={handleMinimize}
                        className="h-7 w-7 hover:bg-gray-100"
                        title="최소화"
                    >
                        <Minus size={14} />
                    </button>
                    <button
                        onClick={handleClose}
                        className="h-7 w-7 hover:bg-red-100 hover:text-red-500"
                        title="닫기"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BarMode;