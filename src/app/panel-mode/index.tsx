
// import { useRef, useLayoutEffect, useState } from "react";
// import CustomTitlebar from "./ui/CustomTitlebar";
// import PanelModeContent from "./ui/PanelModeContent";

// interface PanelModePageProps {
//     onBackToLauncher?: () => void;
// }

// export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
//     const contentRef = useRef<HTMLDivElement>(null);
//     const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });

//     useLayoutEffect(() => {
//         const updateSize = () => {
//             if (contentRef.current) {
//                 const rect = contentRef.current.getBoundingClientRect();
//                 // 🔥 순수한 측정값만 사용 (추가 계산 제거)
//                 const width = Math.ceil(rect.width);
//                 const height = Math.ceil(rect.height);

//                 setCurrentSize({ width, height });
//                 console.log(`🔍 실제 컨텐츠 크기: ${width} × ${height}px`);
//                 console.log(`📏 rect 상세:`, rect);
//             }
//         };

//         updateSize();

//         const resizeObserver = new ResizeObserver(() => {
//             updateSize();
//         });

//         if (contentRef.current) {
//             resizeObserver.observe(contentRef.current);
//         }

//         return () => {
//             resizeObserver.disconnect();
//         };
//     }, []);

//     return (
//         <div className="h-screen flex flex-col bg-white">
//             <CustomTitlebar
//                 title="CTI Task Master – 패널 모드"
//                 onBackToLauncher={onBackToLauncher || (() => { })}
//                 currentSize={currentSize}
//             />
//             <div ref={contentRef} className="p-4 flex flex-col gap-4">
//                 <PanelModeContent />
//             </div>
//         </div>
//     );
// }

// C:\tauri\cti-task-manager-tauri\src\app\panel-mode\index.tsx

import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import CustomTitlebar from "./ui/CustomTitlebar";
import PanelModeContent from "./ui/PanelModeContent";

interface PanelModePageProps {
    onBackToLauncher?: () => void;
}

export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
    // 🎯 컨텐츠 영역만 측정
    const contentRef = useRef<HTMLDivElement>(null);
    const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const updateSize = async () => {
            if (contentRef.current) {
                const rect = contentRef.current.getBoundingClientRect();
                const contentWidth = Math.ceil(rect.width);
                const contentHeight = Math.ceil(rect.height);

                // 🔧 보정값 계산
                const TITLEBAR_HEIGHT = 41; // 타이틀바 높이 (border 포함)
                const PADDING = 16; // p-2 = 8px * 2 = 16px 
                const WINDOW_BORDER = 8; // 윈도우 경계선 등 여백

                const finalWidth = contentWidth;
                const finalHeight = contentHeight + TITLEBAR_HEIGHT + PADDING + WINDOW_BORDER;

                setCurrentSize({
                    width: finalWidth,
                    height: finalHeight
                });

                try {
                    await invoke('save_window_size', {
                        width: finalWidth,
                        height: finalHeight
                    });
                    await invoke('apply_window_size', {
                        width: finalWidth,
                        height: finalHeight
                    });
                    console.log(`✅ 윈도우 크기 업데이트: ${finalWidth}x${finalHeight}`);
                } catch (error) {
                    console.error("❌ 윈도우 크기 조정 실패:", error);
                }

                // 🔍 상세 디버깅 정보
                console.log(`📏 컨텐츠 크기: ${contentWidth} × ${contentHeight}px`);
                console.log(`🔧 보정값: 타이틀바(${TITLEBAR_HEIGHT}) + 패딩(${PADDING}) + 여백(${WINDOW_BORDER}) = +${TITLEBAR_HEIGHT + PADDING + WINDOW_BORDER}px`);
                console.log(`🎯 최종 윈도우 크기: ${finalWidth} × ${finalHeight}px`);
            }
        };

        // DOM 렌더링 완료 후 측정
        const timer = setTimeout(updateSize, 150);

        const resizeObserver = new ResizeObserver(() => {
            console.log("🔄 컨텐츠 크기 변화 감지");
            // 약간의 지연으로 안정적인 측정
            setTimeout(updateSize, 100);
        });

        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }

        return () => {
            clearTimeout(timer);
            resizeObserver.disconnect();
        };
    }, []);

    // 🔄 앱 시작 시 저장된 크기 복원
    useEffect(() => {
        const restoreSize = async () => {
            try {
                const size = await invoke('load_window_size') as { width: number, height: number };
                await invoke('apply_window_size', {
                    width: size.width,
                    height: size.height
                });
                console.log(`🔄 저장된 크기 복원: ${size.width}x${size.height}`);
            } catch (error) {
                console.error("❌ 크기 복원 실패:", error);
            }
        };

        // 컴포넌트 마운트 후 약간 지연
        const timer = setTimeout(restoreSize, 200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col bg-white min-h-screen">
            <CustomTitlebar
                title="CTI Task Master – 패널 모드"
                onBackToLauncher={onBackToLauncher || (() => { })}
                currentSize={currentSize}
            />
            {/* 🎯 이 영역만 측정해서 정확한 컨텐츠 크기 파악 */}
            <div ref={contentRef} className="p-2 flex flex-col gap-2">
                <PanelModeContent />
            </div>
        </div>
    );
}