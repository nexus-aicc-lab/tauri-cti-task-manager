'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import {
    PhoneIncoming,
    ListTodo,
    User as UserIcon,
    Mail,
    Clock,
} from 'lucide-react';
import AgentStatus1 from '../ui/AgentStatus1';
import AgentStatus2 from '../ui/AgentStatus2';
import AgentStatus3 from '../ui/AgentStatus3';
import LoginForm from '@/shared/ui/LoginForm/LoginForm';
import SimpleConsultantProfile from '@/shared/ui/LoginForm/CounsultantProfile';
import CustomTitlebar from '../components/CustomTitlebar';

// ✅ 카드 개수 기반 넓이 + 기존 높이 계산 유지
const DASHBOARD_WINDOW_CONFIG = {
    // 넓이 설정 (카드당 350px)
    CARD_WIDTH: 350,
    GRID_GAP: 16,
    CONTENT_PADDING: 40,

    // 높이 설정 (기존 로직 유지)
    MIN_HEIGHT: 400,
    MAX_HEIGHT: 1200,
    TITLEBAR_HEIGHT: 42,
    CONTENT_PADDING_VERTICAL: 20,

    RESIZE_THRESHOLD: 10,
    WINDOW_TYPE: 'counselor-dashboard',
} as const;

interface User {
    id: number;
    email: string;
    name: string;
    profileImage?: string;
    callStatus: 'READY' | 'BUSY' | 'BREAK' | 'OFFLINE';
    createdAt: string;
}

interface AgentDashboardContentProps {
    user?: User;
}

const dummyCalls = [
    { time: '14:21', name: '홍길동', duration: '2분 43초' },
    { time: '14:17', name: '이순신', duration: '1분 12초' },
];

const dummyQueue = [
    { name: '김유신', expected: '1분' },
    { name: '강감찬', expected: '2분' },
    { name: '을지문덕', expected: '3분' },
];

const AgentDashBoardContainer: React.FC<AgentDashboardContentProps> = () => {
    const [user, setUser] = useState<{ email: string; name: string } | null>(null);
    const [currentWidth, setCurrentWidth] = useState<number>(0);
    const [currentHeight, setCurrentHeight] = useState<number>(DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT);
    const [isInitialized, setIsInitialized] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [backendAvailable, setBackendAvailable] = useState(false);
    const [actualWindowSize, setActualWindowSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    // DOM 참조
    const mainContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const topGridRef = useRef<HTMLDivElement>(null);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT });

    // ✅ 카드 개수 기반 넓이 계산 (정확한 수식)
    const calculateOptimalWidth = useCallback(() => {
        if (!topGridRef.current) return 1400; // 기본값

        // 실제 표시되는 카드 개수 계산
        const visibleCards = Array.from(topGridRef.current.children).filter(card => {
            const cardElement = card as HTMLElement;
            return cardElement.offsetWidth > 0 && cardElement.offsetHeight > 0;
        });

        const cardCount = visibleCards.length;
        if (cardCount === 0) return 1400;

        // 정확한 계산: 카드 개수 × 350px + 간격 + 패딩
        const totalCardWidth = cardCount * DASHBOARD_WINDOW_CONFIG.CARD_WIDTH;
        const totalGaps = cardCount > 1 ? (cardCount - 1) * DASHBOARD_WINDOW_CONFIG.GRID_GAP : 0;
        const calculatedWidth = totalCardWidth + totalGaps + DASHBOARD_WINDOW_CONFIG.CONTENT_PADDING;

        console.log(`📊 [dashboard] 넓이 계산: ${cardCount}개 카드 → ${calculatedWidth}px`);
        return calculatedWidth;
    }, []);

    // ✅ 기존 높이 계산 로직 그대로 유지 (잘 작동하던 방식)
    const measureContentHeight = useCallback(() => {
        if (!contentRef.current) return DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT;

        console.log(`📏 [dashboard] 높이 측정 시작`);

        // 기존 방식 그대로: 각 섹션별 높이 측정
        const sections = contentRef.current.children;
        let totalSectionHeight = 0;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i] as HTMLElement;
            const rect = section.getBoundingClientRect();
            const computed = window.getComputedStyle(section);
            const marginTop = parseFloat(computed.marginTop) || 0;
            const marginBottom = parseFloat(computed.marginBottom) || 0;

            const sectionHeight = rect.height + marginTop + marginBottom;
            totalSectionHeight += sectionHeight;

            console.log(`  - 섹션 ${i}: ${Math.round(sectionHeight)}px`);
        }

        // space-y-4 여백 계산 (16px * 섹션 간격)
        const spacingHeight = sections.length > 1 ? (sections.length - 1) * 16 : 0;

        // 콘텐츠 패딩
        const contentPadding = DASHBOARD_WINDOW_CONFIG.CONTENT_PADDING_VERTICAL;

        // 계산된 총 콘텐츠 높이
        const calculatedContentHeight = totalSectionHeight + spacingHeight + contentPadding;

        // 실제 측정된 높이와 비교 (더 작은 값 사용)
        const measuredHeight = Math.min(
            contentRef.current.scrollHeight,
            contentRef.current.offsetHeight + 30,
            calculatedContentHeight
        );

        // 타이틀바 높이 추가
        const totalHeight = measuredHeight + DASHBOARD_WINDOW_CONFIG.TITLEBAR_HEIGHT;

        // 최종 높이 (최소/최대 제한 적용)
        const finalHeight = Math.min(
            Math.max(totalHeight, DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT),
            DASHBOARD_WINDOW_CONFIG.MAX_HEIGHT
        );

        console.log(`📊 [dashboard] 높이 계산 결과: ${Math.round(finalHeight)}px`);
        return finalHeight;
    }, []);

    // ✅ 백엔드 가용성 체크
    const checkBackendAvailability = useCallback(async () => {
        try {
            await invoke('load_window_size', {
                window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
            });
            setBackendAvailable(true);
            return true;
        } catch (error) {
            setBackendAvailable(false);
            return false;
        }
    }, []);

    // ✅ 윈도우 크기 조정 (넓이 + 높이)
    const applyNativeWindowSize = useCallback(async (newWidth: number, newHeight: number) => {
        console.log(`🔧 [dashboard] 윈도우 크기 조정: ${newWidth}x${newHeight}`);

        // 백엔드 명령어 우선 시도
        if (backendAvailable) {
            try {
                await invoke('apply_window_size', {
                    width: newWidth,
                    height: newHeight,
                    window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
                });

                await invoke('save_window_size', {
                    width: newWidth,
                    height: newHeight,
                    window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
                });

                console.log(`✅ [dashboard] 백엔드로 크기 조정 성공`);
                return true;
            } catch (error) {
                setBackendAvailable(false);
            }
        }

        // 직접 Tauri API 사용
        try {
            const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
            const { LogicalSize } = await import('@tauri-apps/api/window');
            const currentWindow = getCurrentWebviewWindow();

            await currentWindow.setSize(new LogicalSize(newWidth, newHeight));
            console.log(`✅ [dashboard] 직접 API로 크기 조정 성공`);

            // 결과 확인
            setTimeout(async () => {
                const newSize = await currentWindow.innerSize();
                setActualWindowSize({ width: newSize.width, height: newSize.height });
            }, 200);

            return true;
        } catch (error) {
            console.error('❌ [dashboard] 크기 조정 실패:', error);
            return false;
        }
    }, [backendAvailable]);

    // ✅ 윈도우 크기 조정 로직
    const adjustWindowSize = useCallback(async (delay: number = 200) => {
        if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
        }

        resizeTimeoutRef.current = setTimeout(async () => {
            if (!contentRef.current || !isInitialized) {
                return;
            }

            try {
                // 넓이와 높이 계산
                const requiredWidth = calculateOptimalWidth();
                const requiredHeight = measureContentHeight();

                // 변화량 확인
                const widthDiff = Math.abs(requiredWidth - lastSizeRef.current.width);
                const heightDiff = Math.abs(requiredHeight - lastSizeRef.current.height);

                if (widthDiff <= DASHBOARD_WINDOW_CONFIG.RESIZE_THRESHOLD &&
                    heightDiff <= DASHBOARD_WINDOW_CONFIG.RESIZE_THRESHOLD) {
                    console.log(`ℹ️ [dashboard] 크기 변화 미미함, 스킵`);
                    return;
                }

                console.log(`🎯 [dashboard] 크기 변화: ${lastSizeRef.current.width}x${lastSizeRef.current.height} → ${Math.round(requiredWidth)}x${Math.round(requiredHeight)}`);

                // 상태 업데이트
                setCurrentWidth(requiredWidth);
                setCurrentHeight(requiredHeight);
                lastSizeRef.current = { width: requiredWidth, height: requiredHeight };

                // 윈도우 크기 적용
                await applyNativeWindowSize(requiredWidth, requiredHeight);

            } catch (error) {
                console.error('❌ [dashboard] 크기 조정 오류:', error);
            }
        }, delay);
    }, [isInitialized, calculateOptimalWidth, measureContentHeight, applyNativeWindowSize]);

    // ✅ 현재 윈도우 크기 확인
    const checkCurrentWindowSize = useCallback(async () => {
        try {
            const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
            const currentWindow = getCurrentWebviewWindow();
            const size = await currentWindow.innerSize();

            setActualWindowSize({ width: size.width, height: size.height });
            return size;
        } catch (error) {
            return null;
        }
    }, []);

    // ✅ DOM 변화 감지
    useEffect(() => {
        if (!isInitialized) return;

        const observer = new MutationObserver(() => {
            adjustWindowSize(500);
        });

        if (contentRef.current) {
            observer.observe(contentRef.current, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'hidden']
            });
        }

        return () => observer.disconnect();
    }, [adjustWindowSize, isInitialized]);

    // ✅ 초기화
    useEffect(() => {
        const initialize = async () => {
            try {
                console.log("🚀 [dashboard] 대시보드 초기화 시작");

                await checkBackendAvailability();
                await checkCurrentWindowSize();

                await new Promise(resolve => setTimeout(resolve, 300));
                setIsInitialized(true);

                // 초기 크기 조정
                setTimeout(() => adjustWindowSize(100), 500);
                setTimeout(() => adjustWindowSize(100), 1500);

            } catch (error) {
                console.error("❌ [dashboard] 초기화 실패:", error);
                setIsInitialized(true);
            }
        };

        initialize();

        return () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [adjustWindowSize, checkBackendAvailability, checkCurrentWindowSize]);

    // ✅ 사용자 상태 변경 감지
    useEffect(() => {
        if (isInitialized && user !== undefined) {
            console.log("👤 [dashboard] 사용자 상태 변경 감지");
            setForceUpdate(prev => prev + 1);
            setTimeout(() => adjustWindowSize(100), 300);
        }
    }, [user, isInitialized, adjustWindowSize]);

    // ✅ 로그인 상태 확인
    useEffect(() => {
        const checkUserStatus = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user_data');

            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUserStatus();
        window.addEventListener('storage', checkUserStatus);

        return () => {
            window.removeEventListener('storage', checkUserStatus);
        };
    }, []);

    // ✅ 디버깅 함수들
    const manualResize = useCallback(() => {
        adjustWindowSize(50);
    }, [adjustWindowSize]);

    const resetSize = useCallback(async () => {
        const resetWidth = 1400;
        const resetHeight = 600;

        setCurrentWidth(resetWidth);
        setCurrentHeight(resetHeight);
        lastSizeRef.current = { width: resetWidth, height: resetHeight };

        await applyNativeWindowSize(resetWidth, resetHeight);
    }, [applyNativeWindowSize]);

    return (
        <div
            ref={mainContainerRef}
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <CustomTitlebar title='상담사 대쉬 보드' />

            <div
                ref={contentRef}
                key={forceUpdate}
                style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    overflow: 'auto',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
                className="space-y-4"
            >
                {/* 메인 그리드 - 플렉스박스로 한 줄 배치 */}
                <div
                    ref={topGridRef}
                    className="flex gap-4 w-full"
                    style={{
                        flexWrap: 'nowrap',
                        justifyContent: 'flex-start'
                    }}
                >
                    <Card
                        className="h-auto flex-shrink-0"
                        style={{ width: `${DASHBOARD_WINDOW_CONFIG.CARD_WIDTH}px` }}
                    >
                        <CardContent className="p-4">
                            <AgentStatus1 />
                        </CardContent>
                    </Card>

                    <Card
                        className="h-auto flex-shrink-0"
                        style={{ width: `${DASHBOARD_WINDOW_CONFIG.CARD_WIDTH}px` }}
                    >
                        <CardContent className="p-4">
                            <AgentStatus2 />
                        </CardContent>
                    </Card>

                    <Card
                        className="h-auto flex-shrink-0"
                        style={{ width: `${DASHBOARD_WINDOW_CONFIG.CARD_WIDTH}px` }}
                    >
                        <CardContent className="p-4">
                            <AgentStatus3 />
                        </CardContent>
                    </Card>

                    <Card
                        className="h-auto flex-shrink-0"
                        style={{ width: `${DASHBOARD_WINDOW_CONFIG.CARD_WIDTH}px` }}
                    >
                        <CardContent className="p-0">
                            {user ? (
                                <SimpleConsultantProfile
                                    user={user}
                                    onLogout={() => setUser(null)}
                                />
                            ) : (
                                <LoginForm onSuccess={() => {
                                    const userData = localStorage.getItem('user_data');
                                    if (userData) setUser(JSON.parse(userData));
                                }} />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Card className="min-h-[140px] h-auto flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-1">
                                <ListTodo className="w-4 h-4" /> 대기 목록
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {dummyQueue.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{item.name}</span>
                                    <span className="text-muted-foreground">예상 {item.expected}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="min-h-[140px] h-auto flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-1">
                                <PhoneIncoming className="w-4 h-4" /> 최근 통화 목록
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {dummyCalls.map((call, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span>{call.time}</span>
                                    <span>{call.name}</span>
                                    <span>{call.duration}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div>hi1</div>
                <div>hi2</div>
            </div>

            {/* 디버그 정보 */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-2 right-2 bg-black bg-opacity-90 text-white text-xs p-3 rounded space-y-1 min-w-[320px]">
                    <div className="font-bold text-yellow-300">📊 카드 기반 정확한 계산</div>
                    <div>카드 개수: {topGridRef.current ? Array.from(topGridRef.current.children).filter(card => (card as HTMLElement).offsetWidth > 0).length : 0}개</div>
                    <div>예상 넓이: {topGridRef.current ?
                        (() => {
                            const count = Array.from(topGridRef.current.children).filter(card => (card as HTMLElement).offsetWidth > 0).length;
                            const gaps = count > 1 ? (count - 1) * 16 : 0;
                            return `${count} × 350 + ${gaps} + 40 = ${count * 350 + gaps + 40}px`;
                        })() :
                        '계산중...'
                    }</div>
                    <div>계산된 크기: {Math.round(currentWidth)}x{Math.round(currentHeight)}</div>
                    <div>실제 윈도우: {actualWindowSize.width}x{actualWindowSize.height}</div>
                    <div>백엔드: {backendAvailable ? '✅' : '❌'} | 사용자: {user ? '✅' : '❌'}</div>

                    <div className="flex gap-1 pt-2">
                        <button
                            onClick={manualResize}
                            className="bg-blue-600 px-2 py-1 rounded text-white text-xs"
                        >
                            조정
                        </button>
                        <button
                            onClick={resetSize}
                            className="bg-red-600 px-2 py-1 rounded text-white text-xs"
                        >
                            리셋
                        </button>
                        <button
                            onClick={checkCurrentWindowSize}
                            className="bg-green-600 px-2 py-1 rounded text-white text-xs"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentDashBoardContainer;