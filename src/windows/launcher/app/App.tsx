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
import { ToastContainer, toast } from 'react-toastify';
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

    console.log('🚀 런처 윈도우 앱 시작 (FSD 구조) !');

    // 버전 가져오기
    useEffect(() => {
        const fetchVersion = async () => {
            try {
                // Tauri API를 사용하여 앱 버전 가져오기
                const version = await getVersion();
                setAppVersion(version);
                console.log('📱 현재 앱 버전:', version);
            } catch (error) {
                console.error('❌ 버전 정보 가져오기 실패:', error);
                // Fallback으로 설정
                setAppVersion('0.2.4');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVersion();
    }, []);

    // 자동 업데이트 체크 (앱 시작 5초 후)
    useEffect(() => {
        if (!isLoading && appVersion) {
            const timer = setTimeout(() => {
                checkForUpdates(true); // 자동 체크
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isLoading, appVersion]);

    // 업데이트 체크 함수
    const checkForUpdates = async (isAutoCheck: boolean = false) => {
        try {
            setUpdateStatus(prev => ({ ...prev, checking: true, error: undefined }));
            console.log('🔍 업데이트 확인 중...');

            const update = await check();
            console.log('업데이트 체크 결과:', update);

            if (update && update.available) {
                console.log('🆕 새 버전 발견:', update.version);
                setUpdateStatus(prev => ({
                    ...prev,
                    available: true,
                    latestVersion: update.version,
                    checking: false,
                }));

                // 자동 체크가 아닌 경우에만 즉시 다이얼로그 표시
                if (!isAutoCheck) {
                    await promptUpdate(update);
                } else {
                    // 자동 체크인 경우 토스트 알림
                    toast.info(`새 버전 ${update.version}이 사용 가능합니다!`, {
                        onClick: () => promptUpdate(update),
                        autoClose: false,
                        closeOnClick: false,
                    });
                }
            } else {
                console.log('✅ 최신 버전입니다.');
                setUpdateStatus(prev => ({
                    ...prev,
                    available: false,
                    checking: false,
                }));

                if (!isAutoCheck) {
                    toast.success('현재 최신 버전을 사용중입니다!');
                }
            }
        } catch (error) {
            console.error('❌ 업데이트 확인 실패:', error);
            setUpdateStatus(prev => ({
                ...prev,
                checking: false,
                error: error instanceof Error ? error.message : '업데이트 확인 실패',
            }));

            if (!isAutoCheck) {
                toast.error('업데이트 확인에 실패했습니다.');
            }
        }
    };

    // 업데이트 프롬프트
    const promptUpdate = async (update: any) => {
        const shouldUpdate = await ask(
            `새 버전 ${update.version}이 사용 가능합니다.\n\n현재 버전: ${appVersion}\n최신 버전: ${update.version}\n\n지금 업데이트하시겠습니까?`,
            {
                title: 'CTI Task Manager 업데이트',
                okLabel: '업데이트',
                cancelLabel: '나중에',
            }
        );

        if (shouldUpdate) {
            await performUpdate(update);
        }
    };

    // 업데이트 수행
    const performUpdate = async (update: any) => {
        try {
            setUpdateStatus(prev => ({ ...prev, downloading: true }));
            console.log('⬇️ 업데이트 다운로드 중...');

            toast.info('업데이트를 다운로드하고 있습니다...', {
                autoClose: false,
                closeButton: false,
            });

            let downloaded = 0;
            let contentLength = 0;

            await update.downloadAndInstall((event: any) => {
                switch (event.event) {
                    case 'Started':
                        contentLength = event.data.contentLength || 0;
                        console.log('다운로드 시작, 전체 크기:', contentLength);
                        break;
                    case 'Progress':
                        downloaded += event.data.chunkLength;
                        const progress = contentLength > 0 ? Math.round((downloaded / contentLength) * 100) : 0;
                        console.log(`다운로드 진행: ${progress}%`);
                        break;
                    case 'Finished':
                        console.log('다운로드 완료');
                        break;
                }
            });

            console.log('✅ 업데이트 설치 완료! 재시작합니다...');
            toast.success('업데이트가 완료되었습니다. 앱을 재시작합니다...');

            setTimeout(async () => {
                await relaunch();
            }, 2000);
        } catch (error) {
            console.error('❌ 업데이트 실패:', error);
            setUpdateStatus(prev => ({
                ...prev,
                downloading: false,
                error: error instanceof Error ? error.message : '업데이트 실패',
            }));

            toast.error('업데이트에 실패했습니다. 나중에 다시 시도해주세요.');
        }
    };

    // 수동 업데이트 체크
    const manualCheckUpdate = () => {
        checkForUpdates(false);
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
            {/* 업데이트 상태 표시 (상단 중앙) */}
            {(updateStatus.checking || updateStatus.downloading) && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    {updateStatus.checking && (
                        <>
                            <span className="animate-spin">🔄</span>
                            <span>업데이트 확인 중...</span>
                        </>
                    )}
                    {updateStatus.downloading && (
                        <>
                            <span className="animate-pulse">⬇️</span>
                            <span>업데이트 다운로드 중...</span>
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
                    backgroundColor: updateStatus.available
                        ? 'rgba(40, 167, 69, 0.9)'
                        : 'rgba(0, 0, 0, 0.8)',
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
                    animation: updateStatus.available ? 'pulse 2s infinite' : 'none',
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
                            <strong>최신 버전:</strong> {updateStatus.latestVersion}
                            <span style={{ marginLeft: '5px' }}>🆕</span>
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
                            backgroundColor: updateStatus.available ? '#28a745' : '#007ACC',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: updateStatus.checking || updateStatus.downloading
                                ? 'not-allowed'
                                : 'pointer',
                            opacity: updateStatus.checking || updateStatus.downloading ? 0.6 : 1,
                            width: '100%',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            if (!updateStatus.checking && !updateStatus.downloading) {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {updateStatus.checking
                            ? '확인 중...'
                            : updateStatus.available
                                ? '지금 업데이트'
                                : '업데이트 확인'}
                    </button>

                    {updateStatus.error && (
                        <div style={{
                            marginTop: '10px',
                            fontSize: '11px',
                            color: '#dc3545',
                            textAlign: 'center'
                        }}>
                            {updateStatus.error}
                        </div>
                    )}

                    <div style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>
                        © 2025 Nexus AICC Lab
                    </div>
                </div>
            )}

            {/* 애니메이션 스타일 */}
            <style>{`
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
                    }
                }
                
                .animate-spin {
                    display: inline-block;
                    animation: spin 1s linear infinite;
                }
                
                .animate-pulse {
                    display: inline-block;
                    animation: pulse 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>

            {/* ✅ MainPage 컴포넌트 사용 */}
            <MainPage />

            {/* Toast UI */}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                closeOnClick
                pauseOnHover
                theme="light"
                style={{ marginTop: '60px' }}
            />
        </div>
    );
};

export default App;