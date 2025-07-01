// ✅ CustomTitlebar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Pin, PinOff, Minus, Maximize2, Minimize2, X } from 'lucide-react';

interface Props {
    title: string;
}

export default function CustomTitlebar({ title }: Props) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const togglePin = async () => {
        const { invoke } = await import('@tauri-apps/api/core');
        const newPinState = await invoke('toggle_always_on_top') as boolean;
        setIsPinned(newPinState);
    };

    const minimize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        (await getCurrentWindow()).minimize();
    };

    const toggleMaximize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const win = await getCurrentWindow();
        const isMax = await win.isMaximized();
        if (isMax) await win.unmaximize();
        else await win.maximize();
        setIsMaximized(!isMax);
    };

    const close = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        (await getCurrentWindow()).close();
    };

    useEffect(() => {
        (async () => {
            const { invoke } = await import('@tauri-apps/api/core');
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const pinState = await invoke('get_always_on_top_state') as boolean;
            setIsPinned(pinState);
            const win = getCurrentWindow();
            setIsMaximized(await win.isMaximized());
        })();
    }, []);

    return (
        <div className="h-10 px-4 bg-[#55BDC7] flex items-center justify-between text-white border-b border-[#55AAB7] select-none" data-tauri-drag-region>
            <div className="text-sm font-semibold pointer-events-none">{title}</div>
            <div className="flex items-center gap-1" style={{ webkitAppRegion: 'no-drag' }}>
                <button onClick={togglePin}>{isPinned ? <Pin size={14} /> : <PinOff size={14} />}</button>
                <button onClick={minimize}><Minus size={14} /></button>
                <button onClick={toggleMaximize}>{isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
                <button onClick={close} className="text-white hover:text-red-500"><X size={14} /></button>
            </div>
        </div>
    );
}