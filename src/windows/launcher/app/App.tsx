// // src/windows/launcher/app/App.tsx
// import React from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // ✅ FSD Pages 가져오기
// import MainPage from '../pages/MainPage';

// const App: React.FC = () => {
//     console.log('🚀 런처 윈도우 앱 시작 (FSD 구조)');

//     return (
//         <div
//             style={{
//                 backgroundColor: '#f3f4f6',
//                 minHeight: '100vh',
//                 width: '100%',
//                 overflow: 'hidden',
//             }}
//         >
//             {/* ✅ MainPage 컴포넌트 사용 */}
//             <MainPage />

//             {/* Toast UI */}
//             <ToastContainer
//                 position="top-center"
//                 autoClose={2000}
//                 closeOnClick
//                 pauseOnHover
//                 theme="light"
//             />
//         </div>
//     );
// };

// export default App;

// src/windows/launcher/app/App.tsx
import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ FSD Pages 가져오기
import MainPage from '../pages/MainPage';
import { useAutoUpdate } from '../../../hooks/useAutoUpdate';

const App: React.FC = () => {
    console.log('🚀 런처 윈도우 앱 시작 (FSD 구조)');

    const { updateInfo, checkForUpdates, isTauri, debugTauriAPIs } = useAutoUpdate();

    console.log("updateInfo:", updateInfo);
    console.log("isTauri:", isTauri);
    console.log("window.__TAURI__:", window.__TAURI__);

    // 디버깅을 위한 useEffect
    useEffect(() => {
        console.log('=== App 컴포넌트 마운트 ===');
        console.log('1. isTauri:', isTauri);
        console.log('2. window.__TAURI__:', window.__TAURI__);
        console.log('3. typeof window:', typeof window);
        console.log('4. window.__TAURI__ 타입:', typeof window.__TAURI__);

        // Tauri API 상세 디버깅
        if (debugTauriAPIs) {
            debugTauriAPIs();
        }

        // window 객체 전체 확인
        console.log('5. window 객체 키들:', Object.keys(window).filter(key => key.includes('TAURI') || key.includes('tauri')));
    }, [isTauri, debugTauriAPIs]);

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
            {/* 디버깅 정보 표시 (개발 환경에서만) */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '15px',
                    left: '15px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#00ff00',
                    padding: '10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    zIndex: 10000,
                    maxWidth: '300px',
                }}
            >
                <div>🔍 Debug Info:</div>
                <div>isTauri: {String(isTauri)}</div>
                <div>window.__TAURI__: {window.__TAURI__ ? 'Defined' : 'Undefined'}</div>
                <div>currentVersion: {updateInfo.currentVersion}</div>
                <div>Environment: {isTauri ? 'Tauri App' : 'Web Browser'}</div>
            </div>

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

            {/* 수동 업데이트 확인 버튼 (항상 표시 - 디버깅용) */}
            <button
                onClick={checkForUpdates}
                disabled={updateInfo.checking || updateInfo.downloading}
                style={{
                    position: 'fixed',
                    top: '15px',
                    left: '15px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    backgroundColor: isTauri ? (updateInfo.available ? '#28a745' : '#007ACC') : '#6c757d',
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
                title={isTauri ? (updateInfo.available ? '업데이트 사용 가능!' : '업데이트 확인') : '웹 환경에서는 업데이트 불가'}
            >
                {!isTauri ? (
                    <>
                        <span>🌐</span>
                        <span>웹 환경</span>
                    </>
                ) : updateInfo.checking ? (
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