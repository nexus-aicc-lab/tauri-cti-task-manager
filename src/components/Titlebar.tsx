// src/components/Titlebar.tsx
import { useState, useEffect } from "react";
import { X, Minimize, Maximize, PanelTop, User, Clock, Pin } from "lucide-react";

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
    callsPerHour
}: TitlebarProps) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

    // 컴포넌트 마운트 시 현재 상태 확인
    useEffect(() => {
        const checkAlwaysOnTop = async () => {
            const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;
            if (isTauriEnv) {
                try {
                    const { getCurrentWindow } = await import('@tauri-apps/api/window');
                    const appWindow = getCurrentWindow();
                    // Tauri v2에서는 직접적인 상태 확인이 어려우므로, localStorage 사용
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
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;
        if (isTauriEnv) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                await getCurrentWindow().minimize();
            } catch (error) {
                console.error('Failed to minimize:', error);
            }
        }
    };

    const handleToggleMaximize = async () => {
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;
        if (isTauriEnv) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                await getCurrentWindow().toggleMaximize();
                setIsMaximized(!isMaximized);
            } catch (error) {
                console.error('Failed to toggle maximize:', error);
            }
        }
    };

    const handleToggleAlwaysOnTop = async () => {
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;
        if (isTauriEnv) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                const newState = !isAlwaysOnTop;
                await getCurrentWindow().setAlwaysOnTop(newState);
                setIsAlwaysOnTop(newState);
                // 상태 저장
                localStorage.setItem('alwaysOnTop', newState.toString());
            } catch (error) {
                console.error('Failed to toggle always on top:', error);
            }
        }
    };

    const handleClose = async () => {
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;
        if (isTauriEnv) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                await getCurrentWindow().close();
            } catch (error) {
                console.error('Failed to close:', error);
            }
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case '대기중': return 'bg-amber-500';
            case '통화중': return 'bg-green-500';
            case '정지중': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-slate-900 text-white select-none">
            {/* 드래그 가능한 영역과 클릭 가능한 영역을 분리 */}
            <div
                className="flex items-center h-9 px-3"
                // 전체 영역을 드래그 가능하게 하되, 버튼과 클릭 요소는 제외
                data-tauri-drag-region
            >
                {/* 좌측 로고/제목 영역 - 드래그 가능 */}
                <div className="flex items-center gap-2 flex-shrink-0" data-tauri-drag-region>
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm font-semibold">CTI Task Master</span>
                    <span className="text-xs text-gray-400">v2.1</span>
                </div>

                {/* 중앙 상태바 - 클릭 가능한 영역 */}
                <div className="flex-1 flex items-center justify-center gap-4 mx-4">
                    {viewMode === 'bar' && (
                        <>
                            {/* 상태 표시 - stopPropagation으로 드래그 방지 */}
                            <div
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 상태 클릭 시 동작
                                }}
                            >
                                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                                <span className="text-xs">{status}</span>
                            </div>

                            {/* 구분선 */}
                            <div className="w-px h-4 bg-gray-600"></div>

                            {/* 통계 정보들 - 각각 클릭 가능 */}
                            <div
                                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 작업 클릭 시 동작
                                }}
                            >
                                <User size={12} />
                                <span className="text-xs">작업: {taskCount}</span>
                            </div>

                            <div
                                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 완료 클릭 시 동작
                                }}
                            >
                                <span className="text-xs">완료: {completedTasks}</span>
                            </div>

                            <div
                                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 효율성 클릭 시 동작
                                }}
                            >
                                <span className="text-xs">효율: {efficiency}%</span>
                            </div>

                            <div
                                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 통화 클릭 시 동작
                                }}
                            >
                                <span className="text-xs">통화/시간: {callsPerHour}</span>
                            </div>

                            <div className="w-px h-4 bg-gray-600"></div>

                            {/* 시간 표시 */}
                            <div
                                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // 시간 클릭 시 동작
                                }}
                            >
                                <Clock size={12} />
                                <span className="text-xs font-mono">{time}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* 우측 컨트롤 버튼들 - 클릭만 가능 */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    {/* 항상 위 고정 토글 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAlwaysOnTop();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className={`p-1.5 rounded transition-colors ${isAlwaysOnTop
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'hover:bg-gray-700'
                            }`}
                        title={isAlwaysOnTop ? '항상 위 고정 해제' : '항상 위 고정'}
                    >
                        <Pin size={14} className={isAlwaysOnTop ? 'rotate-45' : ''} />
                    </button>

                    {/* 뷰 모드 토글 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleMode();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title={viewMode === 'bar' ? '패널 모드로 전환' : '바 모드로 전환'}
                    >
                        <PanelTop size={14} className={viewMode === 'panel' ? 'rotate-180' : ''} />
                    </button>

                    {/* 창 컨트롤 버튼들 */}
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