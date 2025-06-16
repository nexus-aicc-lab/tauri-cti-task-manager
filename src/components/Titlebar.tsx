// src/components/Titlebar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Pin, PinOff, Minus, Maximize2, X, Grid3X3, Square, TrendingUp, Activity } from 'lucide-react';
import './Titlebar.css';

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
    callsPerHour = 12
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
            case '대기중': return 'status-waiting';
            case '통화중': return 'status-calling';
            case '후처리': return 'status-processing';
            default: return 'status-waiting';
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
        <div className="custom-titlebar">
            {/* 왼쪽: 모드 토글 버튼 */}
            <div className="titlebar-left">
                <div className="mode-toggle">
                    <button
                        onClick={onToggleMode}
                        className="mode-toggle-btn"
                        title={viewMode === 'bar' ? '3단 모드로 전환' : '1단 바 모드로 전환'}
                    >
                        {viewMode === 'bar' ? <Grid3X3 size={14} /> : <Square size={14} />}
                    </button>
                </div>
            </div>

            {/* 중앙: 드래그 영역 및 타이틀/데이터 */}
            <div data-tauri-drag-region className="titlebar-drag">
                {viewMode === 'bar' ? (
                    // 1단 바 모드: 향상된 동적 데이터 표시
                    <div className="titlebar-bar-content enhanced">
                        {/* 시간 표시 */}
                        <div className="bar-data-item time-item">
                            <span className="bar-icon animated-icon">🕐</span>
                            <span className="bar-text time-text">
                                {time?.split(':').slice(0, 2).join(':') || '--:--'}
                            </span>
                        </div>

                        {/* 상태 표시 */}
                        <div className={`bar-data-item status-item ${getStatusClass(status)} ${pulseActive ? 'pulse' : ''}`}>
                            <span className="bar-icon status-icon">
                                {getStatusIcon(status)}
                            </span>
                            <span className="bar-text">{status || '대기중'}</span>
                        </div>

                        {/* 작업 진행률 */}
                        <div className="bar-data-item progress-item">
                            <span className="bar-icon">📊</span>
                            <div className="progress-container">
                                <div className="progress-bar-bg">
                                    <div
                                        ref={progressBarRef}
                                        className="progress-bar-fill"
                                        style={{ backgroundColor: getEfficiencyColor(efficiency) }}
                                    />
                                </div>
                                <span className="bar-text progress-text">{efficiency}%</span>
                            </div>
                        </div>

                        {/* 완료된 작업 */}
                        <div className="bar-data-item completed-item">
                            <span className="bar-icon">✅</span>
                            <span className="bar-text animated-number">
                                {animatedCompletedTasks}
                                <span className="total-tasks">/{animatedTaskCount}</span>
                            </span>
                        </div>

                        {/* 시간당 통화 */}
                        <div className="bar-data-item rate-item">
                            <Activity size={12} className="bar-icon-svg" />
                            <span className="bar-text rate-text">
                                {callsPerHour}
                                <span className="rate-unit">/h</span>
                            </span>
                        </div>

                        {/* 트렌드 인디케이터 */}
                        <div className="bar-data-item trend-item">
                            <TrendingUp
                                size={12}
                                className={`bar-icon-svg trend-icon ${efficiency > 80 ? 'trend-up' : 'trend-down'}`}
                            />
                        </div>
                    </div>
                ) : (
                    // 3단 패널 모드: 기본 타이틀
                    <div className="titlebar-title">CTI Task Master</div>
                )}
            </div>

            {/* 오른쪽: 창 컨트롤 버튼들 */}
            <div className="titlebar-controls">
                <button
                    onClick={togglePin}
                    className={`control-btn pin-btn ${isPinned ? 'pinned' : ''}`}
                    title={isPinned ? '항상 위에 표시 해제' : '항상 위에 표시'}
                >
                    {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
                </button>

                <button
                    onClick={handleMinimize}
                    className="control-btn minimize-btn"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>

                <button
                    onClick={handleToggleMaximize}
                    className="control-btn maximize-btn"
                    title={isMaximized ? '이전 크기로' : '최대화'}
                >
                    <Maximize2 size={14} />
                </button>

                <button
                    onClick={handleClose}
                    className="control-btn close-btn"
                    title="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

export default Titlebar;