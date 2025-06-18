// // C:\tauri\cti-task-manager-tauri\src\widgets\titlebar\ui\Titlebar.tsx
// 'use client';

// import { useState, useEffect } from "react";
// import { X, Minimize, Maximize, PanelTop, Pin } from "lucide-react";
// import AgentStatusPanel from "@/widgets/info-header/ui/AgentStatusPanel";
// import { TITLEBAR_CLASSES } from "@/config/windowConfig";
// import AgentStatusContentForBarMode from "@/widgets/info-header/ui/AgentStatusContentForBarMode";
// import { MenuDropdown } from "./MenuDropdown";

// interface TitlebarProps {
//     viewMode: 'bar' | 'panel';
//     onToggleMode: () => void;
//     status: '대기' | '통화' | '정지';
//     time: string;
//     taskCount: number;
//     completedTasks: number;
//     efficiency: number;
//     callsPerHour: number;
// }

// export default function Titlebar({
//     viewMode,
//     onToggleMode,
//     status,
//     time,
//     taskCount,
//     completedTasks,
//     efficiency,
//     callsPerHour,
// }: TitlebarProps) {
//     const [isMaximized, setIsMaximized] = useState(false);
//     const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

//     useEffect(() => {
//         const checkAlwaysOnTop = async () => {
//             const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window;
//             if (isTauriEnv) {
//                 try {
//                     const { getCurrentWindow } = await import('@tauri-apps/api/window');
//                     const appWindow = getCurrentWindow();
//                     const savedState = localStorage.getItem('alwaysOnTop');
//                     if (savedState === 'true') {
//                         await appWindow.setAlwaysOnTop(true);
//                         setIsAlwaysOnTop(true);
//                     }
//                 } catch (error) {
//                     console.error('Failed to check always on top:', error);
//                 }
//             }
//         };
//         checkAlwaysOnTop();
//     }, []);

//     const handleMinimize = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         await getCurrentWindow().minimize();
//     };

//     const handleToggleMaximize = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         await getCurrentWindow().toggleMaximize();
//         setIsMaximized(!isMaximized);
//     };

//     const handleToggleAlwaysOnTop = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         const newState = !isAlwaysOnTop;
//         await getCurrentWindow().setAlwaysOnTop(newState);
//         setIsAlwaysOnTop(newState);
//         localStorage.setItem('alwaysOnTop', newState.toString());
//     };

//     const handleClose = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         await getCurrentWindow().close();
//     };

//     if (viewMode === 'bar') {
//         // 바 모드일 때
//         return (
//             <div className="bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
//                 <div className={`flex items-center ${TITLEBAR_CLASSES.bar}`}>
//                     {/* P 버튼 - 왼쪽 */}
//                     <MenuDropdown />

//                     {/* 중앙 컨텐츠 영역 - 드래그 가능 영역 */}
//                     <div className="flex-1 flex items-center gap-2 px-2" data-tauri-drag-region>
//                         <AgentStatusContentForBarMode
//                             status={status}
//                             time={time}
//                             taskCount={taskCount}
//                             completedTasks={completedTasks}
//                             efficiency={efficiency}
//                             callsPerHour={callsPerHour}
//                         />
//                     </div>

//                     {/* 우측 버튼들 */}
//                     <div className="flex items-center gap-1 px-2">
//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleToggleAlwaysOnTop();
//                             }}
//                             onMouseDown={(e) => e.stopPropagation()}
//                             className={`p-1.5 rounded transition-colors ${isAlwaysOnTop ? 'bg-green-700 hover:bg-green-800' : 'hover:bg-green-600'
//                                 }`}
//                             title={isAlwaysOnTop ? '항상 위 고정 해제' : '항상 위 고정'}
//                         >
//                             <Pin size={14} className={isAlwaysOnTop ? 'rotate-45' : ''} />
//                         </button>

//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 onToggleMode();
//                             }}
//                             onMouseDown={(e) => e.stopPropagation()}
//                             className="p-1.5 hover:bg-green-600 rounded transition-colors"
//                             title={'패널 모드로 전환'}
//                         >
//                             <PanelTop size={14} />
//                         </button>

//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleMinimize();
//                             }}
//                             onMouseDown={(e) => e.stopPropagation()}
//                             className="p-1.5 hover:bg-green-600 rounded transition-colors"
//                         >
//                             <Minimize size={14} />
//                         </button>

//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleToggleMaximize();
//                             }}
//                             onMouseDown={(e) => e.stopPropagation()}
//                             className="p-1.5 hover:bg-green-600 rounded transition-colors"
//                         >
//                             <Maximize size={14} />
//                         </button>

//                         <button
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleClose();
//                             }}
//                             onMouseDown={(e) => e.stopPropagation()}
//                             className="p-1.5 hover:bg-red-600 rounded transition-colors"
//                         >
//                             <X size={14} />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // 패널 모드일 때
//     return (
//         <div className="bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
//             <div className={`flex items-center ${TITLEBAR_CLASSES.panel} px-3`} data-tauri-drag-region>
//                 {/* 좌측 로고/제목 */}
//                 <div className="flex items-center gap-2 flex-shrink-0" data-tauri-drag-region>
//                     <div className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
//                         <span className="text-green-700 font-bold text-xs">P</span>
//                     </div>
//                     <span className="text-sm font-semibold">CTI Task Master</span>
//                     <span className="text-xs text-green-200">v2.1</span>
//                 </div>

//                 {/* 중앙 영역 */}
//                 <div className="flex-1" data-tauri-drag-region />

//                 {/* 우측 버튼 */}
//                 <div className="flex items-center gap-1 flex-shrink-0">
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handleToggleAlwaysOnTop();
//                         }}
//                         onMouseDown={(e) => e.stopPropagation()}
//                         className={`p-1.5 rounded transition-colors ${isAlwaysOnTop ? 'bg-green-700 hover:bg-green-800' : 'hover:bg-green-600'
//                             }`}
//                         title={isAlwaysOnTop ? '항상 위 고정 해제' : '항상 위 고정'}
//                     >
//                         <Pin size={14} className={isAlwaysOnTop ? 'rotate-45' : ''} />
//                     </button>

//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             onToggleMode();
//                         }}
//                         onMouseDown={(e) => e.stopPropagation()}
//                         className="p-1.5 hover:bg-green-600 rounded transition-colors"
//                         title={'바 모드로 전환'}
//                     >
//                         <PanelTop size={14} className="rotate-180" />
//                     </button>

//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handleMinimize();
//                         }}
//                         onMouseDown={(e) => e.stopPropagation()}
//                         className="p-1.5 hover:bg-green-600 rounded transition-colors"
//                     >
//                         <Minimize size={14} />
//                     </button>

//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handleToggleMaximize();
//                         }}
//                         onMouseDown={(e) => e.stopPropagation()}
//                         className="p-1.5 hover:bg-green-600 rounded transition-colors"
//                     >
//                         <Maximize size={14} />
//                     </button>

//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation();
//                             handleClose();
//                         }}
//                         onMouseDown={(e) => e.stopPropagation()}
//                         className="p-1.5 hover:bg-red-600 rounded transition-colors"
//                     >
//                         <X size={14} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { X, Minimize, Maximize, PanelTop, Pin } from 'lucide-react';
// import { useUIStore } from '@/shared/store/useUIStore';
// import { useCTIStore } from '@/shared/store/useCTIStore';
// import AgentStatusContentForBarMode from '@/widgets/info-header/ui/AgentStatusContentForBarMode';
// import { TITLEBAR_CLASSES } from '@/config/windowConfig';
// import { MenuDropdown } from './MenuDropdown';

// export default function Titlebar() {
//     const { viewMode, toggleViewMode } = useUIStore();
//     const status = useCTIStore((s) => s.status);
//     const time = useCTIStore((s) => s.currentTime);
//     const totalTasks = useCTIStore((s) => s.totalTasks);
//     const completedTasks = useCTIStore((s) => s.completedTasks);
//     const efficiency = useCTIStore((s) => s.efficiency);
//     const callsPerHour = useCTIStore((s) => s.callsPerHour);

//     const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

//     // 시작 시 항상-on-top 복원
//     useEffect(() => {
//         if (!window.__TAURI__) return;
//         (async () => {
//             const { getCurrentWindow } = await import('@tauri-apps/api/window');
//             const win = getCurrentWindow();
//             if (localStorage.getItem('alwaysOnTop') === 'true') {
//                 await win.setAlwaysOnTop(true);
//                 setIsAlwaysOnTop(true);
//             }
//         })();
//     }, []);

//     const handleMinimize = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         await getCurrentWindow().minimize();
//     };
//     const handleToggleMaximize = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         await getCurrentWindow().toggleMaximize();
//     };
//     const handleToggleAlwaysOnTop = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         const next = !isAlwaysOnTop;
//         await getCurrentWindow().setAlwaysOnTop(next);
//         setIsAlwaysOnTop(next);
//         localStorage.setItem('alwaysOnTop', String(next));
//     };
//     const handleClose = async () => {
//         const { getCurrentWindow } = await import('@tauri-apps/api/window');
//         await getCurrentWindow().close();
//     };

//     if (viewMode === 'bar') {
//         return (
//             <div className="bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
//                 <div className={`flex items-center ${TITLEBAR_CLASSES.bar}`}>
//                     <MenuDropdown />

//                     <div className="flex-1 flex items-center gap-2 px-2" data-tauri-drag-region>
//                         <AgentStatusContentForBarMode
//                             status={status}
//                             time={time}
//                             taskCount={totalTasks}
//                             completedTasks={completedTasks}
//                             efficiency={efficiency}
//                             callsPerHour={callsPerHour}
//                         />
//                     </div>

//                     <div className="flex items-center gap-1 px-2">
//                         <button onClick={handleToggleAlwaysOnTop} title="항상 위 고정">
//                             <Pin size={14} className={isAlwaysOnTop ? 'rotate-45' : ''} />
//                         </button>
//                         <button onClick={toggleViewMode} title="패널 모드로 전환">
//                             <PanelTop size={14} />
//                         </button>
//                         <button onClick={handleMinimize} title="최소화">
//                             <Minimize size={14} />
//                         </button>
//                         <button onClick={handleToggleMaximize} title="최대화">
//                             <Maximize size={14} />
//                         </button>
//                         <button onClick={handleClose} title="닫기">
//                             <X size={14} />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // panel 모드
//     return (
//         <div className="bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
//             <div className={`flex items-center ${TITLEBAR_CLASSES.panel} px-3`} data-tauri-drag-region>
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                     <div className="w-5 h-5 bg-white/90 rounded flex items-center justify-center">
//                         <span className="text-green-700 font-bold text-xs">P</span>
//                     </div>
//                     <span className="text-sm font-semibold">CTI Task Master</span>
//                     <span className="text-xs text-green-200">v2.1</span>
//                 </div>
//                 <div className="flex-1" data-tauri-drag-region />

//                 <div className="flex items-center gap-1">
//                     <button onClick={handleToggleAlwaysOnTop} title="항상 위 고정">
//                         <Pin size={14} className={isAlwaysOnTop ? 'rotate-45' : ''} />
//                     </button>
//                     <button onClick={toggleViewMode} title="바 모드로 전환">
//                         <PanelTop size={14} className="rotate-180" />
//                     </button>
//                     <button onClick={handleMinimize} title="최소화">
//                         <Minimize size={14} />
//                     </button>
//                     <button onClick={handleToggleMaximize} title="최대화">
//                         <Maximize size={14} />
//                     </button>
//                     <button onClick={handleClose} title="닫기">
//                         <X size={14} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

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

