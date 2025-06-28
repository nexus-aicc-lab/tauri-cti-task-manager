// import React, { useEffect, useState, useCallback } from 'react';
// import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window';

// // CSS 속성 확장을 위한 인터페이스
// interface ExtendedCSSProperties extends React.CSSProperties {
//     WebkitAppRegion?: 'drag' | 'no-drag';
// }

// // 4번 영역의 컴포넌트 상태 인터페이스
// interface Region4Components {
//     customerInfo: boolean;
//     callHistory: boolean;
//     notes: boolean;
//     toolbar: boolean;
//     script: boolean;
//     transfer: boolean;
//     dialpad: boolean;
//     recording: boolean;
//     monitoring: boolean;
//     reporting: boolean;
//     contacts: boolean;
//     calendar: boolean;
// }

// // 패널 전체 설정 인터페이스
// interface PanelConfig {
//     region1Enabled: boolean;
//     region2Enabled: boolean;
//     region3Enabled: boolean;
//     region4Enabled: boolean;
//     region5Enabled: boolean;
//     region4Components: Region4Components;
//     totalWidth: number;
//     totalHeight: number;
// }

// const FiveRegionPanelSettings: React.FC = () => {
//     // UI 요소들의 고정 크기 값
//     const FIXED_SIZES = {
//         region1Width: 260,
//         region2Width: 360,
//         region3Width: 220,
//         topRegionHeight: 130,
//         region4Height: 40,
//         region5Height: 25,
//         padding: 20,
//         spacing: 10,
//         minWidth: 400,
//         // --- 🔄 여기를 수정 ---
//         minHeight: 150, // 최소 높이를 낮춰서 동적 조절이 잘 보이도록 함
//     };

//     // 패널 설정을 관리하는 React 상태
//     const [config, setConfig] = useState<PanelConfig>({
//         region1Enabled: true,
//         region2Enabled: true,
//         region3Enabled: true,
//         region4Enabled: true,
//         region5Enabled: true,
//         region4Components: {
//             customerInfo: true, callHistory: true, notes: true, toolbar: true,
//             script: true, transfer: true, dialpad: true, recording: true,
//             monitoring: true, reporting: false, contacts: false, calendar: false,
//         },
//         totalWidth: 900,
//         totalHeight: 300,
//     });

//     // 알림 메시지 상태
//     const [notification, setNotification] = useState<string | null>(null);

//     // 활성화된 4번 영역 컴포넌트 개수를 계산하는 함수 (메모이제이션)
//     const getActiveRegion4ComponentsCount = useCallback(
//         () => Object.values(config.region4Components).filter(Boolean).length,
//         [config.region4Components]
//     );

//     // 창 크기를 동적으로 계산하고 적용하는 useEffect 훅
//     useEffect(() => {
//         const { padding, region1Width, region2Width, region3Width, spacing, minWidth, topRegionHeight, region4Height, region5Height, minHeight } = FIXED_SIZES;

//         // 1. 활성화된 영역에 따라 너비 계산
//         let calculatedWidth = padding * 2;
//         let activeTopRegions = 0;
//         if (config.region1Enabled) { calculatedWidth += region1Width; activeTopRegions++; }
//         if (config.region2Enabled) { calculatedWidth += region2Width; activeTopRegions++; }
//         if (config.region3Enabled) { calculatedWidth += region3Width; activeTopRegions++; }
//         if (activeTopRegions > 1) { calculatedWidth += spacing * (activeTopRegions - 1); }
//         if (activeTopRegions === 0 && !config.region4Enabled && !config.region5Enabled) {
//             calculatedWidth = minWidth;
//         }
//         calculatedWidth = Math.max(calculatedWidth, minWidth);

//         // 2. 활성화된 영역에 따라 높이 계산
//         let calculatedHeight = padding * 2;
//         let activeVerticalRegions = [];
//         if (config.region1Enabled || config.region2Enabled || config.region3Enabled) {
//             activeVerticalRegions.push(topRegionHeight);
//         }
//         const count4 = getActiveRegion4ComponentsCount();
//         if (config.region4Enabled && count4 > 0) {
//             activeVerticalRegions.push(count4 >= 7 ? region4Height * 2 : region4Height);
//         }
//         if (config.region5Enabled) {
//             activeVerticalRegions.push(region5Height);
//         }

//         calculatedHeight += activeVerticalRegions.reduce((sum, h) => sum + h, 0);
//         if (activeVerticalRegions.length > 1) {
//             calculatedHeight += spacing * (activeVerticalRegions.length - 1);
//         }

//         if (activeVerticalRegions.length === 0) {
//             calculatedHeight = minHeight;
//         }

//         calculatedHeight = Math.max(calculatedHeight, minHeight);

//         // 3. 계산된 크기를 React 상태에 업데이트 (UI 표시용)
//         if (config.totalWidth !== calculatedWidth || config.totalHeight !== calculatedHeight) {
//             setConfig(prev => ({ ...prev, totalWidth: calculatedWidth, totalHeight: calculatedHeight }));
//         }

//         // 4. Tauri API를 호출하여 실제 네이티브 창 크기 변경
//         const resizeWindow = async () => {
//             try {
//                 const window = getCurrentWindow();
//                 await window.setSize(new PhysicalSize(calculatedWidth, calculatedHeight));
//             } catch (e) {
//                 // console.error("창 크기 조절 실패. Tauri 환경인지 확인하세요.", e);
//             }
//         };
//         resizeWindow();

//         // --- 🔄 여기를 수정 ---
//     }, [
//         config.region1Enabled,
//         config.region2Enabled,
//         config.region3Enabled,
//         config.region4Enabled,
//         config.region5Enabled,
//         config.region4Components,
//         config.totalWidth, // 상태 업데이트 후 재실행을 위해 추가
//         config.totalHeight, // 상태 업데이트 후 재실행을 위해 추가
//         getActiveRegion4ComponentsCount,
//     ]);


//     // 설정 변경을 위한 헬퍼 함수들
//     const toggleRegion = (key: keyof PanelConfig) => { setConfig(prev => ({ ...prev, [key]: !prev[key] })); };
//     const toggleRegion4Component = (key: keyof Region4Components) => { setConfig(prev => ({ ...prev, region4Components: { ...prev.region4Components, [key]: !prev.region4Components[key] } })); };
//     const showNotification = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
//     const getActiveRegionCount = () => [config.region1Enabled, config.region2Enabled, config.region3Enabled, config.region4Enabled, config.region5Enabled].filter(Boolean).length;
//     const hasAnyTopRegion = config.region1Enabled || config.region2Enabled || config.region3Enabled;

//     const region4ComponentsData = [
//         { key: 'customerInfo', name: '고객정보', icon: '👤', color: 'orange' }, { key: 'callHistory', name: '통화이력', icon: '📞', color: 'green' }, { key: 'notes', name: '메모', icon: '📝', color: 'yellow' },
//         { key: 'toolbar', name: '툴바', icon: '🔧', color: 'indigo' }, { key: 'script', name: '스크립트', icon: '📜', color: 'blue' }, { key: 'transfer', name: '호전환', icon: '🔄', color: 'red' },
//         { key: 'dialpad', name: '다이얼패드', icon: '🔢', color: 'cyan' }, { key: 'recording', name: '녹음제어', icon: '🎙️', color: 'rose' }, { key: 'monitoring', name: '모니터링', icon: '👁️', color: 'teal' },
//         { key: 'reporting', name: '실시간통계', icon: '📊', color: 'violet' }, { key: 'contacts', name: '연락처', icon: '📇', color: 'lime' }, { key: 'calendar', name: '일정관리', icon: '📅', color: 'amber' },
//     ];

//     // JSX 렌더링
//     // 이전 코드와 동일하므로 생략...
//     return (
//         <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
//             {notification && (
//                 <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
//                     <div className="flex items-center gap-2"><span>✅</span><span>{notification}</span><button onClick={() => setNotification(null)} className="ml-2 hover:text-gray-200">✕</button></div>
//                 </div>
//             )}
//             <div className="bg-white border-b px-4 py-2"><h1 className="text-lg font-bold text-gray-800 text-center">CTI Task Master - 패널 설정</h1></div>

//             {/* 메인 컨텐츠 */}
//             <div className="flex-1 p-4 overflow-y-auto">
//                 <div className="flex gap-4 items-start">

//                     {/* 미리보기 패널 (왼쪽) */}
//                     <div className="flex-shrink-0">
//                         <div className="bg-white rounded-lg shadow-md p-3">
//                             <div
//                                 className="border-2 border-dashed border-red-500 bg-gray-100 rounded-lg relative flex flex-col transition-all duration-200 ease-in-out"
//                                 style={{
//                                     width: `${config.totalWidth}px`,
//                                     height: `${config.totalHeight}px`,
//                                     padding: `${FIXED_SIZES.padding}px`,
//                                     gap: `${FIXED_SIZES.spacing}px`,
//                                 }}
//                             >
//                                 <div className="absolute top-1 right-1 text-xs bg-black text-white px-2 py-1 rounded z-10">{config.totalWidth} × {config.totalHeight}px</div>

//                                 {hasAnyTopRegion && (
//                                     <div className="flex gap-2" style={{ height: `${FIXED_SIZES.topRegionHeight}px` }}>
//                                         {config.region1Enabled && <div className="h-full rounded-lg border-2 border-teal-500 bg-teal-50 p-2 flex flex-col" style={{ width: `${FIXED_SIZES.region1Width}px` }}><div className="flex items-center justify-center flex-1 mb-1"><div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">통화중</div></div><div className="grid grid-cols-2 gap-1"><div className="bg-white rounded text-center py-1 text-xs border"><div className="text-gray-500">대기</div><div className="font-bold text-base">5</div></div><div className="bg-white rounded text-center py-1 text-xs border"><div className="text-gray-500">상담</div><div className="font-bold text-base">1</div></div></div></div>}
//                                         {config.region2Enabled && <div className="h-full grid grid-cols-2 gap-2 border-2 border-blue-500 bg-blue-50 rounded-lg p-2" style={{ width: `${FIXED_SIZES.region2Width}px` }}><div className="bg-blue-300 rounded flex items-center justify-center text-xs font-medium">대기</div><div className="bg-teal-300 rounded flex items-center justify-center text-xs font-medium">통화</div><div className="bg-orange-300 rounded flex items-center justify-center text-xs font-medium">후처리</div><div className="bg-purple-300 rounded flex items-center justify-center text-xs font-medium">휴식</div></div>}
//                                         {config.region3Enabled && <div className="h-full flex flex-col gap-2 border-2 border-pink-500 bg-pink-50 rounded-lg p-2" style={{ width: `${FIXED_SIZES.region3Width}px` }}><div className="flex-1 bg-pink-300 rounded flex items-center justify-center text-xs font-medium">일반폰드</div><div className="flex-1 bg-pink-300 rounded flex items-center justify-center text-xs font-medium">아웃바운드</div></div>}
//                                     </div>
//                                 )}

//                                 {config.region4Enabled && getActiveRegion4ComponentsCount() > 0 && (
//                                     <div className="rounded-lg border-2 bg-purple-100 border-purple-500 p-2 flex flex-col justify-center" style={{ height: `${getActiveRegion4ComponentsCount() >= 7 ? FIXED_SIZES.region4Height * 2 : FIXED_SIZES.region4Height}px` }}>
//                                         <div className="grid grid-cols-6 gap-1">
//                                             {region4ComponentsData.filter(({ key }) => config.region4Components[key as keyof Region4Components]).map(({ key, name, icon }) => (
//                                                 <div key={key} className="bg-purple-200 text-xs px-1 py-0.5 rounded flex items-center justify-center" title={name}>
//                                                     <span>{icon}</span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {config.region5Enabled && <div className="rounded-lg flex items-center justify-between px-3 text-sm border-2 bg-gray-200 border-gray-600" style={{ height: `${FIXED_SIZES.region5Height}px` }}><span className="font-medium text-xs">LogOn: 44:42:17</span><span className="text-green-600 font-bold text-xs">● 온라인</span></div>}

//                                 {getActiveRegionCount() === 0 && <div className="h-full w-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"><div className="text-center"><div className="text-2xl mb-1">📋</div><div className="text-xs">영역을 선택하세요</div></div></div>}
//                             </div>
//                         </div>
//                     </div>

//                     {/* 제어 패널 (오른쪽) */}
//                     <div className="flex-1 grid grid-cols-2 gap-3">
//                         {/* 영역 선택 */}
//                         <div className="col-span-1">
//                             <div className="bg-white rounded-lg shadow-md h-full p-3 flex flex-col">
//                                 <h3 className="text-md font-bold text-gray-800 mb-2 text-center">영역 선택</h3>
//                                 <div className="space-y-2 flex-1">
//                                     {[
//                                         { key: 'region1Enabled', name: '📞 통화중 박스', color: 'teal', num: '1' }, { key: 'region2Enabled', name: '📊 상태 박스', color: 'blue', num: '2' },
//                                         { key: 'region3Enabled', name: '📋 폰드 정보', color: 'pink', num: '3' }, { key: 'region4Enabled', name: '📄 하단 정보', color: 'purple', num: '4' },
//                                         { key: 'region5Enabled', name: '👤 로그온 정보', color: 'gray', num: '5' },
//                                     ].map(({ key, name, color, num }) => (
//                                         <div key={key} className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${config[key as keyof PanelConfig] ? `bg-${color}-100 border-${color}-500 shadow-md` : 'bg-gray-50 border-gray-300 hover:border-gray-400'}`} onClick={() => toggleRegion(key as keyof PanelConfig)}>
//                                             <div className="flex items-center gap-2">
//                                                 <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${config[key as keyof PanelConfig] ? `bg-${color}-500 text-white border-${color}-600` : 'bg-gray-200 text-gray-500 border-gray-300'}`}>{num}</div>
//                                                 <div className="flex-1 min-w-0"><div className={`font-bold text-xs ${config[key as keyof PanelConfig] ? `text-${color}-700` : 'text-gray-600'}`}>{name}</div></div>
//                                                 <div className={`text-sm font-bold ${config[key as keyof PanelConfig] ? 'text-gray-800' : 'text-gray-400'}`}>{config[key as keyof PanelConfig] ? '✓' : '○'}</div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* 4영역 구성요소 */}
//                         <div className="col-span-1">
//                             <div className="bg-white rounded-lg shadow-md h-full p-3 flex flex-col">
//                                 <h3 className="text-md font-bold text-purple-800 mb-2 text-center">4영역 구성요소</h3>
//                                 {!config.region4Enabled ? (
//                                     <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-2"><div className="text-center"><div className="text-lg mb-1">🔒</div><div className="text-xs">4영역 활성화 필요</div></div></div>
//                                 ) : (
//                                     <>
//                                         <div className="grid grid-cols-2 gap-2 flex-1">
//                                             {region4ComponentsData.map(({ key, name, icon, color }) => (
//                                                 <div key={key} className={`p-1 rounded-lg border-2 cursor-pointer transition-all duration-200 ${config.region4Components[key as keyof Region4Components] ? `bg-${color}-100 border-${color}-500 shadow-md` : 'bg-gray-50 border-gray-300 hover:border-gray-400'}`} onClick={() => toggleRegion4Component(key as keyof Region4Components)}>
//                                                     <div className="flex items-center gap-1">
//                                                         <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs border-2 ${config.region4Components[key as keyof Region4Components] ? `bg-${color}-500 text-white border-${color}-600` : 'bg-gray-200 text-gray-500 border-gray-300'}`}>{icon}</div>
//                                                         <div className="flex-1 min-w-0"><div className={`font-bold text-xs ${config.region4Components[key as keyof Region4Components] ? `text-${color}-700` : 'text-gray-600'}`}>{name}</div></div>
//                                                         <div className={`text-sm font-bold ${config.region4Components[key as keyof Region4Components] ? 'text-gray-800' : 'text-gray-400'}`}>{config.region4Components[key as keyof Region4Components] ? '✓' : '○'}</div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <div className="mt-2 p-1 bg-purple-50 rounded-lg text-center">
//                                             <div className="text-purple-800 font-bold text-xs">구성요소: {getActiveRegion4ComponentsCount()}/12개</div>
//                                             {getActiveRegion4ComponentsCount() >= 7 && (<div className="text-purple-600 text-xs">높이 2배 적용</div>)}
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="bg-white border-t p-2">
//                 <div className="flex justify-center items-center gap-4 text-xs mb-2">
//                     <div><span className="font-bold">활성 영역:</span> <span className="text-blue-600">{getActiveRegionCount()}/5개</span></div>
//                     <div><span className="font-bold">4영역 구성:</span> <span className="text-purple-600">{getActiveRegion4ComponentsCount()}/12개</span></div>
//                     <div><span className="font-bold">계산된 크기:</span> <span className="text-green-600">{config.totalWidth} × {config.totalHeight}px</span></div>
//                 </div>
//                 <div className="flex gap-2 justify-center">
//                     <button onClick={() => { setConfig(prev => { const allEnabledComponents = (Object.keys(prev.region4Components) as (keyof Region4Components)[]).reduce((acc, key) => { acc[key] = true; return acc; }, {} as Region4Components); return { ...prev, region1Enabled: true, region2Enabled: true, region3Enabled: true, region4Enabled: true, region5Enabled: true, region4Components: allEnabledComponents }; }); showNotification('모든 영역과 구성요소가 활성화되었습니다!'); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">🔛 전체 활성화</button>
//                     <button onClick={() => { console.log('Tauri Native 설정:', { ...config, fixedSizes: FIXED_SIZES }); showNotification(`Native 창 크기 ${config.totalWidth}×${config.totalHeight}px 적용됨`); }} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">✅ 설정 적용</button>
//                     <button onClick={() => { setConfig({ region1Enabled: true, region2Enabled: true, region3Enabled: true, region4Enabled: true, region5Enabled: true, region4Components: { customerInfo: true, callHistory: true, notes: false, toolbar: true, script: false, transfer: false, dialpad: false, recording: false, monitoring: false, reporting: false, contacts: false, calendar: false, }, totalWidth: 1000, totalHeight: 500 }); showNotification('기본값으로 초기화되었습니다!'); }} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm">🔄 초기화</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FiveRegionPanelSettings;

import React, { useEffect, useState, useCallback } from 'react';
import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window';

// CSS 속성 확장을 위한 인터페이스
interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

// 4번 영역의 컴포넌트 상태 인터페이스
interface Region4Components {
    customerInfo: boolean;
    callHistory: boolean;
    notes: boolean;
    toolbar: boolean;
    script: boolean;
    transfer: boolean;
    dialpad: boolean;
    recording: boolean;
    monitoring: boolean;
    reporting: boolean;
    contacts: boolean;
    calendar: boolean;
}

// 패널 전체 설정 인터페이스
interface PanelConfig {
    region1Enabled: boolean;
    region2Enabled: boolean;
    region3Enabled: boolean;
    region4Enabled: boolean;
    region5Enabled: boolean;
    region4Components: Region4Components;
    totalWidth: number;
    totalHeight: number;
}

// Tailwind JIT 컴파일러 문제를 해결하기 위한 스타일 맵
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
    const FIXED_SIZES = {
        region1Width: 260,
        region2Width: 360,
        region3Width: 220,
        topRegionHeight: 130,
        region4RowHeight: 22, // 4영역의 한 줄 높이
        region4Padding: 18, // 4영역의 상하 패딩과 여백
        region5Height: 25,
        padding: 20,
        spacing: 10,
        minWidth: 400,
        minHeight: 150,
    };

    const [config, setConfig] = useState<PanelConfig>({
        region1Enabled: true,
        region2Enabled: false,
        region3Enabled: false,
        region4Enabled: true,
        region5Enabled: true,
        region4Components: {
            customerInfo: true, callHistory: true, notes: true, toolbar: true,
            script: true, transfer: true, dialpad: true, recording: true,
            monitoring: true, reporting: false, contacts: false, calendar: false,
        },
        totalWidth: 900,
        totalHeight: 300,
    });

    const [notification, setNotification] = useState<string | null>(null);

    const getActiveRegion4ComponentsCount = useCallback(
        () => Object.values(config.region4Components).filter(Boolean).length,
        [config.region4Components]
    );

    useEffect(() => {
        const { padding, region1Width, region2Width, region3Width, spacing, minWidth, topRegionHeight, region4RowHeight, region4Padding, region5Height, minHeight } = FIXED_SIZES;

        let calculatedWidth = padding * 2;
        let activeTopRegionsCount = 0;
        if (config.region1Enabled) { calculatedWidth += region1Width; activeTopRegionsCount++; }
        if (config.region2Enabled) { calculatedWidth += region2Width; activeTopRegionsCount++; }
        if (config.region3Enabled) { calculatedWidth += region3Width; activeTopRegionsCount++; }
        if (activeTopRegionsCount > 1) { calculatedWidth += spacing * (activeTopRegionsCount - 1); }
        calculatedWidth = Math.max(calculatedWidth, minWidth);

        let calculatedHeight = padding * 2;
        const activeVerticalRegions: number[] = [];
        if (config.region1Enabled || config.region2Enabled || config.region3Enabled) {
            activeVerticalRegions.push(topRegionHeight);
        }

        const count4 = getActiveRegion4ComponentsCount();
        if (config.region4Enabled && count4 > 0) {
            let cols = 6;
            if (activeTopRegionsCount === 2) cols = 4;
            else if (activeTopRegionsCount === 1) cols = 2;

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

        if (config.totalWidth !== calculatedWidth || config.totalHeight !== calculatedHeight) {
            setConfig(prev => ({ ...prev, totalWidth: calculatedWidth, totalHeight: calculatedHeight }));
        }

        const resizeWindow = async () => {
            try {
                const window = getCurrentWindow();
                await window.setSize(new PhysicalSize(calculatedWidth, calculatedHeight));
            } catch (e) {
                // console.error("Error resizing window", e);
            }
        };
        resizeWindow();
    }, [
        config.region1Enabled, config.region2Enabled, config.region3Enabled,
        config.region4Enabled, config.region5Enabled, config.region4Components,
        getActiveRegion4ComponentsCount, FIXED_SIZES, config.totalWidth, config.totalHeight
    ]);

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
            <div className="bg-white border-b px-4 py-2"><h1 className="text-lg font-bold text-gray-800 text-center">CTI Task Master - 패널 설정</h1></div>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-md p-3">
                            <div
                                className="border-2 border-dashed border-red-500 bg-gray-100 rounded-lg relative flex flex-col transition-all duration-200 ease-in-out"
                                style={{
                                    width: `${config.totalWidth}px`,
                                    height: `${config.totalHeight}px`,
                                    padding: `${FIXED_SIZES.padding}px`,
                                    gap: `${FIXED_SIZES.spacing}px`,
                                }}
                            >
                                <div className="absolute top-1 right-1 text-xs bg-black text-white px-2 py-1 rounded z-10">{`${config.totalWidth} × ${config.totalHeight}px`}</div>
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
                                {config.region5Enabled && <div className="rounded-lg flex items-center justify-between px-3 text-sm border-2 bg-gray-200 border-gray-600" style={{ height: `${FIXED_SIZES.region5Height}px` }}><span className="font-medium text-xs">LogOn: 44:42:17</span><span className="text-green-600 font-bold text-xs">● 온라인</span></div>}
                                {getActiveRegionCount() === 0 && <div className="h-full w-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"><div className="text-center"><div className="text-2xl mb-1">📋</div><div className="text-xs">영역을 선택하세요</div></div></div>}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="col-span-1">
                            <div className="bg-white rounded-lg shadow-md h-full p-3 flex flex-col">
                                <h3 className="text-md font-bold text-gray-800 mb-2 text-center">영역 선택</h3>
                                <div className="space-y-2 flex-1">
                                    {[
                                        { key: 'region1Enabled', name: '📞 통화중 박스', color: 'teal', num: '1' },
                                        { key: 'region2Enabled', name: '📊 상태 박스', color: 'blue', num: '2' },
                                        { key: 'region3Enabled', name: '📋 폰드 정보', color: 'pink', num: '3' },
                                        { key: 'region4Enabled', name: '📄 하단 정보', color: 'purple', num: '4' },
                                        { key: 'region5Enabled', name: '👤 로그온 정보', color: 'gray', num: '5' },
                                    ].map(({ key, name, color, num }) => {
                                        const isEnabled = config[key as keyof PanelConfig] as boolean;
                                        const styles = regionStyles[color] || regionStyles.gray;
                                        return (
                                            <div key={key} className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isEnabled ? styles.active : styles.inactive}`} onClick={() => toggleRegion(key as keyof PanelConfig)}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isEnabled ? `bg-${color}-500 text-white border-${color}-600` : 'bg-gray-200 text-gray-500 border-gray-300'}`}>{num}</div>
                                                    <div className="flex-1 min-w-0"><div className={`font-bold text-xs ${isEnabled ? `text-${color}-700` : 'text-gray-600'}`}>{name}</div></div>
                                                    <div className={`text-sm font-bold ${isEnabled ? 'text-gray-800' : 'text-gray-400'}`}>{isEnabled ? '✓' : '○'}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="bg-white rounded-lg shadow-md h-full p-3 flex flex-col">
                                <h3 className="text-md font-bold text-purple-800 mb-2 text-center">4영역 구성요소</h3>
                                {!config.region4Enabled ? (
                                    <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-2"><div className="text-center"><div className="text-lg mb-1">🔒</div><div className="text-xs">4영역 활성화 필요</div></div></div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-2 flex-1">
                                            {region4ComponentsData.map(({ key, name, icon, color }) => {
                                                const isEnabled = config.region4Components[key as keyof Region4Components];
                                                const styles = componentStyles[color] || componentStyles.gray;
                                                return (
                                                    <div key={key} className={`p-1 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isEnabled ? styles.active : styles.inactive}`} onClick={() => toggleRegion4Component(key as keyof Region4Components)}>
                                                        <div className="flex items-center gap-1">
                                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs border-2 ${isEnabled ? `bg-${color}-500 text-white border-${color}-600` : 'bg-gray-200 text-gray-500 border-gray-300'}`}>{icon}</div>
                                                            <div className="flex-1 min-w-0"><div className="font-bold text-xs">{name}</div></div>
                                                            <div className={`text-sm font-bold ${isEnabled ? 'text-gray-800' : 'text-gray-400'}`}>{isEnabled ? '✓' : '○'}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-2 p-1 bg-purple-50 rounded-lg text-center">
                                            <div className="text-purple-800 font-bold text-xs">{`구성요소: ${getActiveRegion4ComponentsCount()}/12개`}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-t p-2">
                <div className="flex justify-center items-center gap-4 text-xs mb-2">
                    <div><span className="font-bold">활성 영역:</span> <span className="text-blue-600">{`${getActiveRegionCount()}/5개`}</span></div>
                    <div><span className="font-bold">4영역 구성:</span> <span className="text-purple-600">{`${getActiveRegion4ComponentsCount()}/12개`}</span></div>
                    <div><span className="font-bold">계산된 크기:</span> <span className="text-green-600">{`${config.totalWidth} × ${config.totalHeight}px`}</span></div>
                </div>
                <div className="flex gap-2 justify-center">
                    <button onClick={() => { setConfig(prev => { const allEnabledComponents = (Object.keys(prev.region4Components) as (keyof Region4Components)[]).reduce((acc, key) => { acc[key] = true; return acc; }, {} as Region4Components); return { ...prev, region1Enabled: true, region2Enabled: true, region3Enabled: true, region4Enabled: true, region5Enabled: true, region4Components: allEnabledComponents }; }); showNotification('모든 영역과 구성요소가 활성화되었습니다!'); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">🔛 전체 활성화</button>
                    <button onClick={() => { console.log('Tauri Native 설정:', { ...config, fixedSizes: FIXED_SIZES }); showNotification(`Native 창 크기 ${config.totalWidth}×${config.totalHeight}px 적용됨`); }} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">✅ 설정 적용</button>
                    <button onClick={() => { setConfig({ region1Enabled: true, region2Enabled: true, region3Enabled: true, region4Enabled: true, region5Enabled: true, region4Components: { customerInfo: true, callHistory: true, notes: false, toolbar: true, script: false, transfer: false, dialpad: false, recording: false, monitoring: false, reporting: false, contacts: false, calendar: false, }, totalWidth: 1000, totalHeight: 500 }); showNotification('기본값으로 초기화되었습니다!'); }} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm">🔄 초기화</button>
                </div>
            </div>
        </div>
    );
};

export default FiveRegionPanelSettings;