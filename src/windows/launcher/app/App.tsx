// src/windows/launcher/app/App.tsx
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ FSD Pages 가져오기
import MainPage from '../pages/MainPage';
import { useAutoUpdate } from '../../../hooks/useAutoUpdate';

const App: React.FC = () => {
    console.log('🚀 런처 윈도우 앱 시작 (FSD 구조)');

    const { updateInfo, checkForUpdates, isTauri } = useAutoUpdate();

    console.log("updateInfo:", updateInfo);


    return (
        <div
            style={{
                backgroundColor: '#f3f4f6',
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* 업데이트 상태 표시 (Tauri 환경에서만) */}
            {isTauri && (updateInfo.checking || updateInfo.downloading || updateInfo.available || updateInfo.error) && (
                <div
                    style={{
                        position: 'fixed',
                        top: '15px',
                        right: '15px',
                        background: '#ffffff',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        zIndex: 9999,
                        minWidth: '280px',
                        fontSize: '14px',
                        border: '1px solid #e0e0e0',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    {updateInfo.checking && (
                        <div style={{ color: '#007ACC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🔍</span>
                            <span>업데이트 확인 중...</span>
                        </div>
                    )}

                    {updateInfo.downloading && (
                        <div style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>⬇️</span>
                            <span>업데이트 다운로드 중...</span>
                        </div>
                    )}

                    {updateInfo.available && !updateInfo.downloading && (
                        <div style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🆕</span>
                            <span>새 버전 {updateInfo.latestVersion} 사용 가능!</span>
                        </div>
                    )}

                    {updateInfo.error && (
                        <div style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>❌</span>
                            <span>{updateInfo.error}</span>
                        </div>
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
                        top: '15px',
                        left: '15px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        backgroundColor: updateInfo.available ? '#28a745' : '#007ACC',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: updateInfo.checking || updateInfo.downloading ? 'not-allowed' : 'pointer',
                        opacity: updateInfo.checking || updateInfo.downloading ? 0.6 : 1,
                        zIndex: 9999,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                    title={updateInfo.available ? '업데이트 사용 가능!' : '업데이트 확인'}
                >
                    {updateInfo.checking ? (
                        <>
                            <span>⏳</span>
                            <span>확인중...</span>
                        </>
                    ) : updateInfo.available ? (
                        <>
                            <span>🔄</span>
                            <span>업데이트</span>
                        </>
                    ) : (
                        <>
                            <span>🔄</span>
                            <span>업데이트 확인</span>
                        </>
                    )}
                </button>
            )}

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