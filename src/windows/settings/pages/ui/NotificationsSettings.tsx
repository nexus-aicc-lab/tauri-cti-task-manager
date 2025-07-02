// src/windows/settings/pages/ui/NotificationsSettings.tsx
import React from 'react';

const NotificationsSettings: React.FC = () => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-medium mb-4">알림 설정</h2>
            <div className="space-y-4">
                <div>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">데스크톱 알림 사용</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">소리 알림 사용</span>
                    </label>
                </div>
                <div>
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">팝업 알림 사용</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default NotificationsSettings;