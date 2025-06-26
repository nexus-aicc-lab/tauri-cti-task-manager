

// @/widgets/titlebar/ui/Titlebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Minimize, Maximize, PanelTop, Pin } from 'lucide-react';
import { useUIStore } from '@/shared/store/useUIStore';
import { useCTIStore } from '@/shared/store/useCTIStore';
import AgentStatusContentForBarMode from '@/widgets/info-header/ui/AgentStatusContentForBarMode';
import { TITLEBAR_CLASSES } from '@/config/windowConfig';
import { MainSystemMenu } from './MainSystemMenu';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { saveViewMode, loadViewMode } from '../../../shared/lib/fs/viewModeStorage';
import { emit } from '@tauri-apps/api/event';


export default function Titlebar() {
    const { viewMode: _viewMode, setViewMode } = useUIStore();
    const status = useCTIStore(s => s.status);
    const time = useCTIStore(s => s.currentTime);
    const totalTasks = useCTIStore(s => s.totalTasks);
    const completed = useCTIStore(s => s.completedTasks);
    const efficiency = useCTIStore(s => s.efficiency);
    const callsPerHour = useCTIStore(s => s.callsPerHour);

    const [alwaysOnTop, setAlwaysOnTop] = useState(false);
    const [currentMode, setCurrentMode] = useState<'bar' | 'panel'>('bar'); // ← 로컬 상태 추가

    // 컴포넌트 마운트 시 현재 모드 감지
    useEffect(() => {
        const detectMode = async () => {
            // URL hash로 모드 감지
            const hash = window.location.hash;
            let detectedMode: 'bar' | 'panel' = 'bar';

            if (hash.includes('/bar')) {
                detectedMode = 'bar';
            } else if (hash.includes('/panel')) {
                detectedMode = 'panel';
            } else {
                // 파일에서 로드
                const savedMode = await loadViewMode();
                detectedMode = savedMode || 'bar';
            }

            setCurrentMode(detectedMode);
            setViewMode(detectedMode);

            console.log(`🔍 현재 모드 감지: ${detectedMode}`);
        };

        detectMode();
    }, [setViewMode]);

    const handleToggleViewMode = async () => {
        const newMode = currentMode === 'bar' ? 'panel' : 'bar';

        try {
            await saveViewMode(newMode);
            await emit('switch-view-mode', newMode);
            console.log(`✅ 윈도우 전환 요청: ${currentMode} → ${newMode}`);
        } catch (error) {
            console.error('❌ 윈도우 전환 실패:', error);
        }
    };

    // 런처로 돌아가기
    const handleBackToLauncher = async () => {
        try {
            await emit('back-to-launcher', currentMode);
            console.log('🏠 런처로 돌아가기 요청');
        } catch (error) {
            console.error('❌ 런처 복귀 실패:', error);
        }
    };

    // 나머지 함수들...
    useEffect(() => {
        if (!(window as any).__TAURI__) return;
        (async () => {
            const win = getCurrentWebviewWindow();
            if (localStorage.getItem('alwaysOnTop') === 'true') {
                await win.setAlwaysOnTop(true);
                setAlwaysOnTop(true);
            }
        })();
    }, []);

    const handleMinimize = async () => {
        await getCurrentWebviewWindow().minimize();
    };
    const handleToggleMax = async () => {
        await getCurrentWebviewWindow().toggleMaximize();
    };
    const handleAlwaysOnTop = async () => {
        const win = getCurrentWebviewWindow();
        const next = !alwaysOnTop;
        await win.setAlwaysOnTop(next);
        setAlwaysOnTop(next);
        localStorage.setItem('alwaysOnTop', String(next));
    };
    const handleClose = async () => {
        await getCurrentWebviewWindow().close();
    };

    // === BAR MODE ===
    if (currentMode === 'bar') { // ← viewMode 대신 currentMode 사용
        return (
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white select-none">
                <div className={`flex items-center ${TITLEBAR_CLASSES.bar}`}>
                    <MainSystemMenu />

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
                        <button onClick={handleBackToLauncher} title="런처로 돌아가기">
                            🏠
                        </button>
                        <button onClick={handleAlwaysOnTop} title="항상 위 고정">
                            <Pin size={14} className={alwaysOnTop ? 'rotate-45' : ''} />
                        </button>
                        <button onClick={handleToggleViewMode} title="패널 모드">
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
                    <button onClick={handleBackToLauncher} title="런처로 돌아가기">
                        🏠
                    </button>
                    <button onClick={handleAlwaysOnTop} title="항상 위 고정">
                        <Pin size={14} className={alwaysOnTop ? 'rotate-45' : ''} />
                    </button>
                    <button onClick={handleToggleViewMode} title="바 모드">
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