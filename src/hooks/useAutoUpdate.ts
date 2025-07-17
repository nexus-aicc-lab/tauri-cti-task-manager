// import { useEffect, useState, useRef } from 'react';

// // Extend Window interface to include Tauri's __TAURI__ property
// declare global {
//     interface Window {
//         __TAURI__?: any;
//     }
// }

// interface UpdateInfo {
//     available: boolean;
//     currentVersion: string;
//     latestVersion?: string;
//     checking: boolean;
//     downloading: boolean;
//     error?: string;
// }

// export const useAutoUpdate = () => {
//     const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
//         available: false,
//         currentVersion: 'Unknown',
//         checking: false,
//         downloading: false,
//     });

//     // 현재 버전을 저장할 ref (상태 업데이트와 독립적으로 관리)
//     const currentVersionRef = useRef<string>('Unknown');

//     // Tauri 환경 확인
//     const isTauri = typeof window !== 'undefined' && window.__TAURI__;

//     // 앱 시작 시 현재 버전 가져오기 및 자동 업데이트 체크
//     useEffect(() => {
//         const initializeAutoUpdate = async () => {
//             if (isTauri) {
//                 console.log('🔍 Tauri 환경 감지됨');
//                 console.log('window.__TAURI__:', window.__TAURI__);

//                 // 버전을 먼저 가져오고
//                 const version = await getCurrentVersion();

//                 // 버전을 성공적으로 가져왔을 때만 업데이트 체크
//                 if (version && version !== 'Unknown') {
//                     // 약간의 지연을 두고 업데이트 체크
//                     setTimeout(() => {
//                         checkForUpdates();
//                     }, 1000);
//                 }
//             } else {
//                 console.log('🌐 웹 브라우저 환경입니다.');
//             }
//         };

//         initializeAutoUpdate();
//     }, [isTauri]);

//     const getCurrentVersion = async () => {
//         if (!isTauri) {
//             console.log('🌐 웹 브라우저에서는 버전 정보를 가져올 수 없습니다.');
//             return 'Unknown';
//         }

//         try {
//             console.log('📱 버전 정보를 가져오는 중...');

//             // 방법 1: @tauri-apps/api v2 사용
//             try {
//                 const { app } = await import('@tauri-apps/api');
//                 if (app && app.getVersion) {
//                     const version = await app.getVersion();
//                     if (version) {
//                         console.log('📱 현재 앱 버전 (API v2):', version);
//                         currentVersionRef.current = version;
//                         setUpdateInfo(prev => ({
//                             ...prev,
//                             currentVersion: version
//                         }));
//                         return version;
//                     }
//                 }
//             } catch (apiError) {
//                 console.log('API v2 방식 실패, 다른 방법 시도...');
//             }

//             // 방법 2: @tauri-apps/api/app 직접 import
//             try {
//                 const appModule = await import('@tauri-apps/api/app');
//                 console.log('App 모듈:', appModule);

//                 if (appModule.getVersion) {
//                     const version = await appModule.getVersion();
//                     console.log('📱 현재 앱 버전 (직접 import):', version);
//                     currentVersionRef.current = version;
//                     setUpdateInfo(prev => ({
//                         ...prev,
//                         currentVersion: version
//                     }));
//                     return version;
//                 }
//             } catch (directImportError) {
//                 console.log('직접 import 실패, 다른 방법 시도...');
//             }

//             // 방법 3: Tauri v1 스타일 (호환성)
//             if (window.__TAURI__?.app?.getVersion) {
//                 const version = await window.__TAURI__.app.getVersion();
//                 console.log('📱 현재 앱 버전 (v1 스타일):', version);
//                 currentVersionRef.current = version;
//                 setUpdateInfo(prev => ({
//                     ...prev,
//                     currentVersion: version
//                 }));
//                 return version;
//             }

//             throw new Error('모든 방법으로 버전을 가져올 수 없음');
//         } catch (error) {
//             console.error('❌ 버전 정보 가져오기 실패:', error);
//             console.error('에러 상세:', {
//                 message: error instanceof Error ? error.message : 'Unknown error',
//                 stack: error instanceof Error ? error.stack : undefined
//             });

//             // tauri.conf.json의 버전을 하드코딩으로 사용
//             const fallbackVersion = '0.1.8';
//             console.log('📱 Fallback 버전 사용:', fallbackVersion);

//             currentVersionRef.current = fallbackVersion;
//             setUpdateInfo(prev => ({
//                 ...prev,
//                 currentVersion: fallbackVersion
//             }));

//             return fallbackVersion;
//         }
//     };

//     const checkForUpdates = async () => {
//         if (!isTauri) {
//             console.log('🌐 웹 브라우저에서는 업데이트 체크를 지원하지 않습니다.');
//             return;
//         }

//         try {
//             // 업데이트 체크 시작
//             setUpdateInfo(prev => ({
//                 ...prev,
//                 checking: true,
//                 error: undefined
//             }));

//             console.log('🔍 업데이트 체크 시작...');
//             console.log('현재 버전 (ref):', currentVersionRef.current);

//             // 동적 import로 Tauri 플러그인 로드
//             const updaterModule = await import('@tauri-apps/plugin-updater');
//             console.log('Updater 모듈:', updaterModule);

//             if (!updaterModule.check) {
//                 throw new Error('check 함수를 찾을 수 없음');
//             }

//             const update = await updaterModule.check();
//             console.log('업데이트 체크 결과:', update);

//             if (update) {
//                 console.log('🆕 업데이트 발견:', update.version);

//                 setUpdateInfo(prev => ({
//                     ...prev,
//                     available: true,
//                     latestVersion: update.version,
//                     checking: false,
//                 }));

//                 // 사용자에게 업데이트 확인
//                 const dialogModule = await import('@tauri-apps/plugin-dialog');
//                 const shouldUpdate = await dialogModule.ask(
//                     `새 버전 ${update.version}이 있습니다.\n현재 버전: ${currentVersionRef.current}\n\n지금 업데이트하시겠습니까?`,
//                     {
//                         title: 'CTI Task Manager 업데이트',
//                         kind: 'info',
//                     }
//                 );

//                 if (shouldUpdate) {
//                     await performUpdate(update);
//                 }
//             } else {
//                 console.log('✅ 최신 버전입니다.');
//                 setUpdateInfo(prev => ({
//                     ...prev,
//                     available: false,
//                     checking: false,
//                 }));
//             }
//         } catch (error) {
//             console.error('❌ 업데이트 체크 실패:', error);
//             console.error('에러 상세:', {
//                 message: error instanceof Error ? error.message : 'Unknown error',
//                 stack: error instanceof Error ? error.stack : undefined
//             });

//             setUpdateInfo(prev => ({
//                 ...prev,
//                 checking: false,
//                 error: error instanceof Error ? error.message : '업데이트 체크 실패',
//             }));
//         }
//     };

//     const performUpdate = async (update: any) => {
//         if (!isTauri) return;

//         try {
//             setUpdateInfo(prev => ({
//                 ...prev,
//                 downloading: true
//             }));

//             console.log('⬇️ 업데이트 다운로드 및 설치 시작...');

//             // 업데이트 다운로드 및 설치
//             await update.downloadAndInstall();

//             console.log('✅ 업데이트 설치 완료! 앱을 재시작합니다...');

//             // 앱 재시작
//             const processModule = await import('@tauri-apps/plugin-process');
//             await processModule.relaunch();
//         } catch (error) {
//             console.error('❌ 업데이트 설치 실패:', error);
//             setUpdateInfo(prev => ({
//                 ...prev,
//                 downloading: false,
//                 error: error instanceof Error ? error.message : '업데이트 설치 실패',
//             }));
//         }
//     };

//     // 자동 업데이트 (사용자 확인 없이)
//     const performSilentUpdate = async () => {
//         if (!isTauri) return;

//         try {
//             setUpdateInfo(prev => ({
//                 ...prev,
//                 checking: true
//             }));

//             const updaterModule = await import('@tauri-apps/plugin-updater');
//             const update = await updaterModule.check();

//             if (update) {
//                 console.log('🔄 자동 업데이트 시작:', update.version);
//                 await performUpdate(update);
//             } else {
//                 setUpdateInfo(prev => ({
//                     ...prev,
//                     checking: false
//                 }));
//             }
//         } catch (error) {
//             console.error('❌ 자동 업데이트 실패:', error);
//             setUpdateInfo(prev => ({
//                 ...prev,
//                 checking: false,
//                 error: error instanceof Error ? error.message : '자동 업데이트 실패',
//             }));
//         }
//     };

//     // 디버깅을 위한 로그
//     useEffect(() => {
//         console.log('📊 updateInfo 변경됨:', updateInfo);
//     }, [updateInfo]);

//     // Tauri API 테스트 함수
//     const debugTauriAPIs = async () => {
//         console.log('=== Tauri API 디버깅 시작 ===');
//         console.log('window.__TAURI__:', window.__TAURI__);

//         try {
//             // @tauri-apps/api 확인
//             const api = await import('@tauri-apps/api');
//             console.log('@tauri-apps/api:', api);

//             // app 모듈 확인
//             const appModule = await import('@tauri-apps/api/app');
//             console.log('@tauri-apps/api/app:', appModule);
//             console.log('getVersion 함수 존재:', !!appModule.getVersion);

//             // 다른 방법으로 버전 가져오기 시도
//             if (window.__TAURI__?.app) {
//                 console.log('window.__TAURI__.app:', window.__TAURI__.app);
//             }

//         } catch (error) {
//             console.error('Tauri API 디버깅 실패:', error);
//         }
//         console.log('=== Tauri API 디버깅 종료 ===');
//     };

//     return {
//         updateInfo,
//         checkForUpdates,
//         performSilentUpdate,
//         getCurrentVersion,
//         debugTauriAPIs, // 디버깅 함수 추가
//         isTauri,
//     };
// };

import { useEffect, useState, useRef } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import { check } from '@tauri-apps/plugin-updater';
import { ask } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';

interface UpdateInfo {
    available: boolean;
    currentVersion: string;
    latestVersion?: string;
    checking: boolean;
    downloading: boolean;
    error?: string;
}

export const useAutoUpdate = () => {
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
        available: false,
        currentVersion: 'Unknown',
        checking: false,
        downloading: false,
    });

    // 현재 버전을 저장할 ref
    const currentVersionRef = useRef<string>('Unknown');

    // Tauri 환경 확인 - v2에서는 항상 true (웹에서는 import 자체가 실패)
    const isTauri = true;

    // 앱 시작 시 현재 버전 가져오기 및 자동 업데이트 체크
    useEffect(() => {
        const initializeAutoUpdate = async () => {
            try {
                await getCurrentVersion();
                // 약간의 지연 후 업데이트 체크
                setTimeout(() => {
                    checkForUpdates();
                }, 2000);
            } catch (error) {
                console.error('초기화 실패:', error);
            }
        };

        initializeAutoUpdate();
    }, []);

    const getCurrentVersion = async () => {
        try {
            console.log('📱 버전 정보를 가져오는 중...');

            const version = await getVersion();
            console.log('📱 현재 앱 버전:', version);

            currentVersionRef.current = version;
            setUpdateInfo(prev => ({
                ...prev,
                currentVersion: version
            }));

            return version;
        } catch (error) {
            console.error('❌ 버전 정보 가져오기 실패:', error);

            // package.json 버전을 fallback으로 사용
            const fallbackVersion = '2.0.4';
            console.log('📱 Fallback 버전 사용:', fallbackVersion);

            currentVersionRef.current = fallbackVersion;
            setUpdateInfo(prev => ({
                ...prev,
                currentVersion: fallbackVersion
            }));

            return fallbackVersion;
        }
    };

    const checkForUpdates = async () => {
        try {
            setUpdateInfo(prev => ({
                ...prev,
                checking: true,
                error: undefined
            }));

            console.log('🔍 업데이트 체크 시작...');
            console.log('현재 버전:', currentVersionRef.current);

            const update = await check();
            console.log('업데이트 체크 결과:', update);

            if (update && update.available) {
                console.log('🆕 업데이트 발견:', update.version);

                setUpdateInfo(prev => ({
                    ...prev,
                    available: true,
                    latestVersion: update.version,
                    checking: false,
                }));

                // 사용자에게 업데이트 확인
                const shouldUpdate = await ask(
                    `새 버전 ${update.version}이 있습니다.\n현재 버전: ${currentVersionRef.current}\n\n지금 업데이트하시겠습니까?`,
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
                setUpdateInfo(prev => ({
                    ...prev,
                    available: false,
                    checking: false,
                }));
            }
        } catch (error) {
            console.error('❌ 업데이트 체크 실패:', error);
            setUpdateInfo(prev => ({
                ...prev,
                checking: false,
                error: error instanceof Error ? error.message : '업데이트 체크 실패',
            }));
        }
    };

    const performUpdate = async (update: any) => {
        try {
            setUpdateInfo(prev => ({
                ...prev,
                downloading: true
            }));

            console.log('⬇️ 업데이트 다운로드 및 설치 시작...');

            let downloaded = 0;
            let contentLength = 0;

            // 업데이트 다운로드 및 설치
            await update.downloadAndInstall((event: any) => {
                switch (event.event) {
                    case 'Started':
                        contentLength = event.data.contentLength || 0;
                        console.log('다운로드 시작, 전체 크기:', contentLength);
                        break;
                    case 'Progress':
                        downloaded += event.data.chunkLength;
                        console.log(`다운로드 진행: ${downloaded}/${contentLength}`);
                        break;
                    case 'Finished':
                        console.log('다운로드 완료');
                        break;
                }
            });

            console.log('✅ 업데이트 설치 완료! 앱을 재시작합니다...');

            // 앱 재시작
            await relaunch();
        } catch (error) {
            console.error('❌ 업데이트 설치 실패:', error);
            setUpdateInfo(prev => ({
                ...prev,
                downloading: false,
                error: error instanceof Error ? error.message : '업데이트 설치 실패',
            }));
        }
    };

    // 자동 업데이트 (사용자 확인 없이)
    const performSilentUpdate = async () => {
        try {
            setUpdateInfo(prev => ({
                ...prev,
                checking: true
            }));

            const update = await check();

            if (update && update.available) {
                console.log('🔄 자동 업데이트 시작:', update.version);
                await performUpdate(update);
            } else {
                setUpdateInfo(prev => ({
                    ...prev,
                    checking: false
                }));
            }
        } catch (error) {
            console.error('❌ 자동 업데이트 실패:', error);
            setUpdateInfo(prev => ({
                ...prev,
                checking: false,
                error: error instanceof Error ? error.message : '자동 업데이트 실패',
            }));
        }
    };

    // 디버깅을 위한 로그
    useEffect(() => {
        console.log('📊 updateInfo 변경됨:', updateInfo);
    }, [updateInfo]);

    return {
        updateInfo,
        checkForUpdates,
        performSilentUpdate,
        getCurrentVersion,
        isTauri,
    };
};