// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from '@/shared/ui/card';
// import {
//     PhoneIncoming,
//     ListTodo,
//     User as UserIcon,
//     Mail,
//     Clock,
// } from 'lucide-react';
// import AgentStatus1 from '../ui/AgentStatus1';
// import AgentStatus2 from '../ui/AgentStatus2';
// import AgentStatus3 from '../ui/AgentStatus3';
// import LoginForm from '@/shared/ui/LoginForm/LoginForm';
// import SimpleConsultantProfile from '@/shared/ui/LoginForm/CounsultantProfile';
// import CustomTitlebar from '../components/CustomTitlebar';

// // ✅ User 타입 정의
// interface User {
//     id: number;
//     email: string;
//     name: string;
//     profileImage?: string;
//     callStatus: 'READY' | 'BUSY' | 'BREAK' | 'OFFLINE';
//     createdAt: string;
// }

// interface AgentDashboardContentProps {
//     user?: User; // ✅ user props 추가
// }

// const dummyCalls = [
//     { time: '14:21', name: '홍길동', duration: '2분 43초' },
//     { time: '14:17', name: '이순신', duration: '1분 12초' },
// ];

// const dummyQueue = [
//     { name: '김유신', expected: '1분' },
//     { name: '강감찬', expected: '2분' },
//     { name: '을지문덕', expected: '3분' },
// ];

// // ✅ 상태별 스타일 함수
// const getStatusStyle = (status: User['callStatus']) => {
//     switch (status) {
//         case 'READY': return 'bg-green-100 text-green-800 border-green-200';
//         case 'BUSY': return 'bg-red-100 text-red-800 border-red-200';
//         case 'BREAK': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//         case 'OFFLINE': return 'bg-gray-100 text-gray-800 border-gray-200';
//         default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
// };

// const getStatusText = (status: User['callStatus']) => {
//     switch (status) {
//         case 'READY': return '대기중';
//         case 'BUSY': return '통화중';
//         case 'BREAK': return '휴식중';
//         case 'OFFLINE': return '오프라인';
//         default: return '알 수 없음';
//     }
// };

// const AgentDashboardContent: React.FC<AgentDashboardContentProps> = () => {
//     const [user, setUser] = useState<{ email: string; name: string } | null>(null);

//     useEffect(() => {
//         const checkUserStatus = () => {
//             const token = localStorage.getItem('token');
//             const userData = localStorage.getItem('user_data');

//             if (token && userData) {
//                 try {
//                     setUser(JSON.parse(userData));
//                 } catch {
//                     setUser(null);
//                 }
//             } else {
//                 setUser(null);
//             }
//         };

//         checkUserStatus();

//         // localStorage 변경 감지
//         window.addEventListener('storage', checkUserStatus);

//         return () => {
//             window.removeEventListener('storage', checkUserStatus);
//         };
//     }, []);

//     return (
//         <div className="space-y-6 max-w-7xl">
//             <CustomTitlebar title='상담사 대쉬 보드' />
//             {/* 메인 4열 구성 */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//                 <Card className="col-span-1">
//                     <CardContent className="p-4">
//                         <AgentStatus1 />
//                     </CardContent>
//                 </Card>

//                 <Card className="col-span-1">
//                     <CardContent className="p-4">
//                         <AgentStatus2 />
//                     </CardContent>
//                 </Card>

//                 <Card className="col-span-1">
//                     <CardContent className="p-4">
//                         <AgentStatus3 />
//                     </CardContent>
//                 </Card>

//                 {/* 로그인/프로필 카드 */}
//                 <Card className="col-span-1">
//                     <CardContent className="p-0">
//                         {user ? (
//                             <SimpleConsultantProfile
//                                 user={user}
//                                 onLogout={() => setUser(null)}
//                             />
//                         ) : (
//                             <LoginForm onSuccess={() => {
//                                 const userData = localStorage.getItem('user_data');
//                                 if (userData) setUser(JSON.parse(userData));
//                             }} />
//                         )}
//                     </CardContent>
//                 </Card>

//             </div>

//             {/* 하단 2열 */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Card className="min-h-[160px] flex flex-col justify-between">
//                     <CardHeader>
//                         <CardTitle className="text-sm font-medium flex items-center gap-1">
//                             <ListTodo className="w-4 h-4" /> 대기 목록
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-2">
//                         {dummyQueue.map((item, idx) => (
//                             <div key={idx} className="flex justify-between text-sm">
//                                 <span>{item.name}</span>
//                                 <span className="text-muted-foreground">예상 {item.expected}</span>
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>

//                 <Card className="min-h-[160px] flex flex-col justify-between">
//                     <CardHeader>
//                         <CardTitle className="text-sm font-medium flex items-center gap-1">
//                             <PhoneIncoming className="w-4 h-4" /> 최근 통화 목록
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-2">
//                         {dummyCalls.map((call, idx) => (
//                             <div key={idx} className="flex justify-between text-sm">
//                                 <span>{call.time}</span>
//                                 <span>{call.name}</span>
//                                 <span>{call.duration}</span>
//                             </div>
//                         ))}
//                     </CardContent>
//                 </Card>
//             </div>
//         </div>
//     );
// };

// export default AgentDashboardContent;

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
    MAX_HEIGHT: 1200, // 1500 → 1200으로 줄임
    TITLEBAR_HEIGHT: 42,
    CONTENT_PADDING: 20, // 60 → 20으로 줄임 (과도한 여백 방지)
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
    const [currentHeight, setCurrentHeight] = useState<number>(DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT);
    const [isInitialized, setIsInitialized] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [backendAvailable, setBackendAvailable] = useState(false);
    const [actualWindowHeight, setActualWindowHeight] = useState<number>(0);

    // DOM 참조
    const mainContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastHeightRef = useRef<number>(DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT);

    // ✅ 정확한 콘텐츠 높이 측정 (과도한 계산 방지)
    const measureContentHeight = useCallback(() => {
        if (!contentRef.current) return DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT;

        console.log(`📏 [dashboard] 높이 측정 시작`);

        // 1. 각 주요 섹션의 실제 높이를 개별 측정
        const sections = contentRef.current.children;
        let totalSectionHeight = 0;
        let maxSectionHeight = 0;

        console.log(`📊 [dashboard] 섹션별 높이 측정:`);

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i] as HTMLElement;

            // 섹션의 실제 높이 (여러 방법 중 가장 작은 값 사용)
            const rect = section.getBoundingClientRect();
            const computed = window.getComputedStyle(section);
            const marginTop = parseFloat(computed.marginTop) || 0;
            const marginBottom = parseFloat(computed.marginBottom) || 0;

            const sectionHeight = rect.height + marginTop + marginBottom;
            totalSectionHeight += sectionHeight;
            maxSectionHeight = Math.max(maxSectionHeight, sectionHeight);

            console.log(`  - 섹션 ${i}: ${Math.round(sectionHeight)}px (margin: ${marginTop}+${marginBottom})`);
        }

        // 2. space-y-4 여백 계산 (16px * 섹션 간격)
        const spacingHeight = sections.length > 1 ? (sections.length - 1) * 16 : 0;

        // 3. 콘텐츠 패딩 (16px * 2)
        const contentPadding = 32;

        // 4. 계산된 총 콘텐츠 높이
        const calculatedContentHeight = totalSectionHeight + spacingHeight + contentPadding;

        // 5. 실제 측정된 높이와 비교 (더 작은 값 사용)
        const measuredHeight = Math.min(
            contentRef.current.scrollHeight,
            contentRef.current.offsetHeight + 50, // 약간의 여유분
            calculatedContentHeight
        );

        // 6. 타이틀바 높이 추가
        const totalHeight = measuredHeight + DASHBOARD_WINDOW_CONFIG.TITLEBAR_HEIGHT;

        // 7. 최종 높이 (최소/최대 제한 적용)
        const finalHeight = Math.min(
            Math.max(totalHeight, DASHBOARD_WINDOW_CONFIG.MIN_HEIGHT),
            DASHBOARD_WINDOW_CONFIG.MAX_HEIGHT
        );

        console.log(`📊 [dashboard] 높이 계산 결과:`);
        console.log(`  - 섹션 총합: ${Math.round(totalSectionHeight)}px`);
        console.log(`  - 여백: ${spacingHeight}px`);
        console.log(`  - 패딩: ${contentPadding}px`);
        console.log(`  - 계산된 콘텐츠: ${Math.round(calculatedContentHeight)}px`);
        console.log(`  - 실제 측정: ${Math.round(measuredHeight)}px`);
        console.log(`  - 타이틀바: ${DASHBOARD_WINDOW_CONFIG.TITLEBAR_HEIGHT}px`);
        console.log(`  - 최종 높이: ${Math.round(finalHeight)}px`);

        return finalHeight;
    }, []);

    // ✅ 백엔드 가용성 체크
    const checkBackendAvailability = useCallback(async () => {
        try {
            await invoke('load_window_size', {
                window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
            });
            console.log(`✅ [dashboard] 백엔드 명령어 사용 가능`);
            setBackendAvailable(true);
            return true;
        } catch (error) {
            console.warn(`⚠️ [dashboard] 백엔드 명령어 사용 불가:`, error);
            setBackendAvailable(false);
            return false;
        }
    }, []);

    // ✅ 다양한 방식으로 윈도우 크기 조정 시도
    const applyNativeWindowSize = useCallback(async (newHeight: number) => {
        console.log(`🔧 [dashboard] 윈도우 크기 조정 시도: ${DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH}x${newHeight}`);

        // 방법 1: 백엔드 명령어 (우선)
        if (backendAvailable) {
            try {
                console.log(`🎯 [dashboard] 백엔드 명령어로 크기 조정 시도`);

                await invoke('apply_window_size', {
                    width: DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                    height: newHeight,
                    window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
                });

                console.log(`✅ [dashboard] 백엔드 명령어로 크기 조정 성공`);

                // 크기 저장
                await invoke('save_window_size', {
                    width: DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                    height: newHeight,
                    window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
                });

                return true;
            } catch (error) {
                console.error('❌ [dashboard] 백엔드 명령어 실패:', error);
                setBackendAvailable(false);
            }
        }

        // 방법 2: 직접 Tauri API 사용
        try {
            console.log(`🎯 [dashboard] 직접 Tauri API로 크기 조정 시도`);

            const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
            const { LogicalSize, PhysicalSize } = await import('@tauri-apps/api/window');
            const currentWindow = getCurrentWebviewWindow();

            // 현재 윈도우 정보 로그
            const currentSize = await currentWindow.innerSize();
            console.log(`📊 [dashboard] 현재 윈도우 크기: ${currentSize.width}x${currentSize.height}`);

            // LogicalSize로 시도
            await currentWindow.setSize(new LogicalSize(
                DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                newHeight
            ));

            console.log(`✅ [dashboard] LogicalSize로 크기 조정 성공`);

            // 적용 결과 확인
            setTimeout(async () => {
                const newSize = await currentWindow.innerSize();
                console.log(`📊 [dashboard] 조정 후 윈도우 크기: ${newSize.width}x${newSize.height}`);
                setActualWindowHeight(newSize.height);
            }, 200);

            return true;

        } catch (logicalError) {
            console.error('❌ [dashboard] LogicalSize 실패:', logicalError);

            // 방법 3: PhysicalSize로 재시도
            try {
                const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
                const { PhysicalSize } = await import('@tauri-apps/api/window');
                const currentWindow = getCurrentWebviewWindow();

                const devicePixelRatio = window.devicePixelRatio || 1;
                const physicalWidth = Math.round(DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH * devicePixelRatio);
                const physicalHeight = Math.round(newHeight * devicePixelRatio);

                await currentWindow.setSize(new PhysicalSize(physicalWidth, physicalHeight));
                console.log(`✅ [dashboard] PhysicalSize로 크기 조정 성공 (ratio: ${devicePixelRatio})`);
                return true;

            } catch (physicalError) {
                console.error('❌ [dashboard] PhysicalSize도 실패:', physicalError);
                return false;
            }
        }
    }, [backendAvailable]);

    // ✅ 윈도우 크기 조정 로직
    const adjustWindowSize = useCallback(async (delay: number = 200) => {
        if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
        }

        resizeTimeoutRef.current = setTimeout(async () => {
            if (!contentRef.current || !isInitialized) {
                console.log(`⏸️ [dashboard] 크기 조정 스킵 - 초기화 미완료`);
                return;
            }

            try {
                console.log(`🚀 [dashboard] ===== 크기 조정 시작 =====`);
                console.log(`🔍 [dashboard] 현재 상태:`);
                console.log(`  - 마지막 높이: ${lastHeightRef.current}px`);
                console.log(`  - 백엔드 사용 가능: ${backendAvailable}`);

                // 1. 필요한 높이 측정
                const requiredHeight = measureContentHeight();

                // 2. 변화량 확인
                const heightDifference = Math.abs(requiredHeight - lastHeightRef.current);

                if (heightDifference <= DASHBOARD_WINDOW_CONFIG.RESIZE_THRESHOLD) {
                    console.log(`ℹ️ [dashboard] 높이 변화 미미함 (${heightDifference}px), 스킵`);
                    return;
                }

                console.log(`🎯 [dashboard] 유의미한 변화: ${lastHeightRef.current}px → ${Math.round(requiredHeight)}px (차이: ${heightDifference}px)`);

                // 3. 상태 업데이트
                setCurrentHeight(requiredHeight);
                lastHeightRef.current = requiredHeight;

                // 4. 윈도우 크기 조정
                const success = await applyNativeWindowSize(requiredHeight);

                if (success) {
                    console.log(`✅ [dashboard] 윈도우 크기 조정 완료`);
                } else {
                    console.warn('⚠️ [dashboard] 윈도우 크기 조정 실패');
                }

                console.log(`🚀 [dashboard] ===== 크기 조정 완료 =====`);

            } catch (error) {
                console.error('❌ [dashboard] 크기 조정 중 오류:', error);
            }
        }, delay);
    }, [isInitialized, backendAvailable, applyNativeWindowSize, measureContentHeight]);

    // ✅ 현재 윈도우 크기 확인
    const checkCurrentWindowSize = useCallback(async () => {
        try {
            const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
            const currentWindow = getCurrentWebviewWindow();
            const size = await currentWindow.innerSize();

            console.log(`📊 [dashboard] 현재 실제 윈도우 크기: ${size.width}x${size.height}`);
            setActualWindowHeight(size.height);

            return size;
        } catch (error) {
            console.error('❌ [dashboard] 윈도우 크기 확인 실패:', error);
            return null;
        }
    }, []);

    // ✅ DOM 변화 감지
    useEffect(() => {
        if (!isInitialized) return;

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

        return () => observer.disconnect();
    }, [adjustWindowSize, isInitialized]);

    // ✅ 초기화
    useEffect(() => {
        const initialize = async () => {
            try {
                console.log("🚀 [dashboard] 대시보드 초기화 시작");

                // 백엔드 가용성 체크
                await checkBackendAvailability();

                // 현재 윈도우 크기 확인
                await checkCurrentWindowSize();

                await new Promise(resolve => setTimeout(resolve, 300));
                setIsInitialized(true);

                console.log("✅ [dashboard] 초기화 완료");

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
        console.log(`🔧 [dashboard] 수동 크기 조정 요청`);
        adjustWindowSize(50);
    }, [adjustWindowSize]);

    const forceRemeasure = useCallback(() => {
        console.log(`🔄 [dashboard] 강제 재측정 요청`);
        setForceUpdate(prev => prev + 1);
        setTimeout(() => adjustWindowSize(50), 100);
    }, [adjustWindowSize]);

    const testBackend = useCallback(async () => {
        console.log(`🧪 [dashboard] 백엔드 테스트 시작`);
        const available = await checkBackendAvailability();
        if (available) {
            try {
                const testHeight = 700;

                // 🔍 1. 현재 윈도우 라벨 확인
                const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
                const currentWindow = getCurrentWebviewWindow();
                const windowLabel = currentWindow.label;
                console.log(`🏷️ [dashboard] 현재 윈도우 라벨: "${windowLabel}"`);

                // 🔍 2. 백엔드에 전송되는 정확한 데이터 로깅
                console.log(`📤 [dashboard] 백엔드로 전송하는 데이터:`, {
                    width: DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                    height: testHeight,
                    window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
                });

                await invoke('apply_window_size', {
                    width: DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                    height: testHeight,
                    window_type: DASHBOARD_WINDOW_CONFIG.WINDOW_TYPE
                });

                console.log(`✅ [dashboard] 백엔드 테스트 성공: ${testHeight}px`);

                // 🔍 3. 결과 확인
                setTimeout(async () => {
                    const newSize = await currentWindow.innerSize();
                    console.log(`📊 [dashboard] 테스트 후 윈도우 크기: ${newSize.width}x${newSize.height}`);
                    if (newSize.height === testHeight) {
                        console.log(`✅ [dashboard] 백엔드 명령어가 정상 작동함`);
                    } else {
                        console.log(`❌ [dashboard] 백엔드 명령어가 윈도우 크기를 변경하지 못함`);
                        console.log(`  - 요청한 높이: ${testHeight}px`);
                        console.log(`  - 실제 높이: ${newSize.height}px`);
                    }
                    setActualWindowHeight(newSize.height);
                }, 300);

            } catch (error) {
                console.error('❌ [dashboard] 백엔드 테스트 실패:', error);
            }
        }
    }, [checkBackendAvailability]);

    // ✅ 강제 크기 조정 테스트 (디버깅용)
    const testDirectResize = useCallback(async () => {
        console.log(`🧪 [dashboard] 직접 크기 조정 테스트 시작`);
        try {
            const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
            const { LogicalSize } = await import('@tauri-apps/api/window');
            const currentWindow = getCurrentWebviewWindow();

            // 현재 콘텐츠에 맞는 적절한 높이로 직접 조정
            const appropriateHeight = 750; // 실제 필요해 보이는 높이

            console.log(`📐 [dashboard] ${appropriateHeight}px로 직접 크기 조정 시도`);

            await currentWindow.setSize(new LogicalSize(
                DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH,
                appropriateHeight
            ));

            console.log(`✅ [dashboard] 직접 크기 조정 완료`);

            setTimeout(async () => {
                const newSize = await currentWindow.innerSize();
                console.log(`📊 [dashboard] 조정 후 크기: ${newSize.width}x${newSize.height}`);
                setActualWindowHeight(newSize.height);
                setCurrentHeight(newSize.height);
                lastHeightRef.current = newSize.height;
            }, 200);

        } catch (error) {
            console.error('❌ [dashboard] 직접 크기 조정 실패:', error);
        }
    }, []);

    const refreshWindowSize = useCallback(async () => {
        console.log(`🔄 [dashboard] 윈도우 크기 새로고침`);
        await checkCurrentWindowSize();
    }, [checkCurrentWindowSize]);

    return (
        <div
            ref={mainContainerRef}
            style={{
                width: `${DASHBOARD_WINDOW_CONFIG.FIXED_WIDTH}px`,
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

            {/* 강화된 디버그 정보 */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-2 right-2 bg-black bg-opacity-90 text-white text-xs p-3 rounded space-y-1 min-w-[280px]">
                    <div className="font-bold text-yellow-300">📊 윈도우 디버그 정보</div>
                    <div>계산된 높이: {Math.round(currentHeight)}px</div>
                    <div>실제 윈도우: {actualWindowHeight}px</div>
                    <div>백엔드 사용 가능: {backendAvailable ? '✅' : '❌'}</div>
                    <div>초기화: {isInitialized ? '완료' : '진행중'}</div>
                    <div>업데이트: {forceUpdate}</div>

                    <div className="flex flex-wrap gap-1 pt-2">
                        <button
                            onClick={manualResize}
                            className="bg-blue-600 px-2 py-1 rounded text-white text-xs"
                        >
                            수동 조정
                        </button>
                        <button
                            onClick={forceRemeasure}
                            className="bg-green-600 px-2 py-1 rounded text-white text-xs"
                        >
                            재측정
                        </button>
                        <button
                            onClick={testBackend}
                            className="bg-purple-600 px-2 py-1 rounded text-white text-xs"
                        >
                            백엔드 테스트
                        </button>
                        <button
                            onClick={refreshWindowSize}
                            className="bg-orange-600 px-2 py-1 rounded text-white text-xs"
                        >
                            크기 새로고침
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentDashBoardContainer;