
import React from 'react';
import LoginForm from './shared/ui/LoginForm/LoginForm';
import { useAutoUpdate } from './hooks/useAutoUpdate';

const App: React.FC = () => {
    const { updateInfo, checkForUpdates, isTauri } = useAutoUpdate();

    return (
        <div
            style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #00bcd4 0%, #008ba3 100%)',
                padding: '20px',
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
                        zIndex: 1000,
                        minWidth: '250px',
                        fontSize: '14px',
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

            <div
                style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '40px 32px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    width: '60%',
                    maxWidth: '800px',
                    minWidth: '360px',
                    position: 'relative',
                }}
            >
                {/* 수동 업데이트 확인 버튼 (Tauri 환경에서만) */}
                {isTauri && (
                    <button
                        onClick={checkForUpdates}
                        disabled={updateInfo.checking || updateInfo.downloading}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            backgroundColor: '#007ACC',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: updateInfo.checking || updateInfo.downloading ? 'not-allowed' : 'pointer',
                            opacity: updateInfo.checking || updateInfo.downloading ? 0.6 : 1,
                        }}
                        title="업데이트 확인"
                    >
                        {updateInfo.checking ? '확인중...' : '🔄'}
                    </button>
                )}

                <LoginForm />
            </div>
        </div>
    );
};

export default App;