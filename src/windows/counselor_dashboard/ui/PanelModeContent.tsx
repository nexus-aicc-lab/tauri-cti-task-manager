// src/app/panel-mode/ui/PanelModeContent.tsx
import React, { useEffect, useState, useRef } from 'react';
import useMeasure from 'react-use-measure';
import AgentStatus1 from './AgentStatus1';
import AgentStatus2 from './AgentStatus2';
import AgentStatus3 from './AgentStatus3';
import AgentStatus4 from './AgentStatus4';

interface PanelModeContentProps {
    onSizeCalculated?: (size: { width: number; height: number }) => void;
}

const PanelModeContent: React.FC<PanelModeContentProps> = ({
    onSizeCalculated
}) => {
    const [lastNotifiedSize, setLastNotifiedSize] = useState({ width: 0, height: 0 });
    const isInitialMount = useRef(true);
    const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 🎯 react-use-measure로 정확한 크기 측정
    const [ref, bounds] = useMeasure({
        debounce: 150, // 디바운싱 시간 단축
        scroll: false,
        offsetSize: true,
    });

    // 🎯 크기 변화 감지 및 전달 (개선된 로직)
    useEffect(() => {
        if (bounds.width > 0 && bounds.height > 0 && onSizeCalculated) {
            // 고정값들
            const TITLEBAR_HEIGHT = 42;
            const PADDING = 16;
            const WINDOW_BORDER = 8;
            const MIN_WIDTH = 900;

            const totalWidth = Math.max(MIN_WIDTH, Math.ceil(bounds.width) + PADDING);
            const totalHeight = Math.ceil(bounds.height) + PADDING + TITLEBAR_HEIGHT + WINDOW_BORDER;

            // 💡 크기 변화 임계값 설정 (너무 작은 변화는 무시)
            const THRESHOLD = 5;
            const widthDiff = Math.abs(totalWidth - lastNotifiedSize.width);
            const heightDiff = Math.abs(totalHeight - lastNotifiedSize.height);

            const shouldNotify = isInitialMount.current ||
                widthDiff > THRESHOLD ||
                heightDiff > THRESHOLD;

            if (shouldNotify) {
                console.log(`📏 react-use-measure 측정 결과:`);
                console.log(`   - 실제 컨텐츠: ${Math.ceil(bounds.width)}x${Math.ceil(bounds.height)}px`);
                console.log(`   - 변화량: width ${widthDiff}px, height ${heightDiff}px`);
                console.log(`🎯 최종 윈도우 크기: ${totalWidth}x${totalHeight}`);

                // 기존 타이머 취소
                if (resizeTimeoutRef.current) {
                    clearTimeout(resizeTimeoutRef.current);
                }

                // 짧은 지연 후 크기 알림 (연속된 변화 방지)
                resizeTimeoutRef.current = setTimeout(() => {
                    onSizeCalculated({
                        width: totalWidth,
                        height: totalHeight
                    });

                    setLastNotifiedSize({ width: totalWidth, height: totalHeight });
                    isInitialMount.current = false;
                }, 50);
            }
        }
    }, [bounds.width, bounds.height, onSizeCalculated, lastNotifiedSize]);

    // 🔄 resize 이벤트 리스너 (수동 리사이즈 지원)
    useEffect(() => {
        const handleResize = () => {
            console.log("🔄 윈도우 리사이즈 이벤트 감지");
            // 강제로 재측정하도록 초기 상태로 리셋
            isInitialMount.current = true;
            setLastNotifiedSize({ width: 0, height: 0 });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className="w-full flex flex-col gap-2">
            {/* 🎯 상단 3개 박스 - 항상 렌더링 */}
            <div className="flex gap-2 w-full">
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatus1 />
                </div>
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatus2 />
                </div>
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatus3 />
                </div>
            </div>

            {/* 🎯 하단 박스 - 항상 렌더링 */}
            <div className="w-full">
                <AgentStatus4 />
            </div>

            {/* 개발 모드에서 실시간 측정 정보 */}
            {/* {import.meta.env.MODE === 'development' && (
                <div className="fixed top-2 right-2 bg-black bg-opacity-90 text-white text-xs p-3 rounded font-mono z-50">
                    <div className="text-green-400 font-bold mb-2">📏 정확한 측정</div>
                    <div className="space-y-1">
                        <div className="text-blue-400">react-use-measure:</div>
                        <div>실제: {Math.ceil(bounds.width)}x{Math.ceil(bounds.height)}</div>
                        <div>상태: {bounds.width > 0 ? '✅ 측정됨' : '⏳ 측정중'}</div>
                        <div className="text-yellow-400 mt-2 pt-2 border-t border-gray-600">
                            <div>마지막 알림: {lastNotifiedSize.width}x{lastNotifiedSize.height}</div>
                            <div>초기 마운트: {isInitialMount.current ? 'Yes' : 'No'}</div>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default PanelModeContent;