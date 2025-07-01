// src/windows/launcher/app/App.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ FSD Pages 가져오기
import MainPage from '../pages/MainPage';

const App: React.FC = () => {
    console.log('🚀 런처 윈도우 앱 시작 (FSD 구조)');

    return (
        <div
            style={{
                backgroundColor: '#f3f4f6',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* ✅ MainPage 컴포넌트 사용 */}
            <MainPage />

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

export default App;