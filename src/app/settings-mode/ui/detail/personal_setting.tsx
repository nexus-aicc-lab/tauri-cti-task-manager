// C:\tauri\cti-task-manager-tauri\src\app\settings-mode\ui\detail\personal_setting.tsx

import React, { useState } from 'react';

interface Props {
    // 개인 설정 관련 props
}

const PersonalSetting: React.FC<Props> = () => {
    const [selectedFormat, setSelectedFormat] = useState('이름(아이디) - DN');

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">개인 정보 설정</h3>

                <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                        개인 정보 형식을 수정하여 화면에 나타날 수 있습니다
                    </p>

                    <div className="space-y-3">
                        <select
                            value={selectedFormat}
                            onChange={(e) => setSelectedFormat(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="이름(아이디) - DN">이름(아이디) - DN</option>
                            <option value="아이디만">아이디만</option>
                            <option value="이름만">이름만</option>
                            <option value="사용자 정의">사용자 정의</option>
                        </select>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>※ cf 큐에 영향을 받는 통계</strong>
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>- 개인 정보 형식은 한줄에 최대 25자까지 표시됩니다</li>
                            <li>- 총 글자수가 25글자를 넘어갈 경우 첫번째 줄에는 상담원 이름이</li>
                            <li className="ml-4">두번째 줄에는 설정된 나머지 개인 정보들이 표시됩니다.</li>
                            <li>- 각 줄당 25글자를 넘어갈 경우 말줄임 표시로 표현됩니다</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalSetting;