import React, { useEffect, useState } from 'react';

interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

interface PanelConfig {
    // 영역 활성화 상태
    region1Enabled: boolean; // 상단 3개 박스 영역
    region2Enabled: boolean; // 하단 정보 영역
    region3Enabled: boolean; // 로그온 정보 영역

    // 각 영역별 높이
    region1Height: number;
    region2Height: number;
    region3Height: number;

    // 전체 크기 설정
    totalWidth: number;
    totalHeight: number;
    padding: number;
    spacing: number;
}

const ThreeRegionPanelSettings: React.FC = () => {
    const [config, setConfig] = useState<PanelConfig>({
        region1Enabled: true,
        region2Enabled: true,
        region3Enabled: true,
        region1Height: 150,
        region2Height: 40,
        region3Height: 25,
        totalWidth: 1000,
        totalHeight: 0,
        padding: 15, // 기본값으로 유지 (표시용)
        spacing: 8,  // 기본값으로 유지 (표시용)
    });

    // 자동 높이 계산
    useEffect(() => {
        let calculatedHeight = 30; // 기본 패딩 (고정)
        let activeRegions = 0;

        if (config.region1Enabled) { calculatedHeight += config.region1Height; activeRegions++; }
        if (config.region2Enabled) { calculatedHeight += config.region2Height; activeRegions++; }
        if (config.region3Enabled) { calculatedHeight += config.region3Height; activeRegions++; }

        // 영역간 간격 추가 (고정값)
        if (activeRegions > 1) {
            calculatedHeight += 10 * (activeRegions - 1);
        }

        setConfig(prev => ({ ...prev, totalHeight: calculatedHeight }));
    }, [config.region1Enabled, config.region2Enabled, config.region3Enabled,
    config.region1Height, config.region2Height, config.region3Height]);

    // 영역 토글
    const toggleRegion = (regionKey: keyof PanelConfig) => {
        setConfig(prev => ({ ...prev, [regionKey]: !prev[regionKey] }));
    };

    // 높이 변경
    const updateHeight = (regionKey: keyof PanelConfig, value: number) => {
        setConfig(prev => ({ ...prev, [regionKey]: value }));
    };

    // 영역 정보
    const regions = [
        { key: 'region1', title: '영역 1 - 상단 3개 박스', height: config.region1Height },
        { key: 'region2', title: '영역 2 - 하단 정보', height: config.region2Height },
        { key: 'region3', title: '영역 3 - 로그온 정보', height: config.region3Height },
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
            {/* 제목 */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">패널 영역 시각적 설정</h1>
                <p className="text-gray-600">3개 영역 구성: 상단 3개 박스 + 하단정보 + 로그온</p>
            </div>

            {/* 미리보기 박스 */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">📱 미리보기</h2>

                <div className="flex justify-center">
                    <div
                        className="border-2 border-gray-400 bg-white rounded-lg p-2 relative"
                        style={{
                            width: '600px',
                            height: '450px'
                        }}
                    >
                        {/* 크기 표시 */}
                        <div className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded z-10">
                            {config.totalWidth} × {config.totalHeight}px
                        </div>

                        {/* 3개 영역 */}
                        <div className="h-full flex flex-col gap-2">

                            {/* 영역 1: 상단 3개 박스 (가로 배치) */}
                            <div
                                className={`flex gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] border-4 rounded-lg p-2 ${config.region1Enabled
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 bg-gray-100 opacity-60'
                                    }`}
                                style={{ height: '75%' }}
                                onClick={() => toggleRegion('region1Enabled')}
                                title="영역 1 - 상단 3개 박스"
                            >
                                {/* 왼쪽: 통화중 + 하단 데이터 (개선된 레이아웃) */}
                                <div className={`w-1/3 rounded-lg border-2 p-3 flex flex-col ${config.region1Enabled
                                        ? 'bg-teal-100 border-teal-400'
                                        : 'bg-gray-200 border-gray-400'
                                    }`}>
                                    {/* 통화중 원형 (크기 증가) */}
                                    <div className="flex items-center justify-center flex-1 mb-3">
                                        <div className="w-20 h-20 bg-teal-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                            통화중
                                        </div>
                                    </div>

                                    {/* 하단 2개 데이터 박스 (개선된 레이아웃) */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white rounded-lg text-center py-2 shadow-sm border">
                                            <div className="text-xs text-gray-500 mb-1">대기호수</div>
                                            <div className="text-lg font-bold text-gray-800">5</div>
                                        </div>
                                        <div className="bg-white rounded-lg text-center py-2 shadow-sm border">
                                            <div className="text-xs text-gray-500 mb-1">대기상담수</div>
                                            <div className="text-lg font-bold text-gray-800">1</div>
                                        </div>
                                    </div>
                                </div>

                                {/* 가운데: 4개 상태 박스 */}
                                <div className={`flex-1 grid grid-cols-2 gap-2 border-2 rounded-lg p-2 ${config.region1Enabled
                                        ? 'bg-blue-100 border-blue-300'
                                        : 'bg-gray-200 border-gray-400'
                                    }`}>
                                    <div className="bg-blue-300 rounded-lg flex items-center justify-center text-sm font-medium">
                                        대기
                                    </div>
                                    <div className="bg-teal-300 rounded-lg flex items-center justify-center text-sm font-medium">
                                        통화
                                    </div>
                                    <div className="bg-orange-300 rounded-lg flex items-center justify-center text-sm font-medium">
                                        후처리
                                    </div>
                                    <div className="bg-purple-300 rounded-lg flex items-center justify-center text-sm font-medium">
                                        휴식
                                    </div>
                                </div>

                                {/* 오른쪽: 폰드 정보 */}
                                <div className={`w-1/4 flex flex-col gap-2 border-2 rounded-lg p-2 ${config.region1Enabled
                                        ? 'bg-pink-100 border-pink-300'
                                        : 'bg-gray-200 border-gray-400'
                                    }`}>
                                    <div className="flex-1 bg-pink-300 rounded-lg flex items-center justify-center text-sm font-medium">
                                        일반폰드
                                    </div>
                                    <div className="flex-1 bg-pink-300 rounded-lg flex items-center justify-center text-sm font-medium">
                                        아웃바운드
                                    </div>
                                </div>
                            </div>

                            {/* 영역 2: 하단 정보 */}
                            <div
                                className={`rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] flex items-center justify-center text-sm font-medium border-4 ${config.region2Enabled
                                        ? 'bg-purple-200 border-purple-500'
                                        : 'bg-gray-200 border-gray-300 opacity-60'
                                    }`}
                                style={{ height: '15%' }}
                                onClick={() => toggleRegion('region2Enabled')}
                                title="영역 2 - 하단 정보"
                            >
                                영역 2 - 하단 정보
                            </div>

                            {/* 영역 3: 로그온 정보 */}
                            <div
                                className={`rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] flex items-center justify-between px-4 text-sm border-4 ${config.region3Enabled
                                        ? 'bg-gray-300 border-gray-600'
                                        : 'bg-gray-200 border-gray-300 opacity-60'
                                    }`}
                                style={{ height: '10%' }}
                                onClick={() => toggleRegion('region3Enabled')}
                                title="영역 3 - 로그온 정보"
                            >
                                <span className="font-medium">LogOn: 44:42:17</span>
                                <span className="text-green-600 font-bold">● 온라인</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 크기 설정 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* 전체 크기 설정 (간소화) */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">🎛️ 전체 크기 설정</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">전체 너비</label>
                            <input
                                type="number"
                                value={config.totalWidth}
                                onChange={(e) => setConfig(prev => ({ ...prev, totalWidth: parseInt(e.target.value) || 0 }))}
                                className="w-full p-2 border rounded text-sm"
                                min="500"
                                max="2000"
                                step="50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">전체 높이 (자동)</label>
                            <input
                                type="number"
                                value={config.totalHeight}
                                readOnly
                                className="w-full p-2 border rounded text-sm bg-green-100 font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* 영역별 높이 설정 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">📏 영역별 높이 설정</h3>
                    <div className="space-y-3">
                        {regions.map((region, index) => {
                            const isEnabled = config[`${region.key}Enabled` as keyof PanelConfig] as boolean;
                            const colors = ['bg-blue-400', 'bg-purple-400', 'bg-gray-500'];
                            return (
                                <div key={region.key} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded border-2 ${isEnabled ? `${colors[index]} border-gray-600` : 'bg-gray-300 border-gray-400'
                                        }`}></div>
                                    <span className={`text-sm flex-1 font-medium ${!isEnabled ? 'opacity-50' : ''}`}>
                                        {region.title}
                                    </span>
                                    <input
                                        type="number"
                                        value={region.height}
                                        onChange={(e) => updateHeight(`${region.key}Height` as keyof PanelConfig, parseInt(e.target.value) || 0)}
                                        disabled={!isEnabled}
                                        className="w-20 p-2 border rounded text-sm"
                                        min="10"
                                        max="300"
                                    />
                                    <span className="text-sm text-gray-500">px</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 계산 결과 요약 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-blue-800 mb-2">📋 크기 계산 결과</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-blue-700">
                    <div>
                        <strong>활성 영역:</strong><br />
                        {[
                            config.region1Enabled && '상단3박스',
                            config.region2Enabled && '하단정보',
                            config.region3Enabled && '로그온',
                        ].filter(Boolean).length}/3개
                    </div>
                    <div>
                        <strong>전체 크기:</strong><br />
                        {config.totalWidth} × {config.totalHeight}px
                    </div>
                    <div>
                        <strong>콘텐츠 높이:</strong><br />
                        {
                            (config.region1Enabled ? config.region1Height : 0) +
                            (config.region2Enabled ? config.region2Height : 0) +
                            (config.region3Enabled ? config.region3Height : 0)
                        }px
                    </div>
                </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3 justify-center">
                <button
                    onClick={() => {
                        setConfig(prev => ({
                            ...prev,
                            region1Enabled: true,
                            region2Enabled: true,
                            region3Enabled: true,
                        }));
                    }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    🔛 전체 활성화
                </button>
                <button
                    onClick={() => {
                        console.log('패널 설정 적용:', config);
                        alert(`패널 크기가 ${config.totalWidth}×${config.totalHeight}px로 적용되었습니다!`);
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    ✅ 설정 적용
                </button>
                <button
                    onClick={() => {
                        setConfig({
                            region1Enabled: true,
                            region2Enabled: true,
                            region3Enabled: true,
                            region1Height: 150,
                            region2Height: 40,
                            region3Height: 25,
                            totalWidth: 1000,
                            totalHeight: 0,
                            padding: 15,
                            spacing: 8,
                        });
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    🔄 초기화
                </button>
            </div>
        </div>
    );
};

export default ThreeRegionPanelSettings;