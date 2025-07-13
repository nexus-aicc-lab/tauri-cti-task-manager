// C:\tauri\cti-task-pilot\src\windows\counselor_dashboard\app\App.tsx

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AgentDashBoardConatainer from '../pages/AgentDashBoardConatainer';
import { useStoreForLoginInfo } from '../store/useStoreForLoginInfo';

const App: React.FC = () => {

    console.log('🚀 상담사 대시보드 앱 시작');

    return (
        <div
            style={{
                backgroundColor: '#f3f4f6',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            <AgentDashBoardConatainer />

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

export default App;