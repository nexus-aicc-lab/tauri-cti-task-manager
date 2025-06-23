import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { toast, Toaster } from 'sonner';

interface AppSettings {
    startup_mode: string;
    auto_login: boolean;
    theme: string;
}

const SettingsComponent: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>({
        startup_mode: 'launcher',
        auto_login: false,
        theme: 'dark'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const loadedSettings = await invoke<AppSettings>('load_settings');
            setSettings(loadedSettings);
        } catch (error) {
            console.error('❌ 설정 로드 실패:', error);
            toast.error('설정 로드에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const saveSettings = async () => {
        try {
            setIsSaving(true);
            await invoke('save_settings', { settings });
            toast.success('설정이 저장되었습니다! 🎉');
        } catch (error) {
            console.error('❌ 설정 저장 실패:', error);
            toast.error('설정 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const closeWindow = async () => {
        const currentWindow = getCurrentWebviewWindow();
        await currentWindow.close();
    };

    const resetSettings = () => {
        setSettings({ startup_mode: 'launcher', auto_login: false, theme: 'dark' });
        toast.info('설정이 초기화되었습니다. 저장 버튼을 눌러 적용하세요.');
    };

    // 테마별 미리보기 색상
    const themePreview = {
        red: 'bg-gradient-to-br from-red-500 to-pink-600',
        yellow: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        green: 'bg-gradient-to-br from-green-500 to-emerald-600',
        dark: 'bg-gradient-to-br from-gray-800 to-gray-900'
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white rounded-lg shadow-xl p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3"></div>
                    <p className="text-gray-600">설정 로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-gray-100">
            <Toaster
                position="top-center"
                richColors
                closeButton
                duration={2000}
            />

            <div className="h-full flex flex-col">
                {/* 헤더 */}
                <div className="bg-white shadow-sm p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-800 text-center">
                        ⚙️ 환경 설정
                    </h1>
                </div>

                {/* 메인 컨텐츠 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* 시작 모드 설정 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-3">🚀 시작 모드</h3>
                        <div className="space-y-2">
                            {[
                                { value: 'launcher', label: '🏠 런처', desc: '메뉴 선택 화면' },
                                { value: 'bar', label: '📊 바 모드', desc: '작업 표시줄 (1000x40)' },
                                { value: 'panel', label: '📋 패널 모드', desc: '전체 창 (1200x800)' }
                            ].map(option => (
                                <label key={option.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                    <input
                                        type="radio"
                                        name="startup_mode"
                                        value={option.value}
                                        checked={settings.startup_mode === option.value}
                                        onChange={(e) => setSettings(prev => ({ ...prev, startup_mode: e.target.value }))}
                                        className="w-4 h-4 text-orange-600"
                                    />
                                    <div>
                                        <div className="font-medium text-sm">{option.label}</div>
                                        <div className="text-xs text-gray-500">{option.desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 테마 설정 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-3">🎨 로그인 화면 테마</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'red', label: '🔴 빨간 계통', desc: 'Red & Pink' },
                                { value: 'yellow', label: '🟡 노란 계통', desc: 'Yellow & Orange' },
                                { value: 'green', label: '🟢 초록 계통', desc: 'Green & Emerald' },
                                { value: 'dark', label: '⚫ 다크 모드', desc: 'Dark & Purple' }
                            ].map(theme => (
                                <label key={theme.value} className="cursor-pointer">
                                    <div className={`border-2 rounded-lg p-3 transition-all ${settings.theme === theme.value
                                        ? 'border-blue-500 shadow-md'
                                        : 'border-gray-200 hover:border-gray-400'
                                        }`}>
                                        {/* 테마 미리보기 */}
                                        <div className={`h-20 rounded-md mb-2 ${themePreview[theme.value as keyof typeof themePreview]}`}></div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="theme"
                                                value={theme.value}
                                                checked={settings.theme === theme.value}
                                                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                                                className="w-4 h-4"
                                            />
                                            <div>
                                                <div className="font-medium text-sm">{theme.label}</div>
                                                <div className="text-xs text-gray-500">{theme.desc}</div>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 기타 설정 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-3">🔧 기타 설정</h3>

                        <div className="space-y-3">
                            {/* 자동 로그인 */}
                            <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <div>
                                    <div className="font-medium text-sm">🔐 자동 로그인</div>
                                    <div className="text-xs text-gray-500">저장된 인증 정보로 자동 로그인</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.auto_login}
                                    onChange={(e) => setSettings(prev => ({ ...prev, auto_login: e.target.checked }))}
                                    className="w-4 h-4 text-orange-600"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="bg-white border-t p-4">
                    <div className="flex justify-between space-x-2">
                        <button
                            onClick={closeWindow}
                            className="bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-4 rounded"
                        >
                            ✖️ 닫기
                        </button>

                        <div className="flex space-x-2">
                            <button
                                onClick={resetSettings}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded"
                            >
                                🔄 초기화
                            </button>

                            <button
                                onClick={saveSettings}
                                disabled={isSaving}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm py-2 px-4 rounded"
                            >
                                {isSaving ? '💾 저장 중...' : '💾 저장'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsComponent;