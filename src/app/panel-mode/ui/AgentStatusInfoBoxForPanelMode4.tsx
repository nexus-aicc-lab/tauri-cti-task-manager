import React from 'react';

const AgentStatusInfoBoxForPanelMode4 = () => {
    const transferStats: [string, number][] = [
        ['그룹호전환 (인입)', 5],
        ['그룹호전환 (응답)', 5],
        ['그룹호전환 (분배)', 5],
        ['그룹호전환 (턴서비스)', 5],
        ['그룹호전환 (실패)', 5],
        ['그룹호전환 (규전환)', 5],
    ];

    return (
        <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">그룹호 전환 통계</h2>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                {transferStats.map(([label, value], idx) => (
                    <div
                        key={idx}
                        className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md border border-gray-200"
                    >
                        <span>{label}</span>
                        <span className="font-semibold">{value}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between text-sm">
                <span className="font-medium text-gray-700">LogOn : 44:42:17</span>
                <span className="text-green-600 font-bold">● 온라인</span>
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode4;
