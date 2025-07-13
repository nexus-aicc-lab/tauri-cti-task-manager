'use client';

import React, { useEffect, useState, useRef } from 'react';
import useMeasure from 'react-use-measure';
import AgentStatusInfoBoxForPanelMode1 from './AgentStatusInfoBoxForPanelMode1';
import AgentStatusInfoBoxForPanelMode2 from './AgentStatusInfoBoxForPanelMode2';
import AgentStatusInfoBoxForPanelMode3 from './AgentStatusInfoBoxForPanelMode3';
import AgentStatusInfoBoxForPanelMode4 from './AgentStatusInfoBoxForPanelMode4';

interface PanelModeContentProps {
    onSizeCalculated?: (size: { width: number; height: number }) => void;
}

const PanelModeContent: React.FC<PanelModeContentProps> = ({ onSizeCalculated }) => {
    const [lastNotifiedSize, setLastNotifiedSize] = useState({ width: 0, height: 0 });
    const isInitialMount = useRef(true);
    const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [ref, bounds] = useMeasure({ debounce: 150, scroll: false, offsetSize: true });

    // 🎯 크기 계산 및 통지 로직만 유지
    useEffect(() => {
        if (bounds.width > 0 && bounds.height > 0 && onSizeCalculated) {
            const TITLEBAR_HEIGHT = 42;
            const PADDING = 16;
            const WINDOW_BORDER = 8;
            const MIN_WIDTH = 900;

            const totalWidth = Math.max(MIN_WIDTH, Math.ceil(bounds.width) + PADDING);
            const totalHeight = Math.ceil(bounds.height) + PADDING + TITLEBAR_HEIGHT + WINDOW_BORDER;

            const THRESHOLD = 5;
            const widthDiff = Math.abs(totalWidth - lastNotifiedSize.width);
            const heightDiff = Math.abs(totalHeight - lastNotifiedSize.height);
            const shouldNotify =
                isInitialMount.current ||
                widthDiff > THRESHOLD ||
                heightDiff > THRESHOLD;

            if (shouldNotify) {
                if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);

                resizeTimeoutRef.current = setTimeout(() => {
                    onSizeCalculated({ width: totalWidth, height: totalHeight });
                    setLastNotifiedSize({ width: totalWidth, height: totalHeight });
                    isInitialMount.current = false;
                }, 50);
            }
        }
    }, [bounds.width, bounds.height, onSizeCalculated, lastNotifiedSize]);

    // 🧹 정리 함수
    useEffect(() => {
        return () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className="w-full flex flex-col gap-2 relative">
            <div className="flex gap-2 w-full">
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatusInfoBoxForPanelMode1 />
                </div>
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatusInfoBoxForPanelMode2 />
                </div>
                <div className="flex-1 h-60 min-w-0">
                    <AgentStatusInfoBoxForPanelMode3 />
                </div>
            </div>
            <div className="w-full">
                <AgentStatusInfoBoxForPanelMode4 />
            </div>
        </div>
    );
};

export default PanelModeContent;