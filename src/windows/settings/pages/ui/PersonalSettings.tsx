import React from 'react';

const PersonalSettings: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">개인 정보 설정</h2>
            <p className="text-sm text-gray-600 mb-4">
                개인 정보 형식을 수정하면 화면에 나타날 수 있습니다
            </p>

            <div className="flex items-center mb-4">
                {/* <span className="text-sm text-gray-700 mr-2">이름(아이디) - DN</span> */}
                <select
                    className="border border-gray-300 rounded px-2 py-0 text-sm bg-white"
                // You might want to manage the selected value with state
                // value={selectedValue} onChange={handleChange}
                >
                    <option value="DN">이름(아이디) - DN</option>
                </select>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
                <p>- 개인 정보 형식은 한줄에 최대 25자까지 표시됩니다</p>
                <p>- 총 글자수가 25글자를 넘어갈 경우 첫번째 줄에는 상담원 이름이</p>
                <p>두번째 줄에는 설정된 나머지 개인 정보들이 표시됩니다.</p>
                <p>- 각 줄당 25글자를 넘어갈 경우 말줄임 표시로 표현됩니다</p>
            </div>
        </div>
    );
};

export default PersonalSettings;