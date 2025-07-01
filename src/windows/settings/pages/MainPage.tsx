'use client';

import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

import GeneralSettings from '@/windows/settings/pages/ui/GeneralSettings';
import PersonalSettings from '@/windows/settings/pages/ui/PersonalSettings';
import CommunicationSettings from '@/windows/settings/pages/ui/CommunicationSettings';
import CallSettings from '@/windows/settings/pages/ui/CallSettings';
import MinimapSettings from '@/windows/settings/pages/ui/MinimapSettings';
import InfoSettings from '@/windows/settings/pages/ui/StatisticsItemsSettings';
import PanelModeSetting from '@/windows/settings/pages/ui/PanelModeSetting';
import CustomTitlebar from '../components/CustomTitlebar';
import SideMenuForEnvironmentSettingWindow from '../components/SideMenuForEnvironmentSettingWindow';
import StatisticsItemsSettings from '@/windows/settings/pages/ui/StatisticsItemsSettings';

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
        if (categoryName === '알림') {
            try {
                await invoke('apply_window_size', {
                    width: -3,
                    height: -3,
                    windowType: 'settings',
                });
                console.log('✅ 알림 화면 - 윈도우 최대화 완료');
            } catch (error) {
                console.error('❌ 윈도우 최대화 실패:', error);
            }
        } else {
            try {
                // You might want to define a default size or logic to revert the window size
                // when switching away from '알림' category. For now, leaving it as is.
                // For example, to set a fixed size for other categories:
                // await invoke('apply_window_size', {
                //     width: 800,
                //     height: 600,
                //     windowType: 'settings',
                // });
            } catch (error) {
                console.error('❌ 윈도우 크기 변경 실패:', error);
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
            case '통계항목': return <StatisticsItemsSettings />;
            case '미니바': return <MinimapSettings />;
            // case '알림': return <PanelModeSetting />;
            case '알림': return <div>알림 페이지</div>;
            default: return null;
        }
    };

    return (
        <div
            className="h-screen flex flex-col"
            style={{
                fontFamily: 'Malgun Gothic, sans-serif',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                overflow: 'hidden'
            } as ExtendedCSSProperties}
        >
            <CustomTitlebar title="환경설정" />

            {/* 메인 컨텐츠 영역에 패딩 추가 */}
            <div className="flex flex-1 pl-3 pr-2 pt-3 pb-2" >
                {/* 컨텐츠 컨테이너 - 흰색 배경과 테두리 */}
                <div
                    className="flex flex-1"
                    style={{
                        backgroundColor: '#FFFFFF',
                        // borderRadius: '8px',
                        // border: '1px solid #E5E5E5',
                        overflow: 'hidden'
                    }}
                >
                    <SideMenuForEnvironmentSettingWindow
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 px-3 overflow-auto" style={{ position: 'relative' }}>
                            {/* 컨텐츠 영역 크기 정보 */}

                            {renderContent()}
                        </div>
                        {/* 푸터 */}
                        <div
                            className="flex justify-end space-x-2"
                            style={{
                                // Removed borderTop to make the footer border cleaner
                                borderBottomRightRadius: '8px'
                            }}
                        >
                            <button
                                onClick={handleOK}
                                className="px-6 py-1 bg-teal-600 text-white text-sm hover:bg-teal-700"
                                style={{ borderRadius: '4px' }}
                            >
                                확인
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50"
                                style={{ borderRadius: '4px' }}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;