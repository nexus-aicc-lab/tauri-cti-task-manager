// C:\tauri\cti-task-manager-tauri\src\app\settings-mode\ui\detail\stats_setting.tsx

import React, { useState } from 'react';

interface Props {
    // 통계보기 설정 관련 props
}

const StatsSetting: React.FC<Props> = () => {
    const [nextSelected, setNextSelected] = useState('모니터링 중인 큐');
    const [nextMyGroup, setNextMyGroup] = useState('내 그룹');
    const [displayStats, setDisplayStats] = useState('변환통계');
    const [agentStats, setAgentStats] = useState('전체 누적');

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">통계 기존 설정</h3>

                <div className="space-y-6">
                    {/* 대기호 보기 설정 */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-700 min-w-[80px]">다음 선택된</span>
                            <select
                                value={nextSelected}
                                onChange={(e) => setNextSelected(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="모니터링 중인 큐">모니터링 중인 큐</option>
                                <option value="전체 큐">전체 큐</option>
                                <option value="특정 큐">특정 큐</option>
                            </select>
                            <span className="text-sm text-gray-700">의 대기호 보기</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-700 min-w-[80px]">다음 선택된</span>
                            <select
                                value={nextMyGroup}
                                onChange={(e) => setNextMyGroup(e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="내 그룹">내 그룹</option>
                                <option value="전체 그룹">전체 그룹</option>
                                <option value="특정 그룹">특정 그룹</option>
                            </select>
                            <span className="text-sm text-gray-700">의 대기호 보기</span>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* 통계관리 */}
                    <div>
                        <h4 className="font-medium text-gray-800 mb-4">통계관리</h4>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-700 min-w-[120px]">표시 되는 통계</span>
                                <select
                                    value={displayStats}
                                    onChange={(e) => setDisplayStats(e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="변환통계">변환통계</option>
                                    <option value="실시간통계">실시간통계</option>
                                    <option value="일일통계">일일통계</option>
                                </select>
                                <span className="text-sm text-gray-700">형 으로 나타내기</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-700 min-w-[120px]">표시되는 상담원 실적</span>
                                <select
                                    value={agentStats}
                                    onChange={(e) => setAgentStats(e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="전체 누적">전체 누적</option>
                                    <option value="일일 누적">일일 누적</option>
                                    <option value="시간별 누적">시간별 누적</option>
                                </select>
                                <span className="text-sm text-gray-700">데이터로 나타내기</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsSetting;