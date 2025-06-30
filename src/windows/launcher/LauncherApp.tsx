
// src/windows/launcher/LauncherApp.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Launcher } from '../../app/launcher';
import { requestModeSwitch } from '../../shared/utils/windowManager';
import type { WindowMode } from '../../shared/types/window';

const LauncherApp: React.FC = () => {
    console.log('🚀 런처 윈도우 앱 시작');

    const handleModeChange = async (mode: WindowMode) => {
        await requestModeSwitch(mode);
    };

    return (
        <div
            style={{
                backgroundColor: '#f3f4f6',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            <Launcher onModeChange={handleModeChange} />

            {/* Toast UI */}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                closeOnClick
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default LauncherApp;