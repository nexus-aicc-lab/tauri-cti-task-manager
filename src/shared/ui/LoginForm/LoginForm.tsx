import React, { useState, useEffect } from 'react';

interface LoginData {
    agent: string;
    password: string;
}

const CTILoginForm: React.FC = () => {
    const [loginData, setLoginData] = useState<LoginData>({ agent: '', password: '' });
    const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');
    const [isChecking, setIsChecking] = useState<boolean>(false);

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

    // 다운로드 (필요 시)
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

        alert(`
다운로드 실패 - 다음 방법을 시도해보세요:

1. 로컬 서버 시작:
   - python -m http.server 8000
   - http://localhost:8000 접속

2. 파일 직접 접근:
   - C:\\tauri\\cti-task-pilot2\\src-tauri\\target\\release\\bundle\\nsis\\CTI Task Master_07151050.exe

3. npm run tauri build
    `);
    };

    // 폼 입력 처리
    const handleLoginChange = (field: keyof LoginData, value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };

    // 폼 로그인
    const handleLogin = () => {
        if (!loginData.agent.trim() || !loginData.password.trim()) return;

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
        console.log('로그인 시도:', loginUrl);
    };

    // JSON 복사
    const copyLoginJson = async () => {
        const loginJson = { authorize: { agent: loginData.agent, password: loginData.password } };
        const jsonString = JSON.stringify(loginJson, null, 2);

        try { await navigator.clipboard.writeText(jsonString); alert('JSON 복사됨!'); }
        catch {
            const ta = document.createElement('textarea'); ta.value = jsonString;
            document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
            alert('JSON 복사됨!');
        }
    };

    const isFormValid = !!loginData.agent.trim() && !!loginData.password.trim();

    return (
        <div style={{
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '32px',
                width: '80%',  // 넉넉한 가로폭
                // maxWidth: '800px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                border: '1px solid #e0f7fa'
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

                    {/* 로그인 버튼 필요 */}
                    <button
                        onClick={handleLogin}
                        disabled={!isFormValid}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: isFormValid ? '#00acc1' : '#b2ebf2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.3s ease'
                        }}>
                        로그인
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
        </div>
    );
};

export default CTILoginForm;
