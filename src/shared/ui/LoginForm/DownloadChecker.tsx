// C:\tauri\cti-task-pilot2\src\shared\ui\LoginForm\DownloadChecker.tsx
import React, { useState, useEffect } from 'react';

interface DownloadCheckerProps {
    onInstallStatusChange?: (isInstalled: boolean) => void;
}

const DownloadChecker: React.FC<DownloadCheckerProps> = ({ onInstallStatusChange }) => {
    const [status, setStatus] = useState<string>('프로그램 연결 확인 중...');
    const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
    const [showDownload, setShowDownload] = useState<boolean>(false);

    useEffect(() => {
        checkAppInstallation();
    }, []);

    useEffect(() => {
        if (onInstallStatusChange) {
            onInstallStatusChange(isAppInstalled);
        }
    }, [isAppInstalled, onInstallStatusChange]);

    const checkAppInstallation = async () => {
        try {
            const testUrl = 'cti-personal://test?timestamp=' + Date.now();
            let resolved = false;

            const onBlur = () => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    setIsAppInstalled(true);
                    setStatus('✅ 프로그램이 설치되어 있습니다!');
                    setShowDownload(false);
                }
            };

            const onFocus = () => {
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        cleanup();
                        setIsAppInstalled(false);
                        setStatus('❌ 프로그램이 설치되어 있지 않습니다.');
                        setShowDownload(true);
                    }
                }, 1000);
            };

            const cleanup = () => {
                window.removeEventListener('blur', onBlur);
                window.removeEventListener('focus', onFocus);
            };

            window.addEventListener('blur', onBlur);
            window.addEventListener('focus', onFocus);
            window.location.href = testUrl;

            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    setIsAppInstalled(false);
                    setStatus('❌ 프로그램이 설치되어 있지 않습니다.');
                    setShowDownload(true);
                }
            }, 3000);
        } catch (error) {
            console.error('앱 설치 확인 오류:', error);
            setIsAppInstalled(false);
            setStatus('❌ 프로그램 연결 실패');
            setShowDownload(true);
        }
    };

    const launchApp = () => {
        const timestamp = Date.now().toString();
        const testLoginUrl = `cti-personal://login?` +
            `safe_token=${encodeURIComponent(btoa('auto_' + timestamp))}&` +
            `username=${encodeURIComponent('자동사용자')}&` +
            `department=${encodeURIComponent('기술팀')}&` +
            `role=${encodeURIComponent('관리자')}&` +
            `email=${encodeURIComponent('auto@example.com')}&` +
            `timestamp=${timestamp}&` +
            `session_id=sess_${timestamp}&` +
            `login_method=auto_launch&` +
            `version=2.0`;

        window.location.href = testLoginUrl;
        console.log('프로그램 실행:', testLoginUrl);
    };

    const downloadApp = async () => {
        const downloadUrls = [
            './src-tauri/target/release/bundle/nsis/CTI Task Master_07151050.exe',
            'http://localhost:8000/CTI Task Master_07151050.exe',
            'file:///C:/tauri/cti-task-pilot2/src-tauri/target/release/bundle/nsis/CTI Task Master_07151050.exe',
            'https://github.com/nexus-aicc-lab/tauri-cti-task-manager/releases/latest/download/CTI_Task_Master_Setup.exe'
        ];

        for (let i = 0; i < downloadUrls.length; i++) {
            try {
                const url = downloadUrls[i];
                console.log(`다운로드 시도 ${i + 1}: ${url}`);

                if (url.startsWith('http')) {
                    const response = await fetch(url, { method: 'HEAD' });
                    if (!response.ok) continue;
                }

                const link = document.createElement('a');
                link.href = url;
                link.download = 'CTI_Task_Master_Setup.exe';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setStatus(`📥 다운로드가 시작되었습니다. (방법 ${i + 1}) 설치 후 새로고침하세요.`);
                return;
            } catch (e) {
                console.warn(`방법 ${i + 1} 실패`, e);
            }
        }

        setStatus('❌ 다운로드 실패. 아래 방법을 시도해보세요.');
        alert(`
다운로드 실패 - 다음 방법을 시도해보세요:

1. 로컬 서버 시작:
   - 프로젝트 폴더에서 python -m http.server 8000 실행
   - http://localhost:8000 접속

2. 파일 직접 접근:
   - C:\\tauri\\cti-task-pilot2\\src-tauri\\target\\release\\bundle\\nsis\\CTI Task Master_07151050.exe 실행

3. npm run tauri build
    `);
    };

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '8px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center'
        }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', color: '#00acc1' }}>🎯</div>
            <h1 style={{ color: '#00acc1', marginBottom: '24px', fontSize: '24px' }}>
                UCTI Personal Application
            </h1>

            <div style={{
                background: '#e0f7fa',
                border: '1px solid #b2ebf2',
                borderRadius: '4px',
                padding: '16px',
                marginBottom: '24px'
            }}>
                <p style={{ margin: 0, color: '#006064', fontSize: '16px' }}>{status}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {isAppInstalled && (
                    <button
                        onClick={launchApp}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        🚀 프로그램 실행
                    </button>
                )}

                {showDownload && (
                    <button
                        onClick={downloadApp}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        📥 프로그램 다운로드
                    </button>
                )}

                <button
                    onClick={checkAppInstallation}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#9e9e9e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                    🔄 다시 확인
                </button>
            </div>

            <div style={{
                marginTop: '32px',
                padding: '20px',
                backgroundColor: '#f1f1f1',
                borderRadius: '4px',
                textAlign: 'left'
            }}>
                <h4 style={{ color: '#333', marginBottom: '12px' }}>📋 사용 방법</h4>
                <ol style={{ color: '#555', fontSize: '14px', paddingLeft: '20px' }}>
                    <li>페이지 로드 시 자동으로 프로그램 설치 상태를 확인합니다.</li>
                    <li>설치되어 있으면 "🚀 프로그램 실행" 버튼이 나타납니다.</li>
                    <li>설치되어 있지 않으면 다음 방법으로 설치하세요:</li>
                    <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                        <li>📥 프로그램 다운로드</li>
                        <li>🌐 로컬 서버</li>
                        <li>📂 파일 위치</li>
                    </ul>
                    <li>다운로드 후 설치하고 "🔄 다시 확인" 버튼을 클릭하세요.</li>
                    <li><strong>프로그램 설치 후 왼쪽 로그인 폼을 사용할 수 있습니다.</strong></li>
                </ol>
            </div>
        </div>
    );
};

export default DownloadChecker;