import React from 'react';

const AgentStatusInfoBoxForPanelMode3 = () => {
    const metrics = [
        { label: '서비스레벨', value: 58 },
        { label: '응답률', value: 58 },
        { label: '실인입호수', value: 58 },
        { label: '응답호수', value: 50 },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">성과 지표</h2>
            <div className="space-y-3">
                {metrics.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col gap-1 bg-gray-50 p-3 rounded-lg border border-gray-200"
                    >
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${item.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode3;
