import React, { useState } from 'react';

interface Props { }

const CallSettings = () => {
    const [selectedMonitoringQueue, setSelectedMonitoringQueue] = useState('모니터링 중인 큐');
    const [selectedInternalQueue, setSelectedInternalQueue] = useState('내 그룹');
    const [selectedDisplayType, setSelectedDisplayType] = useState('현황통계');
    const [selectedDisplay, setSelectedDisplay] = useState('전체 누적');

    return (
        <div className="p-2 font-['Malgun_Gothic'] text-gray-800 bg-white text-sm">
            {/* Header */}
            <div className="pb-3 border-b border-gray-200 mb-4">
                <h3 className="text-base font-bold">통계 기준 설정</h3>
            </div>

            {/* Form Content */}
            <div className="space-y-4">
                {/* 모니터링 중인 큐 */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 whitespace-nowrap">다음 선택된</span>
                    <select
                        value={selectedMonitoringQueue}
                        onChange={(e) => setSelectedMonitoringQueue(e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        style={{ minWidth: '180px' }}
                    >
                        <option value="모니터링 중인 큐">모니터링 중인 큐</option>
                        <option value="[7001]J7001">[7001]J7001</option>
                        <option value="[7002]J7002">[7002]J7002</option>
                    </select>
                    <span className="text-sm text-gray-700">의 대기중 보기</span>
                </div>

                {/* 내 그룹 */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 whitespace-nowrap">다음 선택된</span>
                    <select
                        value={selectedInternalQueue}
                        onChange={(e) => setSelectedInternalQueue(e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                        style={{ minWidth: '180px' }}
                    >
                        <option value="내 그룹">내 그룹</option>
                        <option value="그룹1">그룹 1</option>
                        <option value="그룹2">그룹 2</option>
                    </select>
                    <span className="text-sm text-gray-700">의 대기중 보기</span>
                </div>

                {/* 통계관리 섹션 */}
                <div className="pt-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">통계관리</h4>

                    {/* 표시 하는 통계 */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-700 whitespace-nowrap">표시 하는 통계</span>
                        <select
                            value={selectedDisplayType}
                            onChange={(e) => setSelectedDisplayType(e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            style={{ minWidth: '140px' }}
                        >
                            <option value="현황통계">현황통계</option>
                            <option value="일별통계">일별통계</option>
                            <option value="월별통계">월별통계</option>
                        </select>
                        <span className="text-sm text-gray-700">형 으로 나타내기</span>
                    </div>

                    {/* 표시되는 상담원 설정 */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 whitespace-nowrap">표시되는 상담원 설정</span>
                        <select
                            value={selectedDisplay}
                            onChange={(e) => setSelectedDisplay(e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            style={{ minWidth: '140px' }}
                        >
                            <option value="전체 누적">전체 누적</option>
                            <option value="개별 상담원">개별 상담원</option>
                            <option value="그룹별">그룹별</option>
                        </select>
                        <span className="text-sm text-gray-700">데이터로 나타내기</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallSettings;
