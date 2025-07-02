

// // import { useState, useEffect, useCallback, useRef } from "react";
// // import { invoke } from '@tauri-apps/api/core';
// // import PanelModeContent from "@/app/panel-mode/ui/PanelModeContent";
// // import CustomTitlebar from "../components/CustomTitlebar";

// // interface PanelModePageProps {
// //     onBackToLauncher?: () => void;
// // }

// // export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
// //     const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
// //     const [isInitialized, setIsInitialized] = useState(false);
// //     const [initialSizeSet, setInitialSizeSet] = useState(false);

// //     // DOM 참조
// //     const mainContainerRef = useRef<HTMLDivElement>(null);
// //     const resizeObserverRef = useRef<ResizeObserver | null>(null);

// //     // 🎯 고정 가로 + 동적 세로 크기 설정
// //     const FIXED_WIDTH = 780;     // 고정 가로 크기
// //     const MIN_HEIGHT = 420;      // 최소 세로 크기
// //     const SAFE_MARGIN = 100;     // 화면 하단 여백 (태스크바 등 고려)

// //     // 🎯 개선된 화면 크기 정보 (더 관대한 제한)
// //     const getScreenLimits = useCallback(() => {
// //         const screenHeight = window.screen.availHeight;
// //         const workAreaHeight = window.screen.height; // 전체 화면 높이

// //         // 더 관대한 최대 높이 설정
// //         const maxHeight = Math.min(
// //             screenHeight - SAFE_MARGIN,  // 사용 가능 높이에서 안전 여백만 빼기
// //             workAreaHeight - SAFE_MARGIN  // 전체 화면에서 안전 여백만 빼기
// //         );

// //         console.log(`📺 [panel-mode] 화면 정보: availHeight=${screenHeight}, totalHeight=${workAreaHeight}, maxHeight=${maxHeight}`);

// //         return {
// //             maxHeight: Math.max(maxHeight, MIN_HEIGHT + 100) // 최소 높이보다는 크게 보장
// //         };
// //     }, [SAFE_MARGIN, MIN_HEIGHT]);

// //     // 🎯 더 안정적인 콘텐츠 크기 측정 함수
// //     const measureActualContentSize = useCallback(() => {
// //         if (!mainContainerRef.current) return null;

// //         const element = mainContainerRef.current;

// //         // 🔍 DOM이 완전히 렌더링될 때까지 대기 (더 엄격한 체크)
// //         const rect = element.getBoundingClientRect();
// //         if (rect.width === 0 || rect.height === 0) {
// //             console.log("📏 [panel-mode] DOM 아직 렌더링 안됨, 대기 중...");
// //             return null;
// //         }

// //         // 자식 요소들이 모두 로드되었는지 확인
// //         const children = Array.from(element.children);
// //         if (children.length === 0) {
// //             console.log("📏 [panel-mode] 자식 요소 없음, 대기 중...");
// //             return null;
// //         }

// //         // 모든 자식 요소의 크기가 0이 아닌지 확인
// //         const hasValidChildren = children.some(child => {
// //             const childRect = child.getBoundingClientRect();
// //             return childRect.width > 0 && childRect.height > 0;
// //         });

// //         if (!hasValidChildren) {
// //             console.log("📏 [panel-mode] 유효한 자식 요소 없음, 대기 중...");
// //             return null;
// //         }

// //         // 🎯 다양한 방법으로 실제 높이 측정
// //         const measurements = {
// //             boundingRect: rect.height,
// //             scroll: element.scrollHeight,
// //             offset: element.offsetHeight,
// //             client: element.clientHeight
// //         };

// //         // 자식 요소들의 실제 높이 측정 (더 정확한 계산)
// //         let childrenTotalHeight = 0;
// //         let maxChildBottom = 0;

// //         children.forEach(child => {
// //             const childRect = child.getBoundingClientRect();
// //             const childComputedStyle = window.getComputedStyle(child);
// //             const marginTop = parseFloat(childComputedStyle.marginTop) || 0;
// //             const marginBottom = parseFloat(childComputedStyle.marginBottom) || 0;

// //             const childTotalHeight = childRect.height + marginTop + marginBottom;
// //             childrenTotalHeight += childTotalHeight;

// //             // 자식 요소의 하단 위치 계산
// //             const childBottom = childRect.bottom - rect.top + marginBottom;
// //             maxChildBottom = Math.max(maxChildBottom, childBottom);
// //         });

// //         // 🎯 가장 큰 값을 실제 콘텐츠 높이로 사용
// //         const actualContentHeight = Math.max(
// //             measurements.boundingRect,
// //             measurements.scroll,
// //             measurements.offset,
// //             measurements.client,
// //             maxChildBottom,
// //             childrenTotalHeight * 0.8 // 자식 요소 총합의 80% (중복 고려)
// //         );

// //         // 최소 콘텐츠 높이 보장 (더 관대하게)
// //         const minContentHeight = MIN_HEIGHT - 40; // 패딩 등을 고려
// //         const finalContentHeight = Math.max(actualContentHeight, minContentHeight);

// //         console.log(`📐 [panel-mode] 향상된 세로 크기 측정:`);
// //         console.log(`  - BoundingRect: ${measurements.boundingRect.toFixed(1)}`);
// //         console.log(`  - Scroll: ${measurements.scroll}`);
// //         console.log(`  - Offset: ${measurements.offset}`);
// //         console.log(`  - Client: ${measurements.client}`);
// //         console.log(`  - Max Child Bottom: ${maxChildBottom.toFixed(1)}`);
// //         console.log(`  - Children Total: ${childrenTotalHeight.toFixed(1)}`);
// //         console.log(`  - Final Content: ${finalContentHeight.toFixed(1)}`);

// //         return {
// //             height: finalContentHeight,
// //             measurements,
// //             childInfo: {
// //                 count: children.length,
// //                 totalHeight: childrenTotalHeight,
// //                 maxBottom: maxChildBottom
// //             }
// //         };
// //     }, [MIN_HEIGHT]);

// //     // 🎯 개선된 크기 조정 함수
// //     const adjustWindowSize = useCallback(async () => {
// //         if (!mainContainerRef.current) return;

// //         try {
// //             // 콘텐츠가 완전히 로드될 때까지 재시도
// //             const contentSize = measureActualContentSize();
// //             if (!contentSize) {
// //                 console.log("📏 [panel-mode] 콘텐츠 아직 준비 안됨, 500ms 후 재시도");
// //                 setTimeout(() => adjustWindowSize(), 500);
// //                 return;
// //             }

// //             const { height: contentHeight, childInfo } = contentSize;

// //             // 패딩 계산
// //             const computedStyle = window.getComputedStyle(mainContainerRef.current);
// //             const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
// //             const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

// //             // 🎯 가로: 고정
// //             const finalWidth = FIXED_WIDTH;

// //             // 🎯 세로: 더 여유있게 계산
// //             const extraSpace = 0; // 추가 여백
// //             let calculatedHeight = Math.ceil(contentHeight + paddingTop + paddingBottom + extraSpace);

// //             // 최소 높이 보장
// //             let finalHeight = Math.max(calculatedHeight, MIN_HEIGHT);

// //             // 화면 크기 제한 적용 (더 관대하게)
// //             const screenLimits = getScreenLimits();
// //             const originalHeight = finalHeight;
// //             finalHeight = Math.min(finalHeight, screenLimits.maxHeight);

// //             // 크기가 제한되었다면 경고
// //             if (finalHeight < originalHeight) {
// //                 console.warn(`⚠️ [panel-mode] 화면 크기 제한으로 높이 조정: ${originalHeight} → ${finalHeight}`);
// //                 console.warn(`   원하는 높이보다 작을 수 있습니다. 모니터 해상도를 확인하세요.`);
// //             }

// //             console.log(`📐 [panel-mode] 향상된 크기 조정:`);
// //             console.log(`  - Content: ${contentHeight.toFixed(1)}`);
// //             console.log(`  - Calculated: ${calculatedHeight}`);
// //             console.log(`  - Final: ${finalWidth}x${finalHeight}`);
// //             console.log(`  - Children: ${childInfo.count}개`);
// //             console.log(`  - Screen Limit: ${screenLimits.maxHeight}`);

// //             // 🔄 크기 변화 감지 (더 엄격한 임계값)
// //             const widthDiff = Math.abs(finalWidth - currentSize.width);
// //             const heightDiff = Math.abs(finalHeight - currentSize.height);
// //             const shouldUpdate = !initialSizeSet || widthDiff > 5 || heightDiff > 15;

// //             if (shouldUpdate) {
// //                 setCurrentSize({ width: finalWidth, height: finalHeight });
// //                 setInitialSizeSet(true);

// //                 // 백엔드에 크기 적용
// //                 try {
// //                     await invoke('apply_window_size', {
// //                         width: finalWidth,
// //                         height: finalHeight,
// //                         windowType: 'panel-mode'
// //                     });
// //                     console.log(`✅ [panel-mode] 향상된 크기 적용: ${finalWidth}x${finalHeight}`);
// //                 } catch (applyError) {
// //                     console.log(`ℹ️ [panel-mode] 백엔드 함수 없음, Tauri API 시도`);
// //                     try {
// //                         const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
// //                         const { PhysicalSize } = await import('@tauri-apps/api/window');
// //                         const currentWindow = getCurrentWebviewWindow();

// //                         await currentWindow.setSize(new PhysicalSize(finalWidth, finalHeight));
// //                         console.log(`✅ [panel-mode] Tauri API로 크기 적용: ${finalWidth}x${finalHeight}`);
// //                     } catch (tauriError) {
// //                         console.error(`❌ [panel-mode] Tauri API 실패:`, tauriError);
// //                     }
// //                 }

// //                 // 크기 저장
// //                 try {
// //                     await invoke('save_window_size', {
// //                         width: finalWidth,
// //                         height: finalHeight,
// //                         windowType: 'panel-mode'
// //                     });
// //                 } catch (saveError) {
// //                     console.log(`ℹ️ [panel-mode] 크기 저장 함수 없음`);
// //                 }
// //             } else {
// //                 console.log(`📏 [panel-mode] 크기 변화 미미 (차이: ${widthDiff}x${heightDiff})`);
// //             }

// //         } catch (error) {
// //             console.error("❌ [panel-mode] 향상된 크기 조정 실패:", error);
// //         }
// //     }, [currentSize, initialSizeSet, getScreenLimits, FIXED_WIDTH, MIN_HEIGHT, measureActualContentSize]);

// //     // 🎯 더 안정적인 콘텐츠 변화 감지
// //     useEffect(() => {
// //         if (!mainContainerRef.current) return;

// //         let adjustmentTimeout: NodeJS.Timeout | null = null;

// //         // 디바운스된 크기 조정 함수
// //         const debouncedAdjust = () => {
// //             if (adjustmentTimeout) clearTimeout(adjustmentTimeout);
// //             adjustmentTimeout = setTimeout(() => {
// //                 console.log("🔍 [panel-mode] 디바운스된 크기 조정 실행");
// //                 adjustWindowSize();
// //             }, 300);
// //         };

// //         // ResizeObserver
// //         resizeObserverRef.current = new ResizeObserver((entries) => {
// //             console.log("🔍 [panel-mode] ResizeObserver 감지");
// //             debouncedAdjust();
// //         });

// //         resizeObserverRef.current.observe(mainContainerRef.current);

// //         // 🎯 더 안정적인 초기 크기 조정 (단계적 접근)
// //         const initialChecks = [
// //             { delay: 100, reason: "즉시 체크" },
// //             { delay: 300, reason: "DOM 안정화" },
// //             { delay: 600, reason: "CSS 적용 완료" },
// //             { delay: 1200, reason: "컨텐츠 로딩 완료" },
// //             { delay: 2500, reason: "동적 컨텐츠 안정화" },
// //             { delay: 5000, reason: "최종 확인" }
// //         ];

// //         const timeoutIds = initialChecks.map(({ delay, reason }) =>
// //             setTimeout(() => {
// //                 console.log(`🚀 [panel-mode] ${reason} - 크기 조정`);
// //                 adjustWindowSize();
// //             }, delay)
// //         );

// //         // MutationObserver (더 세밀한 감지)
// //         const mutationObserver = new MutationObserver((mutations) => {
// //             const hasSignificantChange = mutations.some(mutation => {
// //                 if (mutation.type === 'childList') return true;
// //                 if (mutation.type === 'attributes') {
// //                     const attr = mutation.attributeName;
// //                     return attr && ['class', 'style', 'width', 'height', 'data-'].some(prefix =>
// //                         attr.startsWith(prefix)
// //                     );
// //                 }
// //                 return false;
// //             });

// //             if (hasSignificantChange) {
// //                 console.log("🔄 [panel-mode] 중요한 DOM 변화 감지");
// //                 debouncedAdjust();
// //             }
// //         });

// //         mutationObserver.observe(mainContainerRef.current, {
// //             childList: true,
// //             subtree: true,
// //             attributes: true,
// //             attributeFilter: ['class', 'style', 'width', 'height']
// //         });

// //         // 주기적 체크 (더 긴 간격)
// //         const intervalId = setInterval(() => {
// //             console.log("⏰ [panel-mode] 주기적 크기 체크");
// //             adjustWindowSize();
// //         }, 10000); // 10초마다

// //         return () => {
// //             if (adjustmentTimeout) clearTimeout(adjustmentTimeout);
// //             if (resizeObserverRef.current) {
// //                 resizeObserverRef.current.disconnect();
// //             }
// //             mutationObserver.disconnect();
// //             clearInterval(intervalId);
// //             timeoutIds.forEach(id => clearTimeout(id));
// //         };
// //     }, [adjustWindowSize]);

// //     // 🎯 PanelModeContent에서 계산된 크기 받기
// //     const handleSizeCalculated = useCallback((size: { width: number; height: number }) => {
// //         console.log(`📐 [panel-mode] 외부 크기 수신: ${size.width}x${size.height}`);
// //         // 강제 업데이트 트리거
// //         setTimeout(() => adjustWindowSize(), 100);
// //     }, [adjustWindowSize]);

// //     // 📱 수동 크기 맞춤 함수
// //     const manualResize = useCallback(async () => {
// //         console.log("📐 [panel-mode] 수동 크기 맞춤 요청");
// //         setInitialSizeSet(false);

// //         // 즉시 실행
// //         setTimeout(() => {
// //             console.log("🔄 [panel-mode] 수동 크기 재조정 실행");
// //             adjustWindowSize();
// //         }, 50);
// //     }, [adjustWindowSize]);

// //     // ⌨️ 키보드 단축키
// //     useEffect(() => {
// //         const handleKeyPress = (e: KeyboardEvent) => {
// //             if (e.ctrlKey && e.key === 'r') {
// //                 e.preventDefault();
// //                 console.log("⌨️ [panel-mode] Ctrl+R 수동 리사이즈");
// //                 manualResize();
// //             }
// //             if (e.key === 'F5') {
// //                 e.preventDefault();
// //                 console.log("⌨️ [panel-mode] F5 수동 리사이즈");
// //                 manualResize();
// //             }
// //         };

// //         document.addEventListener('keydown', handleKeyPress);
// //         return () => document.removeEventListener('keydown', handleKeyPress);
// //     }, [manualResize]);

// //     // 🔄 앱 시작 시 초기화
// //     useEffect(() => {
// //         const initializePanel = async () => {
// //             try {
// //                 console.log("🚀 [panel-mode] 향상된 패널 모드 초기화 시작");

// //                 // 화면 정보 미리 로그
// //                 const screenLimits = getScreenLimits();
// //                 console.log(`📺 [panel-mode] 화면 제한: 최대 ${screenLimits.maxHeight}px`);

// //                 try {
// //                     const savedSize = await invoke('load_window_size', {
// //                         windowType: 'panel-mode'
// //                     }) as { width: number; height: number };

// //                     console.log(`📋 [panel-mode] 저장된 크기: ${savedSize.width}x${savedSize.height}`);

// //                     const tempWidth = FIXED_WIDTH;
// //                     const tempHeight = Math.max(MIN_HEIGHT, Math.min(savedSize.height, screenLimits.maxHeight));

// //                     await invoke('apply_window_size', {
// //                         width: tempWidth,
// //                         height: tempHeight,
// //                         windowType: 'panel-mode'
// //                     });

// //                     setCurrentSize({ width: tempWidth, height: tempHeight });
// //                     console.log(`🎯 [panel-mode] 저장된 크기 적용: ${tempWidth}x${tempHeight}`);

// //                 } catch (error) {
// //                     console.log('ℹ️ [panel-mode] 저장된 크기 없음, 기본값 사용');

// //                     const DEFAULT_WIDTH = FIXED_WIDTH;
// //                     const DEFAULT_HEIGHT = MIN_HEIGHT;

// //                     try {
// //                         await invoke('apply_window_size', {
// //                             width: DEFAULT_WIDTH,
// //                             height: DEFAULT_HEIGHT,
// //                             windowType: 'panel-mode'
// //                         });
// //                     } catch (applyError) {
// //                         console.log('ℹ️ [panel-mode] 백엔드 함수 없음');
// //                     }

// //                     setCurrentSize({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
// //                     console.log(`🎯 [panel-mode] 기본 크기 설정: ${DEFAULT_WIDTH}x${DEFAULT_HEIGHT}`);
// //                 }

// //             } catch (error) {
// //                 console.error("❌ [panel-mode] 패널 초기화 실패:", error);
// //             } finally {
// //                 setIsInitialized(true);
// //                 console.log("✅ [panel-mode] 향상된 패널 모드 초기화 완료");
// //             }
// //         };

// //         const timer = setTimeout(initializePanel, 50);
// //         return () => clearTimeout(timer);
// //     }, [getScreenLimits, FIXED_WIDTH, MIN_HEIGHT]);

// //     if (!isInitialized) {
// //         return (
// //             <div className="h-full bg-white p-2 rounded-lg shadow-md border border-gray-200 flex items-center justify-center">
// //                 <div className="text-center">
// //                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
// //                     <span className="text-sm text-gray-600">Panel 모드 초기화 중...</span>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div
// //             ref={mainContainerRef}
// //             className="flex flex-col bg-white min-h-screen"
// //             style={{
// //                 minHeight: 'fit-content'
// //             }}
// //         >
// //             <CustomTitlebar
// //                 title="U PERSONAL"
// //                 onBackToLauncher={onBackToLauncher || (() => { })}
// //                 currentSize={currentSize}
// //             />

// //             <div
// //                 className="p-2 flex flex-col"
// //                 style={{
// //                     minHeight: 'fit-content'
// //                 }}
// //             >
// //                 <PanelModeContent
// //                     onSizeCalculated={handleSizeCalculated}
// //                 />
// //             </div>
// //         </div>
// //     );
// // }

// import { useState, useEffect, useCallback, useRef } from "react";
// import { invoke } from '@tauri-apps/api/core';
// import PanelModeContent from "@/app/panel-mode/ui/PanelModeContent";
// import CustomTitlebar from "../components/CustomTitlebar";

// interface PanelModePageProps {
//     onBackToLauncher?: () => void;
// }

// export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
//     const [currentSize, setCurrentSize] = useState({ width: 780, height: 300 });
//     const [isInitialized, setIsInitialized] = useState(false);

//     // DOM 참조
//     const mainContainerRef = useRef<HTMLDivElement>(null);

//     // 🎯 고정된 크기 설정
//     const FIXED_WIDTH = 780;     // 고정 가로 크기
//     const DEFAULT_HEIGHT = 420;  // 기본 세로 크기
//     const MIN_HEIGHT = 300;      // 최소 세로 크기

//     // 🎯 콘텐츠 높이 측정 (간소화)
//     const measureContentHeight = useCallback(() => {
//         if (!mainContainerRef.current) return DEFAULT_HEIGHT;

//         const element = mainContainerRef.current;
//         const rect = element.getBoundingClientRect();

//         // DOM이 아직 렌더링되지 않았으면 기본값 반환
//         if (rect.height === 0) {
//             return DEFAULT_HEIGHT;
//         }

//         // 실제 콘텐츠 높이 (스크롤 높이 기준)
//         const contentHeight = Math.max(
//             element.scrollHeight,
//             element.offsetHeight,
//             rect.height
//         );

//         console.log(`📐 [panel-mode] 콘텐츠 높이: ${contentHeight}`);
//         return contentHeight;
//     }, [DEFAULT_HEIGHT]);

//     // 🎯 윈도우 크기 조정 (콘텐츠 맞춤형)
//     const adjustWindowSize = useCallback(async () => {
//         if (!mainContainerRef.current) return;

//         try {
//             // 고정 가로, 콘텐츠에 따라 자동 세로
//             const finalWidth = FIXED_WIDTH;
//             const contentHeight = measureContentHeight();

//             // 최소 높이만 보장, 최대 제한 없음 (콘텐츠에 맞춤)
//             const finalHeight = Math.max(contentHeight, MIN_HEIGHT);

//             console.log(`📐 [panel-mode] 콘텐츠 맞춤 크기: ${finalWidth}x${finalHeight}`);

//             // 크기 변화가 있을 때만 업데이트
//             const heightDiff = Math.abs(finalHeight - currentSize.height);
//             if (heightDiff > 10) {
//                 setCurrentSize({ width: finalWidth, height: finalHeight });

//                 // Tauri API로 크기 적용
//                 try {
//                     await invoke('apply_window_size', {
//                         width: finalWidth,
//                         height: finalHeight,
//                         windowType: 'panel-mode'
//                     });
//                     console.log(`✅ [panel-mode] 백엔드로 크기 적용: ${finalWidth}x${finalHeight}`);
//                 } catch (applyError) {
//                     console.log(`ℹ️ [panel-mode] 백엔드 함수 없음, Tauri API 시도`);
//                     try {
//                         const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
//                         const { LogicalSize } = await import('@tauri-apps/api/window');
//                         const currentWindow = getCurrentWebviewWindow();

//                         // LogicalSize 사용 (DPI 스케일링 자동 처리)
//                         await currentWindow.setSize(new LogicalSize(finalWidth, finalHeight));
//                         console.log(`✅ [panel-mode] LogicalSize로 크기 적용: ${finalWidth}x${finalHeight}`);
//                     } catch (tauriError) {
//                         console.error(`❌ [panel-mode] LogicalSize 실패:`, tauriError);
//                     }
//                 }
//             }

//         } catch (error) {
//             console.error("❌ [panel-mode] 크기 조정 실패:", error);
//         }
//     }, [currentSize.height, FIXED_WIDTH, MIN_HEIGHT, measureContentHeight]);

//     // 🎯 콘텐츠 변화 감지 (간소화)
//     useEffect(() => {
//         if (!mainContainerRef.current) return;

//         let resizeTimeout: NodeJS.Timeout | null = null;

//         // 디바운스된 크기 조정
//         const debouncedAdjust = () => {
//             if (resizeTimeout) clearTimeout(resizeTimeout);
//             resizeTimeout = setTimeout(() => {
//                 adjustWindowSize();
//             }, 200);
//         };

//         // ResizeObserver
//         const resizeObserver = new ResizeObserver(() => {
//             console.log("🔍 [panel-mode] 콘텐츠 크기 변화 감지");
//             debouncedAdjust();
//         });

//         resizeObserver.observe(mainContainerRef.current);

//         // 초기 크기 조정
//         const initialTimeouts = [
//             setTimeout(() => adjustWindowSize(), 100),
//             setTimeout(() => adjustWindowSize(), 500),
//             setTimeout(() => adjustWindowSize(), 1000)
//         ];

//         return () => {
//             if (resizeTimeout) clearTimeout(resizeTimeout);
//             resizeObserver.disconnect();
//             initialTimeouts.forEach(timeout => clearTimeout(timeout));
//         };
//     }, [adjustWindowSize]);

//     // 🎯 PanelModeContent에서 크기 수신
//     const handleSizeCalculated = useCallback((size: { width: number; height: number }) => {
//         console.log(`📐 [panel-mode] 외부 크기 수신: ${size.width}x${size.height}`);
//         setTimeout(() => adjustWindowSize(), 100);
//     }, [adjustWindowSize]);

//     // 🔄 초기화
//     useEffect(() => {
//         const initializePanel = async () => {
//             try {
//                 console.log("🚀 [panel-mode] 패널 모드 초기화");

//                 // 저장된 크기 로드 시도
//                 try {
//                     const savedSize = await invoke('load_window_size', {
//                         windowType: 'panel-mode'
//                     }) as { width: number; height: number };

//                     const height = Math.max(MIN_HEIGHT, savedSize.height);
//                     setCurrentSize({ width: FIXED_WIDTH, height });

//                     await invoke('apply_window_size', {
//                         width: FIXED_WIDTH,
//                         height: height,
//                         windowType: 'panel-mode'
//                     });

//                     console.log(`🎯 [panel-mode] 저장된 크기 적용: ${FIXED_WIDTH}x${height}`);
//                 } catch (error) {
//                     console.log('ℹ️ [panel-mode] 기본 크기 사용');
//                     setCurrentSize({ width: FIXED_WIDTH, height: DEFAULT_HEIGHT });
//                 }

//             } catch (error) {
//                 console.error("❌ [panel-mode] 초기화 실패:", error);
//             } finally {
//                 setIsInitialized(true);
//                 console.log("✅ [panel-mode] 초기화 완료");
//             }
//         };

//         setTimeout(initializePanel, 50);
//     }, [FIXED_WIDTH, DEFAULT_HEIGHT, MIN_HEIGHT]);

//     if (!isInitialized) {
//         return (
//             <div
//                 style={{
//                     width: `${FIXED_WIDTH}px`,
//                     height: `${DEFAULT_HEIGHT}px`,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     backgroundColor: 'white'
//                 }}
//             >
//                 <div style={{ textAlign: 'center' }}>
//                     <div style={{
//                         width: '32px',
//                         height: '32px',
//                         border: '2px solid #e5e7eb',
//                         borderTop: '2px solid #3b82f6',
//                         borderRadius: '50%',
//                         animation: 'spin 1s linear infinite',
//                         margin: '0 auto 8px'
//                     }}></div>
//                     <span style={{ fontSize: '14px', color: '#6b7280' }}>Panel 모드 초기화 중...</span>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div
//             ref={mainContainerRef}
//             style={{
//                 width: `${FIXED_WIDTH}px`,
//                 minHeight: `${MIN_HEIGHT}px`,
//                 backgroundColor: 'white',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 overflow: 'hidden'
//             }}
//         >
//             <CustomTitlebar
//                 title="U PERSONAL"
//                 onBackToLauncher={onBackToLauncher || (() => { })}
//                 currentSize={currentSize}
//             />

//             <div
//                 style={{
//                     padding: '8px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     flex: '1',
//                     overflow: 'auto'
//                 }}
//             >
//                 <PanelModeContent
//                     onSizeCalculated={handleSizeCalculated}
//                 />
//             </div>
//         </div>
//     );
// }

import { useState, useEffect, useCallback, useRef } from "react";
import { invoke } from '@tauri-apps/api/core';
import PanelModeContent from "@/app/panel-mode/ui/PanelModeContent";
import CustomTitlebar from "../components/CustomTitlebar";

interface PanelModePageProps {
    onBackToLauncher?: () => void;
}

export default function PanelModePage({ onBackToLauncher }: PanelModePageProps) {
    const [currentSize, setCurrentSize] = useState({ width: 780, height: 300 });
    const [isInitialized, setIsInitialized] = useState(false);

    // DOM 참조
    const mainContainerRef = useRef<HTMLDivElement>(null);

    // 🎯 고정된 크기 설정
    const FIXED_WIDTH = 780;     // 고정 가로 크기
    const DEFAULT_HEIGHT = 420;  // 기본 세로 크기
    const MIN_HEIGHT = 300;      // 최소 세로 크기

    // 🎯 콘텐츠 높이 측정 (간소화)
    const measureContentHeight = useCallback(() => {
        if (!mainContainerRef.current) return DEFAULT_HEIGHT;

        const element = mainContainerRef.current;
        const rect = element.getBoundingClientRect();

        // DOM이 아직 렌더링되지 않았으면 기본값 반환
        if (rect.height === 0) {
            return DEFAULT_HEIGHT;
        }

        // 실제 콘텐츠 높이 (스크롤 높이 기준)
        const contentHeight = Math.max(
            element.scrollHeight,
            element.offsetHeight,
            rect.height
        );

        console.log(`📐 [panel-mode] 콘텐츠 높이: ${contentHeight}`);
        return contentHeight;
    }, [DEFAULT_HEIGHT]);

    // 🎯 윈도우 크기 조정 (DPI 스케일링 고려 + 콘텐츠 맞춤형)
    const adjustWindowSize = useCallback(async () => {
        if (!mainContainerRef.current) return;

        try {
            // 🎯 DPI 스케일링 정보 확인
            const devicePixelRatio = window.devicePixelRatio || 1;
            const scaleFactor = devicePixelRatio;

            console.log(`📺 [panel-mode] DPI 정보: devicePixelRatio=${devicePixelRatio}, scaleFactor=${scaleFactor}`);

            // 고정 가로, 콘텐츠에 따라 자동 세로
            const baseWidth = FIXED_WIDTH;
            const baseContentHeight = measureContentHeight();

            // 최소 높이만 보장 (콘텐츠에 맞춤)
            const baseHeight = Math.max(baseContentHeight, MIN_HEIGHT);

            // 🎯 스케일링 적용된 최종 크기
            const finalWidth = Math.round(baseWidth * scaleFactor);
            const finalHeight = Math.round(baseHeight * scaleFactor);

            console.log(`📐 [panel-mode] 크기 조정:`);
            console.log(`  - Base: ${baseWidth}x${baseHeight}`);
            console.log(`  - Scaled: ${finalWidth}x${finalHeight} (ratio: ${scaleFactor})`);

            // 크기 변화가 있을 때만 업데이트
            const heightDiff = Math.abs(finalHeight - currentSize.height);
            if (heightDiff > 10) {
                setCurrentSize({ width: finalWidth, height: finalHeight });

                // Tauri API로 크기 적용 (LogicalSize 우선)
                try {
                    await invoke('apply_window_size', {
                        width: finalWidth,
                        height: finalHeight,
                        windowType: 'panel-mode'
                    });
                    console.log(`✅ [panel-mode] 백엔드로 크기 적용: ${finalWidth}x${finalHeight}`);
                } catch (applyError) {
                    console.log(`ℹ️ [panel-mode] 백엔드 함수 없음, Tauri API 시도`);
                    try {
                        const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
                        const { LogicalSize } = await import('@tauri-apps/api/window');
                        const currentWindow = getCurrentWebviewWindow();

                        // LogicalSize로 설정 (DPI 스케일링 자동 처리)
                        await currentWindow.setSize(new LogicalSize(baseWidth, baseHeight));
                        console.log(`✅ [panel-mode] LogicalSize로 크기 적용: ${baseWidth}x${baseHeight}`);
                    } catch (tauriError) {
                        console.error(`❌ [panel-mode] LogicalSize 실패:`, tauriError);

                        // PhysicalSize로 재시도 (DPI 스케일링 수동 적용)
                        try {
                            const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
                            const { PhysicalSize } = await import('@tauri-apps/api/window');
                            const currentWindow = getCurrentWebviewWindow();
                            await currentWindow.setSize(new PhysicalSize(finalWidth, finalHeight));
                            console.log(`✅ [panel-mode] PhysicalSize로 크기 적용: ${finalWidth}x${finalHeight}`);
                        } catch (physicalError) {
                            console.error(`❌ [panel-mode] PhysicalSize도 실패:`, physicalError);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("❌ [panel-mode] 크기 조정 실패:", error);
        }
    }, [currentSize.height, FIXED_WIDTH, MIN_HEIGHT, measureContentHeight]);

    // 🎯 콘텐츠 변화 감지 (간소화)
    useEffect(() => {
        if (!mainContainerRef.current) return;

        let resizeTimeout: NodeJS.Timeout | null = null;

        // 디바운스된 크기 조정
        const debouncedAdjust = () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                adjustWindowSize();
            }, 200);
        };

        // ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
            console.log("🔍 [panel-mode] 콘텐츠 크기 변화 감지");
            debouncedAdjust();
        });

        resizeObserver.observe(mainContainerRef.current);

        // 초기 크기 조정
        const initialTimeouts = [
            setTimeout(() => adjustWindowSize(), 100),
            setTimeout(() => adjustWindowSize(), 500),
            setTimeout(() => adjustWindowSize(), 1000)
        ];

        return () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeObserver.disconnect();
            initialTimeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, [adjustWindowSize]);

    // 🎯 PanelModeContent에서 크기 수신
    const handleSizeCalculated = useCallback((size: { width: number; height: number }) => {
        console.log(`📐 [panel-mode] 외부 크기 수신: ${size.width}x${size.height}`);
        setTimeout(() => adjustWindowSize(), 100);
    }, [adjustWindowSize]);

    // 🔄 초기화
    useEffect(() => {
        const initializePanel = async () => {
            try {
                console.log("🚀 [panel-mode] 패널 모드 초기화");

                // 저장된 크기 로드 시도
                try {
                    const savedSize = await invoke('load_window_size', {
                        windowType: 'panel-mode'
                    }) as { width: number; height: number };

                    const height = Math.max(MIN_HEIGHT, savedSize.height);
                    setCurrentSize({ width: FIXED_WIDTH, height });

                    await invoke('apply_window_size', {
                        width: FIXED_WIDTH,
                        height: height,
                        windowType: 'panel-mode'
                    });

                    console.log(`🎯 [panel-mode] 저장된 크기 적용: ${FIXED_WIDTH}x${height}`);
                } catch (error) {
                    console.log('ℹ️ [panel-mode] 기본 크기 사용');
                    setCurrentSize({ width: FIXED_WIDTH, height: MIN_HEIGHT });
                }

            } catch (error) {
                console.error("❌ [panel-mode] 초기화 실패:", error);
            } finally {
                setIsInitialized(true);
                console.log("✅ [panel-mode] 초기화 완료");
            }
        };

        setTimeout(initializePanel, 50);
    }, [FIXED_WIDTH, DEFAULT_HEIGHT, MIN_HEIGHT]);

    if (!isInitialized) {
        return (
            <div
                style={{
                    width: `${FIXED_WIDTH}px`,
                    height: `${DEFAULT_HEIGHT}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        border: '2px solid #e5e7eb',
                        borderTop: '2px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 8px'
                    }}></div>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Panel 모드 초기화 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={mainContainerRef}
            style={{
                width: `${FIXED_WIDTH}px`,
                minHeight: `${MIN_HEIGHT}px`,
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            <CustomTitlebar
                title="U PERSONAL"
                onBackToLauncher={onBackToLauncher || (() => { })}
                currentSize={currentSize}
            />

            <div
                style={{
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1',
                    overflow: 'auto'
                }}
            >
                <PanelModeContent
                    onSizeCalculated={handleSizeCalculated}
                />
            </div>
        </div>
    );
}