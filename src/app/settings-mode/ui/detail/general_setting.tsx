// C:\tauri\cti-task-manager-tauri\src\app\settings-mode\ui\detail\general_setting.tsx

import React from 'react';

interface Props {
    // 일반 설정 관련 props
    alwaysOnTop?: boolean;
    onAlwaysOnTopChange?: (value: boolean) => void;
}

const GeneralSetting: React.FC<Props> = ({
    alwaysOnTop = false,
    onAlwaysOnTopChange
}) => {
    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">일반</h3>

                <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                        <input
                            type="checkbox"
                            checked={alwaysOnTop}
                            onChange={(e) => onAlwaysOnTopChange?.(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">항상 위에 보기</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default GeneralSetting;