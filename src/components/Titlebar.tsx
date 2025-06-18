// src/components/Titlebar.tsx
'use client';

import { useState, useEffect } from "react";
import { X, Minimize, Maximize, PanelTop, Pin } from "lucide-react";
import AgentStatusContentForBarMode from "@/widgets/info-header/ui/AgentStatusContentForBarModeProps";
import { TITLEBAR_CLASSES } from "@/config/windowConfig";

interface TitlebarProps {
    viewMode: 'bar' | 'panel';
    onToggleMode: () => void;
    status: '대기중' | '통화중' | '정지중';
    time: string;
    taskCount: number;
    completedTasks: number;
    efficiency: number;
    callsPerHour: number;
}

export default function Titlebar({
    viewMode,
    onToggleMode,
    status,
    time,
    taskCount,
    completedTasks,
    efficiency,
    callsPerHour,
}: TitlebarProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

    useEffect(() => {
        const checkAlwaysOnTop = async () => {
            const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;
            if (isTauriEnv) {
                try {
                    const { getCurrentWindow } = await import('@tauri-apps/api/window');
                    const appWindow = getCurrentWindow();
                    const savedState = localStorage.getItem('alwaysOnTop');
                    if (savedState === 'true') {
                        await appWindow.setAlwaysOnTop(true);
                        setIsAlwaysOnTop(true);
                    }
                } catch (error) {
                    console.error('Failed to check always on top:', error);
                }
            }
        };
        checkAlwaysOnTop();
    }, []);

    const handleMinimize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().minimize();
    };

    const handleToggleMaximize = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().toggleMaximize();
        setIsMaximized(!isMaximized);
    };

    const handleToggleAlwaysOnTop = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const newState = !isAlwaysOnTop;
        await getCurrentWindow().setAlwaysOnTop(newState);
        setIsAlwaysOnTop(newState);
        localStorage.setItem('alwaysOnTop', newState.toString());
    };

    const handleClose = async () => {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().close();
    };

    if (viewMode === 'bar') {
        // 바 모드일 때
        return (
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
                <div className={`flex items-center ${TITLEBAR_CLASSES.bar}`}>
                    {/* P 버튼 - 왼쪽 */}
                    <button
                        className="h-full px-3 bg-green-700 hover:bg-green-800 transition-colors font-bold text-sm border-r border-green-600"
                        title="메뉴"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        P
                    </button>

                    {/* 중앙 컨텐츠 영역 - 드래그 가능 영역 */}
                    <div className="flex-1 flex items-center gap-2 px-2" data-tauri-drag-region>
                        <AgentStatusContentForBarMode
                            status={status}
                            time={time}
                            taskCount={taskCount}
                            completedTasks={completedTasks}
                            efficiency={efficiency}
                            callsPerHour={callsPerHour}
                        />
                    </div>

                    {/* 우측 버튼들 */}
                    <div className="flex items-center gap-1 px-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleAlwaysOnTop();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className={`p-1.5 rounded transition-colors ${isAlwaysOnTop ? 'bg-green-700 hover:bg-green-800' : 'hover:bg-green-600'
                                }`}
                            title={isAlwaysOnTop ? '항상 위 고정 해제' : '항상 위 고정'}
                        >
                            <Pin size={14} className={isAlwaysOnTop ? 'rotate-45' : ''} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleMode();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="p-1.5 hover:bg-green-600 rounded transition-colors"
                            title={'패널 모드로 전환'}
                        >
                            <PanelTop size={14} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMinimize();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="p-1.5 hover:bg-green-600 rounded transition-colors"
                        >
                            <Minimize size={14} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleMaximize();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="p-1.5 hover:bg-green-600 rounded transition-colors"
                        >
                            <Maximize size={14} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClose();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="p-1.5 hover:bg-red-600 rounded transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 패널 모드일 때
    return (
        <div className="bg-slate-900 text-white select-none">
            <div className={`flex items-center ${TITLEBAR_CLASSES.panel} px-3`} data-tauri-drag-region>
                {/* 좌측 로고/제목 */}
                <div className="flex items-center gap-2 flex-shrink-0" data-tauri-drag-region>
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <span className="text-sm font-semibold">CTI Task Master</span>
                    <span className="text-xs text-gray-400">v2.1</span>
                </div>

                {/* 중앙 영역 */}
                <div className="flex-1" data-tauri-drag-region />

                {/* 우측 버튼 */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAlwaysOnTop();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className={`p-1.5 rounded transition-colors ${isAlwaysOnTop ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-700'
                            }`}
                        title={isAlwaysOnTop ? '항상 위 고정 해제' : '항상 위 고정'}
                    >
                        <Pin size={14} className={isAlwaysOnTop ? 'rotate-45' : ''} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleMode();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title={'바 모드로 전환'}
                    >
                        <PanelTop size={14} className="rotate-180" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMinimize();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    >
                        <Minimize size={14} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleMaximize();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                    >
                        <Maximize size={14} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-red-600 rounded transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}