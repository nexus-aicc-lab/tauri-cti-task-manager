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

// ✅ 대시보드 전용 설정
const DASHBOARD_WINDOW_CONFIG = {
    FIXED_WIDTH: 1400,
    MIN_HEIGHT: 500,
    MAX_HEIGHT: 1500,
    TITLEBAR_HEIGHT: 42,
    CONTENT_PADDING: 60,
    RESIZE_THRESHOLD: 5, // 더 민감하게
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
    const [currentHeight, setCurrentHeight] = useState<number>(DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT);
    const [isInitialized, setIsInitialized] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0);

    // DOM 참조
    const mainContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastHeightRef = useRef<number>(DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT);

    // ✅ 완전히 새로운 높이 측정 방식
    const measureContentHeight = useCallback(async () => {
        if (!contentRef.current) return DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT;

        console.log(`📏 [dashboard] ======= 높이 측정 시작 =======`);

        // 1. 가상의 측정용 div 생성
        const measureDiv = document.createElement('div');
        measureDiv.style.cssText = `
            position: absolute;
            top: -9999px;
            left: 0;
            width: ${DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH - 32}px;
            visibility: hidden;
            pointer-events: none;
            overflow: visible;
            height: auto;
        `;

        // 2. 현재 콘텐츠를 복제
        measureDiv.innerHTML = contentRef.current.innerHTML;
        document.body.appendChild(measureDiv);

        // 3. 브라우저가 레이아웃 계산을 완료하도록 강제
        measureDiv.offsetHeight;
        await new Promise(resolve => setTimeout(resolve, 10));

        const virtualHeight = measureDiv.scrollHeight;
        console.log(`📐 가상 div 높이: ${virtualHeight}px`);

        // 4. 측정용 div 제거
        document.body.removeChild(measureDiv);

        // 5. 직접 계산 방식도 병행
        let directCalculation = 0;
        const children = contentRef.current.children;

        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;

            // 임시로 모든 제약 해제
            const originalStyles = {
                height: child.style.height,
                maxHeight: child.style.maxHeight,
                overflow: child.style.overflow,
                position: child.style.position,
            };

            child.style.height = 'auto';
            child.style.maxHeight = 'none';
            child.style.overflow = 'visible';
            child.style.position = 'static';

            // 강제 리플로우
            child.offsetHeight;

            const childHeight = Math.max(
                child.scrollHeight,
                child.offsetHeight,
                child.getBoundingClientRect().height
            );

            directCalculation += childHeight;
            console.log(`  - Child ${i} [${child.className.slice(0, 20)}...]: ${Math.round(childHeight)}px`);

            // 스타일 복원
            Object.assign(child.style, originalStyles);
        }

        // 여백 추가 (space-y-4 = 16px per gap)
        if (children.length > 1) {
            directCalculation += (children.length - 1) * 16;
        }

        // 패딩 추가
        directCalculation += 32;

        console.log(`📊 직접 계산 높이: ${Math.round(directCalculation)}px`);
        console.log(`📊 가상 div 높이: ${virtualHeight}px`);

        // 더 큰 값 선택하되, 가상 div를 우선
        const finalHeight = Math.max(virtualHeight, directCalculation, 500);

        console.log(`🎯 최종 선택 높이: ${Math.round(finalHeight)}px`);
        console.log(`📏 ======= 높이 측정 완료 =======`);

        return finalHeight;
    }, []);

    // ✅ Tauri 백엔드 명령어를 사용한 네이티브 윈도우 크기 조정
    const applyNativeWindowSize = useCallback(async (newHeight: number) => {
        try {
            console.log(`🔧 [dashboard] 네이티브 윈도우 크기 조정 시도: ${DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH}x${newHeight}`);

            await invoke('apply_window_size', {
                width: DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                height: newHeight,
                window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
            });

            console.log(`✅ [dashboard] 네이티브 윈도우 크기 조정 성공`);

            await invoke('save_window_size', {
                width: DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                height: newHeight,
                window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
            });

            return true;
        } catch (error) {
            console.error('❌ [dashboard] 네이티브 윈도우 크기 조정 실패:', error);

            try {
                const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
                const { LogicalSize } = await import('@tauri-apps/api/window');
                const currentWindow = getCurrentWebviewWindow();

                await currentWindow.setSize(new LogicalSize(
                    DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                    newHeight
                ));

                console.log(`🔄 [dashboard] 폴백 방식으로 크기 조정 성공`);
                return true;
            } catch (fallbackError) {
                console.error('❌ [dashboard] 폴백 방식도 실패:', fallbackError);
                return false;
            }
        }
    }, []);

    // ✅ 완전히 새로운 크기 조정 로직
    const adjustWindowSize = useCallback(async (delay: number = 200) => {
        if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
        }

        resizeTimeoutRef.current = setTimeout(async () => {
            if (!contentRef.current || !isInitialized) {
                console.log(`⏸️ [dashboard] 크기 조정 스킵 - contentRef: ${!!contentRef.current}, initialized: ${isInitialized}`);
                return;
            }

            try {
                console.log(`🚀 [dashboard] ===== 크기 조정 시작 =====`);
                console.log(`🔍 [dashboard] 현재 상태 - 높이: ${lastHeightRef.current}px`);

                // DOM이 완전히 안정화될 때까지 대기
                await new Promise(resolve => setTimeout(resolve, 200));

                // 1. 실제 콘텐츠 높이 측정
                const actualContentHeight = await measureContentHeight();

                // 2. 총 윈도우 높이 계산
                const totalHeight = Math.min(
                    Math.max(
                        Math.ceil(actualContentHeight + DASHBOARD_WINDOW_CONFIG.TITLEBAR_HEIGHT + DASHBOARD_WINDOW_CONFIG.CONTENT_PADDING),
                        DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT
                    ),
                    DASHBOARD_WINDOW_CONFIG.MAX_HEIGHT
                );

                console.log(`📊 [dashboard] 계산 결과:`);
                console.log(`  - 콘텐츠 높이: ${Math.round(actualContentHeight)}px`);
                console.log(`  - 타이틀바: ${DASHBOARD_WINDOW_CONFIG.TITLEBAR_HEIGHT}px`);
                console.log(`  - 패딩: ${DASHBOARD_WINDOW_CONFIG.CONTENT_PADDING}px`);
                console.log(`  - 총 높이: ${totalHeight}px`);
                console.log(`  - 이전 높이: ${lastHeightRef.current}px`);

                // 3. 변화량 확인
                const heightDifference = Math.abs(totalHeight - lastHeightRef.current);

                if (heightDifference <= DASHBOARD_WINDOW_CONFIG.RESIZE_THRESHOLD) {
                    console.log(`ℹ️ [dashboard] 높이 변화 미미함 (${heightDifference}px), 스킵`);
                    return;
                }

                console.log(`🎯 [dashboard] 유의미한 변화 감지: ${lastHeightRef.current}px → ${totalHeight}px (차이: ${heightDifference}px)`);

                // 4. 즉시 상태 업데이트 (윈도우 크기 조정 전에)
                setCurrentHeight(totalHeight);
                lastHeightRef.current = totalHeight;

                // 5. 네이티브 윈도우 크기 조정
                const success = await applyNativeWindowSize(totalHeight);

                if (success) {
                    console.log(`✅ [dashboard] 크기 조정 완료: ${totalHeight}px`);
                } else {
                    console.warn('⚠️ [dashboard] 윈도우 크기 조정 실패');
                }

                console.log(`🚀 [dashboard] ===== 크기 조정 완료 =====`);

            } catch (error) {
                console.error('❌ [dashboard] 크기 조정 실패:', error);
            }
        }, delay);
    }, [isInitialized, applyNativeWindowSize, measureContentHeight]);

    // ✅ ResizeObserver 제거하고 더 단순한 감지 방식 사용
    useEffect(() => {
        if (!isInitialized) return;

        // 윈도우 리사이즈 이벤트로 감지
        const handleResize = () => {
            console.log(`🔄 [dashboard] 윈도우 리사이즈 이벤트 감지`);
            adjustWindowSize(300);
        };

        window.addEventListener('resize', handleResize);

        // DOM 변화를 감지하는 간단한 MutationObserver
        const observer = new MutationObserver(() => {
            console.log(`🔍 [dashboard] DOM 변화 감지`);
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

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, [adjustWindowSize, isInitialized]);

    // ✅ 초기화
    useEffect(() => {
        const initialize = async () => {
            try {
                console.log("🚀 [dashboard] 대시보드 초기화 시작");

                await new Promise(resolve => setTimeout(resolve, 300));
                setIsInitialized(true);

                console.log("✅ [dashboard] 초기화 완료, 첫 크기 조정 시작");

                // 초기 크기 조정 (충분한 간격으로)
                setTimeout(() => adjustWindowSize(100), 500);
                setTimeout(() => adjustWindowSize(100), 1000);
                setTimeout(() => adjustWindowSize(100), 2000);

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
    }, [adjustWindowSize]);

    // ✅ 사용자 상태 변경 감지
    useEffect(() => {
        if (isInitialized && user !== undefined) {
            console.log("👤 [dashboard] 사용자 상태 변경 감지");
            setForceUpdate(prev => prev + 1);

            setTimeout(() => adjustWindowSize(100), 300);
            setTimeout(() => adjustWindowSize(100), 800);
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

    // ✅ 수동 크기 조정
    const manualResize = useCallback(() => {
        console.log(`🔧 [dashboard] 수동 크기 조정 요청`);
        adjustWindowSize(50);
    }, [adjustWindowSize]);

    // ✅ 강제 재측정 (디버깅용)
    const forceRemeasure = useCallback(() => {
        console.log(`🔄 [dashboard] 강제 재측정 요청`);
        setForceUpdate(prev => prev + 1);
        setTimeout(() => adjustWindowSize(50), 100);
    }, [adjustWindowSize]);

    return (
        <div
            ref={mainContainerRef}
            style={{
                width: `${DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH}px`,
                minHeight: `${DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT}px`,
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'visible',
                position: 'relative'
            }}
        >
            <CustomTitlebar title='상담사 대쉬 보드' />

            <div
                ref={contentRef}
                key={forceUpdate} // ✅ forceUpdate로 강제 리렌더링
                style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'visible',
                    width: '100%',
                    boxSizing: 'border-box'
                }}
                className="space-y-4"
            >
                {/* 메인 4열 구성 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                    <Card className="col-span-1 h-auto">
                        <CardContent className="p-4">
                            <AgentStatus1 />
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 h-auto">
                        <CardContent className="p-4">
                            <AgentStatus2 />
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 h-auto">
                        <CardContent className="p-4">
                            <AgentStatus3 />
                        </CardContent>
                    </Card>

                    {/* 로그인/프로필 카드 */}
                    <Card className="col-span-1 h-auto">
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

                {/* 하단 2열 */}
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

                {/* 추가된 3번째 줄 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Card className="min-h-[140px] h-auto flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-1">
                                <ListTodo className="w-4 h-4" /> 대기 목록 2
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
                                <PhoneIncoming className="w-4 h-4" /> 최근 통화 목록 2
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
            </div>

            {/* 디버그 정보 */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded space-y-1">
                    <div>높이: {currentHeight}px</div>
                    <div>초기화: {isInitialized ? '완료' : '진행중'}</div>
                    <div>마지막: {lastHeightRef.current}px</div>
                    <div>업데이트: {forceUpdate}</div>
                    <button
                        onClick={manualResize}
                        className="bg-blue-600 px-2 py-1 rounded text-white text-xs mt-1 mr-1"
                    >
                        수동 조정
                    </button>
                    <button
                        onClick={forceRemeasure}
                        className="bg-green-600 px-2 py-1 rounded text-white text-xs mt-1"
                    >
                        강제 재측정
                    </button>
                </div>
            )}
        </div>
    );
};

export default AgentDashBoardContainer;