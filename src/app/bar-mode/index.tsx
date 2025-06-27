// import React, { useState, useEffect } from 'react';
// import { Pin, PinOff, Minus, BetweenHorizontalStart, X, Menu, LogOut } from 'lucide-react';
// import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
// import MainSystemMenu from '@/widgets/titlebar/ui/MainSystemMenu';

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
//                 height: '100vh',
//                 display: 'flex',
//                 alignItems: 'center',
//                 backgroundColor: '#ffffff',
//                 padding: '0 18px',
//                 fontSize: 13,
//                 fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//                 color: '#374151',
//                 userSelect: 'none',
//                 boxSizing: 'border-box',
//             }}
//         >
//             {/* 좌측 시스템 메뉴 */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
//                 <MainSystemMenu />

//                 {/* LogOff 버튼 */}
//                 <div
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 6,
//                         padding: '3px 8px',
//                         backgroundColor: 'transparent',
//                         fontSize: 11,
//                         color: '#64748b',
//                         fontWeight: 500,
//                     } as React.CSSProperties}
//                 >
//                     <LogOut size={12} />
//                     <span>LogOff</span>
//                     <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>00:00:00</span>
//                 </div>
//             </div>

//             {/* 구분선 */}
//             <div
//                 style={{
//                     width: '1px',
//                     height: '24px',
//                     backgroundColor: '#d1d5db',
//                     margin: '0 14px',
//                 }}
//             />

//             {/* 현재 상태 배지 */}
//             <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 8,
//                         backgroundColor: '#3B82F6',
//                         color: '#fff',
//                         padding: '6px 14px',
//                         borderRadius: 18,
//                         fontWeight: 500,
//                         fontSize: 11,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: 18,
//                             height: 18,
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
//                             style={{ width: 14, height: 14 }}
//                         />
//                     </div>
//                     <span>대기중 {waitTime}</span>
//                 </div>
//             </div>

//             {/* 구분선 */}
//             <div
//                 style={{
//                     width: '1px',
//                     height: '24px',
//                     backgroundColor: '#d1d5db',
//                     margin: '0 14px',
//                 }}
//             />

//             {/* 중앙 드래그 영역 */}
//             <div
//                 data-tauri-drag-region
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 16,
//                     flex: 1,
//                     cursor: 'move',
//                 }}
//             >
//                 {/* 통화 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 6,
//                         color: '#14b8a6',
//                         fontSize: 11,
//                         fontWeight: 600,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <img
//                         src="/icons/panel-mode/cell_phone.png"
//                         alt="통화"
//                         style={{ width: 14, height: 14 }}
//                     />
//                     <span>{callTime} (12)</span>
//                 </div>

//                 {/* 후처리 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 6,
//                         color: '#f97316',
//                         fontSize: 11,
//                         fontWeight: 600,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <img
//                         src="/icons/panel-mode/pencel.png"
//                         alt="후처리"
//                         style={{ width: 14, height: 14 }}
//                     />
//                     <span>{pauseTime} (8)</span>
//                 </div>

//                 {/* 대기 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 6,
//                         color: '#3b82f6',
//                         fontSize: 11,
//                         fontWeight: 600,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <img
//                         src="/icons/panel-mode/hourglass.png"
//                         alt="대기"
//                         style={{ width: 14, height: 14 }}
//                     />
//                     <span>12:00:34 (15)</span>
//                 </div>

//                 {/* 휴식 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 6,
//                         color: '#8b5cf6',
//                         fontSize: 11,
//                         fontWeight: 600,
//                         fontFamily: 'monospace',
//                     }}
//                 >
//                     <img
//                         src="/icons/panel-mode/coffe.png"
//                         alt="휴식"
//                         style={{ width: 14, height: 14 }}
//                     />
//                     <span>{restTime} (0)</span>
//                 </div>
//             </div>

//             {/* 구분선 */}
//             <div
//                 style={{
//                     width: '1px',
//                     height: '24px',
//                     backgroundColor: '#d1d5db',
//                     margin: '0 14px',
//                 }}
//             />

//             {/* 작업 수 영역 */}
//             <div
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 10,
//                     WebkitAppRegion: 'no-drag',
//                 } as React.CSSProperties}
//             >
//                 {/* 갈색 배지 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 6,
//                         minWidth: 32,
//                         height: 26,
//                         padding: '0 10px',
//                         backgroundColor: '#a16207',
//                         color: 'white',
//                         borderRadius: 13,
//                         fontSize: 12,
//                         fontWeight: 600,
//                     }}
//                 >
//                     <img
//                         src="/icons/bar-mode/cell_phone_brown.png"
//                         alt="갈색 전화"
//                         style={{ width: 12, height: 12 }}
//                     />
//                     <span>{brownCallCount}</span>
//                 </div>

//                 {/* 초록색 배지 */}
//                 <div
//                     style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: 6,
//                         minWidth: 32,
//                         height: 26,
//                         padding: '0 10px',
//                         backgroundColor: '#16a34a',
//                         color: 'white',
//                         borderRadius: 13,
//                         fontSize: 12,
//                         fontWeight: 600,
//                     }}
//                 >
//                     <img
//                         src="/icons/bar-mode/cell_phone_stop.png"
//                         alt="초록 전화"
//                         style={{ width: 12, height: 12 }}
//                     />
//                     <span>{greenCallCount}</span>
//                 </div>
//             </div>

//             {/* 구분선 */}
//             <div
//                 style={{
//                     width: '1px',
//                     height: '24px',
//                     backgroundColor: '#d1d5db',
//                     margin: '0 14px',
//                 }}
//             />

//             {/* 우측 컨트롤 */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 4, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
//                 {/* 패널 모드 전환 */}
//                 <button
//                     onClick={() => onModeChange('panel')}
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: 8,
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                         borderRadius: 6,
//                         width: 32,
//                         height: 32,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: '#6b7280',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = '#f3f4f6';
//                         e.currentTarget.style.color = '#374151';
//                     }}
//                     onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#6b7280';
//                     }}
//                 >
//                     <BetweenHorizontalStart size={16} />
//                 </button>

//                 {/* 핀 */}
//                 <button
//                     onClick={handleAlwaysOnTop}
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: 8,
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                         borderRadius: 6,
//                         width: 32,
//                         height: 32,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: alwaysOnTop ? '#059669' : '#6b7280',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         if (!alwaysOnTop) {
//                             e.currentTarget.style.backgroundColor = '#f3f4f6';
//                             e.currentTarget.style.color = '#374151';
//                         }
//                     }}
//                     onMouseLeave={(e) => {
//                         if (!alwaysOnTop) {
//                             e.currentTarget.style.backgroundColor = 'transparent';
//                             e.currentTarget.style.color = '#6b7280';
//                         }
//                     }}
//                 >
//                     {alwaysOnTop ? <Pin size={16} /> : <PinOff size={16} />}
//                 </button>

//                 {/* 최소화 */}
//                 <button
//                     onClick={handleMinimize}
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: 8,
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                         borderRadius: 6,
//                         width: 32,
//                         height: 32,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: '#6b7280',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = '#f3f4f6';
//                         e.currentTarget.style.color = '#374151';
//                     }}
//                     onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#6b7280';
//                     }}
//                 >
//                     <Minus size={16} />
//                 </button>

//                 {/* 닫기 */}
//                 <button
//                     onClick={handleClose}
//                     style={{
//                         WebkitAppRegion: 'no-drag',
//                         padding: 8,
//                         backgroundColor: 'transparent',
//                         border: 'none',
//                         cursor: 'pointer',
//                         borderRadius: 6,
//                         width: 32,
//                         height: 32,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: '#6b7280',
//                         transition: 'all 0.15s ease',
//                     } as React.CSSProperties}
//                     onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = '#fef2f2';
//                         e.currentTarget.style.color = '#dc2626';
//                     }}
//                     onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = 'transparent';
//                         e.currentTarget.style.color = '#6b7280';
//                     }}
//                 >
//                     <X size={16} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default BarModePage;

import React, { useState, useEffect } from 'react';
import { Pin, PinOff, Minus, BetweenHorizontalStart, X, LogOut } from 'lucide-react';
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
            data-tauri-drag-region
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F6FBFA',
                padding: '0 18px',
                fontSize: 13,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: '#374151',
                userSelect: 'none',
                boxSizing: 'border-box',
                cursor: 'move',
            }}
        >
            {/* 좌측 시스템 메뉴 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <MainSystemMenu />

                {/* LogOff 버튼 */}
                <div
                    style={{
                        WebkitAppRegion: 'no-drag',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 8px',
                        backgroundColor: 'transparent',
                        fontSize: 11,
                        color: '#64748b',
                        fontWeight: 500,
                    } as React.CSSProperties}
                >
                    <LogOut size={12} />
                    <span>LogOff</span>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>00:00:00</span>
                </div>
            </div>

            {/* 구분선 */}
            <div
                style={{
                    width: '1px',
                    height: '24px',
                    backgroundColor: '#d1d5db',
                    margin: '0 14px',
                }}
            />

            {/* 현재 상태 배지 */}
            <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        backgroundColor: '#3B82F6',
                        color: '#fff',
                        padding: '6px 14px',
                        borderRadius: 18,
                        fontWeight: 500,
                        fontSize: 11,
                        fontFamily: 'monospace',
                    }}
                >
                    <div
                        style={{
                            width: 18,
                            height: 18,
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
                            style={{ width: 14, height: 14 }}
                        />
                    </div>
                    <span>대기중 {waitTime}</span>
                </div>
            </div>

            {/* 구분선 */}
            <div
                style={{
                    width: '1px',
                    height: '24px',
                    backgroundColor: '#d1d5db',
                    margin: '0 14px',
                }}
            />

            {/* 중앙 정보 영역 */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    flex: 1,
                }}
            >
                {/* 통화 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#14b8a6',
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                    }}
                >
                    <img
                        src="/icons/panel-mode/cell_phone.png"
                        alt="통화"
                        style={{ width: 14, height: 14 }}
                    />
                    <span>{callTime} (12)</span>
                </div>

                {/* 후처리 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#f97316',
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                    }}
                >
                    <img
                        src="/icons/panel-mode/pencel.png"
                        alt="후처리"
                        style={{ width: 14, height: 14 }}
                    />
                    <span>{pauseTime} (8)</span>
                </div>

                {/* 대기 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#3b82f6',
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                    }}
                >
                    <img
                        src="/icons/panel-mode/hourglass.png"
                        alt="대기"
                        style={{ width: 14, height: 14 }}
                    />
                    <span>12:00:34 (15)</span>
                </div>

                {/* 휴식 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#8b5cf6',
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                    }}
                >
                    <img
                        src="/icons/panel-mode/coffe.png"
                        alt="휴식"
                        style={{ width: 14, height: 14 }}
                    />
                    <span>{restTime} (0)</span>
                </div>
            </div>

            {/* 구분선 */}
            <div
                style={{
                    width: '1px',
                    height: '24px',
                    backgroundColor: '#d1d5db',
                    margin: '0 14px',
                }}
            />

            {/* 작업 수 영역 */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    WebkitAppRegion: 'no-drag',
                } as React.CSSProperties}
            >
                {/* 갈색 배지 - 아이콘과 숫자 분리 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                    }}
                >
                    {/* 갈색 아이콘 */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 26,
                            height: 26,
                            backgroundColor: '#a16207',
                            borderRadius: 13,
                        }}
                    >
                        <img
                            src="/icons/bar-mode/cell_phone_brown.png"
                            alt="갈색 전화"
                            style={{ width: 12, height: 12 }}
                        />
                    </div>
                    {/* 갈색 숫자 */}
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#a16207',
                            minWidth: 16,
                            textAlign: 'center',
                        }}
                    >
                        {brownCallCount}
                    </span>
                </div>

                {/* 초록색 배지 - 아이콘과 숫자 분리 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                    }}
                >
                    {/* 초록색 아이콘 */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 26,
                            height: 26,
                            backgroundColor: '#16a34a',
                            borderRadius: 13,
                        }}
                    >
                        <img
                            src="/icons/bar-mode/cell_phone_stop.png"
                            alt="초록 전화"
                            style={{ width: 12, height: 12 }}
                        />
                    </div>
                    {/* 초록색 숫자 */}
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#16a34a',
                            minWidth: 16,
                            textAlign: 'center',
                        }}
                    >
                        {greenCallCount}
                    </span>
                </div>
            </div>

            {/* 구분선 */}
            <div
                style={{
                    width: '1px',
                    height: '24px',
                    backgroundColor: '#d1d5db',
                    margin: '0 14px',
                }}
            />

            {/* 우측 컨트롤 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                {/* 패널 모드 전환 */}
                <button
                    onClick={() => onModeChange('panel')}
                    style={{
                        WebkitAppRegion: 'no-drag',
                        padding: 8,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 6,
                        width: 32,
                        height: 32,
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
                    <BetweenHorizontalStart size={16} />
                </button>

                {/* 핀 */}
                <button
                    onClick={handleAlwaysOnTop}
                    style={{
                        WebkitAppRegion: 'no-drag',
                        padding: 8,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 6,
                        width: 32,
                        height: 32,
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
                    {alwaysOnTop ? <Pin size={16} /> : <PinOff size={16} />}
                </button>

                {/* 최소화 */}
                <button
                    onClick={handleMinimize}
                    style={{
                        WebkitAppRegion: 'no-drag',
                        padding: 8,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 6,
                        width: 32,
                        height: 32,
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
                    <Minus size={16} />
                </button>

                {/* 닫기 */}
                <button
                    onClick={handleClose}
                    style={{
                        WebkitAppRegion: 'no-drag',
                        padding: 8,
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 6,
                        width: 32,
                        height: 32,
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
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default BarModePage;