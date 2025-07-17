// src/windows/launcher/app/App.tsx
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getVersion } from '@tauri-apps/api/app';

// ✅ FSD Pages 가져오기
import MainPage from '../pages/MainPage';

const App: React.FC = () => {
    const [appVersion, setAppVersion] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [showVersion, setShowVersion] = useState(false);

    console.log('🚀 런처 윈도우 앱 시작 (FSD 구조) !');

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                // Tauri API를 사용하여 앱 버전 가져오기
                const version = await getVersion();
                setAppVersion(version);
                console.log('📱 현재 앱 버전:', version);
            } catch (error) {
                console.error('❌ 버전 정보 가져오기 실패:', error);
                // Fallback으로 package.json 버전 사용
                setAppVersion('2.0.6');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVersion();
    }, []);

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
            {/* 버전 정보 표시 버튼 (우측 하단) */}
            <button
                onClick={() => setShowVersion(!showVersion)}
                style={{
                    position: 'fixed',
                    bottom: '15px',
                    right: '15px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#00ff00',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                    opacity: showVersion ? 1 : 0.6,
                    backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = showVersion ? '1' : '0.6';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                {isLoading ? '⏳' : '🔧'} {isLoading ? 'Loading...' : `v${appVersion}`}
            </button>

            {/* 상세 정보 팝업 */}
            {showVersion && !isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '60px',
                        right: '15px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        color: '#333',
                        border: '1px solid #e0e0e0',
                        borderRadius: '10px',
                        padding: '15px 20px',
                        fontSize: '13px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        zIndex: 1001,
                        minWidth: '200px',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>
                        CTI Task Manager
                    </h4>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>버전:</strong> {appVersion}
                    </div>
                    <div style={{ marginBottom: '5px' }}>
                        <strong>빌드:</strong> Production
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>
                        © 2025 Nexus AICC Lab
                    </div>
                </div>
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