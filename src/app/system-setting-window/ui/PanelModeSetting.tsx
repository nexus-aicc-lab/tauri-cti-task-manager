import React, { useEffect, useState, useCallback, useRef } from 'react';

// --- 인터페이스 정의 ---
interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

interface Region4Components {
    customerInfo: boolean; callHistory: boolean; notes: boolean; toolbar: boolean;
    script: boolean; transfer: boolean; dialpad: boolean; recording: boolean;
    monitoring: boolean; reporting: boolean; contacts: boolean; calendar: boolean;
}

interface PanelConfig {
    region1Enabled: boolean; region2Enabled: boolean; region3Enabled: boolean;
    region4Enabled: boolean; region5Enabled: boolean;
    region4Components: Region4Components;
    totalWidth: number; totalHeight: number;
}

// --- 스타일 맵 (기존과 동일) ---
const regionStyles: { [key: string]: { active: string; inactive: string } } = {
    teal: { active: 'bg-teal-50 border-teal-400 shadow-lg', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-sm' },
    blue: { active: 'bg-blue-50 border-blue-400 shadow-lg', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-sm' },
    pink: { active: 'bg-pink-50 border-pink-400 shadow-lg', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-sm' },
    purple: { active: 'bg-purple-50 border-purple-400 shadow-lg', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-sm' },
    gray: { active: 'bg-gray-100 border-gray-500 shadow-lg', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-sm' },
};

const componentStyles: { [key: string]: { active: string; inactive: string } } = {
    orange: { active: 'bg-orange-50 border-orange-400 shadow-md text-orange-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    green: { active: 'bg-green-50 border-green-400 shadow-md text-green-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    yellow: { active: 'bg-yellow-50 border-yellow-400 shadow-md text-yellow-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    indigo: { active: 'bg-indigo-50 border-indigo-400 shadow-md text-indigo-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    blue: { active: 'bg-blue-50 border-blue-400 shadow-md text-blue-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    red: { active: 'bg-red-50 border-red-400 shadow-md text-red-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    cyan: { active: 'bg-cyan-50 border-cyan-400 shadow-md text-cyan-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    rose: { active: 'bg-rose-50 border-rose-400 shadow-md text-rose-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    teal: { active: 'bg-teal-50 border-teal-400 shadow-md text-teal-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    violet: { active: 'bg-violet-50 border-violet-400 shadow-md text-violet-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    lime: { active: 'bg-lime-50 border-lime-400 shadow-md text-lime-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    amber: { active: 'bg-amber-50 border-amber-400 shadow-md text-amber-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
};

const FiveRegionPanelSettings: React.FC = () => {
    // --- 상태 및 상수 정의 (기존과 동일) ---
    const FIXED_SIZES = {
        region1Width: 260, region2Width: 460, region3Width: 220, topRegionHeight: 335, region4RowHeight: 30,
        region4Padding: 20, region5Height: 25, padding: 20, spacing: 10, minWidth: 400, minHeight: 250,
    };
    const [config, setConfig] = useState<PanelConfig>({
        region1Enabled: true, region2Enabled: true, region3Enabled: true, region4Enabled: true, region5Enabled: true,
        region4Components: {
            customerInfo: true, callHistory: true, notes: true, toolbar: true, script: true, transfer: true,
            dialpad: true, recording: true, monitoring: true, reporting: false, contacts: false, calendar: false,
        },
        totalWidth: 1000, totalHeight: 500,
    });
    const [notification, setNotification] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'regions' | 'components'>('regions');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);

    // --- 콜백 및 useEffect 훅 (기존과 대부분 동일) ---
    const getActiveRegion4ComponentsCount = useCallback(() => Object.values(config.region4Components).filter(Boolean).length, [config.region4Components]);
    const getTopRegionDimensions = useCallback(() => {
        const activeTopRegions = [config.region1Enabled, config.region2Enabled, config.region3Enabled].filter(Boolean);
        const activeCount = activeTopRegions.length;
        if (activeCount === 0) return { regions: [], totalWidth: 0 };
        const { padding, spacing, minWidth } = FIXED_SIZES;
        const availableWidth = Math.max(940, minWidth) - (padding * 2) - (spacing * (activeCount - 1));
        if (activeCount === 1) {
            const singleWidth = availableWidth;
            return {
                regions: [
                    { enabled: config.region1Enabled, width: singleWidth }, { enabled: config.region2Enabled, width: singleWidth }, { enabled: config.region3Enabled, width: singleWidth }
                ],
                totalWidth: availableWidth + (padding * 2)
            };
        }
        const ratios = [0.28, 0.49, 0.23];
        const enabledRegions: { index: number, ratio: number }[] = [];
        let totalRatio = 0;
        [config.region1Enabled, config.region2Enabled, config.region3Enabled].forEach((enabled, index) => {
            if (enabled) {
                enabledRegions.push({ index, ratio: ratios[index] });
                totalRatio += ratios[index];
            }
        });
        const regionWidths = enabledRegions.map(region => Math.floor((availableWidth * region.ratio) / totalRatio));
        let regionIndex = 0;
        const result = [
            { enabled: config.region1Enabled, width: config.region1Enabled ? regionWidths[regionIndex++] : 0 },
            { enabled: config.region2Enabled, width: config.region2Enabled ? regionWidths[regionIndex++] : 0 },
            { enabled: config.region3Enabled, width: config.region3Enabled ? regionWidths[regionIndex++] : 0 }
        ];
        return {
            regions: result,
            totalWidth: regionWidths.reduce((sum, w) => sum + w, 0) + (padding * 2) + (spacing * (activeCount - 1))
        };
    }, [config.region1Enabled, config.region2Enabled, config.region3Enabled, FIXED_SIZES]);

    useEffect(() => {
        // 이 로직은 패널 내부 크기 계산용이므로 기존 로직 유지
        const { padding, spacing, minWidth, topRegionHeight, region4RowHeight, region4Padding, region5Height, minHeight } = FIXED_SIZES;
        const topRegionDimensions = getTopRegionDimensions();
        const calculatedWidth = Math.max(topRegionDimensions.totalWidth, minWidth);
        let calculatedHeight = padding * 2;
        const activeVerticalRegions: number[] = [];
        if (config.region1Enabled || config.region2Enabled || config.region3Enabled) {
            activeVerticalRegions.push(topRegionHeight);
        }
        const count4 = getActiveRegion4ComponentsCount();
        if (config.region4Enabled && count4 > 0) {
            const activeTopRegionsCount = [config.region1Enabled, config.region2Enabled, config.region3Enabled].filter(Boolean).length;
            let cols = 6;
            if (activeTopRegionsCount === 2) cols = 4;
            else if (activeTopRegionsCount === 1) cols = 3;
            const rows = Math.ceil(count4 / cols);
            const calculatedRegion4Height = (rows * region4RowHeight) + region4Padding;
            activeVerticalRegions.push(calculatedRegion4Height);
        }
        if (config.region5Enabled) {
            activeVerticalRegions.push(region5Height);
        }
        calculatedHeight += activeVerticalRegions.reduce((sum, h) => sum + h, 0);
        if (activeVerticalRegions.length > 1) {
            calculatedHeight += spacing * (activeVerticalRegions.length - 1);
        }
        calculatedHeight = Math.max(calculatedHeight, minHeight);
        if (Math.round(config.totalWidth) !== Math.round(calculatedWidth) || Math.round(config.totalHeight) !== Math.round(calculatedHeight)) {
            setConfig(prev => ({ ...prev, totalWidth: calculatedWidth, totalHeight: calculatedHeight }));
        }
    }, [config.region1Enabled, config.region2Enabled, config.region3Enabled, config.region4Enabled, config.region5Enabled, config.region4Components, getActiveRegion4ComponentsCount, getTopRegionDimensions, FIXED_SIZES]);

    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            const availableWidth = containerRect.width - 40;
            const availableHeight = containerRect.height - 40;
            const scaleX = availableWidth / config.totalWidth;
            const scaleY = availableHeight / config.totalHeight;
            const newScale = Math.min(scaleX, scaleY, 1);
            setScale(Math.max(newScale, 0.2));
        };
        updateScale();
        const debouncedUpdateScale = setTimeout(updateScale, 100);
        window.addEventListener('resize', updateScale);
        return () => {
            clearTimeout(debouncedUpdateScale);
            window.removeEventListener('resize', updateScale);
        };
    }, [config.totalWidth, config.totalHeight]);

    const toggleRegion = (key: keyof PanelConfig) => setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    const toggleRegion4Component = (key: keyof Region4Components) => setConfig(prev => ({ ...prev, region4Components: { ...prev.region4Components, [key]: !prev.region4Components[key] } }));
    const showNotification = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
    const getActiveRegionCount = () => [config.region1Enabled, config.region2Enabled, config.region3Enabled, config.region4Enabled, config.region5Enabled].filter(Boolean).length;
    const hasAnyTopRegion = config.region1Enabled || config.region2Enabled || config.region3Enabled;
    const region4ComponentsData = [
        { key: 'customerInfo', name: '서비스레벨', color: 'orange' }, { key: 'callHistory', name: '응답률', color: 'green' }, { key: 'notes', name: '실인입수', color: 'yellow' },
        { key: 'toolbar', name: '응답횟수', color: 'indigo' }, { key: 'script', name: '포기횟수', color: 'blue' }, { key: 'transfer', name: '난서비스횟수', color: 'red' },
        { key: 'dialpad', name: '그룹호전환 입외', color: 'cyan' }, { key: 'recording', name: '그룹호전환 응답', color: 'rose' }, { key: 'monitoring', name: '그룹호전환 분배', color: 'teal' },
        { key: 'reporting', name: '예비항목1', color: 'violet' }, { key: 'contacts', name: '예비항목2', color: 'lime' }, { key: 'calendar', name: '예비항목3', color: 'amber' },
    ];
    const topRegionDimensions = getTopRegionDimensions();
    const activeTopRegionCount = [config.region1Enabled, config.region2Enabled, config.region3Enabled].filter(Boolean).length;
    let region4GridClass = 'grid-cols-6';
    if (activeTopRegionCount === 2) { region4GridClass = 'grid-cols-4'; }
    else if (activeTopRegionCount === 1) { region4GridClass = 'grid-cols-3'; }

    return (
        <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
            {notification && (
                <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm animate-pulse">
                    <div className="flex items-center gap-2">
                        <span>✅</span><span>{notification}</span>
                        <button onClick={() => setNotification(null)} className="ml-2 hover:text-gray-200 font-bold">✕</button>
                    </div>
                </div>
            )}

            {/* 메인 콘텐츠 영역: 상단으로 정렬하고 푸터 공간 확보 */}
            <main className="flex-1 p-2 lg:p-4 mb-20 overflow-y-auto">
                <div className="flex flex-col lg:flex-row gap-4 max-w-screen-2xl mx-auto h-full">

                    {/* 미리보기 영역 */}
                    <div className="w-full lg:w-[60%] flex flex-col">
                        <div className="bg-white rounded-2xl shadow-xl p-3 border border-gray-200 flex flex-col flex-grow">

                            <div ref={containerRef} className="w-full flex-grow bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 flex items-start justify-center relative border-2 border-blue-200">
                                <div className="bg-white rounded-xl relative flex flex-col transition-all duration-300 ease-in-out shadow-xl border-2 border-gray-400"
                                    style={{
                                        width: `${config.totalWidth}px`, height: `${config.totalHeight}px`,
                                        padding: `${FIXED_SIZES.padding}px`, gap: `${FIXED_SIZES.spacing}px`,
                                        transform: `scale(${scale})`, transformOrigin: 'top center',
                                        marginTop: '20px'
                                    }}>
                                    {/* --- 패널 미리보기 내부 코드 (기존과 동일) --- */}
                                    {hasAnyTopRegion && (
                                        <div className="flex gap-2" style={{ height: `${FIXED_SIZES.topRegionHeight}px` }}>
                                            {config.region1Enabled && (
                                                <div className="h-full rounded-xl border-2 border-teal-400 bg-gradient-to-br from-teal-50 to-teal-100 p-4 flex flex-col shadow-lg" style={{ width: `${topRegionDimensions.regions[0].width}px` }}>
                                                    <div className="flex items-center justify-center flex-1 mb-3">
                                                        <div className="relative">
                                                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex flex-col items-center justify-center text-white shadow-lg">
                                                                <div className="text-sm">☕</div><div className="text-xs font-bold">휴식중</div><div className="text-xs">00:01:45</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="bg-white rounded-lg text-center py-2 text-xs border border-teal-200 shadow-sm"><div className="text-teal-600 font-medium">대기호</div><div className="font-bold text-lg text-red-500">5</div></div>
                                                        <div className="bg-white rounded-lg text-center py-2 text-xs border border-teal-200 shadow-sm"><div className="text-teal-600 font-medium">대기 상담사</div><div className="font-bold text-lg">0</div></div>
                                                    </div>
                                                </div>
                                            )}
                                            {config.region2Enabled && (
                                                <div className="h-full grid grid-cols-2 gap-2 border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 shadow-lg" style={{ width: `${topRegionDimensions.regions[1].width}px` }}>
                                                    <div className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg flex flex-col items-center justify-center text-xs p-3 shadow-sm"><div className="text-blue-600 text-lg mb-1">👤</div><div className="font-medium text-blue-700">대기</div><div className="font-bold text-blue-800">12:00:34 (15)</div></div>
                                                    <div className="bg-gradient-to-br from-teal-200 to-teal-300 rounded-lg flex flex-col items-center justify-center text-xs p-3 shadow-sm"><div className="text-teal-600 text-lg mb-1">📞</div><div className="font-medium text-teal-700">통화</div><div className="font-bold text-teal-800">12:50:20 (12)</div></div>
                                                    <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg flex flex-col items-center justify-center text-xs p-3 shadow-sm"><div className="text-orange-600 text-lg mb-1">✏️</div><div className="font-medium text-orange-700">후처리</div><div className="font-bold text-orange-800">00:34:20 (15)</div></div>
                                                    <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg flex flex-col items-center justify-center text-xs p-3 shadow-sm"><div className="text-purple-600 text-lg mb-1">☕</div><div className="font-medium text-purple-700">휴식</div><div className="font-bold text-purple-800">00:00:00 (0)</div></div>
                                                </div>
                                            )}
                                            {config.region3Enabled && (
                                                <div className="h-full flex flex-col gap-2 border-2 border-pink-400 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-3 shadow-lg" style={{ width: `${topRegionDimensions.regions[2].width}px` }}>
                                                    <div className="flex-1 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg p-3 shadow-sm"><div className="text-xs font-bold text-pink-700 mb-2">인바운드</div><div className="flex justify-between text-xs text-pink-600 mb-1"><span>🔴 개인 03:12:44(15)</span></div><div className="flex justify-between text-xs text-pink-600 mb-1"><span>🟢 그룹 01:10:44(1)</span></div><div className="flex justify-between text-xs text-pink-600"><span>🔵 팀 04:10:44(1)</span></div></div>
                                                    <div className="flex-1 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg p-3 shadow-sm"><div className="text-xs font-bold text-pink-700 mb-2">아웃바운드</div><div className="flex justify-between text-xs text-pink-600 mb-1"><span>🔴 개인 03:12:44(15)</span></div><div className="flex justify-between text-xs text-pink-600 mb-1"><span>🟢 그룹 01:10:44(1)</span></div><div className="flex justify-between text-xs text-pink-600"><span>🔵 팀 04:10:44(1)</span></div></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {config.region4Enabled && getActiveRegion4ComponentsCount() > 0 && (
                                        <div className="rounded-xl border-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400 p-4 flex-grow shadow-lg">
                                            <div className={`grid ${region4GridClass} gap-2 h-full`}>
                                                {region4ComponentsData.filter(item => config.region4Components[item.key as keyof Region4Components]).map((item, index) => (<div key={index} className="bg-white rounded-lg border border-purple-300 p-2 text-center shadow-sm hover:shadow-md transition-shadow"><div className="text-xs text-gray-600 mb-1 whitespace-pre-line leading-tight">{item.name}</div><div className="font-bold text-sm text-gray-800">{/* value */}</div></div>))}
                                            </div>
                                        </div>
                                    )}
                                    {config.region5Enabled && (<div className="rounded-xl flex items-center justify-between px-4 text-sm border-2 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-500 shadow-lg" style={{ height: `${FIXED_SIZES.region5Height}px`, flexShrink: 0 }}><span className="font-medium text-xs">LogOn: 08:02:40</span><span className="text-green-600 font-bold text-xs flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>온라인</span></div>)}
                                    {getActiveRegionCount() === 0 && (<div className="h-full w-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100"><div className="text-center"><div className="text-3xl mb-2">📋</div><div className="text-sm font-medium">영역을 선택하세요</div><div className="text-xs text-gray-400 mt-1">좌측 패널에서 영역을 활성화해주세요</div></div></div>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 설정 패널 */}
                    <div className="w-full lg:w-[40%] flex flex-col">
                        <div className="bg-white rounded-2xl shadow-xl p-3 h-full flex flex-col border border-gray-200">
                            <div className="flex mb-3 bg-gray-100 rounded-xl p-1 shadow-inner flex-shrink-0">
                                <button onClick={() => setActiveTab('regions')} className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'regions' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}>📋 영역 선택</button>
                                <button onClick={() => setActiveTab('components')} className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'components' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'}`}>📊 통계 구성</button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                {activeTab === 'regions' ? (
                                    <div className="space-y-3 h-full overflow-y-auto p-3">
                                        {/* --- 영역 선택 아이템 --- */}
                                        {[{ key: 'region1Enabled', name: '🟢 통화중 박스', color: 'teal', num: '1', desc: '현재 상태 및 대기 정보' }, { key: 'region2Enabled', name: '📊 상태 박스', color: 'blue', num: '2', desc: '상담사별 상태 현황' }, { key: 'region3Enabled', name: '📈 인바운드/아웃바운드', color: 'pink', num: '3', desc: '호 유형별 통계' }, { key: 'region4Enabled', name: '📋 통계 정보', color: 'purple', num: '4', desc: '상세 성과 지표' }, { key: 'region5Enabled', name: '👤 로그온 정보', color: 'gray', num: '5', desc: '접속 상태 및 시간' },].map(({ key, name, color, num, desc }) => { const isEnabled = config[key as keyof PanelConfig] as boolean; const styles = regionStyles[color] || regionStyles.gray; return (<div key={key} className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 transform ${isEnabled ? `${styles.active} scale-[1.02] shadow-lg` : `${styles.inactive} hover:scale-[1.01]`}`} onClick={() => toggleRegion(key as keyof PanelConfig)}> <div className="flex items-center gap-3"> <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-3 transition-all duration-300 shadow-lg ${isEnabled ? 'bg-white text-black border-black' : 'bg-gray-300 text-gray-600 border-gray-500'}`}>{num}</div> <div className="flex-1 min-w-0"> <div className={`font-bold text-base ${isEnabled ? `text-${color}-900` : 'text-gray-900'}`}>{name}</div> <div className="text-sm text-gray-700 mt-1 font-medium">{desc}</div> </div> <div className={`text-2xl transition-all duration-300 font-black ${isEnabled ? 'text-green-800' : 'text-gray-700'}`}>{isEnabled ? '✓' : '○'}</div> </div> </div>); })}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col">
                                        {/* --- 통계 구성 아이템 --- */}
                                        {!config.region4Enabled ?
                                            (<div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-gray-100">
                                                <div className="text-center"><div className="text-2xl mb-2">🔒</div><div className="text-sm font-medium mb-1">통계 영역을 먼저 활성화해주세요</div><div className="text-xs text-gray-400">영역 선택 탭에서 4번 영역을 활성화하세요</div></div></div>)
                                            : (<>
                                                <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pb-3 pr-2"> {region4ComponentsData.map(({ key, name, color }) => {
                                                    const isEnabled = config.region4Components[key as keyof Region4Components]; const styles = componentStyles[color] || componentStyles.gray; return (
                                                        <div key={key}
                                                            className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-300 transform ${isEnabled ? `${styles.active} scale-[1.02] shadow-md` : `${styles.inactive} hover:scale-[1.01]`} mx-2`}
                                                            onClick={() => toggleRegion4Component(key as keyof Region4Components)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="font-bold text-sm leading-tight">
                                                                        {name}
                                                                    </div>
                                                                </div>
                                                                <div className={`text-lg transition-all duration-300 font-black ${isEnabled ? 'text-green-800' : 'text-gray-700'}`}>{isEnabled ? '✓' : '○'}</div>
                                                            </div>
                                                        </div>);
                                                })}
                                                </div>
                                                <div className="p-3 bg-gradient-to-r from-purple-300 to-purple-400 rounded-xl text-center mt-2 border-3 border-purple-500 shadow-lg flex-shrink-0">
                                                    <div className="text-purple-950 font-bold text-base">{`활성 통계: ${getActiveRegion4ComponentsCount()}/12개`}</div>
                                                </div>
                                            </>
                                            )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 하단 푸터: fixed로 항상 보이게 고정 */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-20">
                <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-blue-200 px-2 py-1 rounded-lg border border-blue-300 shadow-sm"><span className="font-bold text-gray-800 text-xs">패널 크기:</span><span className="text-blue-700 font-bold text-xs">{`${Math.round(config.totalWidth)} × ${Math.round(config.totalHeight)}px`}</span></div>
                            <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-purple-200 px-2 py-1 rounded-lg border border-purple-300 shadow-sm"><span className="font-bold text-gray-800 text-xs">활성 영역:</span><span className="text-purple-700 font-bold text-xs">{`${getActiveRegionCount()}/5개`}</span></div>
                            <div className="flex items-center gap-1 bg-gradient-to-r from-green-100 to-green-200 px-2 py-1 rounded-lg border border-green-300 shadow-sm"><span className="font-bold text-gray-800 text-xs">활성 통계:</span><span className="text-green-700 font-bold text-xs">{`${getActiveRegion4ComponentsCount()}/12개`}</span></div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { console.log('패널 설정 저장:', { ...config, fixedSizes: FIXED_SIZES }); showNotification(`패널 설정이 저장되었습니다!`); }} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold text-xs shadow-md hover:shadow-lg transform hover:scale-105 border border-blue-800">💾 저장</button>
                            <button onClick={() => { setConfig({ region1Enabled: true, region2Enabled: false, region3Enabled: false, region4Enabled: true, region5Enabled: true, region4Components: { customerInfo: true, callHistory: true, notes: true, toolbar: true, script: true, transfer: true, dialpad: true, recording: true, monitoring: true, reporting: false, contacts: false, calendar: false, }, totalWidth: 400, totalHeight: 343 }); showNotification('변경사항이 취소되었습니다!'); }} className="px-3 py-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-bold text-xs shadow-md hover:shadow-lg transform hover:scale-105 border border-gray-800">🔄 취소</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FiveRegionPanelSettings;