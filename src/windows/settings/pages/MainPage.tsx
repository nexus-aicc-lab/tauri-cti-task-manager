// C:\tauri\cti-task-manager-tauri\src\windows\settings\pages\MainPage.tsx
'use client';

import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

import GeneralSettings from '@/windows/settings/pages/ui/GeneralSettings';
import PersonalSettings from '@/windows/settings/pages/ui/PersonalSettings';
import CommunicationSettings from '@/windows/settings/pages/ui/CommunicationSettings';
import CallSettings from '@/windows/settings/pages/ui/CallSettings';
import MinimapSettings from '@/windows/settings/pages/ui/MinimapSettings';
import InfoSettings from '@/windows/settings/pages/ui/InfoSettings';
import PanelModeSetting from '@/windows/settings/pages/ui/PanelModeSetting';
import CustomTitlebar from '../components/CustomTitlebar';

interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

const MainPage: React.FC = () => {
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
        panelMode: 'floating',
        panelSize: 'medium',
        panelTransparency: 100,
        panelFullscreen: false,
        panelMaximized: false,
        panelWidth: 900,
        panelHeight: 350,
    });

    const categories = [
        { name: '일반', iconPath: '/icons/environment_setting/settings_on_gear.svg' },
        { name: '개인', iconPath: '/icons/environment_setting/profile_on_avatar.svg' },
        { name: '큐 통계범위', iconPath: '/icons/environment_setting/statistics_lange_on.svg' },
        { name: '통계보기', iconPath: '/icons/environment_setting/statistics_view_on.svg' },
        { name: '통계항목', iconPath: '/icons/environment_setting/statistics_list_on.svg' },
        { name: '미니바', iconPath: '/icons/environment_setting/minibar_on_panel.svg' },
        { name: '알림', iconPath: '/icons/environment_setting/notifications_on_bell.svg' },
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
        console.log(`🔧 설정 업데이트: ${key} = ${value}`);
    };

    const handleCategoryChange = async (categoryName: string) => {
        setSelectedCategory(categoryName);
        if (categoryName === '패널설정') {
            try {
                await invoke('apply_window_size', {
                    width: -3,
                    height: -3,
                    windowType: 'settings',
                });
                console.log('✅ 패널설정 화면 - 윈도우 최대화 완료');
            } catch (error) {
                console.error('❌ 윈도우 최대화 실패:', error);
            }
        }
    };

    const renderContent = () => {
        const componentProps = { settings, updateSetting };
        switch (selectedCategory) {
            case '일반': return <GeneralSettings />;
            case '개인': return <PersonalSettings />;
            case '큐 통계범위': return <CommunicationSettings />;
            case '통계보기': return <CallSettings />;
            case '통계항목': return <InfoSettings />;
            case '미니바': return <MinimapSettings />;
            case '알림': return <PanelModeSetting />;
            default: return null;
        }
    };

    return (
        <div
            className="h-screen flex flex-col"
            style={{ fontFamily: 'Malgun Gothic, sans-serif', backgroundColor: '#f1fafa', borderRadius: '8px', overflow: 'hidden' } as ExtendedCSSProperties}
        >
            <CustomTitlebar title="환경설정" />
            <div className="flex flex-1">
                <div className="w-36 border-r" style={{ backgroundColor: '#F1FBFC' }}>
                    {categories.map(cat => (
                        <div
                            key={cat.name}
                            onClick={() => handleCategoryChange(cat.name)}
                            className="flex items-center px-3 py-2 cursor-pointer text-sm border-b"
                            style={{
                                backgroundColor: selectedCategory === cat.name ? '#D0F0F2' : 'transparent',
                                color: selectedCategory === cat.name ? '#00A1A7' : '#333',
                                fontWeight: selectedCategory === cat.name ? '600' : 'normal',
                            }}
                        >
                            <img src={cat.iconPath} alt={cat.name} className="w-5 h-5 mr-2" />
                            <span>{cat.name}</span>
                        </div>
                    ))}
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-4 overflow-auto bg-white">
                        {renderContent()}
                    </div>
                    <div className="px-4 py-3 border-t flex justify-end space-x-2" style={{ backgroundColor: '#DFF2F4' }}>
                        <button onClick={handleOK} className="px-6 py-1 bg-teal-600 text-white text-sm hover:bg-teal-700">
                            확인
                        </button>
                        <button onClick={handleCancel} className="px-6 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50">
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
