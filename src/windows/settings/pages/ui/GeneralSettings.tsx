import React from 'react';

const GeneralSettings = () => {
    return (
        <div className="text-sm text-gray-700">
            <label className="inline-flex items-center space-x-2">
                <input type="checkbox" className="accent-[#55BDC7]" />
                <span>항상 위에 보기</span>
            </label>
        </div>
    );
};

export default GeneralSettings;