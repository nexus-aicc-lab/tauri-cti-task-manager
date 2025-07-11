import React from 'react';

interface Props {
    // 큐 통계범위 설정 관련 props
}

const QueueStatsSetting: React.FC<Props> = () => {
    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">큐 통계범위</h3>
                <p className="text-gray-600">큐 통계범위 설정 내용이 여기에 표시됩니다.</p>
            </div>
        </div>
    );
};

export default QueueStatsSetting;
