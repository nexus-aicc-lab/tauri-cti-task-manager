// 개선된 네비게이션 컴포넌트
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

const NavigationButtons: React.FC = () => {
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    const router = useRouter();

    // 🎯 브라우저 네이티브 히스토리 상태 확인
    const updateNavigationState = () => {
        try {
            // 브라우저의 실제 히스토리 길이 확인
            const historyLength = window.history.length;

            // 세션 히스토리에서 현재 위치 추정
            // (정확한 인덱스는 브라우저에서 직접 제공하지 않음)

            // 기본적으로 히스토리가 있으면 뒤로 갈 수 있다고 가정
            const hasHistory = historyLength > 1;
            setCanGoBack(hasHistory);

            // 앞으로 가기는 popstate 이벤트로만 정확히 판단 가능
            // 초기에는 false로 설정

            console.log('🧭 네비게이션 상태:', {
                historyLength,
                canGoBack: hasHistory,
                currentPath: router.state.location.pathname
            });

        } catch (error) {
            console.warn('⚠️ 네비게이션 상태 확인 실패:', error);
            setCanGoBack(false);
            setCanGoForward(false);
        }
    };

    // 🎯 뒤로가기
    const goBack = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (canGoBack) {
            console.log('🔙 뒤로가기 실행');
            window.history.back(); // 브라우저 네이티브 API 사용
        }
    };

    // 🎯 앞으로가기  
    const goForward = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (canGoForward) {
            console.log('🔜 앞으로가기 실행');
            window.history.forward(); // 브라우저 네이티브 API 사용
        }
    };

    // 🎯 히스토리 변경 감지 (가장 중요!)
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            console.log('🔄 히스토리 변경 감지');

            // popstate 이벤트 후 약간의 지연을 두고 상태 확인
            setTimeout(() => {
                // 히스토리 변경 후에는 보통 앞으로/뒤로 모두 가능할 수 있음
                const historyLength = window.history.length;

                // 더 정교한 상태 확인을 위해 테스트 네비게이션 시도
                try {
                    // 뒤로 갈 수 있는지 확인 (실제로는 추정)
                    setCanGoBack(historyLength > 1);

                    // 앞으로 갈 수 있는지는 실제 시도해보는 것 외에는 
                    // 브라우저에서 직접적인 방법이 없음
                    // 하지만 popstate가 발생했다는 것은 뒤로 갔다는 의미이므로
                    // 대부분의 경우 앞으로 갈 수 있음
                    setCanGoForward(true);

                } catch (error) {
                    console.warn('히스토리 상태 확인 중 오류:', error);
                }
            }, 50);
        };

        // 새로운 페이지로 이동 감지
        const handleNewNavigation = () => {
            console.log('🆕 새 페이지 이동');
            // 새 페이지로 이동하면 앞으로 가기는 불가능해짐
            setCanGoForward(false);
            updateNavigationState();
        };

        window.addEventListener('popstate', handlePopState);

        // router 이벤트도 감지 (새로운 네비게이션용)
        // TanStack Router의 이벤트 시스템 활용
        const cleanup = router.subscribe('onBeforeLoad', () => {
            handleNewNavigation();
        });

        return () => {
            window.removeEventListener('popstate', handlePopState);
            cleanup?.();
        };
    }, [router]);

    // 🎯 라우터 경로 변경 감지 (새로운 네비게이션)
    useEffect(() => {
        // 경로가 변경되면 새로운 네비게이션으로 간주
        setCanGoForward(false);
        updateNavigationState();
    }, [router.state.location.pathname]);

    // 🎯 초기화
    useEffect(() => {
        updateNavigationState();
    }, []);

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={goBack}
                disabled={!canGoBack}
                className={`p-1.5 rounded transition-all duration-200 ${canGoBack
                        ? 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200'
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
                    }`}
                title="뒤로 가기"
            >
                <ChevronLeft size={14} />
            </button>

            <button
                onClick={goForward}
                disabled={!canGoForward}
                className={`p-1.5 rounded transition-all duration-200 ${canGoForward
                        ? 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200'
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
                    }`}
                title="앞으로 가기"
            >
                <ChevronRight size={14} />
            </button>

            {/* 디버그 정보 */}
            {process.env.NODE_ENV === 'development' && (
                <div className="ml-2 text-xs text-gray-500 font-mono">
                    ← {canGoBack ? '✅' : '❌'} | → {canGoForward ? '✅' : '❌'}
                </div>
            )}
        </div>
    );
};

export default NavigationButtons;