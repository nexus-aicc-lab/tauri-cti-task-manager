// import React, { useState, useEffect } from 'react';

// const App: React.FC = () => {
//     const [status, setStatus] = useState<string>('프로그램 연결 확인 중...');
//     const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
//     const [showDownload, setShowDownload] = useState<boolean>(false);

//     useEffect(() => {
//         checkAppInstallation();
//     }, []);

//     const checkAppInstallation = async () => {
//         try {
//             // 딥링크 테스트
//             const testUrl = 'cti-personal://test?timestamp=' + Date.now();

//             // 포커스 변경을 통한 앱 설치 감지
//             let resolved = false;

//             const onBlur = () => {
//                 if (!resolved) {
//                     resolved = true;
//                     cleanup();
//                     setIsAppInstalled(true);
//                     setStatus('✅ 프로그램이 설치되어 있습니다!');
//                     setShowDownload(false);
//                 }
//             };

//             const onFocus = () => {
//                 setTimeout(() => {
//                     if (!resolved) {
//                         resolved = true;
//                         cleanup();
//                         setIsAppInstalled(false);
//                         setStatus('❌ 프로그램이 설치되어 있지 않습니다.');
//                         setShowDownload(true);
//                     }
//                 }, 1000);
//             };

//             const cleanup = () => {
//                 window.removeEventListener('blur', onBlur);
//                 window.removeEventListener('focus', onFocus);
//             };

//             window.addEventListener('blur', onBlur);
//             window.addEventListener('focus', onFocus);

//             // 딥링크 실행
//             window.location.href = testUrl;

//             // 타임아웃 설정
//             setTimeout(() => {
//                 if (!resolved) {
//                     resolved = true;
//                     cleanup();
//                     setIsAppInstalled(false);
//                     setStatus('❌ 프로그램이 설치되어 있지 않습니다.');
//                     setShowDownload(true);
//                 }
//             }, 3000);

//         } catch (error) {
//             console.error('앱 설치 확인 오류:', error);
//             setIsAppInstalled(false);
//             setStatus('❌ 프로그램 연결 실패');
//             setShowDownload(true);
//         }
//     };

//     const launchApp = () => {
//         const timestamp = Date.now().toString();
//         const testLoginUrl = `cti-personal://login?` +
//             `safe_token=${encodeURIComponent(btoa('auto_' + timestamp))}&` +
//             `username=${encodeURIComponent('자동사용자')}&` +
//             `department=${encodeURIComponent('기술팀')}&` +
//             `role=${encodeURIComponent('관리자')}&` +
//             `email=${encodeURIComponent('auto@example.com')}&` +
//             `timestamp=${timestamp}&` +
//             `session_id=sess_${timestamp}&` +
//             `login_method=auto_launch&` +
//             `version=2.0`;

//         window.location.href = testLoginUrl;
//         console.log('프로그램 실행:', testLoginUrl);
//     };

//     const downloadApp = async () => {
//         const downloadUrls = [
//             // 1. 상대 경로 (개발 환경)
//             './src-tauri/target/release/bundle/nsis/CTI Task Master_07151050.exe',
//             // 2. 로컬 서버 (8000 포트)
//             'http://localhost:8000/CTI Task Master_07151050.exe',
//             // 3. 절대 경로 (로컬 파일 시스템)
//             'file:///C:/tauri/cti-task-pilot2/src-tauri/target/release/bundle/nsis/CTI Task Master_07151050.exe',
//             // 4. 대체 다운로드 링크 (GitHub 등)
//             'https://github.com/nexus-aicc-lab/tauri-cti-task-manager/releases/latest/download/CTI_Task_Master_Setup.exe'
//         ];

//         for (let i = 0; i < downloadUrls.length; i++) {
//             try {
//                 const url = downloadUrls[i];
//                 console.log(`다운로드 시도 ${i + 1}: ${url}`);

//                 // HTTP URL인 경우 먼저 존재 여부 확인
//                 if (url.startsWith('http')) {
//                     try {
//                         const response = await fetch(url, { method: 'HEAD' });
//                         if (!response.ok) {
//                             console.log(`파일이 존재하지 않음: ${url}`);
//                             continue;
//                         }
//                     } catch (fetchError) {
//                         console.log(`서버 연결 실패: ${url}`);
//                         continue;
//                     }
//                 }

//                 // 다운로드 링크 생성
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.download = 'CTI_Task_Master_Setup.exe';
//                 link.style.display = 'none';

//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);

//                 setStatus(`📥 다운로드가 시작되었습니다. (방법 ${i + 1}) 설치 후 새로고침하세요.`);
//                 return; // 성공하면 함수 종료

//             } catch (error) {
//                 console.error(`다운로드 방법 ${i + 1} 실패:`, error);
//                 continue; // 다음 방법 시도
//             }
//         }

//         // 모든 방법이 실패한 경우
//         setStatus('❌ 다운로드 실패. 아래 방법을 시도해보세요.');

//         // 대체 다운로드 방법 안내
//         const fallbackMessage = `
// 다운로드 실패 - 다음 방법을 시도해보세요:

// 1. 로컬 서버 시작:
//    - 명령 프롬프트에서 프로젝트 폴더로 이동
//    - python -m http.server 8000 실행
//    - http://localhost:8000 접속

// 2. 파일 직접 접근:
//    - 파일 탐색기에서 다음 경로 이동:
//    - C:\\tauri\\cti-task-pilot2\\src-tauri\\target\\release\\bundle\\nsis\\
//    - CTI Task Master_07151050.exe 실행

// 3. 프로그램 빌드:
//    - npm run tauri build 실행
//         `;

//         alert(fallbackMessage);
//     };

//     const openLocalServer = () => {
//         // 로컬 서버 열기
//         window.open('http://localhost:8000', '_blank');
//     };

//     const openFileLocation = () => {
//         // 파일 위치 안내
//         const filePathMessage = `
// 파일 위치:
// C:\\tauri\\cti-task-pilot2\\src-tauri\\target\\release\\bundle\\nsis\\CTI Task Master_07151050.exe

// 파일 탐색기에서 위 경로로 이동하여 직접 실행하세요.
//         `;

//         alert(filePathMessage);

//         // 클립보드에 경로 복사 시도
//         if (navigator.clipboard) {
//             navigator.clipboard.writeText('C:\\tauri\\cti-task-pilot2\\src-tauri\\target\\release\\bundle\\nsis\\CTI Task Master_07151050.exe');
//         }
//     };

//     return (
//         <div style={{
//             padding: '40px',
//             textAlign: 'center',
//             minHeight: '100vh',
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center'
//         }}>
//             <div style={{
//                 background: 'white',
//                 borderRadius: '20px',
//                 padding: '40px',
//                 maxWidth: '500px',
//                 width: '100%',
//                 boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
//             }}>
//                 <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎯</div>
//                 <h1 style={{ color: '#333', marginBottom: '30px' }}>UCTI Personal Application</h1>

//                 <div style={{
//                     padding: '20px',
//                     borderRadius: '10px',
//                     backgroundColor: '#f8f9fa',
//                     marginBottom: '30px',
//                     border: '1px solid #dee2e6'
//                 }}>
//                     <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>{status}</p>
//                 </div>

//                 <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
//                     {isAppInstalled ? (
//                         <button
//                             onClick={launchApp}
//                             style={{
//                                 padding: '15px 30px',
//                                 backgroundColor: '#28a745',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '10px',
//                                 fontSize: '16px',
//                                 fontWeight: '600',
//                                 cursor: 'pointer',
//                                 transition: 'all 0.3s'
//                             }}
//                             onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                         >
//                             🚀 프로그램 실행
//                         </button>
//                     ) : null}

//                     {showDownload ? (
//                         <>
//                             <button
//                                 onClick={downloadApp}
//                                 style={{
//                                     padding: '15px 30px',
//                                     backgroundColor: '#007bff',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '10px',
//                                     fontSize: '16px',
//                                     fontWeight: '600',
//                                     cursor: 'pointer',
//                                     transition: 'all 0.3s'
//                                 }}
//                                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                             >
//                                 📥 프로그램 다운로드
//                             </button>
//                             {/* <button
//                                 onClick={openLocalServer}
//                                 style={{
//                                     padding: '15px 20px',
//                                     backgroundColor: '#17a2b8',
//                                     color: 'white',
//                                     border: 'none',
//                                     borderRadius: '10px',
//                                     fontSize: '14px',
//                                     fontWeight: '600',
//                                     cursor: 'pointer',
//                                     transition: 'all 0.3s'
//                                 }}
//                                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                             >
//                                 🌐 로컬 서버
//                             </button>
//                             <button
//                                 onClick={openFileLocation}
//                                 style={{
//                                     padding: '15px 20px',
//                                     backgroundColor: '#ffc107',
//                                     color: '#212529',
//                                     border: 'none',
//                                     borderRadius: '10px',
//                                     fontSize: '14px',
//                                     fontWeight: '600',
//                                     cursor: 'pointer',
//                                     transition: 'all 0.3s'
//                                 }}
//                                 onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                                 onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                             >
//                                 📂 파일 위치
//                             </button> */}
//                         </>
//                     ) : null}

//                     <button
//                         onClick={checkAppInstallation}
//                         style={{
//                             padding: '15px 30px',
//                             backgroundColor: '#6c757d',
//                             color: 'white',
//                             border: 'none',
//                             borderRadius: '10px',
//                             fontSize: '16px',
//                             fontWeight: '600',
//                             cursor: 'pointer',
//                             transition: 'all 0.3s'
//                         }}
//                         onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                         onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//                     >
//                         🔄 다시 확인
//                     </button>
//                 </div>

//                 <div style={{
//                     marginTop: '30px',
//                     padding: '20px',
//                     backgroundColor: '#e9ecef',
//                     borderRadius: '10px',
//                     textAlign: 'left'
//                 }}>
//                     <h4 style={{ color: '#333', marginBottom: '15px' }}>📋 사용 방법</h4>
//                     <ol style={{ color: '#666', fontSize: '14px', paddingLeft: '20px' }}>
//                         <li>페이지 로드 시 자동으로 프로그램 설치 상태를 확인합니다.</li>
//                         <li>설치되어 있으면 "프로그램 실행" 버튼이 나타납니다.</li>
//                         <li>설치되어 있지 않으면 다음 방법으로 설치하세요:</li>
//                         <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
//                             <li>"📥 프로그램 다운로드" - 자동으로 여러 방법을 시도합니다</li>
//                             <li>"🌐 로컬 서버" - 로컬 파일 서버에서 다운로드</li>
//                             <li>"📂 파일 위치" - 설치 파일 위치를 확인하여 직접 실행</li>
//                         </ul>
//                         <li>다운로드 후 설치하고 "🔄 다시 확인" 버튼을 클릭하세요.</li>
//                     </ol>

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default App;

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
            padding: '20px',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #00bcd4 0%, #008ba3 100%)',
            fontFamily: 'Segoe UI, sans-serif'
        }}>
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
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default App;
