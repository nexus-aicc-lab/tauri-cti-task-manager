// C:\tauri\cti-task-pilot\src\windows\counselor_dashboard\app\App.tsx

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AgentDashBoardConatainer from '../pages/AgentDashBoardConatainer';
import { useStoreForLoginInfo } from '../store/useStoreForLoginInfo';
import { useAutoUpdate } from '../../../hooks/useAutoUpdate';

const App: React.FC = () => {
    const { updateInfo, checkForUpdates, isTauri } = useAutoUpdate();

    console.log('🚀 상담사 대시보드 앱 시작');

    return (
        <div
            style={{
                backgroundColor: '#f3f4f6',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* 업데이트 상태 표시 (Tauri 환경에서만) */}
            {isTauri && (updateInfo.checking || updateInfo.downloading || updateInfo.available || updateInfo.error) && (
                <div
                    style={{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 9999,
                        minWidth: '250px',
                        fontSize: '14px',
                        border: '1px solid #e0e0e0',
                    }}
                >
                    {updateInfo.checking && (
                        <div style={{ color: '#007ACC' }}>🔍 업데이트 확인 중...</div>
                    )}

                    {updateInfo.downloading && (
                        <div style={{ color: '#28a745' }}>⬇️ 업데이트 다운로드 중...</div>
                    )}

                    {updateInfo.available && !updateInfo.downloading && (
                        <div style={{ color: '#28a745' }}>
                            🆕 새 버전 {updateInfo.latestVersion} 사용 가능!
                        </div>
                    )}

                    {updateInfo.error && (
                        <div style={{ color: '#dc3545' }}>❌ {updateInfo.error}</div>
                    )}
                </div>
            )}

            {/* 수동 업데이트 확인 버튼 (Tauri 환경에서만) */}
            {isTauri && (
                <button
                    onClick={checkForUpdates}
                    disabled={updateInfo.checking || updateInfo.downloading}
                    style={{
                        position: 'fixed',
                        top: '10px',
                        left: '10px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        backgroundColor: '#007ACC',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: updateInfo.checking || updateInfo.downloading ? 'not-allowed' : 'pointer',
                        opacity: updateInfo.checking || updateInfo.downloading ? 0.6 : 1,
                        zIndex: 9999,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                    title="업데이트 확인"
                >
                    {updateInfo.checking ? '확인중...' : '🔄 업데이트'}
                </button>
            )}

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