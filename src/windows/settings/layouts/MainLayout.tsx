// src/windows/settings/layouts/MainLayout.tsx
import React, { useEffect } from 'react';
import { Outlet, useRouter, useLocation } from '@tanstack/react-router';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

import CustomTitlebar from '../components/CustomTitlebar';
import SideMenuForEnvironmentSettingWindow from '../components/SideMenuForEnvironmentSettingWindow';
import BackButton from '../components/BackButton';

interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

const MainLayout: React.FC = () => {
    const router = useRouter();
    const location = useLocation();

    // URL 경로에서 현재 카테고리 추출
    const getCurrentCategory = () => {
        const path = location.pathname;
        const categoryMap: { [key: string]: string } = {
            '/settings/general': '일반',
            '/settings/personal': '개인',
            '/settings/communication': '큐 통계범위',
            '/settings/statistics-view': '통계보기',
            '/settings/statistics-items': '통계항목',
            '/settings/minimap': '미니바',
            '/settings/notifications': '알림',
        };
        return categoryMap[path] || '일반';
    };

    const [settings, setSettings] = React.useState({
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
        const routeMap: { [key: string]: string } = {
            '일반': '/settings/general',
            '개인': '/settings/personal',
            '큐 통계범위': '/settings/communication',
            '통계보기': '/settings/statistics-view',
            '통계항목': '/settings/statistics-items',
            '미니바': '/settings/minimap',
            '알림': '/settings/notifications',
        };

        const targetRoute = routeMap[categoryName];
        if (targetRoute) {
            await router.navigate({ to: targetRoute });

            // 알림 카테고리일 때 윈도우 크기 조정
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
            }
        }
    };

    const handleBack = () => {
        router.history.back();
    };

    // 현재 경로가 기본 설정 경로가 아닐 때만 뒤로 가기 버튼 표시
    const showBackButton = location.pathname !== '/settings/general';

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
            <div className="flex flex-1 pl-3 pr-2 pt-3 pb-2">
                {/* 컨텐츠 컨테이너 - 흰색 배경과 테두리 */}
                <div
                    className="flex flex-1"
                    style={{
                        backgroundColor: '#FFFFFF',
                        overflow: 'hidden'
                    }}
                >
                    <SideMenuForEnvironmentSettingWindow
                        selectedCategory={getCurrentCategory()}
                        onCategoryChange={handleCategoryChange}
                    />
                    <div className="flex-1 flex flex-col">
                        {/* 뒤로 가기 버튼과 콘텐츠 영역 */}
                        <div className="flex-1 flex flex-col">
                            {showBackButton && (
                                <div className="px-3 py-2 border-b border-gray-200">
                                    <BackButton onBack={handleBack} />
                                </div>
                            )}
                            <div className="flex-1 px-3 overflow-auto" style={{ position: 'relative' }}>
                                {/* React Router의 Outlet 대신 TanStack Router의 Outlet 사용 */}
                                <Outlet />
                            </div>
                        </div>

                        {/* 푸터 */}
                        <div
                            className="flex justify-end space-x-2 p-3"
                            style={{
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

export default MainLayout;