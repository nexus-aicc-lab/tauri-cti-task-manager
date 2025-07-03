// src/windows/settings/components/NavigationButtons.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

const NavigationButtons: React.FC = () => {
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [historyIndex, setHistoryIndex] = useState(0);

    const router = useRouter();

    // 🎯 네비게이션 기능들
    const goBack = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (canGoBack) {
            console.log('🔙 뒤로가기 실행');
            router.history.back();
        }
    };

    const goForward = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (canGoForward) {
            console.log('🔜 앞으로가기 실행');
            router.history.forward();
        }
    };

    // 🔍 Hash Router용 히스토리 상태 확인 (개선된 버전)
    const updateNavigationState = () => {
        try {
            // Hash Router의 내부 히스토리 상태 확인
            const routerHistory = router.history;
            const currentIndex = routerHistory.location.state?.key ?
                parseInt(routerHistory.location.state.key) || 0 : 0;

            // 브라우저 히스토리와 비교
            const browserHistoryLength = window.history.length;

            // Hash 기반 네비게이션 가능 여부 확인
            const hasMultiplePages = browserHistoryLength > 1;
            const isNotFirstPage = currentIndex > 0 || hasMultiplePages;

            setCanGoBack(isNotFirstPage);
            setCanGoForward(false); // Hash Router에서는 forward 상태 확인이 어려움
            setHistoryIndex(currentIndex);

            console.log('🧭 네비게이션 상태 업데이트:', {
                browserHistoryLength,
                currentIndex,
                canGoBack: isNotFirstPage,
                canGoForward: false,
                currentHash: window.location.hash,
                routerLocation: router.state.location
            });
        } catch (error) {
            console.warn('⚠️ 네비게이션 상태 확인 실패:', error);
            // 안전한 기본값 설정
            setCanGoBack(window.history.length > 1);
            setCanGoForward(false);
        }
    };

    // 🎯 라우터 상태 변경 감지
    useEffect(() => {
        updateNavigationState();
    }, [router.state.location]);

    // 🎯 브라우저 히스토리 변경 감지
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            console.log('🔄 브라우저 히스토리 변경 감지:', event);
            setTimeout(updateNavigationState, 100); // 약간의 지연 후 상태 확인
        };

        const handleHashChange = () => {
            console.log('🔗 해시 변경 감지:', window.location.hash);
            setTimeout(updateNavigationState, 50);
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // 🎯 초기 상태 설정
    useEffect(() => {
        // 컴포넌트 마운트 시 상태 확인
        setTimeout(updateNavigationState, 100);
    }, []);

    return (
        <div className="flex items-center gap-1 p-2">
            <button
                onClick={goBack}
                disabled={!canGoBack}
                className={`p-1.5 rounded transition-all duration-200 shadow-sm ${canGoBack
                        ? 'text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
                    }`}
                title="뒤로 가기"
            >
                <ChevronLeft size={14} />
            </button>

            <button
                onClick={goForward}
                disabled={!canGoForward}
                className={`p-1.5 rounded transition-all duration-200 shadow-sm ${canGoForward
                        ? 'text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed border border-gray-200'
                    }`}
                title="앞으로 가기"
            >
                <ChevronRight size={14} />
            </button>

            {/* 🔍 디버그 정보 (개발 환경에서만) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="ml-2 text-xs text-gray-500 font-mono">
                    Back: {canGoBack ? '✅' : '❌'} | Idx: {historyIndex}
                </div>
            )}
        </div>
    );
};

export default NavigationButtons;