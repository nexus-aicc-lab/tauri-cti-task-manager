// hooks/useResponsiveWindowSizing.ts
import { useState, useEffect, useCallback } from 'react';

interface ScreenInfo {
    width: number;
    height: number;
    availableWidth: number;
    availableHeight: number;
    devicePixelRatio: number;
}

interface ResponsiveLimits {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    isSmallScreen: boolean;
}

export const useResponsiveWindowSizing = (windowType: 'panel-mode' | 'settings' | 'main') => {
    const [screenInfo, setScreenInfo] = useState<ScreenInfo>({
        width: 1920,
        height: 1080,
        availableWidth: 1900,
        availableHeight: 1000,
        devicePixelRatio: 1
    });

    const [responsiveLimits, setResponsiveLimits] = useState<ResponsiveLimits>({
        minWidth: 400,
        minHeight: 250,
        maxWidth: 900,
        maxHeight: 800,
        isSmallScreen: false
    });

    // 스크린 정보 감지
    const detectScreenInfo = useCallback(() => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const availWidth = window.screen.availWidth;
        const availHeight = window.screen.availHeight;
        const dpr = window.devicePixelRatio || 1;

        const info: ScreenInfo = {
            width: screenWidth,
            height: screenHeight,
            availableWidth: availWidth,
            availableHeight: availHeight,
            devicePixelRatio: dpr
        };

        console.log(`📱 화면 정보 감지:`, info);
        setScreenInfo(info);

        return info;
    }, []);

    // 반응형 크기 제한 계산 (최소/최대 제한 대폭 완화)
    const calculateResponsiveLimits = useCallback((info: ScreenInfo): ResponsiveLimits => {
        // 사용 가능한 실제 크기 (여유 공간 확보)
        const safeWidth = Math.floor(info.availableWidth * 0.98); // 98% 사용
        const safeHeight = Math.floor(info.availableHeight * 0.95); // 95% 사용

        // 작은 화면 판정 (1366x768 이하)
        const isSmallScreen = info.width <= 1366 || info.height <= 768;

        let limits: ResponsiveLimits;

        switch (windowType) {
            case 'panel-mode':
                limits = {
                    minWidth: 200,  // 매우 관대한 최소값
                    minHeight: 150, // 매우 관대한 최소값
                    maxWidth: safeWidth,   // 화면 크기까지 허용
                    maxHeight: safeHeight, // 화면 크기까지 허용
                    isSmallScreen
                };
                break;

            case 'settings':
                limits = {
                    minWidth: 300,  // 매우 관대한 최소값
                    minHeight: 200, // 매우 관대한 최소값
                    maxWidth: safeWidth,   // 화면 크기까지 허용
                    maxHeight: safeHeight, // 화면 크기까지 허용
                    isSmallScreen
                };
                break;

            case 'main':
            default:
                limits = {
                    minWidth: 250,  // 매우 관대한 최소값
                    minHeight: 150, // 매우 관대한 최소값
                    maxWidth: safeWidth,   // 화면 크기까지 허용
                    maxHeight: safeHeight, // 화면 크기까지 허용
                    isSmallScreen
                };
                break;
        }

        console.log(`🎯 [${windowType}] 컨텐츠 기반 크기 제한 (관대한 설정):`, limits);
        console.log(`📏 화면 정보: ${info.width}x${info.height} (사용가능: ${safeWidth}x${safeHeight})`);

        return limits;
    }, [windowType]);

    // 초기화 및 리사이즈 이벤트 리스너
    useEffect(() => {
        const updateLimits = () => {
            const info = detectScreenInfo();
            const limits = calculateResponsiveLimits(info);
            setResponsiveLimits(limits);
        };

        // 초기 설정
        updateLimits();

        // 리사이즈 이벤트 리스너
        window.addEventListener('resize', updateLimits);

        return () => {
            window.removeEventListener('resize', updateLimits);
        };
    }, [detectScreenInfo, calculateResponsiveLimits]);

    // 크기를 안전 범위 내로 조정하는 함수
    const getSafeSize = useCallback((width: number, height: number) => {
        const safeWidth = Math.max(
            responsiveLimits.minWidth,
            Math.min(responsiveLimits.maxWidth, width)
        );
        const safeHeight = Math.max(
            responsiveLimits.minHeight,
            Math.min(responsiveLimits.maxHeight, height)
        );

        return { width: safeWidth, height: safeHeight };
    }, [responsiveLimits]);

    // 화면 중앙 위치 계산
    const getCenterPosition = useCallback((width: number, height: number) => {
        const x = Math.floor((screenInfo.availableWidth - width) / 2);
        const y = Math.floor((screenInfo.availableHeight - height) / 2);

        return { x: Math.max(0, x), y: Math.max(0, y) };
    }, [screenInfo]);

    return {
        screenInfo,
        responsiveLimits,
        getSafeSize,
        getCenterPosition,
        detectScreenInfo
    };
};