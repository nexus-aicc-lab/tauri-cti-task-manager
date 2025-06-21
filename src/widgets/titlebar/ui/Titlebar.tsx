
'use client';

import { useState, useEffect } from 'react';
import { X, Minimize, Maximize, PanelTop, Pin } from 'lucide-react';
import { useUIStore } from '@/shared/store/useUIStore';
import { useCTIStore } from '@/shared/store/useCTIStore';
import AgentStatusContentForBarMode from '@/widgets/info-header/ui/AgentStatusContentForBarMode';
import { TITLEBAR_CLASSES } from '@/config/windowConfig';
import { MenuDropdown } from './MenuDropdown';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export default function Titlebar() {
    const { viewMode, toggleViewMode } = useUIStore();
    const status = useCTIStore(s => s.status);
    const time = useCTIStore(s => s.currentTime);
    const totalTasks = useCTIStore(s => s.totalTasks);
    const completed = useCTIStore(s => s.completedTasks);
    const efficiency = useCTIStore(s => s.efficiency);
    const callsPerHour = useCTIStore(s => s.callsPerHour);

    const [alwaysOnTop, setAlwaysOnTop] = useState(false);

    // 시작 시 “항상 위” 상태 복원
    useEffect(() => {
        if (!window.__TAURI__) return;
        (async () => {
            const win = getCurrentWindow();
            if (localStorage.getItem('alwaysOnTop') === 'true') {
                await win.setAlwaysOnTop(true);
                setAlwaysOnTop(true);
            }
        })();
    }, []);

    const handleMinimize = async () => {
        await getCurrentWindow().minimize();
    };
    const handleToggleMax = async () => {
        await getCurrentWindow().toggleMaximize();
    };
    const handleAlwaysOnTop = async () => {
        const win = getCurrentWindow();
        const next = !alwaysOnTop;
        await win.setAlwaysOnTop(next);
        setAlwaysOnTop(next);
        localStorage.setItem('alwaysOnTop', String(next));
    };
    const handleClose = async () => {
        await getCurrentWindow().close();
    };

    // 설정창을 메인 바로 아래에 띄우기
    const handleOpenSettings = async () => {
        const main = getCurrentWindow();
        const pos = await main.outerPosition();
        // 타이틀바 높이에 맞춰 Y 오프셋
        const TITLEBAR_HEIGHT = 32;

        new WebviewWindow('settings', {
            url: 'index.html#/settings',
            x: pos.x,
            y: pos.y + TITLEBAR_HEIGHT,
            width: 400,
            height: 300,
            resizable: false,
            decorations: true,
            skipTaskbar: true,
        });
    };

    // === BAR MODE ===
    if (viewMode === 'bar') {
        return (
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
                <div className={`flex items-center ${TITLEBAR_CLASSES.bar}`}>
                    <MenuDropdown />

                    <div className="flex-1 flex items-center gap-2 px-2" data-tauri-drag-region>
                        <AgentStatusContentForBarMode
                            status={status}
                            time={time}
                            taskCount={totalTasks}
                            completedTasks={completed}
                            efficiency={efficiency}
                            callsPerHour={callsPerHour}
                        />
                    </div>

                    <div className="flex items-center gap-1 px-2">
                        <button onClick={handleAlwaysOnTop} title="항상 위 고정">
                            <Pin size={14} className={alwaysOnTop ? 'rotate-45' : ''} />
                        </button>
                        <button onClick={toggleViewMode} title="패널 모드">
                            <PanelTop size={14} />
                        </button>
                        <button onClick={handleMinimize} title="최소화">
                            <Minimize size={14} />
                        </button>
                        <button onClick={handleToggleMax} title="최대화">
                            <Maximize size={14} />
                        </button>
                        <button onClick={handleClose} title="닫기">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // === PANEL MODE ===
    return (
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
            <div className={`flex items-center ${TITLEBAR_CLASSES.panel} px-3`} data-tauri-drag-region>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
                        <span className="text-green-700 font-bold text-xs">P</span>
                    </div>
                    <span className="text-sm font-semibold">CTI Task Master</span>
                    <span className="text-xs text-green-200">v2.1</span>
                </div>
                <div className="flex-1" data-tauri-drag-region />
                <div className="flex items-center gap-1">
                    <button onClick={handleAlwaysOnTop} title="항상 위 고정">
                        <Pin size={14} className={alwaysOnTop ? 'rotate-45' : ''} />
                    </button>
                    <button onClick={toggleViewMode} title="바 모드">
                        <PanelTop size={14} className="rotate-180" />
                    </button>

                    <button onClick={handleMinimize} title="최소화">
                        <Minimize size={14} />
                    </button>
                    <button onClick={handleToggleMax} title="최대화">
                        <Maximize size={14} />
                    </button>
                    <button onClick={handleClose} title="닫기">
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

