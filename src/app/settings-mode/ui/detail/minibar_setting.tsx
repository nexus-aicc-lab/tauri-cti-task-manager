// C:\tauri\cti-task-manager-tauri\src\app\settings-mode\ui\detail\minibar_setting.tsx

import React, { useState } from 'react';

interface Props {
    // 미니바 설정 관련 props
}

const MinibarSetting: React.FC<Props> = () => {
    const [allStats] = useState([
        '대메뉴',
        'Queue state123',
        'Queue state',
        '서비스레벨',
        '실인입호수',
        '응답호수',
        '포기호수',
        'Etc',
        '그룹최장대기시간'
    ]);

    const [minibarStats, setMinibarStats] = useState([
        '대기',
        '처리',
        '후처리',
        '휴식',
        '서비스레벨',
        '넌서비스호수'
    ]);

    const moveToMinibar = (item: string) => {
        if (minibarStats.length < 10 && !minibarStats.includes(item)) {
            setMinibarStats([...minibarStats, item]);
        }
    };

    const removeFromMinibar = (item: string) => {
        setMinibarStats(minibarStats.filter(stat => stat !== item));
    };

    const moveUp = (index: number) => {
        if (index > 0) {
            const newStats = [...minibarStats];
            [newStats[index], newStats[index - 1]] = [newStats[index - 1], newStats[index]];
            setMinibarStats(newStats);
        }
    };

    const moveDown = (index: number) => {
        if (index < minibarStats.length - 1) {
            const newStats = [...minibarStats];
            [newStats[index], newStats[index + 1]] = [newStats[index + 1], newStats[index]];
            setMinibarStats(newStats);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 전체 통계 항목 */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">전체 통계 항목</h4>
                        <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
                            <div className="space-y-2">
                                {allStats.map((stat, index) => (
                                    <div
                                        key={`all-${index}`}
                                        className="flex items-center justify-between p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer group"
                                        onClick={() => moveToMinibar(stat)}
                                    >
                                        <span className="text-sm text-gray-700">{stat}</span>
                                        <button
                                            className="text-teal-600 hover:text-teal-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveToMinibar(stat);
                                            }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 미니바 구성 통계 */}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">
                            미니바 구성 통계(최대10개)
                        </h4>
                        <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
                            <div className="space-y-2">
                                {minibarStats.map((stat, index) => (
                                    <div
                                        key={`mini-${index}`}
                                        className="flex items-center justify-between p-3 bg-white rounded border group"
                                    >
                                        <span className="text-sm text-gray-700">{stat}</span>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => moveUp(index)}
                                                disabled={index === 0}
                                                className="p-1 text-teal-600 hover:text-teal-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                                                title="위로"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => moveDown(index)}
                                                disabled={index === minibarStats.length - 1}
                                                className="p-1 text-teal-600 hover:text-teal-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                                                title="아래로"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => removeFromMinibar(stat)}
                                                className="p-1 text-teal-600 hover:text-teal-800"
                                                title="제거"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 하단 버튼들 */}
                        <div className="flex justify-end space-x-2 mt-4">
                            <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors">
                                위로
                            </button>
                            <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors">
                                아래로
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MinibarSetting;