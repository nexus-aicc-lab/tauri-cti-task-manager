
import React, { useEffect, useState, useCallback } from 'react';
import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window';

// --- 인터페이스 정의 (변경 없음) ---
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
interface CalculationSummary {
    width: string;
    height: string;
}

// --- Tailwind CSS 색상 문제 해결을 위한 스타일 맵 (변경 없음) ---
const regionStyles: { [key: string]: { active: string; inactive: string } } = {
    teal: { active: 'bg-teal-100 border-teal-500 shadow-md', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400' },
    blue: { active: 'bg-blue-100 border-blue-500 shadow-md', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400' },
    pink: { active: 'bg-pink-100 border-pink-500 shadow-md', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400' },
    purple: { active: 'bg-purple-100 border-purple-500 shadow-md', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400' },
    gray: { active: 'bg-gray-200 border-gray-600 shadow-md', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400' },
};
const componentStyles: { [key: string]: { active: string; inactive: string } } = {
    orange: { active: 'bg-orange-100 border-orange-500 shadow-md text-orange-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    green: { active: 'bg-green-100 border-green-500 shadow-md text-green-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    yellow: { active: 'bg-yellow-100 border-yellow-500 shadow-md text-yellow-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    indigo: { active: 'bg-indigo-100 border-indigo-500 shadow-md text-indigo-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    blue: { active: 'bg-blue-100 border-blue-500 shadow-md text-blue-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    red: { active: 'bg-red-100 border-red-500 shadow-md text-red-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    cyan: { active: 'bg-cyan-100 border-cyan-500 shadow-md text-cyan-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    rose: { active: 'bg-rose-100 border-rose-500 shadow-md text-rose-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    teal: { active: 'bg-teal-100 border-teal-500 shadow-md text-teal-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    violet: { active: 'bg-violet-100 border-violet-500 shadow-md text-violet-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    lime: { active: 'bg-lime-100 border-lime-500 shadow-md text-lime-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
    amber: { active: 'bg-amber-100 border-amber-500 shadow-md text-amber-700', inactive: 'bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-600' },
};


const FiveRegionPanelSettings: React.FC = () => {
    // --- 1. 1000x500 목표에 맞춘 고정 크기 값 수정 ---
    const FIXED_SIZES = {
        region1Width: 260,
        region2Width: 460, // 1000px 너비를 맞추기 위해 조정
        region3Width: 220,
        topRegionHeight: 335, // 500px 높이를 맞추기 위해 조정
        region4RowHeight: 30,
        region4Padding: 20,
        region5Height: 25,
        padding: 20,
        spacing: 10,
        minWidth: 400,
        minHeight: 250,
    };

    // --- 2. 초기 상태를 '전체 활성화'로 변경 ---
    const [config, setConfig] = useState<PanelConfig>({
        region1Enabled: true,
        region2Enabled: true,
        region3Enabled: true,
        region4Enabled: true,
        region5Enabled: true,
        region4Components: {
            customerInfo: true, callHistory: true, notes: true, toolbar: true,
            script: true, transfer: true, dialpad: true, recording: true,
            monitoring: true, reporting: false, contacts: false, calendar: false,
        },
        totalWidth: 1000,
        totalHeight: 500,
    });

    // --- 3. 계산 요약 저장을 위한 상태 추가 ---
    const [summary, setSummary] = useState<CalculationSummary>({ width: '', height: '' });
    const [notification, setNotification] = useState<string | null>(null);

    const getActiveRegion4ComponentsCount = useCallback(
        () => Object.values(config.region4Components).filter(Boolean).length,
        [config.region4Components]
    );

    useEffect(() => {
        const { padding, region1Width, region2Width, region3Width, spacing, minWidth, topRegionHeight, region4RowHeight, region4Padding, region5Height, minHeight } = FIXED_SIZES;

        const widthParts: string[] = [`여백(${padding * 2})`];
        let calculatedWidth = padding * 2;
        let activeTopRegionsCount = 0;

        if (config.region1Enabled) { calculatedWidth += region1Width; activeTopRegionsCount++; widthParts.push(`1영역(${region1Width})`); }
        if (config.region2Enabled) { calculatedWidth += region2Width; activeTopRegionsCount++; widthParts.push(`2영역(${region2Width})`); }
        if (config.region3Enabled) { calculatedWidth += region3Width; activeTopRegionsCount++; widthParts.push(`3영역(${region3Width})`); }
        if (activeTopRegionsCount > 1) {
            const totalSpacing = spacing * (activeTopRegionsCount - 1);
            calculatedWidth += totalSpacing;
            widthParts.splice(1, 0, `간격(${totalSpacing})`);
        }
        calculatedWidth = Math.max(calculatedWidth, minWidth);

        const heightParts: string[] = [`여백(${padding * 2})`];
        let calculatedHeight = padding * 2;
        const activeVerticalRegions: number[] = [];
        const verticalRegionNames: string[] = [];

        if (config.region1Enabled || config.region2Enabled || config.region3Enabled) {
            activeVerticalRegions.push(topRegionHeight);
            verticalRegionNames.push(`상단(${topRegionHeight})`);
        }

        const count4 = getActiveRegion4ComponentsCount();
        if (config.region4Enabled && count4 > 0) {
            let cols = 6;
            if (activeTopRegionsCount === 2) cols = 4;
            else if (activeTopRegionsCount === 1) cols = 2;

            const rows = Math.ceil(count4 / cols);
            const calculatedRegion4Height = (rows * region4RowHeight) + region4Padding;
            activeVerticalRegions.push(calculatedRegion4Height);
            verticalRegionNames.push(`4영역(${calculatedRegion4Height})`);
        }

        if (config.region5Enabled) {
            activeVerticalRegions.push(region5Height);
            verticalRegionNames.push(`5영역(${region5Height})`);
        }

        calculatedHeight += activeVerticalRegions.reduce((sum, h) => sum + h, 0);
        if (activeVerticalRegions.length > 1) {
            const totalSpacing = spacing * (activeVerticalRegions.length - 1);
            calculatedHeight += totalSpacing;
            heightParts.push(`간격(${totalSpacing})`);
        }
        calculatedHeight = Math.max(calculatedHeight, minHeight);

        heightParts.push(...verticalRegionNames);

        if (Math.round(config.totalWidth) !== Math.round(calculatedWidth) || Math.round(config.totalHeight) !== Math.round(calculatedHeight)) {
            setConfig(prev => ({ ...prev, totalWidth: calculatedWidth, totalHeight: calculatedHeight }));
        }

        setSummary({
            width: widthParts.join(' + '),
            height: heightParts.join(' + ')
        });

        const resizeWindow = async () => {
            try {
                const window = getCurrentWindow();
                await window.setSize(new PhysicalSize(calculatedWidth, calculatedHeight));
            } catch (e) { /* console.error("Error resizing window", e); */ }
        };
        resizeWindow();
    }, [config, getActiveRegion4ComponentsCount, FIXED_SIZES]);

    const toggleRegion = (key: keyof PanelConfig) => setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    const toggleRegion4Component = (key: keyof Region4Components) => setConfig(prev => ({ ...prev, region4Components: { ...prev.region4Components, [key]: !prev.region4Components[key] } }));
    const showNotification = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
    const getActiveRegionCount = () => [config.region1Enabled, config.region2Enabled, config.region3Enabled, config.region4Enabled, config.region5Enabled].filter(Boolean).length;
    const hasAnyTopRegion = config.region1Enabled || config.region2Enabled || config.region3Enabled;

    const region4ComponentsData = [
        { key: 'customerInfo', name: '고객정보', icon: '👤', color: 'orange' }, { key: 'callHistory', name: '통화이력', icon: '📞', color: 'green' }, { key: 'notes', name: '메모', icon: '📝', color: 'yellow' },
        { key: 'toolbar', name: '툴바', icon: '🔧', color: 'indigo' }, { key: 'script', name: '스크립트', icon: '📜', color: 'blue' }, { key: 'transfer', name: '호전환', icon: '🔄', color: 'red' },
        { key: 'dialpad', name: '다이얼패드', icon: '🔢', color: 'cyan' }, { key: 'recording', name: '녹음제어', icon: '🎙️', color: 'rose' }, { key: 'monitoring', name: '모니터링', icon: '👁️', color: 'teal' },
        { key: 'reporting', name: '실시간통계', icon: '📊', color: 'violet' }, { key: 'contacts', name: '연락처', icon: '📇', color: 'lime' }, { key: 'calendar', name: '일정관리', icon: '📅', color: 'amber' },
    ];

    const activeTopRegionCount = [config.region1Enabled, config.region2Enabled, config.region3Enabled].filter(Boolean).length;
    let region4GridClass = 'grid-cols-6';
    if (activeTopRegionCount === 2) {
        region4GridClass = 'grid-cols-4';
    } else if (activeTopRegionCount === 1) {
        region4GridClass = 'grid-cols-2';
    }

    return (
        <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
            {notification && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
                    <div className="flex items-center gap-2"><span>✅</span><span>{notification}</span><button onClick={() => setNotification(null)} className="ml-2 hover:text-gray-200">✕</button></div>
                </div>
            )}
            {/* <div className="bg-white border-b px-4 py-2"><h1 className="text-lg font-bold text-gray-800 text-center">CTI Task Master - 패널 설정</h1></div> */}

            <div className="flex-1 p-4 overflow-y-auto">
                {/* 🆕 가로 배치 - 70:30 비율로 조정하여 미리보기 영역 대폭 확대 */}
                <div className="flex gap-4 items-start justify-center h-full">
                    {/* 첫 번째 박스 - 미리보기 (대폭 확대된 컨테이너 크기) */}
                    <div className="w-[70%] max-w-5xl">
                        <div className="bg-white rounded-lg shadow-md p-3 h-full">
                            {/* 스크롤 없는 미리보기 컨테이너 - 70% 영역에 맞춤 자동 스케일링 */}
                            <div className="w-full h-full bg-gray-50 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                                <div
                                    className="border-2 border-dashed border-red-500 bg-gray-100 rounded-lg relative flex flex-col transition-all duration-200 ease-in-out"
                                    style={{
                                        width: `${config.totalWidth}px`,
                                        height: `${config.totalHeight}px`,
                                        padding: `${FIXED_SIZES.padding}px`,
                                        gap: `${FIXED_SIZES.spacing}px`,
                                        transform: `scale(${Math.min(
                                            (window.innerWidth * 0.7 - 80) / config.totalWidth,
                                            (window.innerHeight - 180) / config.totalHeight,
                                            1
                                        )})`,
                                        transformOrigin: 'center center'
                                    }}
                                >
                                    <div className="absolute top-1 right-1 text-xs bg-black text-white px-2 py-1 rounded z-10">{`${Math.round(config.totalWidth)} × ${Math.round(config.totalHeight)}px`}</div>
                                    {hasAnyTopRegion && (
                                        <div className="flex gap-2" style={{ height: `${FIXED_SIZES.topRegionHeight}px` }}>
                                            {config.region1Enabled && <div className="h-full rounded-lg border-2 border-teal-500 bg-teal-50 p-2 flex flex-col" style={{ width: `${FIXED_SIZES.region1Width}px` }}><div className="flex items-center justify-center flex-1 mb-1"><div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">통화중</div></div><div className="grid grid-cols-2 gap-1"><div className="bg-white rounded text-center py-1 text-xs border"><div className="text-gray-500">대기</div><div className="font-bold text-base">5</div></div><div className="bg-white rounded text-center py-1 text-xs border"><div className="text-gray-500">상담</div><div className="font-bold text-base">1</div></div></div></div>}
                                            {config.region2Enabled && <div className="h-full grid grid-cols-2 gap-2 border-2 border-blue-500 bg-blue-50 rounded-lg p-2" style={{ width: `${FIXED_SIZES.region2Width}px` }}><div className="bg-blue-300 rounded flex items-center justify-center text-xs font-medium">대기</div><div className="bg-teal-300 rounded flex items-center justify-center text-xs font-medium">통화</div><div className="bg-orange-300 rounded flex items-center justify-center text-xs font-medium">후처리</div><div className="bg-purple-300 rounded flex items-center justify-center text-xs font-medium">휴식</div></div>}
                                            {config.region3Enabled && <div className="h-full flex flex-col gap-2 border-2 border-pink-500 bg-pink-50 rounded-lg p-2" style={{ width: `${FIXED_SIZES.region3Width}px` }}><div className="flex-1 bg-pink-300 rounded flex items-center justify-center text-xs font-medium">일반폰드</div><div className="flex-1 bg-pink-300 rounded flex items-center justify-center text-xs font-medium">아웃바운드</div></div>}
                                        </div>
                                    )}
                                    {config.region4Enabled && getActiveRegion4ComponentsCount() > 0 && (
                                        <div className="rounded-lg border-2 bg-purple-100 border-purple-500 p-2 flex-grow flex flex-col justify-center">
                                            <div className={`grid ${region4GridClass} gap-1`}>
                                                {region4ComponentsData.filter(({ key }) => config.region4Components[key as keyof Region4Components]).map(({ key, name, icon }) => (
                                                    <div key={key} className="bg-purple-200 text-xs px-1 py-0.5 rounded flex items-center justify-center" title={name}>
                                                        <span>{icon}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {config.region5Enabled && <div className="rounded-lg flex items-center justify-between px-3 text-sm border-2 bg-gray-200 border-gray-600" style={{ height: `${FIXED_SIZES.region5Height}px`, flexShrink: 0 }}><span className="font-medium text-xs">LogOn: 44:42:17</span><span className="text-green-600 font-bold text-xs">● 온라인</span></div>}
                                    {getActiveRegionCount() === 0 && <div className="h-full w-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"><div className="text-center"><div className="text-2xl mb-1">📋</div><div className="text-xs">영역을 선택하세요</div></div></div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🆕 두 번째, 세 번째 박스 - 30% 비율로 조정 */}
                    <div className="w-[30%] flex flex-col gap-3 h-full">
                        {/* 두 번째 박스 - 영역 선택 (컴팩트) */}
                        <div className="bg-white rounded-lg shadow-md p-2 flex-1">
                            <h3 className="text-sm font-bold text-gray-800 mb-2 text-center">영역 선택</h3>
                            <div className="space-y-1 h-full overflow-y-auto pb-4">
                                {[
                                    { key: 'region1Enabled', name: '📞 통화중 박스', color: 'teal', num: '1' },
                                    { key: 'region2Enabled', name: '📊 상태 박스', color: 'blue', num: '2' },
                                    { key: 'region3Enabled', name: '📋 폰드 정보', color: 'pink', num: '3' },
                                    { key: 'region4Enabled', name: '📄 하단 정보', color: 'purple', num: '4' },
                                    { key: 'region5Enabled', name: '👤 로그온 정보', color: 'gray', num: '5' },
                                ].map(({ key, name, color, num }) => {
                                    const isEnabled = config[key as keyof PanelConfig] as boolean;
                                    const styles = regionStyles[color] || regionStyles.gray;
                                    const textStyle = isEnabled ? `text-${color}-700` : 'text-gray-600';
                                    return (
                                        <div key={key} className={`p-1 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isEnabled ? styles.active : styles.inactive}`} onClick={() => toggleRegion(key as keyof PanelConfig)}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isEnabled ? `bg-white text-${color}-700 border-${color}-600 shadow-sm` : 'bg-gray-300 text-gray-700 border-gray-400'}`}>{num}</div>
                                                <div className={`flex-1 min-w-0 font-bold text-xs ${textStyle}`}>{name}</div>
                                                <div className={`text-xs font-bold ${isEnabled ? 'text-gray-800' : 'text-gray-400'}`}>{isEnabled ? '✓' : '○'}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 세 번째 박스 - 4영역 구성요소 (컴팩트) */}
                        <div className="bg-white rounded-lg shadow-md p-2 flex-1">
                            <h3 className="text-sm font-bold text-purple-800 mb-2 text-center">4영역 구성요소</h3>
                            {!config.region4Enabled ? (
                                <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-2 h-full">
                                    <div className="text-center">
                                        <div className="text-lg mb-1">🔒</div>
                                        <div className="text-xs">4영역 활성화 필요</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full">
                                    <div className="grid grid-cols-2 gap-1 flex-1 overflow-y-auto pb-1">
                                        {region4ComponentsData.map(({ key, name, icon, color }) => {
                                            const isEnabled = config.region4Components[key as keyof Region4Components];
                                            const styles = componentStyles[color] || componentStyles.gray;
                                            return (
                                                <div key={key} className={`p-0.5 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isEnabled ? styles.active : styles.inactive}`} onClick={() => toggleRegion4Component(key as keyof Region4Components)}>
                                                    <div className="flex items-center gap-1">
                                                        <div className={`w-3 h-3 rounded-full flex items-center justify-center text-xs border-2 ${isEnabled ? `bg-white text-${color}-700 border-${color}-600 shadow-sm` : 'bg-gray-300 text-gray-700 border-gray-400'}`}>{icon}</div>
                                                        <div className="flex-1 min-w-0"><div className="font-bold text-xs">{name}</div></div>
                                                        <div className={`text-xs font-bold ${isEnabled ? 'text-gray-800' : 'text-gray-400'}`}>{isEnabled ? '✓' : '○'}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="p-1 bg-purple-50 rounded-lg text-center mt-1">
                                        <div className="text-purple-800 font-bold text-xs">{`구성요소: ${getActiveRegion4ComponentsCount()}/12개`}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-t p-2">
                <div className="flex justify-center items-center gap-4 text-xs mb-2">
                    <div><span className="font-bold">활성 영역:</span> <span className="text-blue-600">{`${getActiveRegionCount()}/5개`}</span></div>
                    <div><span className="font-bold">4영역 구성:</span> <span className="text-purple-600">{`${getActiveRegion4ComponentsCount()}/12개`}</span></div>
                    <div><span className="font-bold">계산된 크기:</span> <span className="text-green-600">{`${Math.round(config.totalWidth)} × ${Math.round(config.totalHeight)}px`}</span></div>
                </div>
                {/* --- 4. 계산 요약 정보 표시 --- */}
                <div className="text-center text-xs text-gray-500 bg-gray-100 p-2 rounded-md">
                    <p><span className='font-bold'>너비 계산:</span> {summary.width}</p>
                    <p><span className='font-bold'>높이 계산:</span> {summary.height}</p>
                </div>
                <div className="flex gap-2 justify-center mt-2">
                    <button onClick={() => { setConfig(prev => ({ ...prev, region1Enabled: true, region2Enabled: true, region3Enabled: true, region4Enabled: true, region5Enabled: true, region4Components: region4ComponentsData.reduce((acc, comp) => ({ ...acc, [comp.key]: true }), {} as Region4Components) })); showNotification('모든 영역과 구성요소가 활성화되었습니다!'); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">🔛 전체 활성화</button>
                    <button onClick={() => { console.log('Tauri Native 설정:', { ...config, fixedSizes: FIXED_SIZES }); showNotification(`Native 창 크기 ${config.totalWidth}×${config.totalHeight}px 적용됨`); }} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">✅ 설정 적용</button>
                    <button onClick={() => { setConfig({ region1Enabled: true, region2Enabled: false, region3Enabled: false, region4Enabled: true, region5Enabled: true, region4Components: { customerInfo: true, callHistory: true, notes: true, toolbar: true, script: true, transfer: true, dialpad: true, recording: true, monitoring: true, reporting: false, contacts: false, calendar: false, }, totalWidth: 400, totalHeight: 343 }); showNotification('기본값으로 초기화되었습니다!'); }} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm">🔄 초기화</button>
                </div>
            </div>
        </div>
    );
};

export default FiveRegionPanelSettings;