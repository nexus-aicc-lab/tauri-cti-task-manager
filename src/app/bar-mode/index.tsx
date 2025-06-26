// C:\tauri\cti-task-manager-tauri\src\app\bar-mode\index.tsx

import React, { useState, useEffect } from 'react';
import { Pin, Minimize, Maximize, X } from 'lucide-react';
import { MainSystemMenu } from '@/widgets/titlebar/ui/MainSystemMenu';
import { useCTIStore } from '@/shared/store/useCTIStore';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { emit } from '@tauri-apps/api/event';
import HamburgerButtonForSystemMenuWithDropdownStyle from '../panel-mode/ui/HamburgerButtonForSystemMenuWithDropdownStyle';

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
            const win = getCurrentWebviewWindow();
            if (localStorage.getItem('alwaysOnTop') === 'true') {
                await win.setAlwaysOnTop(true);
                setAlwaysOnTop(true);
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

    const handleToggleMax = async () => {
        try {
            await getCurrentWebviewWindow().toggleMaximize();
        } catch (error) {
            console.error('❌ 최대화 실패:', error);
        }
    };

    const handleAlwaysOnTop = async () => {
        try {
            const win = getCurrentWebviewWindow();
            const next = !alwaysOnTop;
            await win.setAlwaysOnTop(next);
            setAlwaysOnTop(next);
            localStorage.setItem('alwaysOnTop', String(next));
            console.log(`📌 항상 위 고정: ${next}`);
        } catch (error) {
            console.error('❌ 항상 위 고정 실패:', error);
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
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#e6f3ff',
                border: '1px solid #b3d9f7',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                margin: '2px',
                userSelect: 'none',
            }}
        >
            {/* 왼쪽: 시스템 메뉴 */}
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '4px' }}>
                {/* <MainSystemMenu /> */}
                <HamburgerButtonForSystemMenuWithDropdownStyle />
            </div>

            {/* LogOff 버튼 */}
            <div style={{ paddingLeft: '8px' }}>
                <button
                    style={{
                        padding: '2px 6px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ccc',
                        borderRadius: '2px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                    }}
                >
                    <span>📤</span>
                    <span>LogOff</span>
                    <span style={{ fontSize: '9px', color: '#666' }}>00:00:00</span>
                </button>
            </div>

            {/* 현재 상태 */}
            <div style={{ paddingLeft: '8px' }}>
                <span
                    style={{
                        padding: '2px 8px',
                        backgroundColor: '#4285f4',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px'
                    }}
                >
                    <span>▶</span>
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
                    <img src="/모래시계.png" alt="대기" style={{ width: '14px', height: '14px' }} />
                    <span>{waitTime}({waitCount})</span>
                </div>

                {/* 통화 시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <img src="/head_phone.png" alt="통화" style={{ width: '14px', height: '14px' }} />
                    <span>{callTime}({callCount})</span>
                </div>

                {/* 일시정지 시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <img src="/pause.png" alt="일시정지" style={{ width: '14px', height: '14px' }} />
                    <span>{pauseTime}({pauseCount})</span>
                </div>

                {/* 휴식 시간 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <img src="/커피_아이콘.png" alt="휴식" style={{ width: '14px', height: '14px' }} />
                    <span>{restTime}({restCount})</span>
                </div>

                {/* 작업 수량 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    backgroundColor: '#e3f2fd',
                    padding: '2px 4px',
                    borderRadius: '2px'
                }}>
                    <img src="/mini_graph.png" alt="작업" style={{ width: '14px', height: '14px' }} />
                    <span style={{ color: '#1976d2', fontWeight: 'bold' }}>{totalTasks || 10}</span>
                </div>

                {/* 오류 수량 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    backgroundColor: '#ffebee',
                    padding: '2px 4px',
                    borderRadius: '2px'
                }}>
                    <span style={{ color: '#d32f2f', fontSize: '12px' }}>❌</span>
                    <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>{errorCount}</span>
                </div>
            </div>

            {/* 오른쪽: 컨트롤 버튼들 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1px',
                paddingRight: '4px'
            }}>
                <button
                    onClick={handleBackToLauncher}
                    style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#d1ecf1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="런처로 돌아가기"
                >
                    🏠
                </button>

                <button
                    onClick={() => onModeChange('panel')}
                    style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#d1ecf1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="패널 모드로 전환"
                >
                    📋
                </button>

                <button
                    onClick={handleAlwaysOnTop}
                    style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#d1ecf1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="항상 위에 고정"
                >
                    <Pin size={12} className={alwaysOnTop ? 'rotate-45' : ''} />
                </button>

                <button
                    onClick={handleMinimize}
                    style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#d1ecf1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="최소화"
                >
                    <Minimize size={12} />
                </button>

                <button
                    onClick={handleToggleMax}
                    style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#d1ecf1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="최대화"
                >
                    <Maximize size={12} />
                </button>

                <button
                    onClick={handleClose}
                    style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffcdd2';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    title="닫기"
                >
                    <X size={12} style={{ color: '#d32f2f' }} />
                </button>
            </div>
        </div>
    );
};

export default BarModePage;