'use client';

import React, { useState, useEffect } from 'react';
import {
    Pin,
    PinOff,
    Minus,
    BetweenHorizontalStart,
    X,
    LogOut,
} from 'lucide-react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { emit } from '@tauri-apps/api/event';
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
            className="h-screen flex items-center justify-between bg-[#F6FBFA] px-4 text-sm font-sans text-gray-700 select-none cursor-move"
            data-tauri-drag-region
        >
            {/* 왼쪽 - 로그오프 */}
            <div
                className="flex items-center gap-2"
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
                <LogOut size={14} />
                <span>LogOff</span>
                <span className="text-xs text-gray-400 font-mono">00:00:00</span>
            </div>

            {/* 가운데 - 배지들 */}
            <div className="flex items-center gap-4">
                <span className="bg-blue-500 text-white rounded-full px-3 py-1 flex items-center gap-2 font-mono text-xs">
                    <img src="/icons/panel-mode/hourglass.png" className="w-4 h-4" />
                    대기중 00:38:08
                </span>

                <span className="text-teal-600 font-mono text-xs flex items-center gap-1">
                    <img src="/icons/panel-mode/cell_phone.png" className="w-4 h-4" />
                    12:50:20 (12)
                </span>

                <span className="text-orange-500 font-mono text-xs flex items-center gap-1">
                    <img src="/icons/panel-mode/pencel.png" className="w-4 h-4" />
                    00:34:20 (8)
                </span>

                <span className="text-indigo-500 font-mono text-xs flex items-center gap-1">
                    <img src="/icons/panel-mode/coffe.png" className="w-4 h-4" />
                    00:00:00 (0)
                </span>
            </div>

            {/* 오른쪽 - 컨트롤 */}
            <div
                className="flex items-center gap-2"
                style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
                <Button variant="ghost" size="icon" onClick={handleSwitchToPanelMode}>
                    <BetweenHorizontalStart size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAlwaysOnTop}
                    className={cn(alwaysOnTop ? 'text-green-600' : 'text-muted-foreground')}
                >
                    {alwaysOnTop ? <Pin size={16} /> : <PinOff size={16} />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleMinimize}>
                    <Minus size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="hover:bg-red-100 hover:text-red-500"
                >
                    <X size={16} />
                </Button>
            </div>
        </div>
    );
};

export default BarMode;
