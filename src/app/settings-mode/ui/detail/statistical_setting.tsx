// C:\tauri\cti-task-manager-tauri\src\app\settings-mode\ui\detail\statistical_setting.tsx

import React, { useState } from 'react';

interface Props {
    // 통계학적 설정 관련 props
}

const StatisticalSetting: React.FC<Props> = () => {
    const [refreshInterval, setRefreshInterval] = useState('5');
    const [dataRetention, setDataRetention] = useState('30');
    const [reportFormat, setReportFormat] = useState('excel');
    const [enableCache, setEnableCache] = useState(true);
    const [enableCompression, setEnableCompression] = useState(false);
    const [autoCleanup, setAutoCleanup] = useState(true);

    return (
        <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">통계학적</h3>

                <div className="space-y-6">
                    {/* 데이터 갱신 주기 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            📊 데이터 갱신 주기
                        </label>
                        <select
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="1">1초</option>
                            <option value="3">3초</option>
                            <option value="5">5초</option>
                            <option value="10">10초</option>
                            <option value="30">30초</option>
                            <option value="60">1분</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            실시간 데이터 갱신 빈도를 설정합니다.
                        </p>
                    </div>

                    {/* 데이터 보관 기간 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            🗃️ 데이터 보관 기간
                        </label>
                        <select
                            value={dataRetention}
                            onChange={(e) => setDataRetention(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="7">7일</option>
                            <option value="14">14일</option>
                            <option value="30">30일</option>
                            <option value="90">90일</option>
                            <option value="365">1년</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            통계 데이터를 보관할 기간을 설정합니다.
                        </p>
                    </div>

                    {/* 리포트 형식 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            📄 리포트 출력 형식
                        </label>
                        <select
                            value={reportFormat}
                            onChange={(e) => setReportFormat(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="excel">Excel 파일 (.xlsx)</option>
                            <option value="csv">CSV 파일 (.csv)</option>
                            <option value="pdf">PDF 파일 (.pdf)</option>
                            <option value="html">HTML 파일 (.html)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            통계 리포트를 내보낼 때 사용할 파일 형식입니다.
                        </p>
                    </div>

                    {/* 성능 최적화 */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium text-gray-800 mb-4">⚡ 성능 최적화</h4>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enableCache}
                                    onChange={(e) => setEnableCache(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">메모리 캐시 사용</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enableCompression}
                                    onChange={(e) => setEnableCompression(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">압축 저장</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoCleanup}
                                    onChange={(e) => setAutoCleanup(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">자동 정리</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticalSetting;