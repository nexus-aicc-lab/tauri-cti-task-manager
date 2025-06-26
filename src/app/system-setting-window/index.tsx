// src/app/system-setting-window/index.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

// Extend CSS properties to include webkit-app-region
interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

interface SystemSettingWindowProps { }

const SystemSettingWindow: React.FC<SystemSettingWindowProps> = () => {
    const [selectedCategory, setSelectedCategory] = useState('일반');
    const [settings, setSettings] = useState({
        startupWithWindows: false,
        language: '한국어(KO-KR)',
        fontSize: 'medium',
        theme: 'system',
        serverAddress: '',
        port: '',
        timeout: 30,
        recordingPath: '',
        autoRecord: false,
        showMinimap: true,
        minimapPosition: 'right',
        version: '1.0.0',
        buildDate: '2024-01-01',
    });

    const categories = [
        { name: '일반', icon: '⚙️' },
        { name: '개인', icon: '👤' },
        { name: '통신설정', icon: '🌐' },
        { name: '통화설정', icon: '📞' },
        { name: '미니맵', icon: '🗺️' },
        { name: '정보', icon: 'ℹ️' },
    ];

    const handleClose = async () => {
        try {
            await getCurrentWebviewWindow().close();
        } catch (error) {
            console.error('❌ 창 닫기 실패:', error);
        }
    };

    const handleOK = () => {
        console.log('💾 설정 저장:', settings);
        handleClose();
    };

    const handleCancel = () => {
        console.log('❌ 설정 취소');
        handleClose();
    };

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const renderContent = () => {
        switch (selectedCategory) {
            case '일반':
                return (
                    <div className="space-y-4" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="startup"
                                checked={settings.startupWithWindows}
                                onChange={e => updateSetting('startupWithWindows', e.target.checked)}
                                className="mr-3"
                                style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                            />
                            <label htmlFor="startup" className="text-sm" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                                윈도우 시작시 프로그램
                            </label>
                        </div>
                    </div>
                );

            case '개인':
                return (
                    <div className="space-y-4" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                        <label className="block text-sm font-medium mb-2" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                            개인 정보 수정
                        </label>
                        <select
                            value={settings.language}
                            onChange={e => updateSetting('language', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 text-sm"
                            style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                        >
                            <option value="한국어(KO-KR)">한국어(KO-KR)</option>
                            <option value="English(EN-US)">English(EN-US)</option>
                        </select>
                    </div>
                );

            // 생략: 나머지 카테고리도 동일하게 WebkitAppRegion 스타일 적용
            default:
                return null;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100" style={{ fontFamily: 'Malgun Gothic, sans-serif', WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
            {/* 타이틀바 */}
            <div
                className="bg-blue-500 text-white px-3 py-1 flex items-center justify-between text-sm"
                style={{ WebkitAppRegion: 'drag' } as ExtendedCSSProperties}
            >
                <span>환경설정</span>
                <button
                    onClick={handleClose}
                    className="text-white hover:bg-blue-600 px-2 py-1 text-xs"
                    style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                >
                    ×
                </button>
            </div>

            <div className="flex flex-1">
                {/* 왼쪽 카테고리 */}
                <div className="w-32 bg-white border-r border-gray-300" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                    {categories.map(cat => (
                        <div
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`flex items-center px-3 py-2 cursor-pointer text-sm border-b border-gray-200 ${selectedCategory === cat.name ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'}`}
                            style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
                        >
                            <span className="mr-2 text-base">{cat.icon}</span>
                            <span>{cat.name}</span>
                        </div>
                    ))}
                </div>

                {/* 설정 내용 */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-4 bg-gray-50 overflow-auto" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                        <h3 className="text-lg font-medium mb-4">{selectedCategory}</h3>
                        {renderContent()}
                    </div>
                    <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 flex justify-end space-x-2" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                        <button onClick={handleOK} className="px-6 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                            확인
                        </button>
                        <button onClick={handleCancel} className="px-6 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettingWindow;
