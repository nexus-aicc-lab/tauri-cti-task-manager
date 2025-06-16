// src/components/Titlebar.jsx

import React, { useState, useEffect } from 'react';
import { Pin, PinOff, Minus, Maximize2, X, LayoutGrid, Minus as MinusIcon } from 'lucide-react';
import './Titlebar.css';

type TitlebarProps = {
    viewMode: string;
    onToggleMode: () => void;
};

function Titlebar({ viewMode, onToggleMode }: TitlebarProps) {
    const [isPinned, setIsPinned] = useState(true); // 기본값 true (config와 일치)
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        // Tauri 환경에서 초기 상태 확인
        const isTauriEnv = '__TAURI__' in window || '__TAURI_INTERNALS__' in window || navigator.userAgent.includes('tauri');

        if (isTauriEnv) {
            checkInitialState();
        }
    }, []);

    const checkInitialState = async () => {
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();

            // Always On Top 상태 확인
            const alwaysOnTop = await appWindow.isAlwaysOnTop();
            setIsPinned(alwaysOnTop);

            // 최대화 상태 확인
            const maximized = await appWindow.isMaximized();
            setIsMaximized(maximized);
        } catch (error) {
            console.error('초기 상태 확인 실패:', error);
        }
    };

    // 핀 기능 (Always On Top 토글)
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

    // 최소화
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

    // 최대화/복원
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

    // 닫기
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
            {/* 드래그 영역 */}
            <div data-tauri-drag-region className="titlebar-drag">
                {/* 왼쪽: 모드 토글 버튼 */}
                <div className="titlebar-left">
                    <button
                        onClick={onToggleMode}
                        className={`control-btn mode-toggle-btn ${viewMode}`}
                        title={viewMode === 'bar' ? '패널 모드로 변경' : '바 모드로 변경'}
                    >
                        {viewMode === 'bar' ? <LayoutGrid size={14} /> : <MinusIcon size={14} />}
                    </button>
                </div>

                {/* 중앙: 타이틀 */}
                <div className="titlebar-title">CTI Task Master</div>
            </div>

            {/* 창 컨트롤 버튼들 */}
            <div className="titlebar-controls">
                {/* 핀 버튼 - Lucide 아이콘 */}
                <button
                    onClick={togglePin}
                    className={`control-btn pin-btn ${isPinned ? 'pinned' : ''}`}
                    title={isPinned ? '항상 위에 표시 해제' : '항상 위에 표시'}
                >
                    {isPinned ? <Pin size={14} /> : <PinOff size={14} />}
                </button>

                {/* 최소화 버튼 - Lucide 아이콘 */}
                <button
                    onClick={handleMinimize}
                    className="control-btn minimize-btn"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>

                {/* 최대화/복원 버튼 - Lucide 아이콘 */}
                <button
                    onClick={handleToggleMaximize}
                    className="control-btn maximize-btn"
                    title={isMaximized ? '이전 크기로' : '최대화'}
                >
                    <Maximize2 size={14} />
                </button>

                {/* 닫기 버튼 - Lucide 아이콘 */}
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