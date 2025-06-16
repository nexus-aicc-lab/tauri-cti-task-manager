// src/components/Titlebar.jsx

import React, { useState, useEffect } from 'react';
import { Pin, PinOff, Minus, Maximize2, X, Grid3X3, Square } from 'lucide-react';
import './Titlebar.css';

interface TitlebarProps {
    viewMode: 'bar' | 'panel';
    onToggleMode: () => void;
    status?: string;
    time?: string;
    taskCount?: number;
}

function Titlebar({ viewMode, onToggleMode, status, time, taskCount }: TitlebarProps) {
    const [isPinned, setIsPinned] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);

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
                    // 1단 바 모드: 헤더에 데이터 직접 출력
                    <div className="titlebar-bar-content">
                        <div className="bar-data-item">
                            <span className="bar-icon">🕐</span>
                            <span className="bar-text">{time?.split(':').slice(0, 2).join(':') || '--:--'}</span>
                        </div>

                        <div className={`bar-data-item status-item ${getStatusClass(status)}`}>
                            <span className="bar-icon">
                                {status === '대기중' ? '⏸️' : status === '통화중' ? '📞' : status === '후처리' ? '⚙️' : '⏸️'}
                            </span>
                            <span className="bar-text">{status || '대기중'}</span>
                        </div>

                        <div className="bar-data-item">
                            <span className="bar-icon">✅</span>
                            <span className="bar-text">{taskCount || 0}</span>
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