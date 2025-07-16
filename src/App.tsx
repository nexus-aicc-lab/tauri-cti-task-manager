import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
    const [status, setStatus] = useState<string>('프로그램 연결 확인 중...');
    const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
    const [showDownload, setShowDownload] = useState<boolean>(false);

    useEffect(() => {
        checkAppInstallation();
    }, []);

    const checkAppInstallation = async () => {
        try {
            // 딥링크 테스트
            const testUrl = 'cti-personal://test?timestamp=' + Date.now();

            // 포커스 변경을 통한 앱 설치 감지
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

            // 딥링크 실행
            window.location.href = testUrl;

            // 타임아웃 설정
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

    const downloadApp = () => {
        try {
            // 다운로드 링크 생성
            const link = document.createElement('a');
            link.href = 'C:\\tauri\\cti-task-pilot2\\src-tauri\\target\\release\\bundle\\nsis\\CTI Task Master_07151050.exe';
            link.download = 'CTI_Task_Master_Setup.exe';
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setStatus('📥 다운로드가 시작되었습니다. 설치 후 새로고침하세요.');

        } catch (error) {
            console.error('다운로드 오류:', error);
            setStatus('❌ 다운로드 실패. 수동으로 파일을 다운로드하세요.');
        }
    };

    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
                <h1 style={{ color: '#333', marginBottom: '30px' }}>CTI Task Master</h1>

                <div style={{
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f8f9fa',
                    marginBottom: '30px',
                    border: '1px solid #dee2e6'
                }}>
                    <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>{status}</p>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {isAppInstalled ? (
                        <button
                            onClick={launchApp}
                            style={{
                                padding: '15px 30px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            🚀 프로그램 실행
                        </button>
                    ) : null}

                    {showDownload ? (
                        <button
                            onClick={downloadApp}
                            style={{
                                padding: '15px 30px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            📥 프로그램 다운로드
                        </button>
                    ) : null}

                    <button
                        onClick={checkAppInstallation}
                        style={{
                            padding: '15px 30px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        🔄 다시 확인
                    </button>
                </div>

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '10px',
                    textAlign: 'left'
                }}>
                    <h4 style={{ color: '#333', marginBottom: '15px' }}>📋 사용 방법</h4>
                    <ol style={{ color: '#666', fontSize: '14px', paddingLeft: '20px' }}>
                        <li>페이지 로드 시 자동으로 프로그램 설치 상태를 확인합니다.</li>
                        <li>설치되어 있으면 "프로그램 실행" 버튼이 나타납니다.</li>
                        <li>설치되어 있지 않으면 "프로그램 다운로드" 버튼이 나타납니다.</li>
                        <li>다운로드 후 설치하고 "다시 확인" 버튼을 클릭하세요.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default App;
