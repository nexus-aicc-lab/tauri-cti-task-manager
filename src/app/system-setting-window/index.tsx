// C:\tauri\cti-task-manager-tauri\src\app\system-setting-window\index.tsx

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

interface SystemSettingWindowProps {

}

const SystemSettingWindow: React.FC<SystemSettingWindowProps> = (props) => {
    const [selectedCategory, setSelectedCategory] = useState('일반');
    const [settings, setSettings] = useState({
        // 일반 설정
        startupWithWindows: false,
        language: '한국어(KO-KR)',

        // 개인 설정  
        fontSize: 'medium',
        theme: 'system',

        // 통신설정
        serverAddress: '',
        port: '',
        timeout: 30,

        // 통화설정
        recordingPath: '',
        autoRecord: false,

        // 미니맵
        showMinimap: true,
        minimapPosition: 'right',

        // 정보
        version: '1.0.0',
        buildDate: '2024-01-01'
    });

    const categories = [
        { name: '일반', icon: '⚙️' },
        { name: '개인', icon: '👤' },
        { name: '통신설정', icon: '🌐' },
        { name: '통화설정', icon: '📞' },
        { name: '미니맵', icon: '🗺️' },
        { name: '정보', icon: 'ℹ️' }
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
        // TODO: 설정 저장 로직
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
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="startup"
                                checked={settings.startupWithWindows}
                                onChange={(e) => updateSetting('startupWithWindows', e.target.checked)}
                                className="mr-3"
                            />
                            <label htmlFor="startup" className="text-sm">윈도우 시작시 프로그램</label>
                        </div>
                    </div>
                );

            case '개인':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">개인 정보 수정</label>
                            <p className="text-xs text-gray-600 mb-3">
                                - 개인 정보를 통해 프로그램의 동작과 내내가 각 기능에 맞게 동작합니다.
                            </p>
                            <div>
                                <label className="block text-xs mb-1">언어(언어별):</label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => updateSetting('language', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 text-sm"
                                >
                                    <option value="한국어(KO-KR)">한국어(KO-KR)</option>
                                    <option value="English(EN-US)">English(EN-US)</option>
                                </select>
                            </div>
                            <div className="mt-4 text-xs text-gray-600">
                                <p>개인 정보를 통해 프로그램 설정과 각종 자료를 개별적으로 저장하여 관리됩니다.</p>
                                <p>개인 정보가 저장될 때는 자동으로 고객과 공유하는 내용이 저장하여 주의가 지원됩니다.</p>
                                <p>등록한 정보가 있을 때 일반 비즈카드가 기반 정보를 통합하여 노출됩니다.</p>
                                <p>각 정보가 자동으로 등록시 그룹의 설팅 설정이 로그 로컬됩니다.</p>
                            </div>
                        </div>
                    </div>
                );

            case '통신설정':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">서버 설정</label>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs mb-1">서버 주소:</label>
                                    <input
                                        type="text"
                                        value={settings.serverAddress}
                                        onChange={(e) => updateSetting('serverAddress', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 text-sm"
                                        placeholder="서버 주소를 입력하세요"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">포트:</label>
                                    <input
                                        type="text"
                                        value={settings.port}
                                        onChange={(e) => updateSetting('port', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 text-sm"
                                        placeholder="포트 번호"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">타임아웃 (초):</label>
                                    <input
                                        type="number"
                                        value={settings.timeout}
                                        onChange={(e) => updateSetting('timeout', parseInt(e.target.value))}
                                        className="w-full px-2 py-1 border border-gray-300 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case '통화설정':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">녹음 설정</label>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs mb-1">녹음 저장 경로:</label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={settings.recordingPath}
                                            onChange={(e) => updateSetting('recordingPath', e.target.value)}
                                            className="flex-1 px-2 py-1 border border-gray-300 text-sm"
                                            placeholder="경로를 선택하세요"
                                        />
                                        <button className="ml-2 px-3 py-1 border border-gray-300 text-sm">찾아보기</button>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="autoRecord"
                                        checked={settings.autoRecord}
                                        onChange={(e) => updateSetting('autoRecord', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="autoRecord" className="text-xs">자동 녹음</label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case '미니맵':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">미니맵 설정</label>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showMinimap"
                                        checked={settings.showMinimap}
                                        onChange={(e) => updateSetting('showMinimap', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="showMinimap" className="text-xs">미니맵 표시</label>
                                </div>
                                <div>
                                    <label className="block text-xs mb-1">위치:</label>
                                    <select
                                        value={settings.minimapPosition}
                                        onChange={(e) => updateSetting('minimapPosition', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 text-sm"
                                        disabled={!settings.showMinimap}
                                    >
                                        <option value="left">왼쪽</option>
                                        <option value="right">오른쪽</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case '정보':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">프로그램 정보</label>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">버전:</span> {settings.version}
                                </div>
                                <div>
                                    <span className="font-medium">빌드 날짜:</span> {settings.buildDate}
                                </div>
                                <div>
                                    <span className="font-medium">제작자:</span> CTI Task Manager Team
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100" style={{ fontFamily: 'Malgun Gothic, sans-serif' }}>
            {/* 타이틀바 */}
            <div className="bg-blue-500 text-white px-3 py-1 flex items-center justify-between text-sm">
                <span>환경설정</span>
                <button
                    onClick={handleClose}
                    className="text-white hover:bg-blue-600 px-2 py-1 text-xs"
                >
                    ×
                </button>
            </div>

            <div className="flex flex-1">
                {/* 왼쪽 카테고리 목록 */}
                <div className="w-32 bg-white border-r border-gray-300">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`flex items-center px-3 py-2 cursor-pointer text-sm border-b border-gray-200 ${selectedCategory === category.name
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'hover:bg-gray-50'
                                }`}
                        >
                            <span className="mr-2 text-base">{category.icon}</span>
                            <span>{category.name}</span>
                        </div>
                    ))}
                </div>

                {/* 오른쪽 설정 내용 */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-4 bg-gray-50">
                        <h3 className="text-lg font-medium mb-4">{selectedCategory}</h3>
                        {renderContent()}
                    </div>

                    {/* 하단 버튼 */}
                    <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 flex justify-end space-x-2">
                        <button
                            onClick={handleOK}
                            className="px-6 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50"
                        >
                            확인
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-1 bg-white border border-gray-300 text-sm hover:bg-gray-50"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettingWindow;