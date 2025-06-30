// C:\tauri\cti-task-manager-tauri\src\app\settings-mode\ui\settings_header.tsx

import React from 'react';

interface SettingsHeaderProps {
    title?: string;
    onClose?: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
    title = "환경설정",
    onClose
}) => {
    return (
        <div className="bg-teal-500 text-white p-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold">{title}</h1>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-teal-600"
                    aria-label="닫기"
                >
                    ✖
                </button>
            )}
        </div>
    );
};

export default SettingsHeader;