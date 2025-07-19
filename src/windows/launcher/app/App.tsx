import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getVersion } from '@tauri-apps/api/app';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import { confirm } from '@tauri-apps/api/dialog';
import { relaunch } from '@tauri-apps/api/process';

import MainPage from '../pages/MainPage';

const App: React.FC = () => {
    const [appVersion, setAppVersion] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showVersion, setShowVersion] = useState(false);
    const [updateStatus, setUpdateStatus] = useState({
        checking: false,
        available: false,
        downloading: false,
        latestVersion: undefined as string | undefined,
        error: undefined as string | undefined,
    });

    useEffect(() => {
        getVersion()
            .then(version => setAppVersion(version))
            .catch(() => setAppVersion('0.0.0'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (!isLoading && appVersion) {
            const timer = setTimeout(() => {
                checkForUpdates(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, appVersion]);

    const checkForUpdates = async (isAutoCheck = false) => {
        try {
            setUpdateStatus(prev => ({ ...prev, checking: true, error: undefined }));
            const { shouldUpdate, manifest } = await checkUpdate();

            if (shouldUpdate) {
                setUpdateStatus(prev => ({
                    ...prev,
                    available: true,
                    latestVersion: manifest?.version,
                    checking: false,
                }));

                if (!isAutoCheck) {
                    await promptUpdate(manifest?.version);
                } else {
                    toast.info(`새 버전 ${manifest?.version}이 사용 가능합니다!`, {
                        onClick: () => promptUpdate(manifest?.version),
                        autoClose: false,
                    });
                }
            } else {
                setUpdateStatus(prev => ({ ...prev, available: false, checking: false }));
                if (!isAutoCheck) toast.success('현재 최신 버전을 사용중입니다!');
            }
        } catch (error: any) {
            setUpdateStatus(prev => ({ ...prev, checking: false, error: error.message || '업데이트 확인 실패' }));
            if (!isAutoCheck) toast.error('업데이트 확인에 실패했습니다.');
        }
    };

    const promptUpdate = async (version: string | undefined) => {
        const shouldUpdate = await confirm(`새 버전 ${version}이 사용 가능합니다.\n지금 업데이트하시겠습니까?`, {
            title: '업데이트 확인',
            okLabel: '업데이트',
            cancelLabel: '나중에',
        });
        if (shouldUpdate) await performUpdate();
    };

    const performUpdate = async () => {
        try {
            setUpdateStatus(prev => ({ ...prev, downloading: true }));
            toast.info('업데이트 다운로드 중...', { autoClose: false });
            await installUpdate();
            toast.success('업데이트 완료! 앱을 재시작합니다.');
            setTimeout(() => relaunch(), 2000);
        } catch (error: any) {
            toast.error('업데이트에 실패했습니다.');
            setUpdateStatus(prev => ({ ...prev, downloading: false, error: error.message }));
        }
    };

    return (
        <div
            style={{
                backgroundColor: '#f3f4f6',
                minHeight: '100vh',
                width: '100%',
                position: 'relative',
            }}
        >
            <button
                onClick={() => setShowVersion(!showVersion)}
                style={{
                    position: 'fixed',
                    bottom: '15px',
                    right: '15px',
                    backgroundColor: '#000',
                    color: '#00ff00',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    zIndex: 1000,
                }}
            >
                {isLoading ? '⏳' : '🔧'} {isLoading ? 'Loading...' : `v${appVersion}`}
            </button>

            {showVersion && !isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '60px',
                        right: '15px',
                        backgroundColor: '#fff',
                        padding: '15px 20px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        zIndex: 1001,
                    }}
                >
                    <h4>CTI Task Manager</h4>
                    <button
                        onClick={() => checkForUpdates(false)}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                        }}
                    >
                        지금 업데이트
                    </button>
                </div>
            )}

            <MainPage />
            <ToastContainer position="top-center" autoClose={3000} closeOnClick pauseOnHover theme="light" />
        </div>
    );
};

export default App;
