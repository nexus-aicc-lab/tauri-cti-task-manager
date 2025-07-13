// C:\tauri\cti-task-pilot\src\windows\counselor_dashboard\lib\windowResize.ts

// 카드 개수별 고정 넓이 설정
export const WINDOW_CONFIG = {
    WIDTH_MODES: {
        1: 430,
        2: 780,
        3: 1130,
        4: 1480,
    } as const,
    TITLEBAR_HEIGHT: 42,
    MIN_HEIGHT: 400,
    MAX_HEIGHT: 800,
} as const;

// 가시 카드 개수 계산
export const getVisibleCardCount = (topGridRef: React.RefObject<HTMLDivElement>): number => {
    if (!topGridRef.current) return 4;

    const visibleCards = Array.from(topGridRef.current.children).filter(card => {
        const cardElement = card as HTMLElement;
        return cardElement.offsetWidth > 0 && cardElement.offsetHeight > 0;
    });

    return visibleCards.length || 4;
};

// 실제 높이 측정
export const measureActualHeight = (contentRef: React.RefObject<HTMLDivElement>): number => {
    if (!contentRef.current) return WINDOW_CONFIG.MIN_HEIGHT;

    const sections = contentRef.current.children;
    let totalHeight = 0;

    // 각 섹션 높이 측정
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        const rect = section.getBoundingClientRect();
        const style = window.getComputedStyle(section);
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;

        totalHeight += rect.height + marginTop + marginBottom;
    }

    // 간격 및 패딩 추가
    const spacing = sections.length > 1 ? (sections.length - 1) * 16 : 0;
    const padding = 32; // 16px * 2
    const finalHeight = totalHeight + spacing + padding + WINDOW_CONFIG.TITLEBAR_HEIGHT;

    return Math.min(Math.max(finalHeight, WINDOW_CONFIG.MIN_HEIGHT), WINDOW_CONFIG.MAX_HEIGHT);
};

// 윈도우 크기 조정
export const adjustWindowSize = async (
    contentRef: React.RefObject<HTMLDivElement>,
    topGridRef: React.RefObject<HTMLDivElement>
): Promise<void> => {
    try {
        // 넓이: 카드 개수별 고정값
        const cardCount = getVisibleCardCount(topGridRef);
        const width = WINDOW_CONFIG.WIDTH_MODES[cardCount as keyof typeof WINDOW_CONFIG.WIDTH_MODES] || 1480;

        // 높이: 실제 측정값
        const height = measureActualHeight(contentRef);

        console.log(`🔧 윈도우 크기 조정: ${cardCount}개 카드 → ${width}x${height}`);

        // Tauri 윈도우 크기 변경
        const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
        const { LogicalSize } = await import('@tauri-apps/api/window');

        const currentWindow = getCurrentWebviewWindow();
        await currentWindow.setSize(new LogicalSize(width, height));

        console.log(`✅ 크기 조정 완료`);
    } catch (error) {
        console.error('❌ 크기 조정 실패:', error);
    }
};