// import React, { useEffect, useState, useCallback } from 'react';

// interface ExtendedCSSProperties extends React.CSSProperties {
//     WebkitAppRegion?: 'drag' | 'no-drag';
// }

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
//         minHeight: 300,
//     };

//     const [config, setConfig] = useState<PanelConfig>({
//         region1Enabled: true,
//         region2Enabled: true,
//         region3Enabled: true,
//         region4Enabled: true,
//         region5Enabled: true,
//         region4Components: {
//             customerInfo: true,
//             callHistory: true,
//             notes: true,
//             toolbar: true,
//             script: true,
//             transfer: true,
//             dialpad: true,
//             recording: true,
//             monitoring: true,
//             reporting: false,
//             contacts: false,
//             calendar: false,
//         },
//         totalWidth: 1000,
//         totalHeight: 500,
//     });

//     const [notification, setNotification] = useState<string | null>(null);

//     const getActiveRegion4ComponentsCount = useCallback(
//         () => Object.values(config.region4Components).filter(Boolean).length,
//         [config.region4Components]
//     );

//     // Mapping explicit Tailwind classes for each color to ensure proper JIT generation
//     const region4ColorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string; iconBorder: string }> = {
//         orange: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700', iconBg: 'bg-orange-500', iconBorder: 'border-orange-600' },
//         green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', iconBg: 'bg-green-500', iconBorder: 'border-green-600' },
//         yellow: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', iconBg: 'bg-yellow-500', iconBorder: 'border-yellow-600' },
//         indigo: { bg: 'bg-indigo-100', border: 'border-indigo-500', text: 'text-indigo-700', iconBg: 'bg-indigo-500', iconBorder: 'border-indigo-600' },
//         blue: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-700', iconBg: 'bg-blue-500', iconBorder: 'border-blue-600' },
//         red: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', iconBg: 'bg-red-500', iconBorder: 'border-red-600' },
//         cyan: { bg: 'bg-cyan-100', border: 'border-cyan-500', text: 'text-cyan-700', iconBg: 'bg-cyan-500', iconBorder: 'border-cyan-600' },
//         rose: { bg: 'bg-rose-100', border: 'border-rose-500', text: 'text-rose-700', iconBg: 'bg-rose-500', iconBorder: 'border-rose-600' },
//         teal: { bg: 'bg-teal-100', border: 'border-teal-500', text: 'text-teal-700', iconBg: 'bg-teal-500', iconBorder: 'border-teal-600' },
//         violet: { bg: 'bg-violet-100', border: 'border-violet-500', text: 'text-violet-700', iconBg: 'bg-violet-500', iconBorder: 'border-violet-600' },
//         lime: { bg: 'bg-lime-100', border: 'border-lime-500', text: 'text-lime-700', iconBg: 'bg-lime-500', iconBorder: 'border-lime-600' },
//         amber: { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-700', iconBg: 'bg-amber-500', iconBorder: 'border-amber-600' },
//     };

//     useEffect(() => {
//         const { padding, region1Width, region2Width, region3Width, spacing, minWidth, topRegionHeight, region4Height, region5Height, minHeight } = FIXED_SIZES;
//         let calculatedWidth = padding * 2;
//         let activeTopRegions = 0;

//         if (config.region1Enabled) { calculatedWidth += region1Width; activeTopRegions++; }
//         if (config.region2Enabled) { calculatedWidth += region2Width; activeTopRegions++; }
//         if (config.region3Enabled) { calculatedWidth += region3Width; activeTopRegions++; }
//         if (activeTopRegions > 1) { calculatedWidth += spacing * (activeTopRegions - 1); }
//         calculatedWidth = Math.max(calculatedWidth, minWidth);

//         let calculatedHeight = padding * 2;
//         let activeVerticalRegions = 0;

//         if (config.region1Enabled || config.region2Enabled || config.region3Enabled) { calculatedHeight += topRegionHeight; activeVerticalRegions++; }
//         if (config.region4Enabled) {
//             const count4 = getActiveRegion4ComponentsCount();
//             calculatedHeight += count4 > 8 ? region4Height * 2 : region4Height;
//             activeVerticalRegions++;
//         }
//         if (config.region5Enabled) { calculatedHeight += region5Height; activeVerticalRegions++; }
//         if (activeVerticalRegions > 1) { calculatedHeight += spacing * (activeVerticalRegions - 1); }
//         calculatedHeight = Math.max(calculatedHeight, minHeight);

//         setConfig(prev => ({ ...prev, totalWidth: calculatedWidth, totalHeight: calculatedHeight }));
//     }, [
//         config.region1Enabled,
//         config.region2Enabled,
//         config.region3Enabled,
//         config.region4Enabled,
//         config.region5Enabled,
//         getActiveRegion4ComponentsCount,
//         FIXED_SIZES,
//     ]);

//     const toggleRegion = (key: keyof PanelConfig) => {
//         setConfig(prev => ({ ...prev, [key]: !prev[key] }));
//     };

//     const toggleRegion4Component = (key: keyof Region4Components) => {
//         setConfig(prev => ({
//             ...prev,
//             region4Components: {
//                 ...prev.region4Components,
//                 [key]: !prev.region4Components[key],
//             },
//         }));
//     };

//     const showNotification = (msg: string) => {
//         setNotification(msg);
//         setTimeout(() => setNotification(null), 3000);
//     };

//     const getActiveRegionCount = () =>
//         [config.region1Enabled, config.region2Enabled, config.region3Enabled, config.region4Enabled, config.region5Enabled].filter(Boolean).length;

//     const hasAnyTopRegion = config.region1Enabled || config.region2Enabled || config.region3Enabled;

//     const region4ComponentsData = [
//         { key: 'customerInfo', name: '고객정보', icon: '👤', color: 'orange' },
//         { key: 'callHistory', name: '통화이력', icon: '📞', color: 'green' },
//         { key: 'notes', name: '메모', icon: '📝', color: 'yellow' },
//         { key: 'toolbar', name: '툴바', icon: '🔧', color: 'indigo' },
//         { key: 'script', name: '스크립트', icon: '📜', color: 'blue' },
//         { key: 'transfer', name: '호전환', icon: '🔄', color: 'red' },
//         { key: 'dialpad', name: '다이얼패드', icon: '🔢', color: 'cyan' },
//         { key: 'recording', name: '녹음제어', icon: '🎙️', color: 'rose' },
//         { key: 'monitoring', name: '모니터링', icon: '👁️', color: 'teal' },
//         { key: 'reporting', name: '실시간통계', icon: '📊', color: 'violet' },
//         { key: 'contacts', name: '연락처', icon: '📇', color: 'lime' },
//         { key: 'calendar', name: '일정관리', icon: '📅', color: 'amber' },
//     ];

//     return (
//         <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
//             {notification && (
//                 <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
//                     <div className="flex items-center gap-2">
//                         <span>✅</span>
//                         <span>{notification}</span>
//                         <button onClick={() => setNotification(null)} className="ml-2 hover:text-gray-200">✕</button>
//                     </div>
//                 </div>
//             )}

//             <div className="bg-white border-b px-4 py-2">
//                 <h1 className="text-lg font-bold text-gray-800 text-center">CTI Task Master - 패널 설정</h1>
//             </div>

//             <div className="p-3" style={{ height: '55vh', maxHeight: '55vh' }}>
//                 <div className="h-full grid grid-cols-12 gap-3">
//                     {/* Left Preview Panel */}
//                     <div className="col-span-5">
//                         <div className="bg-white rounded-lg shadow-md h-full p-3">
//                             <div className="border-2 border-gray-300 bg-gray-50 rounded-lg p-3 relative h-full">
//                                 <div className="absolute top-1 right-1 text-xs bg-black text-white px-2 py-1 rounded z-10 font-bold">
//                                     {config.totalWidth} × {config.totalHeight}px
//                                 </div>
//                                 <div className="h-full flex flex-col gap-2">
//                                     {hasAnyTopRegion && (
//                                         <div className="flex gap-2" style={{ height: '70%' }}>
//                                             {config.region1Enabled && (
//                                                 <div
//                                                     className="rounded-lg border-2 border-teal-500 bg-teal-50 p-3 flex flex-col cursor-pointer transition-all duration-200 hover:scale-105"
//                                                     style={{
//                                                         flex: `0 0 ${(FIXED_SIZES.region1Width /
//                                                             ((config.region1Enabled ? FIXED_SIZES.region1Width : 0) +
//                                                                 (config.region2Enabled ? FIXED_SIZES.region2Width : 0) +
//                                                                 (config.region3Enabled ? FIXED_SIZES.region3Width : 0))) * 100}%`,
//                                                     }}
//                                                     onClick={() => toggleRegion('region1Enabled')}
//                                                 >
//                                                     <div className="flex items-center justify-center flex-1 mb-2">
//                                                         <div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">통화중</div>
//                                                     </div>
//                                                     <div className="grid grid-cols-2 gap-2">
//                                                         <div className="bg-white rounded text-center py-2 text-xs border">
//                                                             <div className="text-gray-500 mb-1">대기</div>
//                                                             <div className="font-bold text-lg">5</div>
//                                                         </div>
//                                                         <div className="bg-white rounded text-center py-2 text-xs border">
//                                                             <div className="text-gray-500 mb-1">상담</div>
//                                                             <div className="font-bold text-lg">1</div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             {config.region2Enabled && (
//                                                 <div
//                                                     className="grid grid-cols-2 gap-2 border-2 border-blue-500 bg-blue-50 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105"
//                                                     style={{
//                                                         flex: `0 0 ${(FIXED_SIZES.region2Width /
//                                                             ((config.region1Enabled ? FIXED_SIZES.region1Width : 0) +
//                                                                 (config.region2Enabled ? FIXED_SIZES.region2Width : 0) +
//                                                                 (config.region3Enabled ? FIXED_SIZES.region3Width : 0))) * 100}%`,
//                                                     }}
//                                                     onClick={() => toggleRegion('region2Enabled')}
//                                                 >
//                                                     <div className="bg-blue-300 rounded flex items-center justify-center text-sm font-medium py-3">대기</div>
//                                                     <div className="bg-teal-300 rounded flex items-center justify-center text-sm font-medium py-3">통화</div>
//                                                     <div className="bg-orange-300 rounded flex items-center justify-center text-sm font-medium py-3">후처리</div>
//                                                     <div className="bg-purple-300 rounded flex items-center justify-center text-sm font-medium py-3">휴식</div>
//                                                 </div>
//                                             )}
//                                             {config.region3Enabled && (
//                                                 <div
//                                                     className="flex flex-col gap-2 border-2 border-pink-500 bg-pink-50 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105"
//                                                     style={{
//                                                         flex: `0 0 ${(FIXED_SIZES.region3Width /
//                                                             ((config.region1Enabled ? FIXED_SIZES.region1Width : 0) +
//                                                                 (config.region2Enabled ? FIXED_SIZES.region2Width : 0) +
//                                                                 (config.region3Enabled ? FIXED_SIZES.region3Width : 0))) * 100}%`,
//                                                     }}
//                                                     onClick={() => toggleRegion('region3Enabled')}
//                                                 >
//                                                     <div className="flex-1 bg-pink-300 rounded flex items-center justify-center text-sm font-medium">일반폰드</div>
//                                                     <div className="flex-1 bg-pink-300 rounded flex items-center justify-center text-sm font-medium">아웃바운드</div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     )}

//                                     {/* Updated Region4 Preview: dynamic flex-wrap */}
//                                     {config.region4Enabled && (
//                                         <div
//                                             className="rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 border-2 bg-purple-100 border-purple-500 p-2 flex flex-col justify-center"
//                                             style={{ height: getActiveRegion4ComponentsCount() > 8 ? '25%' : '15%' }}
//                                             onClick={() => toggleRegion('region4Enabled')}
//                                         >
//                                             {
//                                                 getActiveRegion4ComponentsCount() === 0 ? (
//                                                     <div className="text-gray-500 text-xs text-center">구성요소 없음</div>
//                                                 ) : (
//                                                     <div className="flex flex-wrap gap-1 justify-center">
//                                                         {region4ComponentsData.filter(({ key }) => config.region4Components[key as keyof Region4Components]).map(({ key, name, icon }) => (
//                                                             <div key={key} className="bg-purple-300 text-xs px-1 py-0.5 rounded flex items-center gap-1">
//                                                                 <span>{icon}</span>
//                                                                 <span>{name}</span>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 )
//                                             }
//                                         </div>
//                                     )}

//                                     {config.region5Enabled && (
//                                         <div
//                                             className="rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 flex items-center justify-between px-3 text-sm border-2 bg-gray-200 border-gray-600"
//                                             style={{ height: '10%' }}
//                                             onClick={() => toggleRegion('region5Enabled')}
//                                         >
//                                             <span className="font-medium text-sm">LogOn: 44:42:17</span>
//                                             <span className="text-green-600 font-bold text-sm">● 온라인</span>
//                                         </div>
//                                     )}

//                                     {getActiveRegionCount() === 0 && (
//                                         <div className="h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
//                                             <div className="text-center">
//                                                 <div className="text-2xl mb-1">📋</div>
//                                                 <div className="text-xs">영역을 선택하세요</div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Center Controls */}
//                     <div className="col-span-4">
//                         <div className="bg-white rounded-lg shadow-md h-full p-3 flex flex-col">
//                             <h3 className="text-md font-bold text-gray-800 mb-2 text-center">영역 선택</h3>
//                             <div className="space-y-2 flex-1 overflow-y-auto">
//                                 {[
//                                     { key: 'region1Enabled', name: '📞 통화중 박스', color: 'teal', num: '1' },
//                                     { key: 'region2Enabled', name: '📊 상태 박스', color: 'blue', num: '2' },
//                                     { key: 'region3Enabled', name: '📋 폰드 정보', color: 'pink', num: '3' },
//                                     { key: 'region4Enabled', name: '📄 하단 정보', color: 'purple', num: '4' },
//                                     { key: 'region5Enabled', name: '👤 로그온 정보', color: 'gray', num: '5' },
//                                 ].map(({ key, name, color, num }) => (
//                                     <div
//                                         key={key}
//                                         className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${config[key as keyof PanelConfig] ? `bg-${color}-100 border-${color}-500 shadow-md` : 'bg-gray-50 border-gray-300 hover:border-gray-400'}`}
//                                         onClick={() => toggleRegion(key as keyof PanelConfig)}
//                                     >
//                                         <div className="flex items-center gap-2">
//                                             <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${config[key as keyof PanelConfig] ? `bg-${color}-500 text-white border-${color}-600` : 'bg-gray-200 text-gray-500 border-gray-300'}`}>{num}</div>
//                                             <div className="flex-1 min-w-0">
//                                                 <div className={`font-bold text-xs ${config[key as keyof PanelConfig] ? `text-${color}-700` : 'text-gray-600'}`}>{name}</div>
//                                             </div>
//                                             <div className={`text-sm ${config[key as keyof PanelConfig] ? `text-${color}-500` : 'text-gray-400'}`}>{config[key as keyof PanelConfig] ? '✓' : '○'}</div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="mt-1 p-2 bg-blue-50 rounded-lg text-center">
//                                 <div className="text-blue-800 font-bold text-xs">선택: {getActiveRegionCount()}/5개</div>
//                                 <div className="text-blue-600 text-xs mt-1">{config.totalWidth} × {config.totalHeight}px</div>
//                             </div>
//                             <div className="mt-1 bg-green-100 rounded-lg p-2">
//                                 <div className="text-green-800 font-bold text-center text-xs">🎯 Native 창 크기</div>
//                                 <div className="text-green-700 text-sm font-bold text-center">{config.totalWidth} × {config.totalHeight}px</div>
//                                 <div className="text-green-600 text-xs text-center">DPI 자동 적용</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Region4 Components Controls */}
//                     <div className="col-span-3">
//                         <div className="bg-white rounded-lg shadow-md h-full p-3 flex flex-col">
//                             <h3 className="text-md font-bold text-purple-800 mb-2 text-center">4영역 구성요소</h3>
//                             {!config.region4Enabled ? (
//                                 <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-2">
//                                     <div className="text-center">
//                                         <div className="text-lg mb-1">🔒</div>
//                                         <div className="text-xs">4영역 활성화 필요</div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <>
//                                     <div className="grid grid-cols-2 gap-1 flex-1 overflow-y-auto">
//                                         {region4ComponentsData.map(({ key, name, icon, color }) => {
//                                             const classes = region4ColorClasses[color];
//                                             const isActive = config.region4Components[key as keyof Region4Components];
//                                             return (
//                                                 <div
//                                                     key={key}
//                                                     className={`${isActive ? `${classes.bg} ${classes.border} shadow-md` : 'bg-gray-50 border-gray-300 hover:border-gray-400'} p-1 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105`}
//                                                     onClick={() => toggleRegion4Component(key as keyof Region4Components)}
//                                                 >
//                                                     <div className="flex items-center gap-1">
//                                                         <div
//                                                             className={`${isActive ? `${classes.iconBg} text-white ${classes.iconBorder}` : 'bg-gray-200 text-gray-500 border-gray-300'} w-4 h-4 rounded-full flex items-center justify-center text-xs`}
//                                                         >
//                                                             {icon}
//                                                         </div>
//                                                         <div className={`flex-1 min-w-0 font-bold text-xs ${isActive ? classes.text : 'text-gray-600'}`}>{name}</div>
//                                                         <div className={`text-sm font-bold ${isActive ? classes.text : 'text-gray-400'}`}>{isActive ? '✓' : '○'}</div>
//                                                     </div>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                     <div className="mt-1 p-1 bg-purple-50 rounded-lg text-center">
//                                         <div className="text-purple-800 font-bold text-xs">구성요소: {getActiveRegion4ComponentsCount()}/12개</div>
//                                         {getActiveRegion4ComponentsCount() > 8 && (
//                                             <div className="text-purple-600 text-xs">높이 2배 적용</div>
//                                         )}
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Footer Buttons */}
//             <div className="bg-white border-t p-2">
//                 <div className="flex gap-2 justify-center">
//                     <button
//                         onClick={() => {
//                             setConfig(prev => {
//                                 const allEnabledComponents = (Object.keys(prev.region4Components) as (keyof Region4Components)[]).reduce((acc, key) => {
//                                     acc[key] = true;
//                                     return acc;
//                                 }, {} as Region4Components);
//                                 return { ...prev, region1Enabled: true, region2Enabled: true, region3Enabled: true, region4Enabled: true, region5Enabled: true, region4Components: allEnabledComponents };
//                             });
//                             showNotification('모든 영역과 구성요소가 활성화되었습니다!');
//                         }}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
//                     >🔛 전체 활성화</button>
//                     <button
//                         onClick={() => { console.log('Tauri Native 설정:', { ...config, fixedSizes: FIXED_SIZES }); showNotification(`Native: ${config.totalWidth}×${config.totalHeight}px`); }}
//                         className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
//                     >✅ 설정 적용</button>
//                     <button
//                         onClick={() => {
//                             setConfig({
//                                 region1Enabled: true,
//                                 region2Enabled: true,
//                                 region3Enabled: true,
//                                 region4Enabled: true,
//                                 region5Enabled: true,
//                                 region4Components: {
//                                     customerInfo: true,
//                                     callHistory: true,
//                                     notes: false,
//                                     toolbar: true,
//                                     script: false,
//                                     transfer: false,
//                                     dialpad: false,
//                                     recording: false,
//                                     monitoring: false,
//                                     reporting: false,
//                                     contacts: false,
//                                     calendar: false,
//                                 },
//                                 totalWidth: 1000,
//                                 totalHeight: 500,
//                             });
//                             showNotification('기본값으로 초기화되었습니다!');
//                         }}
//                         className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
//                     >🔄 초기화</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default FiveRegionPanelSettings;

import React, { useEffect, useState, useCallback } from 'react';
import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window';

interface ExtendedCSSProperties extends React.CSSProperties {
    WebkitAppRegion?: 'drag' | 'no-drag';
}

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

const FiveRegionPanelSettings: React.FC = () => {
    const FIXED_SIZES = {
        region1Width: 260,
        region2Width: 360,
        region3Width: 220,
        topRegionHeight: 130,
        region4Height: 40,
        region5Height: 25,
        padding: 20,
        spacing: 10,
        minWidth: 400,
        minHeight: 300,
    };

    const [config, setConfig] = useState<PanelConfig>({
        region1Enabled: true,
        region2Enabled: true,
        region3Enabled: true,
        region4Enabled: true,
        region5Enabled: true,
        region4Components: {
            customerInfo: true,
            callHistory: true,
            notes: true,
            toolbar: true,
            script: true,
            transfer: true,
            dialpad: true,
            recording: true,
            monitoring: true,
            reporting: false,
            contacts: false,
            calendar: false,
        },
        totalWidth: 1000,
        totalHeight: 500,
    });

    const [notification, setNotification] = useState<string | null>(null);

    const getActiveRegion4ComponentsCount = useCallback(
        () => Object.values(config.region4Components).filter(Boolean).length,
        [config.region4Components]
    );

    useEffect(() => {
        const { padding, region1Width, region2Width, region3Width, spacing, minWidth, topRegionHeight, region4Height, region5Height, minHeight } = FIXED_SIZES;
        let calculatedWidth = padding * 2;
        let activeTopRegions = 0;

        if (config.region1Enabled) { calculatedWidth += region1Width; activeTopRegions++; }
        if (config.region2Enabled) { calculatedWidth += region2Width; activeTopRegions++; }
        if (config.region3Enabled) { calculatedWidth += region3Width; activeTopRegions++; }
        if (activeTopRegions > 1) { calculatedWidth += spacing * (activeTopRegions - 1); }
        calculatedWidth = Math.max(calculatedWidth, minWidth);

        let calculatedHeight = padding * 2;
        let activeVerticalRegions = 0;

        if (config.region1Enabled || config.region2Enabled || config.region3Enabled) {
            calculatedHeight += topRegionHeight;
            activeVerticalRegions++;
        }
        if (config.region4Enabled) {
            const count4 = getActiveRegion4ComponentsCount();
            calculatedHeight += count4 >= 7 ? region4Height * 2 : region4Height;
            activeVerticalRegions++;
        }
        if (config.region5Enabled) {
            calculatedHeight += region5Height;
            activeVerticalRegions++;
        }
        if (activeVerticalRegions > 1) {
            calculatedHeight += spacing * (activeVerticalRegions - 1);
        }
        calculatedHeight = Math.max(calculatedHeight, minHeight);

        setConfig(prev => ({ ...prev, totalWidth: calculatedWidth, totalHeight: calculatedHeight }));

        // 실제 창 크기 조절
        const resizeWindow = async () => {
            try {
                const window = getCurrentWindow();
                await window.setSize(new PhysicalSize(calculatedWidth, calculatedHeight));
            } catch (e) {
                console.error("Window resize failed. Are you in a Tauri environment?", e);
            }
        };
        resizeWindow();

    }, [
        config.region1Enabled, config.region2Enabled, config.region3Enabled, config.region4Enabled, config.region5Enabled,
        getActiveRegion4ComponentsCount,
        FIXED_SIZES,
    ]);


    const toggleRegion = (key: keyof PanelConfig) => { setConfig(prev => ({ ...prev, [key]: !prev[key] })); };
    const toggleRegion4Component = (key: keyof Region4Components) => { setConfig(prev => ({ ...prev, region4Components: { ...prev.region4Components, [key]: !prev.region4Components[key] } })); };
    const showNotification = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
    const getActiveRegionCount = () => [config.region1Enabled, config.region2Enabled, config.region3Enabled, config.region4Enabled, config.region5Enabled].filter(Boolean).length;
    const hasAnyTopRegion = config.region1Enabled || config.region2Enabled || config.region3Enabled;

    const region4ComponentsData = [
        { key: 'customerInfo', name: '고객정보', icon: '👤', color: 'orange' }, { key: 'callHistory', name: '통화이력', icon: '📞', color: 'green' }, { key: 'notes', name: '메모', icon: '📝', color: 'yellow' },
        { key: 'toolbar', name: '툴바', icon: '🔧', color: 'indigo' }, { key: 'script', name: '스크립트', icon: '📜', color: 'blue' }, { key: 'transfer', name: '호전환', icon: '🔄', color: 'red' },
        { key: 'dialpad', name: '다이얼패드', icon: '🔢', color: 'cyan' }, { key: 'recording', name: '녹음제어', icon: '🎙️', color: 'rose' }, { key: 'monitoring', name: '모니터링', icon: '👁️', color: 'teal' },
        { key: 'reporting', name: '실시간통계', icon: '📊', color: 'violet' }, { key: 'contacts', name: '연락처', icon: '📇', color: 'lime' }, { key: 'calendar', name: '일정관리', icon: '📅', color: 'amber' },
    ];

    return (
        <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}>
            {notification && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
                    <div className="flex items-center gap-2"><span>✅</span><span>{notification}</span><button onClick={() => setNotification(null)} className="ml-2 hover:text-gray-200">✕</button></div>
                </div>
            )}

            <div className="bg-white border-b px-4 py-2"><h1 className="text-lg font-bold text-gray-800 text-center">CTI Task Master - 패널 설정</h1></div>

            <div className="flex-1 p-3 overflow-y-auto">
                <div className="grid grid-cols-12 gap-3">
                    {/* 미리보기 패널 */}
                    <div className="col-span-5">
                        <div className="bg-white rounded-lg shadow-md h-full p-3">
                            <div className="border-2 border-gray-300 bg-gray-50 rounded-lg p-3 relative h-full">
                                <div className="absolute top-1 right-1 text-xs bg-black text-white px-2 py-1 rounded z-10">{config.totalWidth} × {config.totalHeight}px</div>
                                <div className="h-full flex flex-col gap-2">
                                    {hasAnyTopRegion && (
                                        <div className="flex gap-2" style={{ height: '70%' }}>
                                            {config.region1Enabled && <div className="rounded-lg border-2 border-teal-500 bg-teal-50 p-3 flex flex-col cursor-pointer" style={{ flexBasis: `${(FIXED_SIZES.region1Width / ((config.region1Enabled ? FIXED_SIZES.region1Width : 0) + (config.region2Enabled ? FIXED_SIZES.region2Width : 0) + (config.region3Enabled ? FIXED_SIZES.region3Width : 0))) * 100}%` }} onClick={() => toggleRegion('region1Enabled')}><div className="flex items-center justify-center flex-1 mb-2"><div className="w-16 h-16 bg-teal-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">통화중</div></div><div className="grid grid-cols-2 gap-2"><div className="bg-white rounded text-center py-2 text-xs border"><div className="text-gray-500 mb-1">대기</div><div className="font-bold text-lg">5</div></div><div className="bg-white rounded text-center py-2 text-xs border"><div className="text-gray-500 mb-1">상담</div><div className="font-bold text-lg">1</div></div></div></div>}
                                            {config.region2Enabled && <div className="grid grid-cols-2 gap-2 border-2 border-blue-500 bg-blue-50 rounded-lg p-3 cursor-pointer" style={{ flexBasis: `${(FIXED_SIZES.region2Width / ((config.region1Enabled ? FIXED_SIZES.region1Width : 0) + (config.region2Enabled ? FIXED_SIZES.region2Width : 0) + (config.region3Enabled ? FIXED_SIZES.region3Width : 0))) * 100}%` }} onClick={() => toggleRegion('region2Enabled')}><div className="bg-blue-300 rounded flex items-center justify-center text-sm font-medium">대기</div><div className="bg-teal-300 rounded flex items-center justify-center text-sm font-medium">통화</div><div className="bg-orange-300 rounded flex items-center justify-center text-sm font-medium">후처리</div><div className="bg-purple-300 rounded flex items-center justify-center text-sm font-medium">휴식</div></div>}
                                            {config.region3Enabled && <div className="flex flex-col gap-2 border-2 border-pink-500 bg-pink-50 rounded-lg p-3 cursor-pointer" style={{ flexBasis: `${(FIXED_SIZES.region3Width / ((config.region1Enabled ? FIXED_SIZES.region1Width : 0) + (config.region2Enabled ? FIXED_SIZES.region2Width : 0) + (config.region3Enabled ? FIXED_SIZES.region3Width : 0))) * 100}%` }} onClick={() => toggleRegion('region3Enabled')}><div className="flex-1 bg-pink-300 rounded flex items-center justify-center text-sm font-medium">일반폰드</div><div className="flex-1 bg-pink-300 rounded flex items-center justify-center text-sm font-medium">아웃바운드</div></div>}
                                        </div>
                                    )}
                                    {config.region4Enabled && (
                                        <div className="rounded-lg cursor-pointer border-2 bg-purple-100 border-purple-500 p-2 flex flex-col justify-center" style={{ minHeight: getActiveRegion4ComponentsCount() >= 7 ? '25%' : '15%' }} onClick={() => toggleRegion('region4Enabled')}>
                                            {getActiveRegion4ComponentsCount() > 0 ? (
                                                <div className="grid grid-cols-6 gap-1">
                                                    {region4ComponentsData.filter(({ key }) => config.region4Components[key as keyof Region4Components]).map(({ key, name, icon }) => (
                                                        <div key={key} className="bg-purple-200 text-xs px-1 py-0.5 rounded flex items-center gap-0.5 justify-center" title={name}>
                                                            <span>{icon}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-gray-500 text-xs text-center">구성요소 없음</div>
                                            )}
                                        </div>
                                    )}
                                    {config.region5Enabled && <div className="rounded-lg cursor-pointer flex items-center justify-between px-3 text-sm border-2 bg-gray-200 border-gray-600" style={{ height: '10%' }} onClick={() => toggleRegion('region5Enabled')}><span className="font-medium text-sm">LogOn: 44:42:17</span><span className="text-green-600 font-bold text-sm">● 온라인</span></div>}
                                    {getActiveRegionCount() === 0 && <div className="h-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"><div className="text-center"><div className="text-2xl mb-1">📋</div><div className="text-xs">영역을 선택하세요</div></div></div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 제어 패널 */}
                    <div className="col-span-7 grid grid-cols-2 gap-3">
                        <div className="col-span-1">
                            <div className="bg-white rounded-lg shadow-md h-full p-3 flex flex-col">
                                <h3 className="text-md font-bold text-gray-800 mb-2 text-center">영역 선택</h3>
                                <div className="space-y-2 flex-1">
                                    {[
                                        { key: 'region1Enabled', name: '📞 통화중 박스', color: 'teal', num: '1' }, { key: 'region2Enabled', name: '📊 상태 박스', color: 'blue', num: '2' },
                                        { key: 'region3Enabled', name: '📋 폰드 정보', color: 'pink', num: '3' }, { key: 'region4Enabled', name: '📄 하단 정보', color: 'purple', num: '4' },
                                        { key: 'region5Enabled', name: '👤 로그온 정보', color: 'gray', num: '5' },
                                    ].map(({ key, name, color, num }) => (
                                        <div key={key} className={`p-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${config[key as keyof PanelConfig] ? `bg-${color}-100 border-${color}-500 shadow-md` : 'bg-gray-50 border-gray-300 hover:border-gray-400'}`} onClick={() => toggleRegion(key as keyof PanelConfig)}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 ${config[key as keyof PanelConfig] ? `bg-${color}-500 text-white border-${color}-600` : 'bg-gray-200 text-gray-500 border-gray-300'}`}>{num}</div>
                                                <div className="flex-1 min-w-0"><div className={`font-bold text-xs ${config[key as keyof PanelConfig] ? `text-${color}-700` : 'text-gray-600'}`}>{name}</div></div>
                                                <div className={`text-sm font-bold ${config[key as keyof PanelConfig] ? 'text-gray-800' : 'text-gray-400'}`}>{config[key as keyof PanelConfig] ? '✓' : '○'}</div>
                                            </div>
                                        </div>
                                    ))}
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
                                            {region4ComponentsData.map(({ key, name, icon, color }) => (
                                                <div key={key} className={`p-1 rounded-lg border-2 cursor-pointer transition-all duration-200 ${config.region4Components[key as keyof Region4Components] ? `bg-${color}-100 border-${color}-500 shadow-md` : 'bg-gray-50 border-gray-300 hover:border-gray-400'}`} onClick={() => toggleRegion4Component(key as keyof Region4Components)}>
                                                    <div className="flex items-center gap-1">
                                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs border-2 ${config.region4Components[key as keyof Region4Components] ? `bg-${color}-500 text-white border-${color}-600` : 'bg-gray-200 text-gray-500 border-gray-300'}`}>{icon}</div>
                                                        <div className="flex-1 min-w-0"><div className={`font-bold text-xs ${config.region4Components[key as keyof Region4Components] ? `text-${color}-700` : 'text-gray-600'}`}>{name}</div></div>
                                                        <div className={`text-sm font-bold ${config.region4Components[key as keyof Region4Components] ? 'text-gray-800' : 'text-gray-400'}`}>{config.region4Components[key as keyof Region4Components] ? '✓' : '○'}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2 p-1 bg-purple-50 rounded-lg text-center">
                                            <div className="text-purple-800 font-bold text-xs">구성요소: {getActiveRegion4ComponentsCount()}/12개</div>
                                            {getActiveRegion4ComponentsCount() >= 7 && (<div className="text-purple-600 text-xs">높이 2배 적용</div>)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 요약 및 버튼 */}
            <div className="bg-white border-t p-2">
                <div className="flex justify-center items-center gap-4 text-xs mb-2">
                    <div><span className="font-bold">활성 영역:</span> <span className="text-blue-600">{getActiveRegionCount()}/5개</span></div>
                    <div><span className="font-bold">4영역 구성:</span> <span className="text-purple-600">{getActiveRegion4ComponentsCount()}/12개</span></div>
                    <div><span className="font-bold">계산된 크기:</span> <span className="text-green-600">{config.totalWidth} × {config.totalHeight}px</span></div>
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