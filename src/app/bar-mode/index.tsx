// // // C:\tauri\cti-task-manager-tauri\src\app\bar-mode\index.tsx

// // import React, { useState, useEffect } from 'react';
// // import { Pin, PinOff, Minus, BetweenHorizontalStart, X } from 'lucide-react';
// // import { useCTIStore } from '@/shared/store/useCTIStore';
// // import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
// // import MainSystemMenu from '@/widgets/titlebar/ui/MainSystemMenu';
// // import AgentCallStatusBadge from './ui/AgentCallStatusBedge';

// // interface Props {
// //     onModeChange: (mode: 'launcher' | 'bar' | 'panel' | 'login' | 'settings') => Promise<void>;
// // }

// // const BarModePage: React.FC<Props> = ({ onModeChange }) => {
// //     // CTI Store에서 상태 가져오기
// //     const currentTime = useCTIStore(s => s.currentTime);
// //     const totalTasks = useCTIStore(s => s.totalTasks);

// //     // 윈도우 상태
// //     const [alwaysOnTop, setAlwaysOnTop] = useState(false);

// //     // 임시 데이터
// //     const workTime = currentTime || '00:01:53';
// //     const waitTime = '02:50:20', waitCount = 8;
// //     const callTime = '02:50:20', callCount = 8;
// //     const pauseTime = '02:50:20', pauseCount = 8;
// //     const restTime = '02:50:20', restCount = 8;
// //     const errorCount = 2;

// //     // 초기 윈도우 상태
// //     useEffect(() => {
// //         if (!(window as any).__TAURI__) return;
// //         (async () => {
// //             try {
// //                 const { invoke } = await import('@tauri-apps/api/core');
// //                 // const win = getCurrentWebviewWindow();
// //                 const pinState = (await invoke('get_always_on_top_state')) as boolean;
// //                 setAlwaysOnTop(pinState);
// //                 if (localStorage.getItem('alwaysOnTop') === 'true') {
// //                     const win = getCurrentWebviewWindow();
// //                     await win.setAlwaysOnTop(true);
// //                     setAlwaysOnTop(true);
// //                 }
// //             } catch (error) {
// //                 console.error('Error setting initial window state:', error);
// //             }
// //         })();
// //     }, []);

// //     // 윈도우 제어
// //     const handleMinimize = async () => {
// //         await getCurrentWebviewWindow().minimize();
// //     };

// //     // const handleToggleMaximize = async () => {
// //     //     const win = getCurrentWebviewWindow();
// //     //     const maximized = await win.isMaximized();
// //     //     maximized ? await win.unmaximize() : await win.maximize();
// //     // };

// //     const handleAlwaysOnTop = async () => {
// //         try {
// //             const { invoke } = await import('@tauri-apps/api/core');
// //             const next = (await invoke('toggle_always_on_top')) as boolean;
// //             setAlwaysOnTop(next);
// //             localStorage.setItem('alwaysOnTop', String(next));
// //         } catch {
// //             const win = getCurrentWebviewWindow();
// //             const next = !alwaysOnTop;
// //             await win.setAlwaysOnTop(next);
// //             setAlwaysOnTop(next);
// //             localStorage.setItem('alwaysOnTop', String(next));
// //         }
// //     };

// //     const handleClose = async () => {
// //         await getCurrentWebviewWindow().close();
// //     };

// //     // const handleBackToLauncher = async () => {
// //     //     await emit('back-to-launcher', 'bar');
// //     // };

// //     return (
// //         <div
// //             style={{
// //                 height: '100vh',
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 backgroundColor: '#fff',
// //                 padding: '0 12px',
// //                 fontSize: 12,
// //                 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
// //                 color: '#374151',
// //                 userSelect: 'none',
// //                 boxSizing: 'border-box',
// //             }}
// //         >
// //             {/* 좌측 시스템 메뉴 (클릭 가능) */}
// //             <div style={{ WebkitAppRegion: 'no-drag', display: 'flex', alignItems: 'center' } as React.CSSProperties}>
// //                 <MainSystemMenu />
// //             </div>

// //             {/* LogOff 버튼 */}
// //             <div style={{ WebkitAppRegion: 'no-drag', marginLeft: 12 } as React.CSSProperties}>
// //                 <button
// //                     style={{
// //                         WebkitAppRegion: 'no-drag',
// //                         padding: '4px 10px',
// //                         backgroundColor: '#f3f4f6',
// //                         border: 'none',
// //                         borderRadius: 6,
// //                         fontSize: 11,
// //                         cursor: 'pointer',
// //                         display: 'flex',
// //                         alignItems: 'center',
// //                         gap: 4,
// //                         height: 24,
// //                         color: '#6b7280',
// //                         fontWeight: 500,
// //                         transition: 'all .15s ease',
// //                     } as React.CSSProperties}
// //                 >
// //                     <span style={{ fontSize: 10 }}>📤</span>
// //                     <span>LogOff</span>
// //                     <span style={{ fontSize: 10, color: '#9ca3af' }}>00:00:00</span>
// //                 </button>
// //             </div>

// //             {/* 통화 상태 배지 (클릭 가능 아님) */}
// //             <AgentCallStatusBadge workTime={workTime} />

// //             {/* 중앙 드래그 영역 */}
// //             <div
// //                 data-tauri-drag-region
// //                 style={{
// //                     WebkitAppRegion: 'drag',
// //                     display: 'flex',
// //                     alignItems: 'center',
// //                     gap: 16,
// //                     marginLeft: 16,
// //                     flex: 1,
// //                     cursor: 'move',
// //                 } as React.CSSProperties}
// //             >
// //                 {/* 대기 */}
// //                 <div style={{
// //                     display: 'flex', alignItems: 'center', gap: 4,
// //                     padding: '2px 6px', borderRadius: 4, backgroundColor: '#fafafa'
// //                 }}>
// //                     <span style={{ fontSize: 12 }}>⏳</span>
// //                     <span style={{ fontSize: 11, fontWeight: 500 }}>{waitTime}</span>
// //                     <span style={{ fontSize: 10, color: '#6b7280' }}>({waitCount})</span>
// //                 </div>
// //                 {/* 통화 */}
// //                 <div style={{
// //                     display: 'flex', alignItems: 'center', gap: 4,
// //                     padding: '2px 6px', borderRadius: 4, backgroundColor: '#fafafa'
// //                 }}>
// //                     <span style={{ fontSize: 12 }}>🎧</span>
// //                     <span style={{ fontSize: 11, fontWeight: 500 }}>{callTime}</span>
// //                     <span style={{ fontSize: 10, color: '#6b7280' }}>({callCount})</span>
// //                 </div>
// //                 {/* 후처리 */}
// //                 <div style={{
// //                     display: 'flex', alignItems: 'center', gap: 4,
// //                     padding: '2px 6px', borderRadius: 4, backgroundColor: '#fafafa'
// //                 }}>
// //                     <span style={{ fontSize: 12 }}>⏸️</span>
// //                     <span style={{ fontSize: 11, fontWeight: 500 }}>{pauseTime}</span>
// //                     <span style={{ fontSize: 10, color: '#6b7280' }}>({pauseCount})</span>
// //                 </div>
// //                 {/* 휴식 */}
// //                 <div style={{
// //                     display: 'flex', alignItems: 'center', gap: 4,
// //                     padding: '2px 6px', borderRadius: 4, backgroundColor: '#fafafa'
// //                 }}>
// //                     <span style={{ fontSize: 12 }}>☕</span>
// //                     <span style={{ fontSize: 11, fontWeight: 500 }}>{restTime}</span>
// //                     <span style={{ fontSize: 10, color: '#6b7280' }}>({restCount})</span>
// //                 </div>
// //                 {/* 작업 */}
// //                 <div style={{
// //                     display: 'flex', alignItems: 'center', gap: 4,
// //                     backgroundColor: '#eff6ff', padding: '4px 8px',
// //                     borderRadius: 6, border: '1px solid #dbeafe'
// //                 }}>
// //                     <span style={{ fontSize: 12 }}>📊</span>
// //                     <span style={{ color: '#2563eb', fontWeight: 600, fontSize: 11 }}>{totalTasks || 0}</span>
// //                 </div>
// //                 {/* 오류 */}
// //                 <div style={{
// //                     display: 'flex', alignItems: 'center', gap: 4,
// //                     backgroundColor: '#fef2f2', padding: '4px 8px',
// //                     borderRadius: 6, border: '1px solid #fecaca'
// //                 }}>
// //                     <span style={{ color: '#dc2626', fontSize: 12 }}>❌</span>
// //                     <span style={{ color: '#dc2626', fontWeight: 600, fontSize: 11 }}>{errorCount}</span>
// //                 </div>
// //             </div>

// //             {/* 우측 컨트롤 (클릭 가능) */}
// //             <div style={{ WebkitAppRegion: 'no-drag', display: 'flex', alignItems: 'center', gap: 4 } as React.CSSProperties}>
// //                 {/* 패널 모드 전환 */}
// //                 <button
// //                     onClick={() => onModeChange('panel')}
// //                     style={{
// //                         WebkitAppRegion: 'no-drag',
// //                         padding: 6, backgroundColor: 'transparent', border: 'none',
// //                         cursor: 'pointer', borderRadius: 4, width: 28, height: 28,
// //                         display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                         color: '#6b7280', transition: 'all .15s ease'
// //                     } as React.CSSProperties}
// //                 >
// //                     <BetweenHorizontalStart size={14} />
// //                 </button>

// //                 {/* 핀 */}
// //                 <button
// //                     onClick={handleAlwaysOnTop}
// //                     style={{
// //                         WebkitAppRegion: 'no-drag',
// //                         padding: 6, backgroundColor: 'transparent', border: 'none',
// //                         cursor: 'pointer', borderRadius: 4, width: 28, height: 28,
// //                         display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                         color: alwaysOnTop ? '#059669' : '#6b7280', transition: 'all .15s ease'
// //                     } as React.CSSProperties}
// //                 >
// //                     {alwaysOnTop ? <Pin size={14} /> : <PinOff size={14} />}
// //                 </button>

// //                 {/* 최소화 */}
// //                 <button
// //                     onClick={handleMinimize}
// //                     style={{
// //                         WebkitAppRegion: 'no-drag',
// //                         padding: 6, backgroundColor: 'transparent', border: 'none',
// //                         cursor: 'pointer', borderRadius: 4, width: 28, height: 28,
// //                         display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                         color: '#6b7280', transition: 'all .15s ease'
// //                     } as React.CSSProperties}
// //                 >
// //                     <Minus size={14} />
// //                 </button>

// //                 {/* 닫기 */}
// //                 <button
// //                     onClick={handleClose}
// //                     style={{
// //                         WebkitAppRegion: 'no-drag',
// //                         padding: 6, backgroundColor: 'transparent', border: 'none',
// //                         cursor: 'pointer', borderRadius: 4, width: 28, height: 28,
// //                         display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                         color: '#6b7280', transition: 'all .15s ease'
// //                     } as React.CSSProperties}
// //                 >
// //                     <X size={14} />
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // export default BarModePage;

// import React, { useState, useEffect } from 'react';
// import { Pin, PinOff, Minus, BetweenHorizontalStart, X, Menu, LogOut } from 'lucide-react';
// import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

// interface Props {
//     onModeChange: (mode: 'launcher' | 'bar' | 'panel' | 'login' | 'settings') => Promise<void>;
// }

// const BarModePage: React.FC<Props> = ({ onModeChange }) => {
//     const [alwaysOnTop, setAlwaysOnTop] = useState(false);

//     // 예시 데이터
//     const waitTime = '00:38:08';
//     const callTime = '12:50:20';
//     const pauseTime = '00:34:20';
//     const restTime = '00:00:00';
//     const brownCallCount = 8;
//     const greenCallCount = 10;

//     useEffect(() => {
//         if (!(window as any).__TAURI__) return;
//         (async () => {
//             try {
//                 const { invoke } = await import('@tauri-apps/api/core');
//                 const pinState = (await invoke('get_always_on_top_state')) as boolean;
//                 setAlwaysOnTop(pinState);
//                 if (localStorage.getItem('alwaysOnTop') === 'true') {
//                     const win = getCurrentWebviewWindow();
//                     await win.setAlwaysOnTop(true);
//                     setAlwaysOnTop(true);
//                 }
//             } catch (error) {
//                 console.error('Error setting initial window state:', error);
//             }
//         })();
//     }, []);

//     const handleAlwaysOnTop = async () => {
//         try {
//             const { invoke } = await import('@tauri-apps/api/core');
//             const next = (await invoke('toggle_always_on_top')) as boolean;
//             setAlwaysOnTop(next);
//             localStorage.setItem('alwaysOnTop', String(next));
//         } catch {
//             const win = getCurrentWebviewWindow();
//             const next = !alwaysOnTop;
//             await win.setAlwaysOnTop(next);
//             setAlwaysOnTop(next);
//             localStorage.setItem('alwaysOnTop', String(next));
//         }
//     };

//     const handleMinimize = async () => {
//         await getCurrentWebviewWindow().minimize();
//     };

//     const handleClose = async () => {
//         await getCurrentWebviewWindow().close();
//     };

//     return (
//         <div
//             style={{
//                 height: '40px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 backgroundColor: '#f8fffe',
//                 padding: '8px 12px',
//                 fontSize: 12,
//                 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//                 color: '#374151',
//                 userSelect: 'none',
//                 boxSizing: 'border-box',
//                 border: '2px solid #7dd3fc',
//                 borderRadius: '24px',
//                 margin: '4px',
//             }}
//         >
//             {/* 좌측 시스템 메뉴 */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
//                 <button
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: '4px 6px',
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         borderRadius: 6,
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         color: '#6b7280',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = '#f3f4f6';
//                     }}
//                     onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                     }}
//                 >
//                     <Menu size={14} />
//                 </button>

//                 {/* LogOff 버튼 */}
//                 <div
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 4,
//                         padding: '2px 6px',
//                         backgroundColor: 'transparent',
//                         fontSize: 10,
//                         color: '#64748b',
//                         fontWeight: 500,
//                     } as React.CSSProperties}
//                 >
//                     <LogOut size={10} />
//                     <span>LogOff</span>
//                     <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'monospace' }}>00:00:00</span>
//                 </div>
//             </div>

//             {/* 구분선 */}
//             <div
//                 style={{
//                     width: '1px',
//                     height: '20px',
//                     backgroundColor: '#d1d5db',
//                     margin: '0 12px',
//                 }}
//             />

//             {/* 현재 상태 배지 */}
//             <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 6,
//                         backgroundColor: '#3B82F6',
//                         color: '#fff',
//                         padding: '4px 12px',
//                         borderRadius: 16,
//                         fontWeight: 500,
//                         fontSize: 10,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: 16,
//                             height: 16,
//                             borderRadius: '50%',
//                             backgroundColor: 'rgba(255, 255, 255, 0.25)',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                         }}
//                     >
//                         <img
//                             src="/icons/panel-mode/hourglass.png"
//                             alt="대기중"
//                             style={{ width: 12, height: 12 }}
//                         />
//                     </div>
//                     <span>대기중 {waitTime}</span>
//                 </div>
//             </div>

//             {/* 구분선 */}
//             <div
//                 style={{
//                     width: '1px',
//                     height: '20px',
//                     backgroundColor: '#d1d5db',
//                     margin: '0 12px',
//                 }}
//             />

//             {/* 중앙 드래그 영역 */}
//             <div
//                 data-tauri-drag-region
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 12,
//                     flex: 1,
//                     cursor: 'move',
//                 }}
//             >
//                 {/* 통화 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 4,
//                         color: '#14b8a6',
//                         fontSize: 10,
//                         fontWeight: 600,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <img
//                         src="/icons/panel-mode/cell_phone.png"
//                         alt="통화"
//                         style={{ width: 12, height: 12 }}
//                     />
//                     <span>{callTime} (12)</span>
//                 </div>

//                 {/* 후처리 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 4,
//                         color: '#f97316',
//                         fontSize: 10,
//                         fontWeight: 600,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <img
//                         src="/icons/panel-mode/pencel.png"
//                         alt="후처리"
//                         style={{ width: 12, height: 12 }}
//                     />
//                     <span>{pauseTime} (8)</span>
//                 </div>

//                 {/* 대기 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 4,
//                         color: '#3b82f6',
//                         fontSize: 10,
//                         fontWeight: 600,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <img
//                         src="/icons/panel-mode/hourglass.png"
//                         alt="대기"
//                         style={{ width: 12, height: 12 }}
//                     />
//                     <span>12:00:34 (15)</span>
//                 </div>

//                 {/* 휴식 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 4,
//                         color: '#8b5cf6',
//                         fontSize: 10,
//                         fontWeight: 600,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <img
//                         src="/icons/panel-mode/coffe.png"
//                         alt="휴식"
//                         style={{ width: 12, height: 12 }}
//                     />
//                     <span>{restTime} (0)</span>
//                 </div>
//             </div>

//             {/* 구분선 */}
//             <div
//                 style={{
//                     width: '1px',
//                     height: '20px',
//                     backgroundColor: '#d1d5db',
//                     margin: '0 12px',
//                 }}
//             />

//             {/* 작업 수 영역 */}
//             <div
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 8,
//                     WebkitAppRegion: 'no-drag',
//                 } as React.CSSProperties}
//             >
//                 {/* 갈색 배지 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 2,
//                         minWidth: 24,
//                         height: 20,
//                         padding: '0 6px',
//                         backgroundColor: '#a16207',
//                         color: 'white',
//                         borderRadius: '50%',
//                         fontSize: 10,
//                         fontWeight: 600,
//                     }}
//                 >
//                     <img
//                         src="/icons/bar-mode/cell_phone_brown.png"
//                         alt="갈색 전화"
//                         style={{ width: 8, height: 8 }}
//                     />
//                     <span>{brownCallCount}</span>
//                 </div>

//                 {/* 초록색 배지 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 2,
//                         minWidth: 24,
//                         height: 20,
//                         padding: '0 6px',
//                         backgroundColor: '#16a34a',
//                         color: 'white',
//                         borderRadius: '50%',
//                         fontSize: 10,
//                         fontWeight: 600,
//                     }}
//                 >
//                     <img
//                         src="/icons/bar-mode/cell_phone_stop.png"
//                         alt="초록 전화"
//                         style={{ width: 8, height: 8 }}
//                     />
//                     <span>{greenCallCount}</span>
//                 </div>
//             </div>

//             {/* 구분선 */}
//             <div
//                 style={{
//                     width: '1px',
//                     height: '20px',
//                     backgroundColor: '#d1d5db',
//                     margin: '0 12px',
//                 }}
//             />

//             {/* 우측 컨트롤 */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 2, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
//                 {/* 패널 모드 전환 */}
//                 <button
//                     onClick={() => onModeChange('panel')}
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: 6,
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                         borderRadius: 4,
//                         width: 28,
//                         height: 28,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: '#7dd3fc',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = '#f0f9ff';
//                         e.currentTarget.style.color = '#0ea5e9';
//                     }}
//                     onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#7dd3fc';
//                     }}
//                 >
//                     <BetweenHorizontalStart size={14} />
//                 </button>

//                 {/* 핀 */}
//                 <button
//                     onClick={handleAlwaysOnTop}
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: 6,
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                         borderRadius: 4,
//                         width: 28,
//                         height: 28,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: alwaysOnTop ? '#059669' : '#7dd3fc',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         if (!alwaysOnTop) {
//                             e.currentTarget.style.backgroundColor = '#f0f9ff';
//                             e.currentTarget.style.color = '#0ea5e9';
//                         }
//                     }}
//                     onMouseLeave={(e) => {
//                         if (!alwaysOnTop) {
//                             e.currentTarget.style.backgroundColor = 'transparent';
//                             e.currentTarget.style.color = '#7dd3fc';
//                         }
//                     }}
//                 >
//                     {alwaysOnTop ? <Pin size={14} /> : <PinOff size={14} />}
//                 </button>

//                 {/* 최소화 */}
//                 <button
//                     onClick={handleMinimize}
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: 6,
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                         borderRadius: 4,
//                         width: 28,
//                         height: 28,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: '#7dd3fc',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = '#f0f9ff';
//                         e.currentTarget.style.color = '#0ea5e9';
//                     }}
//                     onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#7dd3fc';
//                     }}
//                 >
//                     <Minus size={14} />
//                 </button>

//                 {/* 닫기 */}
//                 <button
//                     onClick={handleClose}
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: 6,
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                         borderRadius: 4,
//                         width: 28,
//                         height: 28,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: '#7dd3fc',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = '#fef2f2';
//                         e.currentTarget.style.color = '#dc2626';
//                     }}
//                     onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#7dd3fc';
//                     }}
//                 >
//                     <X size={14} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default BarModePage;

import React, { useState, useEffect } from 'react';
import { Pin, PinOff, Minus, BetweenHorizontalStart, X, Menu, LogOut } from 'lucide-react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import MainSystemMenu from '@/widgets/titlebar/ui/MainSystemMenu';

interface Props {
    onModeChange: (mode: 'launcher' | 'bar' | 'panel' | 'login' | 'settings') => Promise<void>;
}

const BarModePage: React.FC<Props> = ({ onModeChange }) => {
    const [alwaysOnTop, setAlwaysOnTop] = useState(false);

    // 예시 데이터
    const waitTime = '00:38:08';
    const callTime = '12:50:20';
    const pauseTime = '00:34:20';
    const restTime = '00:00:00';
    const brownCallCount = 8;
    const greenCallCount = 10;

    useEffect(() => {
        if (!(window as any).__TAURI__) return;
        (async () => {
            try {
                const { invoke } = await import('@tauri-apps/api/core');
                const pinState = (await invoke('get_always_on_top_state')) as boolean;
                setAlwaysOnTop(pinState);
                if (localStorage.getItem('alwaysOnTop') === 'true') {
                    const win = getCurrentWebviewWindow();
                    await win.setAlwaysOnTop(true);
                    setAlwaysOnTop(true);
                }
            } catch (error) {
                console.error('Error setting initial window state:', error);
            }
        })();
    }, []);

    const handleAlwaysOnTop = async () => {
        try {
            const { invoke } = await import('@tauri-apps/api/core');
            const next = (await invoke('toggle_always_on_top')) as boolean;
            setAlwaysOnTop(next);
            localStorage.setItem('alwaysOnTop', String(next));
        } catch {
            const win = getCurrentWebviewWindow();
            const next = !alwaysOnTop;
            await win.setAlwaysOnTop(next);
            setAlwaysOnTop(next);
            localStorage.setItem('alwaysOnTop', String(next));
        }
    };

    const handleMinimize = async () => {
        await getCurrentWebviewWindow().minimize();
    };

    const handleClose = async () => {
        await getCurrentWebviewWindow().close();
    };

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: '0 16px',
                fontSize: 12,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: '#374151',
                userSelect: 'none',
                boxSizing: 'border-box',
            }}
        >
            {/* 좌측 시스템 메뉴 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <MainSystemMenu />

                {/* LogOff 버튼 */}
                <div
                    style={{
                        WebkitAppRegion: 'no-drag',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 6px',
                        backgroundColor: 'transparent',
                        fontSize: 10,
                        color: '#64748b',
                        fontWeight: 500,
                    } as React.CSSProperties}
                >
                    <LogOut size={10} />
                    <span>LogOff</span>
                    <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'monospace' }}>00:00:00</span>
                </div>
            </div>

            {/* 구분선 */}
            <div
                style={{
                    width: '1px',
                    height: '20px',
                    backgroundColor: '#d1d5db',
                    margin: '0 12px',
                }}
            />

            {/* 현재 상태 배지 */}
            <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        backgroundColor: '#3B82F6',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontWeight: 500,
                        fontSize: 10,
                        fontFamily: 'monospace',
                    }}
                >
                    <div
                        style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src="/icons/panel-mode/hourglass.png"
                            alt="대기중"
                            style={{ width: 12, height: 12 }}
                        />
                    </div>
                    <span>대기중 {waitTime}</span>
                </div>
            </div>

            {/* 구분선 */}
            <div
                style={{
                    width: '1px',
                    height: '20px',
                    backgroundColor: '#d1d5db',
                    margin: '0 12px',
                }}
            />

            {/* 중앙 드래그 영역 */}
            <div
                data-tauri-drag-region
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flex: 1,
                    cursor: 'move',
                }}
            >
                {/* 통화 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: '#14b8a6',
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                    }}
                >
                    <img
                        src="/icons/panel-mode/cell_phone.png"
                        alt="통화"
                        style={{ width: 12, height: 12 }}
                    />
                    <span>{callTime} (12)</span>
                </div>

                {/* 후처리 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: '#f97316',
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                    }}
                >
                    <img
                        src="/icons/panel-mode/pencel.png"
                        alt="후처리"
                        style={{ width: 12, height: 12 }}
                    />
                    <span>{pauseTime} (8)</span>
                </div>

                {/* 대기 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: '#3b82f6',
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                    }}
                >
                    <img
                        src="/icons/panel-mode/hourglass.png"
                        alt="대기"
                        style={{ width: 12, height: 12 }}
                    />
                    <span>12:00:34 (15)</span>
                </div>

                {/* 휴식 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: '#8b5cf6',
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                    }}
                >
                    <img
                        src="/icons/panel-mode/coffe.png"
                        alt="휴식"
                        style={{ width: 12, height: 12 }}
                    />
                    <span>{restTime} (0)</span>
                </div>
            </div>

            {/* 구분선 */}
            <div
                style={{
                    width: '1px',
                    height: '20px',
                    backgroundColor: '#d1d5db',
                    margin: '0 12px',
                }}
            />

            {/* 작업 수 영역 */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    WebkitAppRegion: 'no-drag',
                } as React.CSSProperties}
            >
                {/* 갈색 배지 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        minWidth: 24,
                        height: 20,
                        padding: '0 6px',
                        backgroundColor: '#a16207',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: 10,
                        fontWeight: 600,
                    }}
                >
                    <img
                        src="/icons/bar-mode/cell_phone_brown.png"
                        alt="갈색 전화"
                        style={{ width: 8, height: 8 }}
                    />
                    <span>{brownCallCount}</span>
                </div>

                {/* 초록색 배지 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        minWidth: 24,
                        height: 20,
                        padding: '0 6px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: 10,
                        fontWeight: 600,
                    }}
                >
                    <img
                        src="/icons/bar-mode/cell_phone_stop.png"
                        alt="초록 전화"
                        style={{ width: 8, height: 8 }}
                    />
                    <span>{greenCallCount}</span>
                </div>
            </div>

            {/* 구분선 */}
            <div
                style={{
                    width: '1px',
                    height: '20px',
                    backgroundColor: '#d1d5db',
                    margin: '0 12px',
                }}
            />

            {/* 우측 컨트롤 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                {/* 패널 모드 전환 */}
                <button
                    onClick={() => onModeChange('panel')}
                    style={{
                        WebkitAppRegion: 'no-drag',
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 4,
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        transition: 'all 0.15s ease',
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                    }}
                >
                    <BetweenHorizontalStart size={14} />
                </button>

                {/* 핀 */}
                <button
                    onClick={handleAlwaysOnTop}
                    style={{
                        WebkitAppRegion: 'no-drag',
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 4,
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: alwaysOnTop ? '#059669' : '#6b7280',
                        transition: 'all 0.15s ease',
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                        if (!alwaysOnTop) {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.color = '#374151';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!alwaysOnTop) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                        }
                    }}
                >
                    {alwaysOnTop ? <Pin size={14} /> : <PinOff size={14} />}
                </button>

                {/* 최소화 */}
                <button
                    onClick={handleMinimize}
                    style={{
                        WebkitAppRegion: 'no-drag',
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 4,
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        transition: 'all 0.15s ease',
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                    }}
                >
                    <Minus size={14} />
                </button>

                {/* 닫기 */}
                <button
                    onClick={handleClose}
                    style={{
                        WebkitAppRegion: 'no-drag',
                        padding: 6,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 4,
                        width: 28,
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280',
                        transition: 'all 0.15s ease',
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                        e.currentTarget.style.color = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                    }}
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default BarModePage;