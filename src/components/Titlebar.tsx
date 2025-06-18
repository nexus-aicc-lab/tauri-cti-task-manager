// src/components/Titlebar.tsx

import { useState, useEffect, useRef } from 'react';
import { Pin, PinOff, Minus, Maximize2, X, TrendingUp, Clock, Users, AppWindow, SquareMinus } from 'lucide-react';

interface TitlebarProps {
    viewMode: 'bar' | 'panel';
    onToggleMode: () => void;
    status?: string;
    time?: string;
    taskCount?: number;
    completedTasks?: number;
    efficiency?: number;
    callsPerHour?: number;
}

function Titlebar({
    viewMode,
    onToggleMode,
    status,
    time,
    taskCount = 0,
    completedTasks = 0,
    efficiency = 85,
}: TitlebarProps) {
    const [isPinned, setIsPinned] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    const [animatedTaskCount, setAnimatedTaskCount] = useState(0);
    const [animatedCompletedTasks, setAnimatedCompletedTasks] = useState(0);
    const [pulseActive, setPulseActive] = useState(false);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // 숫자 카운트업 애니메이션
    useEffect(() => {
        const animateNumber = (target: number, setter: (value: number) => void, current: number) => {
            const duration = 1000; // 1초
            const steps = 30;
            const increment = (target - current) / steps;
            let step = 0;

            const timer = setInterval(() => {
                step++;
                const newValue = Math.round(current + (increment * step));
                setter(newValue);

                if (step >= steps) {
                    clearInterval(timer);
                    setter(target);
                }
            }, duration / steps);

            return timer;
        };

        const taskTimer = animateNumber(taskCount, setAnimatedTaskCount, animatedTaskCount);
        const completedTimer = animateNumber(completedTasks, setAnimatedCompletedTasks, animatedCompletedTasks);

        return () => {
            clearInterval(taskTimer);
            clearInterval(completedTimer);
        };
    }, [taskCount, completedTasks]);

    // 상태 변경시 펄스 효과
    useEffect(() => {
        if (status === '통화중' || status === '후처리') {
            setPulseActive(true);
            const timer = setTimeout(() => setPulseActive(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    // 진행률 바 애니메이션
    useEffect(() => {
        if (progressBarRef.current && viewMode === 'bar') {
            const progressWidth = Math.min(efficiency, 100);
            progressBarRef.current.style.width = `${progressWidth}%`;
        }
    }, [efficiency, viewMode]);

    useEffect(() => {
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window || navigator.userAgent.includes('tauri');

        if (isTauriEnv) {
            checkInitialState();
        }
    }, []);

    const checkInitialState = async () => {
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();

            const alwaysOnTop = await appWindow.isAlwaysOnTop();
            setIsPinned(alwaysOnTop);

            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);
        } catch (error) {
            console.error('초기 상태 확인 실패:', error);
        }
    };

    const getStatusClass = (status?: string) => {
        switch (status) {
            case '대기중':
                return 'bg-gradient-to-r from-blue-600/85 to-blue-700/85 border-blue-500/80 shadow-[0_2px_8px_rgba(59,130,246,0.3)]';
            case '통화중':
                return 'bg-gradient-to-r from-red-600/85 to-red-700/85 border-red-500/80 shadow-[0_2px_8px_rgba(239,68,68,0.3)]';
            case '후처리':
                return 'bg-gradient-to-r from-amber-600/85 to-orange-600/85 border-amber-500/80 shadow-[0_2px_8px_rgba(245,158,11,0.3)]';
            default:
                return 'bg-gradient-to-r from-blue-600/85 to-blue-700/85 border-blue-500/80';
        }
    };

    const getEfficiencyColor = (efficiency: number) => {
        if (efficiency >= 90) return '#10b981'; // green
        if (efficiency >= 70) return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case '대기중': return '⏸️';
            case '통화중': return '📞';
            case '후처리': return '⚙️';
            default: return '⏸️';
        }
    };

    const togglePin = async () => {
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window || navigator.userAgent.includes('tauri');

        if (!isTauriEnv) {
            setIsPinned(!isPinned);
            return;
        }

        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();
            const newState = !isPinned;

            await appWindow.setAlwaysOnTop(newState);
            setIsPinned(newState);
        } catch (error) {
            console.error('핀 기능 실패:', error);
        }
    };

    const handleMinimize = async () => {
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window || navigator.userAgent.includes('tauri');

        if (!isTauriEnv) return;

        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();
            await appWindow.minimize();
        } catch (error) {
            console.error('최소화 실패:', error);
        }
    };

    const handleToggleMaximize = async () => {
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window || navigator.userAgent.includes('tauri');

        if (!isTauriEnv) {
            setIsMaximized(!isMaximized);
            return;
        }

        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();
            await appWindow.toggleMaximize();
            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);
        } catch (error) {
            console.error('최대화 토글 실패:', error);
        }
    };

    const handleClose = async () => {
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window || navigator.userAgent.includes('tauri');

        if (isTauriEnv) {
            try {
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                const appWindow = getCurrentWindow();
                await appWindow.close();
            } catch (error) {
                console.error('닫기 실패:', error);
            }
        } else {
            window.close();
        }
    };

    return (
        <div className="h-9 bg-gray-800 flex items-center justify-between select-none backdrop-blur-2xl w-full relative shadow-lg py-1">
            {/* 왼쪽: 모드 토글 버튼 */}
            <div className="flex-none pl-2 z-[100]">
                <div className="flex bg-white/10 rounded-md p-0.5 backdrop-blur-lg">
                    <button
                        onClick={onToggleMode}
                        className="p-1.5 border-0 bg-white/10 text-white/90 rounded cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-white/30 hover:text-white hover:scale-105 active:scale-95"
                        title={viewMode === 'bar' ? '패널 모드' : '막대바'}
                    >
                        {viewMode === 'bar' ? <AppWindow size={14} /> : <SquareMinus size={14} />}
                    </button>
                </div>
            </div>

            {/* 중앙: 드래그 영역 및 타이틀/데이터 */}
            <div data-tauri-drag-region className="flex-1 h-full flex items-center justify-center cursor-move px-4">
                {viewMode === 'bar' ? (
                    // 바 모드: 핵심 정보만 간략하게
                    <div className="flex items-center justify-center gap-6 w-full max-w-full px-5">
                        {/* 연결 상태 */}
                        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-green-900/30 rounded-2xl backdrop-blur-xl text-white text-sm font-semibold border border-green-500/30 transition-all duration-200 shadow-[0_2px_8px_rgba(34,197,94,0.2)] min-w-[80px] justify-center hover:bg-green-900/40 hover:-translate-y-0.5 hover:shadow-lg">
                            <span className="text-green-400 animate-pulse">🟢</span>
                            <span className="text-xs font-semibold text-green-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">ONLINE</span>
                        </div>

                        {/* 현재 시간 */}
                        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/15 rounded-2xl backdrop-blur-xl text-white text-sm font-semibold border border-white/25 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[80px] justify-center hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-lg">
                            <Clock size={11} className="text-white/80" />
                            <span className="text-xs font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] font-mono">
                                {time?.split(':').slice(0, 2).join(':') || '--:--'}
                            </span>
                        </div>

                        {/* 상태 표시 */}
                        <div
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl backdrop-blur-xl text-white text-sm font-semibold border transition-all duration-200 cursor-pointer min-w-[100px] justify-center hover:-translate-y-0.5 hover:shadow-lg active:scale-95 ${getStatusClass(status)} ${pulseActive ? 'animate-pulse' : ''}`}
                            onClick={onToggleMode}
                        >
                            <span className="text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{getStatusIcon(status)}</span>
                            <span className="text-xs font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{status || '대기중'}</span>
                        </div>

                        {/* 효율성 + 진행률 */}
                        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/15 rounded-2xl backdrop-blur-xl text-white text-sm font-semibold border border-white/25 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[100px] justify-center hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-lg">
                            <TrendingUp size={11} className="text-white/80" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">{efficiency}%</span>
                                <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        ref={progressBarRef}
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            backgroundColor: getEfficiencyColor(efficiency)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 작업 현황 */}
                        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/15 rounded-2xl backdrop-blur-xl text-white text-sm font-semibold border border-white/25 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[80px] justify-center hover:bg-white/25 hover:-translate-y-0.5 hover:shadow-lg">
                            <Users size={11} className="text-white/80" />
                            <span className="text-xs font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                                {animatedCompletedTasks}<span className="text-white/50 mx-0.5">/</span>{animatedTaskCount + animatedCompletedTasks}
                            </span>
                        </div>
                    </div>
                ) : (
                    // 패널 모드: 브랜드 타이틀
                    <div className="flex items-center gap-2 text-white">
                        <span className="text-base font-semibold tracking-wide">CTI Task Master</span>
                        <span className="text-xs text-white/60 font-medium">v2.1</span>
                    </div>
                )}
            </div>

            {/* 오른쪽: 창 컨트롤 버튼들 */}
            <div className="flex items-center h-full">
                <button
                    onClick={togglePin}
                    className={`w-[46px] h-9 border-0 bg-transparent text-white cursor-pointer flex items-center justify-center transition-all duration-200 outline-none opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 ${isPinned ? 'bg-green-600/90 opacity-100 shadow-[0_2px_8px_rgba(34,197,94,0.3)] hover:bg-green-600 hover:shadow-[0_4px_12px_rgba(34,197,94,0.4)]' : 'hover:bg-white/20'
                        }`}
                    title={isPinned ? '항상 위에 표시 해제' : '항상 위에 표시'}
                >
                    {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
                </button>

                <button
                    onClick={handleMinimize}
                    className="w-[46px] h-9 border-0 bg-transparent text-white cursor-pointer flex items-center justify-center transition-all duration-200 outline-none opacity-80 hover:bg-white/20 hover:opacity-100 hover:scale-105 active:scale-95"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>

                <button
                    onClick={handleToggleMaximize}
                    className="w-[46px] h-9 border-0 bg-transparent text-white cursor-pointer flex items-center justify-center transition-all duration-200 outline-none opacity-80 hover:bg-white/20 hover:opacity-100 hover:scale-105 active:scale-95"
                    title={isMaximized ? '이전 크기로' : '최대화'}
                >
                    <Maximize2 size={14} />
                </button>

                <button
                    onClick={handleClose}
                    className="w-[46px] h-9 border-0 bg-transparent text-white cursor-pointer flex items-center justify-center transition-all duration-200 outline-none opacity-80 hover:bg-red-600 hover:opacity-100 hover:shadow-[0_2px_8px_rgba(239,68,68,0.3)] active:scale-95 active:bg-red-700"
                    title="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

export default Titlebar;