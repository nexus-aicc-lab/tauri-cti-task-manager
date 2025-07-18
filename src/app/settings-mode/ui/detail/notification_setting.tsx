// C:\tauri\cti-task-manager-tauri\src\app\settings-mode\ui\detail\notification_setting.tsx

import React, { useState } from 'react';

interface Props {
    // 알림 설정 관련 props
}

const NotificationSetting: React.FC<Props> = () => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [popupEnabled, setPopupEnabled] = useState(false);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [queueTimeout, setQueueTimeout] = useState(true);
    const [serviceLevelDrop, setServiceLevelDrop] = useState(true);
    const [agentShortage, setAgentShortage] = useState(false);
    const [systemAlert, setSystemAlert] = useState(true);

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">알림</h3>

                <div className="space-y-6">
                    {/* 알림 방식 */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-4">🔔 알림 방식</h4>
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <div className="font-medium text-sm">🔊 사운드 알림</div>
                                        <div className="text-xs text-gray-500">시스템 이벤트 시 사운드 재생</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={soundEnabled}
                                        onChange={(e) => setSoundEnabled(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            <div className="border rounded-lg p-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <div className="font-medium text-sm">💬 팝업 알림</div>
                                        <div className="text-xs text-gray-500">중요한 이벤트 시 팝업 표시</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={popupEnabled}
                                        onChange={(e) => setPopupEnabled(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </label>
                            </div>

                            <div className="border rounded-lg p-4">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <div className="font-medium text-sm">📧 이메일 알림</div>
                                        <div className="text-xs text-gray-500">설정된 이메일로 알림 발송</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={emailEnabled}
                                        onChange={(e) => setEmailEnabled(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 알림 조건 */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-4">⚠️ 알림 조건</h4>
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={queueTimeout}
                                    onChange={(e) => setQueueTimeout(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">큐 대기시간 초과</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={serviceLevelDrop}
                                    onChange={(e) => setServiceLevelDrop(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">서비스 레벨 하락</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agentShortage}
                                    onChange={(e) => setAgentShortage(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">상담원 부족</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={systemAlert}
                                    onChange={(e) => setSystemAlert(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">시스템 오류</span>
                            </label>
                        </div>
                    </div>

                    {/* 임계값 설정 */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-4">📏 임계값 설정</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    대기시간 임계값 (초)
                                </label>
                                <input
                                    type="number"
                                    defaultValue="300"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    서비스 레벨 임계값 (%)
                                </label>
                                <input
                                    type="number"
                                    defaultValue="80"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSetting;