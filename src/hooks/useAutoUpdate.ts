import { useEffect, useState } from 'react';

// Extend Window interface to include Tauri's __TAURI__ property
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
        currentVersion: 'Unknown', // 초기값
        checking: false,
        downloading: false,
    });

    // Tauri 환경 확인
    const isTauri = typeof window !== 'undefined' && window.__TAURI__;

    // 앱 시작 시 현재 버전 가져오기 및 자동 업데이트 체크 (Tauri 환경에서만)
    useEffect(() => {
        if (isTauri) {
            getCurrentVersion();
            // 버전을 먼저 가져온 후 업데이트 체크
            setTimeout(() => {
                checkForUpdates();
            }, 1000);
        }
    }, [isTauri]);

    const getCurrentVersion = async () => {
        if (!isTauri) return;

        try {
            const { getVersion } = await import('@tauri-apps/api/app');
            const version = await getVersion();
            setUpdateInfo(prev => ({ ...prev, currentVersion: version }));
            console.log('📱 현재 앱 버전:', version);
        } catch (error) {
            console.error('❌ 버전 정보 가져오기 실패:', error);
            setUpdateInfo(prev => ({ ...prev, currentVersion: '0.1.8' })); // fallback
        }
    };

    const checkForUpdates = async () => {
        if (!isTauri) {
            console.log('🌐 웹 브라우저에서는 업데이트 체크를 지원하지 않습니다.');
            return;
        }

        try {
            // 동적 import로 Tauri 플러그인 로드
            const { check } = await import('@tauri-apps/plugin-updater');
            const { ask } = await import('@tauri-apps/plugin-dialog');

            setUpdateInfo(prev => ({ ...prev, checking: true, error: undefined }));
            console.log('🔍 업데이트 체크 시작...');

            const update = await check();

            if (update) {
                console.log('🆕 업데이트 발견:', update.version);
                setUpdateInfo(prev => ({
                    ...prev,
                    available: true,
                    latestVersion: update.version,
                    checking: false,
                }));

                // 사용자에게 업데이트 확인
                const shouldUpdate = await ask(
                    `새 버전 ${update.version}이 있습니다.\n지금 업데이트하시겠습니까?`,
                    {
                        title: 'CTI Task Manager 업데이트',
                        kind: 'info',
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
        if (!isTauri) return;

        try {
            const { relaunch } = await import('@tauri-apps/plugin-process');

            setUpdateInfo(prev => ({ ...prev, downloading: true }));
            console.log('⬇️ 업데이트 다운로드 및 설치 시작...');

            // 업데이트 다운로드 및 설치
            await update.downloadAndInstall();

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
        if (!isTauri) return;

        try {
            const { check } = await import('@tauri-apps/plugin-updater');

            setUpdateInfo(prev => ({ ...prev, checking: true }));
            const update = await check();

            if (update) {
                console.log('🔄 자동 업데이트 시작:', update.version);
                await performUpdate(update);
            } else {
                setUpdateInfo(prev => ({ ...prev, checking: false }));
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

    return {
        updateInfo,
        checkForUpdates,
        performSilentUpdate,
        isTauri, // Tauri 환경 여부도 반환
    };
};