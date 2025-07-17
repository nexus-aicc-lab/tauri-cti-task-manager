// C:\tauri\cti-task-pilot2\src\shared\ui\LoginForm\LoginForm.tsx
import React, { useState, useEffect } from 'react';

interface LoginData {
    agent: string;
    password: string;
}

interface LoginResponse {
    result: {
        center: string;
        config: string;
        cube_token: string;
        dn: string;
        error_code: number;
        error_message: string;
        login_id: string;
        name: string;
        tenant: string;
    };
}

const CTILoginForm: React.FC = () => {
    const [loginData, setLoginData] = useState<LoginData>({ agent: '', password: '' });
    const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // 앱 설치 체크
    useEffect(() => {
        checkAppInstallation();
    }, []);

    const checkAppInstallation = async () => {
        setIsChecking(true);
        setStatus('프로그램 연결 확인 중...');

        try {
            const testUrl = 'cti-personal://test?timestamp=' + Date.now();
            let resolved = false;

            const onBlur = () => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    setIsAppInstalled(true);
                    setStatus('✅ 프로그램이 설치되어 있습니다!');
                    setIsChecking(false);
                }
            };

            const onFocus = () => {
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        cleanup();
                        setIsAppInstalled(false);
                        setStatus('❌ 프로그램이 설치되어 있지 않습니다.');
                        setIsChecking(false);
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
                    setIsChecking(false);
                }
            }, 3000);
        } catch (error) {
            console.error('앱 설치 확인 오류:', error);
            setIsAppInstalled(false);
            setStatus('❌ 프로그램 연결 실패');
            setIsChecking(false);
        }
    };

    // 앱 실행
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

    // 다운로드
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
                return;
            } catch (e) {
                console.warn(`방법 ${i + 1} 실패`, e);
            }
        }

        alert(`다운로드 실패 - 다음 방법을 시도해보세요:\n\n1. 로컬 서버 시작:\n   - python -m http.server 8000\n   - http://localhost:8000 접속\n\n2. 파일 직접 접근:\n   - C:\\tauri\\cti-task-pilot2\\src-tauri\\target\\release\\bundle\\nsis\\CTI Task Master_07151050.exe\n\n3. npm run tauri build`);
    };

    // 폼 입력 처리
    const handleLoginChange = (field: keyof LoginData, value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };

    // API 로그인
    const handleLogin = async () => {
        if (!loginData.agent.trim() || !loginData.password.trim()) return;

        setIsLoading(true);
        setError('');
        setLoginResponse(null);

        try {
            const response = await fetch('http://10.10.40.186:21004/authorize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    authorize: {
                        agent: loginData.agent,
                        password: loginData.password
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: LoginResponse = await response.json();
            setLoginResponse(data);

            // 로그인 성공 시 프로그램 실행
            if (data.result.error_code === 0) {
                const timestamp = Date.now().toString();
                const loginUrl = `cti-personal://login?` +
                    `safe_token=${encodeURIComponent(btoa('form_' + timestamp))}&` +
                    `agent=${encodeURIComponent(loginData.agent)}&` +
                    `password=${encodeURIComponent(loginData.password)}&` +
                    `timestamp=${timestamp}&` +
                    `session_id=sess_${timestamp}&` +
                    `login_method=form_login&` +
                    `version=2.0`;

                window.location.href = loginUrl;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = !!loginData.agent.trim() && !!loginData.password.trim();

    return (
        <div style={{
            // minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                width: '80%',
                maxWidth: '500px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e0f7fa',
                marginBottom: '20px'
            }}>
                {/* 헤더 */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{ fontSize: '64px', color: '#00acc1', marginBottom: '12px' }}>👤</div>
                    <h2 style={{ color: '#00acc1', fontSize: '30px', margin: 0 }}>사용자 로그인</h2>
                    <p style={{ color: '#00838f', fontSize: '16px', margin: '8px 0 0' }}>
                        CTI 시스템에 로그인하세요
                    </p>
                </div>

                {/* 로그인 폼 */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    padding: '0 16px'
                }}>
                    <div>
                        <label style={{ color: '#00495c', fontSize: '14px', fontWeight: 600 }}>Agent ID</label>
                        <input
                            type="text"
                            value={loginData.agent}
                            onChange={e => handleLoginChange('agent', e.target.value)}
                            placeholder="Agent ID를 입력하세요 (예: lab05)"
                            style={{
                                width: '100%',
                                marginTop: '8px',
                                padding: '14px 16px',
                                border: '2px solid #b2ebf2',
                                borderRadius: '10px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                                boxSizing: 'border-box'
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#00acc1'}
                            onBlur={e => e.currentTarget.style.borderColor = '#b2ebf2'}
                        />
                    </div>

                    <div>
                        <label style={{ color: '#00495c', fontSize: '14px', fontWeight: 600 }}>Password</label>
                        <input
                            type="password"
                            value={loginData.password}
                            onChange={e => handleLoginChange('password', e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            style={{
                                width: '100%',
                                marginTop: '8px',
                                padding: '14px 16px',
                                border: '2px solid #b2ebf2',
                                borderRadius: '10px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                                boxSizing: 'border-box'
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = '#00acc1'}
                            onBlur={e => e.currentTarget.style.borderColor = '#b2ebf2'}
                        />
                    </div>

                    {/* 로그인 버튼 */}
                    <button
                        onClick={handleLogin}
                        disabled={!isFormValid || isLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: isFormValid && !isLoading ? '#00acc1' : '#b2ebf2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            cursor: isFormValid && !isLoading ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.3s ease'
                        }}>
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>

                    {/* 실행/다운로드 버튼 */}
                    {isAppInstalled ? (
                        <button
                            onClick={launchApp}
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#4caf50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            🚀 프로그램 실행
                        </button>
                    ) : (
                        <button
                            onClick={downloadApp}
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#2196f3',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            📥 프로그램 다운로드
                        </button>
                    )}
                </div>
            </div>

            {/* 응답 표시 영역 */}
            {(loginResponse || error) && (
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    width: '80%',
                    maxWidth: '800px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    border: '1px solid #e0f7fa'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ color: '#00acc1', margin: 0 }}>
                            {error ? '❌ 로그인 오류' : loginResponse?.result.error_code === 0 ? '✅ 로그인 성공' : '❌ 로그인 실패'}
                        </h3>
                        <div style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: error ? '#ffebee' : loginResponse?.result.error_code === 0 ? '#e8f5e8' : '#ffebee',
                            color: error ? '#c62828' : loginResponse?.result.error_code === 0 ? '#2e7d32' : '#c62828'
                        }}>
                            {error ? 'ERROR' : loginResponse?.result.error_code === 0 ? '200 OK' : `ERROR ${loginResponse?.result.error_code}`}
                        </div>
                    </div>

                    {error ? (
                        <div style={{
                            background: '#ffebee',
                            border: '1px solid #ffcdd2',
                            borderRadius: '8px',
                            padding: '16px',
                            color: '#c62828',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    ) : loginResponse && (
                        <div style={{
                            background: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            padding: '16px',
                            fontSize: '13px',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                        }}>
                            <pre style={{
                                margin: 0,
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                color: '#495057'
                            }}>
                                {JSON.stringify(loginResponse, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* {loginResponse && (
                        <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            background: '#e0f7fa',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#00838f'
                        }}>
                            <strong>응답 정보:</strong>
                            <div style={{ marginTop: '8px' }}>
                                • 사용자: {loginResponse.result.name} ({loginResponse.result.login_id})
                                <br />
                                • 센터: {loginResponse.result.center}
                                <br />
                                • 상태: {loginResponse.result.error_code === 0 ? '정상' : `오류 (${loginResponse.result.error_message})`}
                            </div>
                        </div>
                    )} */}
                </div>
            )}
        </div>
    );
};

export default CTILoginForm;