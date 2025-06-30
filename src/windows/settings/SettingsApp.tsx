// src/windows/settings/SettingsApp.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SystemSettingWindow from '../../app/system-setting-window';
import type { WindowMode } from '../../shared/types/window';

const SettingsApp: React.FC = () => {
    console.log('⚙️ 설정 윈도우 앱 시작');

    return (
        <div
            style={{
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            <SystemSettingWindow />

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

export default SettingsApp;