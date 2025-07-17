import { useEffect, useState, useRef } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import { check } from '@tauri-apps/plugin-updater';
import { ask } from '@tauri-apps/plugin-dialog';
import { relaunch } from '@tauri-apps/plugin-process';

declare global {
    interface Window {
        __TAURI__?: any;
    }
}

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
            const fallbackVersion = '2.0.5';
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

    // Tauri API 디버깅 함수
    const debugTauriAPIs = () => {
        console.log('=== Tauri API 디버깅 ===');
        console.log('1. window.__TAURI__ 존재 여부:', !!window.__TAURI__);

        if (window.__TAURI__) {
            console.log('2. __TAURI__ 객체 키들:', Object.keys(window.__TAURI__));
            console.log('3. __TAURI__.app 존재 여부:', !!window.__TAURI__.app);
            console.log('4. __TAURI__.updater 존재 여부:', !!window.__TAURI__.updater);
            console.log('5. __TAURI__.dialog 존재 여부:', !!window.__TAURI__.dialog);
            console.log('6. __TAURI__.process 존재 여부:', !!window.__TAURI__.process);

            // 각 API의 메서드 확인
            if (window.__TAURI__.app) {
                console.log('7. app API 메서드:', Object.keys(window.__TAURI__.app));
            }
            if (window.__TAURI__.updater) {
                console.log('8. updater API 메서드:', Object.keys(window.__TAURI__.updater));
            }
        }

        // Tauri v2 플러그인 시스템 확인
        console.log('9. @tauri-apps/api 모듈 로드 확인:');
        try {
            console.log('   - getVersion 함수:', typeof getVersion);
            console.log('   - check 함수:', typeof check);
            console.log('   - ask 함수:', typeof ask);
            console.log('   - relaunch 함수:', typeof relaunch);
        } catch (e) {
            console.error('   - 모듈 로드 실패:', e);
        }

        console.log('=== 디버깅 종료 ===');
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
        debugTauriAPIs, // 디버깅 함수 추가
    };
};