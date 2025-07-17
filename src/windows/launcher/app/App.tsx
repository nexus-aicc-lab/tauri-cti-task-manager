// // src/windows/launcher/app/App.tsx
// import React, { useEffect, useState } from 'react';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { getVersion } from '@tauri-apps/api/app';

// // ✅ FSD Pages 가져오기
// import MainPage from '../pages/MainPage';

// const App: React.FC = () => {
//     const [appVersion, setAppVersion] = useState<string>('');
//     const [isLoading, setIsLoading] = useState(true);
//     const [showVersion, setShowVersion] = useState(false);

//     console.log('🚀 런처 윈도우 앱 시작 (FSD 구조)');

//     useEffect(() => {
//         const fetchVersion = async () => {
//             try {
//                 // Tauri API를 사용하여 앱 버전 가져오기
//                 const version = await getVersion();
//                 setAppVersion(version);
//                 console.log('📱 현재 앱 버전:', version);
//             } catch (error) {
//                 console.error('❌ 버전 정보 가져오기 실패:', error);
//                 // Fallback으로 package.json 버전 사용
//                 setAppVersion('2.0.6');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchVersion();
//     }, []);

//     return (
//         <div
//             style={{
//                 backgroundColor: '#f3f4f6',
//                 minHeight: '100vh',
//                 width: '100%',
//                 overflow: 'hidden',
//                 position: 'relative',
//             }}
//         >
//             {/* 버전 정보 표시 버튼 (우측 하단) */}
//             <button
//                 onClick={() => setShowVersion(!showVersion)}
//                 style={{
//                     position: 'fixed',
//                     bottom: '15px',
//                     right: '15px',
//                     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                     color: '#00ff00',
//                     border: 'none',
//                     borderRadius: '20px',
//                     padding: '8px 16px',
//                     fontSize: '12px',
//                     fontFamily: 'monospace',
//                     cursor: 'pointer',
//                     zIndex: 1000,
//                     transition: 'all 0.3s ease',
//                     opacity: showVersion ? 1 : 0.6,
//                     backdropFilter: 'blur(10px)',
//                 }}
//                 onMouseEnter={(e) => {
//                     e.currentTarget.style.opacity = '1';
//                     e.currentTarget.style.transform = 'scale(1.05)';
//                 }}
//                 onMouseLeave={(e) => {
//                     e.currentTarget.style.opacity = showVersion ? '1' : '0.6';
//                     e.currentTarget.style.transform = 'scale(1)';
//                 }}
//             >
//                 {isLoading ? '⏳' : '🔧'} {isLoading ? 'Loading...' : `v${appVersion}`}
//             </button>

//             {/* 상세 정보 팝업 */}
//             {showVersion && !isLoading && (
//                 <div
//                     style={{
//                         position: 'fixed',
//                         bottom: '60px',
//                         right: '15px',
//                         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                         color: '#333',
//                         border: '1px solid #e0e0e0',
//                         borderRadius: '10px',
//                         padding: '15px 20px',
//                         fontSize: '13px',
//                         boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
//                         zIndex: 1001,
//                         minWidth: '200px',
//                         backdropFilter: 'blur(10px)',
//                     }}
//                 >
//                     <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>
//                         CTI Task Manager
//                     </h4>
//                     <div style={{ marginBottom: '5px' }}>
//                         <strong>버전:</strong> {appVersion}
//                     </div>
//                     <div style={{ marginBottom: '5px' }}>
//                         <strong>빌드:</strong> Production
//                     </div>
//                     <div style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>
//                         © 2025 Nexus AICC Lab
//                     </div>
//                 </div>
//             )}

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
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getVersion } from '@tauri-apps/api/app';
import { check } from '@tauri-apps/plugin-updater';
import { ask } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';

// ✅ FSD Pages 가져오기
import MainPage from '../pages/MainPage';

const App: React.FC = () => {
    const [appVersion, setAppVersion] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [showVersion, setShowVersion] = useState(false);
    const [updateStatus, setUpdateStatus] = useState<{
        checking: boolean;
        available: boolean;
        downloading: boolean;
        latestVersion?: string;
        error?: string;
    }>({
        checking: false,
        available: false,
        downloading: false,
    });

    console.log('🚀 런처 윈도우 앱 시작 (FSD 구조)');

    // 버전 가져오기
    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const version = await getVersion();
                setAppVersion(version);
                console.log('📱 현재 앱 버전:', version);
            } catch (error) {
                console.error('❌ 버전 정보 가져오기 실패:', error);
                setAppVersion('0.2.2'); // Fallback 버전
            } finally {
                setIsLoading(false);
            }
        };

        fetchVersion();
    }, []);

    // 업데이트 체크 (앱 시작 시 자동)
    useEffect(() => {
        const checkForUpdates = async () => {
            if (isLoading) return;

            try {
                setUpdateStatus(prev => ({ ...prev, checking: true }));
                console.log('🔍 업데이트 확인 중...');

                const update = await check();

                if (update?.available) {
                    console.log('🆕 새 버전 발견:', update.version);
                    setUpdateStatus(prev => ({
                        ...prev,
                        available: true,
                        latestVersion: update.version,
                        checking: false,
                    }));

                    // 업데이트 알림
                    const shouldUpdate = await ask(
                        `새 버전 ${update.version}이 사용 가능합니다.\n현재 버전: ${appVersion}\n\n지금 업데이트하시겠습니까?`,
                        {
                            title: 'CTI Task Manager 업데이트',
                            okLabel: '업데이트',
                            cancelLabel: '나중에',
                        }
                    );

                    if (shouldUpdate) {
                        await performUpdate(update);
                    }
                } else {
                    console.log('✅ 최신 버전입니다.');
                    setUpdateStatus(prev => ({
                        ...prev,
                        available: false,
                        checking: false,
                    }));
                }
            } catch (error) {
                console.error('❌ 업데이트 확인 실패:', error);
                setUpdateStatus(prev => ({
                    ...prev,
                    checking: false,
                    error: error instanceof Error ? error.message : '업데이트 확인 실패',
                }));
            }
        };

        // 버전 로드 완료 후 3초 뒤에 업데이트 체크
        if (!isLoading) {
            const timer = setTimeout(checkForUpdates, 3000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, appVersion]);

    // 업데이트 수행
    const performUpdate = async (update: any) => {
        try {
            setUpdateStatus(prev => ({ ...prev, downloading: true }));
            console.log('⬇️ 업데이트 다운로드 중...');

            await update.downloadAndInstall((event: any) => {
                switch (event.event) {
                    case 'Started':
                        console.log('다운로드 시작');
                        break;
                    case 'Progress':
                        console.log('다운로드 진행 중...');
                        break;
                    case 'Finished':
                        console.log('다운로드 완료');
                        break;
                }
            });

            console.log('✅ 업데이트 완료! 재시작합니다...');
            await relaunch();
        } catch (error) {
            console.error('❌ 업데이트 실패:', error);
            setUpdateStatus(prev => ({
                ...prev,
                downloading: false,
                error: error instanceof Error ? error.message : '업데이트 실패',
            }));
        }
    };

    // 수동 업데이트 체크
    const manualCheckUpdate = async () => {
        setUpdateStatus({ checking: true, available: false, downloading: false });

        try {
            const update = await check();

            if (update?.available) {
                setUpdateStatus(prev => ({
                    ...prev,
                    available: true,
                    latestVersion: update.version,
                    checking: false,
                }));

                const shouldUpdate = await ask(
                    `새 버전 ${update.version}이 사용 가능합니다.\n현재 버전: ${appVersion}\n\n지금 업데이트하시겠습니까?`,
                    {
                        title: 'CTI Task Manager 업데이트',
                        okLabel: '업데이트',
                        cancelLabel: '나중에',
                    }
                );

                if (shouldUpdate) {
                    await performUpdate(update);
                }
            } else {
                setUpdateStatus(prev => ({
                    ...prev,
                    available: false,
                    checking: false,
                }));
                alert('현재 최신 버전입니다.');
            }
        } catch (error) {
            console.error('업데이트 확인 실패:', error);
            setUpdateStatus(prev => ({
                ...prev,
                checking: false,
                error: error instanceof Error ? error.message : '업데이트 확인 실패',
            }));
        }
    };

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
            {/* 업데이트 상태 표시 */}
            {(updateStatus.checking || updateStatus.downloading || updateStatus.available) && (
                <div
                    style={{
                        position: 'fixed',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    {updateStatus.checking && (
                        <>
                            <span>🔍</span>
                            <span>업데이트 확인 중...</span>
                        </>
                    )}
                    {updateStatus.downloading && (
                        <>
                            <span>⬇️</span>
                            <span>업데이트 다운로드 중...</span>
                        </>
                    )}
                    {updateStatus.available && !updateStatus.downloading && (
                        <>
                            <span>🆕</span>
                            <span>새 버전 {updateStatus.latestVersion} 사용 가능!</span>
                        </>
                    )}
                </div>
            )}

            {/* 버전 정보 표시 버튼 (우측 하단) */}
            <button
                onClick={() => setShowVersion(!showVersion)}
                style={{
                    position: 'fixed',
                    bottom: '15px',
                    right: '15px',
                    backgroundColor: updateStatus.available ? 'rgba(40, 167, 69, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                    color: updateStatus.available ? '#ffffff' : '#00ff00',
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
                {isLoading ? '⏳' : updateStatus.available ? '🆕' : '🔧'}
                {isLoading ? 'Loading...' : `v${appVersion}`}
                {updateStatus.available && ` → v${updateStatus.latestVersion}`}
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
                        <strong>현재 버전:</strong> {appVersion}
                    </div>
                    {updateStatus.available && (
                        <div style={{ marginBottom: '5px', color: '#28a745' }}>
                            <strong>최신 버전:</strong> {updateStatus.latestVersion} 🆕
                        </div>
                    )}
                    <div style={{ marginBottom: '5px' }}>
                        <strong>빌드:</strong> Production
                    </div>

                    {/* 업데이트 확인 버튼 */}
                    <button
                        onClick={manualCheckUpdate}
                        disabled={updateStatus.checking || updateStatus.downloading}
                        style={{
                            marginTop: '10px',
                            padding: '6px 12px',
                            backgroundColor: '#007ACC',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: updateStatus.checking || updateStatus.downloading ? 'not-allowed' : 'pointer',
                            opacity: updateStatus.checking || updateStatus.downloading ? 0.6 : 1,
                            width: '100%',
                        }}
                    >
                        {updateStatus.checking ? '확인 중...' : '업데이트 확인'}
                    </button>

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