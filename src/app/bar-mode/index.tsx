// C:\tauri\cti-task-manager-tauri\src\app\bar-mode\index.tsx

import React, { useState, useEffect } from 'react';
import { Pin, PinOff, Minus, BetweenHorizontalStart, X } from 'lucide-react';
import { useCTIStore } from '@/shared/store/useCTIStore';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { emit } from '@tauri-apps/api/event';
import MainSystemMenu from '@/widgets/titlebar/ui/MainSystemMenu';

interface Props {
    onModeChange: (mode: 'launcher' | 'bar' | 'panel' | 'login' | 'settings') => Promise<void>;
}

const BarModePage: React.FC<Props> = ({ onModeChange }) => {
    // CTI Store에서 상태 가져오기
    const status = useCTIStore(s => s.status);
    const currentTime = useCTIStore(s => s.currentTime);
    const totalTasks = useCTIStore(s => s.totalTasks);
    const completedTasks = useCTIStore(s => s.completedTasks);
    const efficiency = useCTIStore(s => s.efficiency);
    const callsPerHour = useCTIStore(s => s.callsPerHour);

    // 윈도우 상태
    const [alwaysOnTop, setAlwaysOnTop] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    // 임시 상태 데이터 (실제로는 store에서 더 세분화된 데이터 필요)
    const workTime = currentTime || '00:01:53';
    const waitTime = '02:50:20';
    const waitCount = 8;
    const callTime = '02:50:20';
    const callCount = 8;
    const pauseTime = '02:50:20';
    const pauseCount = 8;
    const restTime = '02:50:20';
    const restCount = 8;
    const errorCount = 2;

    // 윈도우 상태 초기화
    useEffect(() => {
        if (!(window as any).__TAURI__) return;
        (async () => {
            try {
                const { invoke } = await import('@tauri-apps/api/core');
                const win = getCurrentWebviewWindow();

                // 핀 상태 확인
                const pinState = await invoke('get_always_on_top_state') as boolean;
                setAlwaysOnTop(pinState);

                // 최대화 상태 확인
                setIsMaximized(await win.isMaximized());

                console.log(`📌 초기 핀 상태: ${pinState}, 최대화 상태: ${await win.isMaximized()}`);
            } catch (error) {
                console.error('❌ 윈도우 상태 초기화 실패:', error);
                // fallback to localStorage
                if (localStorage.getItem('alwaysOnTop') === 'true') {
                    const win = getCurrentWebviewWindow();
                    await win.setAlwaysOnTop(true);
                    setAlwaysOnTop(true);
                }
            }
        })();
    }, []);

    // 윈도우 제어 함수들
    const handleMinimize = async () => {
        try {
            await getCurrentWebviewWindow().minimize();
        } catch (error) {
            console.error('❌ 최소화 실패:', error);
        }
    };

    const handleToggleMaximize = async () => {
        try {
            const win = getCurrentWebviewWindow();
            const currentMaxState = await win.isMaximized();

            if (currentMaxState) {
                await win.unmaximize();
            } else {
                await win.maximize();
            }

            setIsMaximized(!currentMaxState);
            console.log(`📐 ${!currentMaxState ? '최대화' : '복원'} 완료`);
        } catch (error) {
            console.error('❌ 최대화/복원 실패:', error);
        }
    };

    // 핀 모드 토글 (실제 백엔드 구현)
    const handleAlwaysOnTop = async () => {
        try {
            const { invoke } = await import('@tauri-apps/api/core');
            const newState = await invoke('toggle_always_on_top') as boolean;
            setAlwaysOnTop(newState);

            console.log(`📌 핀 모드 ${newState ? '활성화' : '비활성화'}`);
        } catch (error) {
            console.error('❌ 핀 모드 변경 실패, fallback 사용:', error);
            // fallback implementation
            try {
                const win = getCurrentWebviewWindow();
                const next = !alwaysOnTop;
                await win.setAlwaysOnTop(next);
                setAlwaysOnTop(next);
                localStorage.setItem('alwaysOnTop', String(next));
                console.log(`📌 Fallback 핀 모드: ${next}`);
            } catch (fallbackError) {
                console.error('❌ Fallback 핀 모드도 실패:', fallbackError);
            }
        }
    };

    const handleClose = async () => {
        try {
            await getCurrentWebviewWindow().close();
        } catch (error) {
            console.error('❌ 창 닫기 실패:', error);
        }
    };

    // 런처로 돌아가기
    const handleBackToLauncher = async () => {
        try {
            await emit('back-to-launcher', 'bar');
            console.log('🏠 런처로 돌아가기 요청');
        } catch (error) {
            console.error('❌ 런처 복귀 실패:', error);
        }
    };

    return (
        <div
            style={{
                height: '100vh',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f1f5f9',
                border: 'none',
                borderRadius: '0',
                fontSize: '11px',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                margin: '0',
                padding: '0',
                userSelect: 'none',
                boxShadow: 'none',
                outline: 'none',
                width: '100%',
            }}
        >
            {/* 왼쪽: 시스템 메뉴 */}
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>
                <MainSystemMenu />
            </div>

            {/* LogOff 버튼 */}
            <div style={{ paddingLeft: '6px' }}>
                <button
                    style={{
                        padding: '2px 6px',
                        backgroundColor: '#e2e8f0',
                        border: '1px solid #94a3b8',
                        borderRadius: '3px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        height: '20px'
                    }}
                >
                    <span style={{ fontSize: '9px' }}>📤</span>
                    <span>LogOff</span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>00:00:00</span>
                </button>
            </div>

            {/* 현재 상태 */}
            <div style={{ paddingLeft: '6px' }}>
                <span
                    style={{
                        padding: '2px 8px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        height: '20px'
                    }}
                >
                    <span style={{ fontSize: '9px' }}>▶</span>
                    <span>{status || '대기중'}</span>
                    <span>{workTime}</span>
                </span>
            </div>

            {/* 드래그 가능한 중앙 영역 */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    paddingLeft: '8px',
                    flex: 1,
                    cursor: 'move'
                }}
                data-tauri-drag-region
            >
                {/* 대기 시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '11px' }}>⏳</span>
                    <span style={{ fontSize: '10px' }}>{waitTime}({waitCount})</span>
                </div>

                {/* 통화 시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '11px' }}>🎧</span>
                    <span style={{ fontSize: '10px' }}>{callTime}({callCount})</span>
                </div>

                {/* 일시정지 시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '11px' }}>⏸️</span>
                    <span style={{ fontSize: '10px' }}>{pauseTime}({pauseCount})</span>
                </div>

                {/* 휴식 시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '11px' }}>☕</span>
                    <span style={{ fontSize: '10px' }}>{restTime}({restCount})</span>
                </div>

                {/* 작업 수량 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    backgroundColor: '#dbeafe',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    border: '1px solid #93c5fd'
                }}>
                    <span style={{ fontSize: '11px' }}>📊</span>
                    <span style={{ color: '#1d4ed8', fontWeight: 'bold', fontSize: '10px' }}>{totalTasks || 10}</span>
                </div>

                {/* 오류 수량 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    backgroundColor: '#fecaca',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    border: '1px solid #f87171'
                }}>
                    <span style={{ color: '#dc2626', fontSize: '11px' }}>❌</span>
                    <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '10px' }}>{errorCount}</span>
                </div>
            </div>

            {/* 오른쪽: 컨트롤 버튼들 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                paddingRight: '4px'
            }}>
                {/* <button
                    onClick={handleBackToLauncher}
                    style={{
                        padding: '2px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '10px',
                        borderRadius: '1px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="런처로 돌아가기"
                >
                    🏠
                </button> */}

                {/* 패널 모드 전환 버튼 */}
                <button
                    onClick={() => onModeChange('panel')}
                    style={{
                        padding: '2px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '1px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="패널 모드로 전환"
                >
                    <BetweenHorizontalStart size={10} />
                </button>

                {/* 핀 버튼 (실제 기능) */}
                <button
                    onClick={handleAlwaysOnTop}
                    style={{
                        padding: '2px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '1px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: alwaysOnTop ? '#16a34a' : '#64748b'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = alwaysOnTop ? '#dcfce7' : '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title={alwaysOnTop ? '항상 위에 보이기 해제' : '항상 위에 보이기'}
                >
                    {alwaysOnTop ? <Pin size={10} /> : <PinOff size={10} />}
                </button>

                {/* 최소화 버튼 */}
                <button
                    onClick={handleMinimize}
                    style={{
                        padding: '2px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '1px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="최소화"
                >
                    <Minus size={10} />
                </button>

                {/* 닫기 버튼 */}
                <button
                    onClick={handleClose}
                    style={{
                        padding: '2px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '1px',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="닫기"
                >
                    <X size={10} style={{ color: '#dc2626' }} />
                </button>
            </div>
        </div>
    );
};

export default BarModePage;