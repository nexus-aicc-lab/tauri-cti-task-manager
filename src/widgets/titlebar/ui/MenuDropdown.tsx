
// // src/widgets/titlebar/ui/MenuDropdown.tsx
// import { useState, useRef } from "react";
// import { ChevronDown } from "lucide-react";
// import { cn } from "@/shared/lib/utils";

// interface MenuDropdownProps {
//     className?: string;
// }

// export function MenuDropdown({ className }: MenuDropdownProps) {
//     const [isLoading, setIsLoading] = useState(false);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     // 네이티브 다이얼로그 함수 (Rust 커맨드 사용)
//     const showNativeDialog = async (title: string, message: string) => {
//         try {
//             const { invoke } = await import('@tauri-apps/api/core');
//             await invoke('show_message_dialog', { title, message });
//         } catch (error) {
//             console.error('네이티브 다이얼로그 실패:', error);
//             // 폴백으로 브라우저 alert 사용
//             alert(`${title}: ${message}`);
//         }
//     };

//     // 확인 다이얼로그 함수 (Rust 커맨드 사용)
//     const showNativeConfirm = async (title: string, message: string): Promise<boolean> => {
//         try {
//             const { invoke } = await import('@tauri-apps/api/core');
//             return await invoke('show_confirm_dialog', { title, message });
//         } catch (error) {
//             console.error('네이티브 확인 다이얼로그 실패:', error);
//             // 폴백으로 브라우저 confirm 사용
//             return confirm(`${title}: ${message}`);
//         }
//     };

//     const showNativeMenu = async () => {
//         if (isLoading) return;
//         setIsLoading(true);

//         try {
//             console.log('네이티브 메뉴 시작...');

//             const { Menu, MenuItem, PredefinedMenuItem } = await import('@tauri-apps/api/menu');
//             console.log('Menu API 로드 성공');

//             // 메뉴 생성
//             const menu = await Menu.new({
//                 items: [
//                     await MenuItem.new({
//                         id: 'task_view',
//                         text: '작업보기',
//                         action: async () => {
//                             console.log("작업보기 클릭됨!");
//                             await showNativeDialog('작업보기', '작업보기가 실행되었습니다.');
//                         }
//                     }),
//                     await MenuItem.new({
//                         id: 'agent_info',
//                         text: '에이전트정보',
//                         action: async () => {
//                             console.log("에이전트정보 클릭됨!");
//                             await showNativeDialog('에이전트정보', '에이전트 정보를 표시합니다.');
//                         }
//                     }),
//                     await MenuItem.new({
//                         id: 'terminal_stats',
//                         text: '단말누적통계보기',
//                         action: async () => {
//                             console.log("단말누적통계보기 클릭됨!");
//                             await showNativeDialog('통계보기', '단말 누적 통계를 표시합니다.');
//                         }
//                     }),
//                     await PredefinedMenuItem.new({ item: 'Separator' }),
//                     await MenuItem.new({
//                         id: 'settings',
//                         text: '환경설정',
//                         action: async () => {
//                             console.log("환경설정 클릭됨!");
//                             try {
//                                 // 현재 윈도우와 WebviewWindow 임포트
//                                 const { getCurrentWindow } = await import('@tauri-apps/api/window');
//                                 const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');

//                                 // 현재 메인 윈도우 가져오기
//                                 const currentWindow = getCurrentWindow();

//                                 // 현재 윈도우의 위치와 크기 정보 가져오기
//                                 const currentPosition = await currentWindow.outerPosition();
//                                 const currentSize = await currentWindow.outerSize();

//                                 console.log('현재 윈도우 위치:', currentPosition);
//                                 console.log('현재 윈도우 크기:', currentSize);

//                                 // 새 창 크기 설정
//                                 const newWindowWidth = 600;
//                                 const newWindowHeight = 400;

//                                 // 메인 윈도우 바로 아래 중앙에 새 창 위치 계산
//                                 const newWindowX = currentPosition.x + (currentSize.width - newWindowWidth) / 2; // 중앙 정렬
//                                 const newWindowY = currentPosition.y + currentSize.height + 10; // 메인 윈도우 바로 아래

//                                 console.log('새 창 위치:', { x: newWindowX, y: newWindowY });

//                                 const settingsWindow = new WebviewWindow('settings', {
//                                     url: '/settings', // 또는 별도의 HTML 파일 경로
//                                     title: '환경설정',
//                                     width: newWindowWidth,
//                                     height: newWindowHeight,
//                                     resizable: true,
//                                     center: false, // 중앙 정렬 비활성화 (수동으로 위치 지정)
//                                     x: newWindowX,  // 메인 윈도우 중앙 기준
//                                     y: newWindowY,  // 메인 윈도우 바로 아래
//                                     decorations: true,
//                                     alwaysOnTop: false,
//                                     skipTaskbar: false
//                                 });

//                                 // 윈도우 생성 완료 대기
//                                 await settingsWindow.once('tauri://created', () => {
//                                     console.log('환경설정 윈도우 생성됨');
//                                 });

//                                 // 윈도우 에러 처리
//                                 settingsWindow.once('tauri://error', (e) => {
//                                     console.error('환경설정 윈도우 생성 실패:', e);
//                                 });

//                             } catch (error) {
//                                 console.error('환경설정 윈도우 생성 실패:', error);
//                                 await showNativeDialog('오류', '환경설정 창을 열 수 없습니다.');
//                             }
//                         }
//                     }),
//                     await MenuItem.new({
//                         id: 'stats_config',
//                         text: '통계표 설정',
//                         action: async () => {
//                             console.log("통계표 설정 클릭됨!");
//                             await showNativeDialog('통계설정', '통계표 설정을 변경합니다.');
//                         }
//                     }),
//                     await MenuItem.new({
//                         id: 'secret_info',
//                         text: '비밀정보',
//                         action: async () => {
//                             console.log("비밀정보 클릭됨!");
//                             const confirmed = await showNativeConfirm(
//                                 '비밀정보 접근',
//                                 '비밀정보에 접근하시겠습니까?'
//                             );
//                             if (confirmed) {
//                                 await showNativeDialog('비밀정보', '비밀정보에 접근했습니다.');
//                             }
//                         }
//                     }),
//                     await PredefinedMenuItem.new({ item: 'Separator' }),
//                     await MenuItem.new({
//                         id: 'quit',
//                         text: '종료',
//                         action: async () => {
//                             console.log("종료 클릭됨!");
//                             const confirmed = await showNativeConfirm(
//                                 '프로그램 종료',
//                                 '정말로 프로그램을 종료하시겠습니까?'
//                             );
//                             if (confirmed) {
//                                 try {
//                                     const { invoke } = await import('@tauri-apps/api/core');
//                                     await invoke('exit_app');
//                                 } catch (error) {
//                                     console.error('종료 실패:', error);
//                                     await showNativeDialog('오류', '프로그램 종료에 실패했습니다.');
//                                 }
//                             }
//                         }
//                     })
//                 ]
//             });

//             console.log('메뉴 생성 완료');

//             // 버튼 위치만 사용 (창 위치 계산 제거)
//             const buttonRect = buttonRef.current?.getBoundingClientRect();
//             if (buttonRect) {
//                 console.log('버튼 위치:', buttonRect);

//                 // 화면 절대 좌표 사용
//                 const menuX = buttonRect.left;
//                 const menuY = buttonRect.bottom + 5;

//                 console.log('메뉴 위치:', { x: menuX, y: menuY });

//                 // popup 호출
//                 const { LogicalPosition } = await import('@tauri-apps/api/window');

//                 // popup 호출 후 바로 로딩 해제 (popup은 비동기로 완료되지 않을 수 있음)
//                 menu.popup(new LogicalPosition(menuX, menuY));
//                 setIsLoading(false); // 바로 로딩 해제

//                 console.log('popup 호출됨 - 로딩 해제');
//             }

//         } catch (error) {
//             console.error('네이티브 메뉴 실패:', error);

//             // 폴백: 간단한 HTML 드롭다운
//             const isOpen = await showNativeConfirm(
//                 '메뉴 오류',
//                 '네이티브 메뉴를 사용할 수 없습니다. 브라우저 드롭다운을 사용하시겠습니까?'
//             );
//             if (isOpen) {
//                 // 여기에 HTML 드롭다운 로직 추가 가능
//                 await showNativeDialog('알림', 'HTML 드롭다운으로 대체하거나, 다른 메뉴 방식을 구현하세요.');
//             }
//             setIsLoading(false); // 에러 시에도 로딩 해제
//         }
//         // finally 블록 제거 - 각 경우에서 직접 setIsLoading(false) 호출
//     };

//     return (
//         <button
//             ref={buttonRef}
//             className={cn(
//                 "h-full px-3 rounded-none font-bold text-sm",
//                 "flex items-center gap-1",
//                 "border-none outline-none cursor-pointer",
//                 "transition-colors duration-150",
//                 "bg-slate-700 hover:bg-slate-800 text-white border-r border-slate-600",
//                 isLoading && "opacity-75 cursor-not-allowed",
//                 className
//             )}
//             onClick={showNativeMenu}
//             onMouseDown={(e) => e.stopPropagation()}
//             disabled={isLoading}
//             type="button"
//         >
//             P
//             <ChevronDown className={cn(
//                 "h-3 w-3 transition-transform duration-150",
//                 isLoading && "animate-spin"
//             )} />
//         </button>
//     );
// }

// src/widgets/titlebar/ui/MenuDropdown.tsx
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface MenuDropdownProps {
    className?: string;
}

export function MenuDropdown({ className }: MenuDropdownProps) {
    const [isLoading, setIsLoading] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // 네이티브 다이얼로그 함수 (Rust 커맨드 사용)
    const showNativeDialog = async (title: string, message: string) => {
        try {
            const { invoke } = await import('@tauri-apps/api/core');
            await invoke('show_message_dialog', { title, message });
        } catch (error) {
            console.error('네이티브 다이얼로그 실패:', error);
            // 폴백으로 브라우저 alert 사용
            alert(`${title}: ${message}`);
        }
    };

    // 확인 다이얼로그 함수 (Rust 커맨드 사용)
    const showNativeConfirm = async (title: string, message: string): Promise<boolean> => {
        try {
            const { invoke } = await import('@tauri-apps/api/core');
            return await invoke('show_confirm_dialog', { title, message });
        } catch (error) {
            console.error('네이티브 확인 다이얼로그 실패:', error);
            // 폴백으로 브라우저 confirm 사용
            return confirm(`${title}: ${message}`);
        }
    };

    const showNativeMenu = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            console.log('네이티브 메뉴 시작...');

            const { Menu, MenuItem, PredefinedMenuItem } = await import('@tauri-apps/api/menu');
            console.log('Menu API 로드 성공');

            // 메뉴 생성
            const menu = await Menu.new({
                items: [
                    await MenuItem.new({
                        id: 'task_view',
                        text: '작업보기',
                        action: async () => {
                            console.log("작업보기 클릭됨!");
                            await showNativeDialog('작업보기', '작업보기가 실행되었습니다.');
                        }
                    }),
                    await MenuItem.new({
                        id: 'agent_info',
                        text: '에이전트정보',
                        action: async () => {
                            console.log("에이전트정보 클릭됨!");
                            await showNativeDialog('에이전트정보', '에이전트 정보를 표시합니다.');
                        }
                    }),
                    await MenuItem.new({
                        id: 'terminal_stats',
                        text: '단말누적통계보기',
                        action: async () => {
                            console.log("단말누적통계보기 클릭됨!");
                            await showNativeDialog('통계보기', '단말 누적 통계를 표시합니다.');
                        }
                    }),
                    await PredefinedMenuItem.new({ item: 'Separator' }),
                    await MenuItem.new({
                        id: 'settings',
                        text: '환경설정',
                        action: async () => {
                            console.log("환경설정 클릭됨!");
                            try {
                                // 현재 윈도우와 WebviewWindow 임포트
                                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                                const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');

                                // 현재 메인 윈도우 가져오기
                                const currentWindow = getCurrentWindow();

                                // 현재 윈도우의 위치와 크기 정보 가져오기 (Physical과 Logical 모두 확인)
                                const currentPosition = await currentWindow.outerPosition();
                                const currentSize = await currentWindow.outerSize();
                                const scaleFactor = await currentWindow.scaleFactor();

                                console.log('현재 윈도우 위치:', currentPosition);
                                console.log('현재 윈도우 크기:', currentSize);
                                console.log('스케일 팩터:', scaleFactor);

                                // 새 창 크기 설정
                                const newWindowWidth = 600;
                                const newWindowHeight = 400;

                                // 스케일 팩터를 고려한 정확한 위치 계산
                                const adjustedWidth = currentSize.width / scaleFactor;
                                const adjustedHeight = currentSize.height / scaleFactor;
                                const adjustedX = currentPosition.x / scaleFactor;
                                const adjustedY = currentPosition.y / scaleFactor;

                                // 메인 윈도우 바로 아래 중앙에 새 창 위치 계산
                                const newWindowX = Math.round(adjustedX + (adjustedWidth - newWindowWidth) / 2); // 중앙 정렬
                                const newWindowY = Math.round(adjustedY + adjustedHeight + 10); // 메인 윈도우 바로 아래

                                console.log('조정된 윈도우 크기:', { width: adjustedWidth, height: adjustedHeight });
                                console.log('조정된 윈도우 위치:', { x: adjustedX, y: adjustedY });
                                // 모니터 경계 체크를 위한 추가 보정
                                const { availableMonitors } = await import('@tauri-apps/api/window');
                                const monitors = await availableMonitors();

                                // 현재 윈도우가 있는 모니터 찾기
                                let targetMonitor = monitors[0]; // 기본값
                                for (const monitor of monitors) {
                                    const monitorLeft = monitor.position.x / monitor.scaleFactor;
                                    const monitorTop = monitor.position.y / monitor.scaleFactor;
                                    const monitorRight = monitorLeft + monitor.size.width / monitor.scaleFactor;
                                    const monitorBottom = monitorTop + monitor.size.height / monitor.scaleFactor;

                                    if (adjustedX >= monitorLeft && adjustedX < monitorRight &&
                                        adjustedY >= monitorTop && adjustedY < monitorBottom) {
                                        targetMonitor = monitor;
                                        break;
                                    }
                                }

                                console.log('대상 모니터:', targetMonitor);

                                // 해당 모니터 내에서 위치 보정
                                const monitorLeft = targetMonitor.position.x / targetMonitor.scaleFactor;
                                const monitorTop = targetMonitor.position.y / targetMonitor.scaleFactor;
                                const monitorWidth = targetMonitor.size.width / targetMonitor.scaleFactor;
                                const monitorHeight = targetMonitor.size.height / targetMonitor.scaleFactor;

                                // 최종 위치 계산 (모니터 경계 고려)
                                let finalX = Math.max(monitorLeft, Math.min(newWindowX, monitorLeft + monitorWidth - newWindowWidth));
                                let finalY = newWindowY;

                                // 아래쪽으로 벗어나면 윈도우 위쪽으로 배치
                                if (finalY + newWindowHeight > monitorTop + monitorHeight) {
                                    finalY = adjustedY - newWindowHeight - 10;
                                }

                                // 위쪽으로도 벗어나면 모니터 내 적절한 위치에 배치
                                if (finalY < monitorTop) {
                                    finalY = monitorTop + 50;
                                }

                                console.log('최종 창 위치:', { x: finalX, y: finalY });

                                const settingsWindow = new WebviewWindow('settings', {
                                    url: '/settings', // 또는 별도의 HTML 파일 경로
                                    title: '환경설정',
                                    width: newWindowWidth,
                                    height: newWindowHeight,
                                    resizable: true,
                                    center: false, // 중앙 정렬 비활성화 (수동으로 위치 지정)
                                    x: finalX,  // 최종 계산된 위치
                                    y: finalY,  // 최종 계산된 위치
                                    decorations: true,
                                    alwaysOnTop: false,
                                    skipTaskbar: false
                                });

                                // 윈도우 생성 완료 대기
                                await settingsWindow.once('tauri://created', () => {
                                    console.log('환경설정 윈도우 생성됨');
                                });

                                // 윈도우 에러 처리
                                settingsWindow.once('tauri://error', (e) => {
                                    console.error('환경설정 윈도우 생성 실패:', e);
                                });

                            } catch (error) {
                                console.error('환경설정 윈도우 생성 실패:', error);
                                await showNativeDialog('오류', '환경설정 창을 열 수 없습니다.');
                            }
                        }
                    }),
                    await MenuItem.new({
                        id: 'stats_config',
                        text: '통계표 설정',
                        action: async () => {
                            console.log("통계표 설정 클릭됨!");
                            await showNativeDialog('통계설정', '통계표 설정을 변경합니다.');
                        }
                    }),
                    await MenuItem.new({
                        id: 'secret_info',
                        text: '비밀정보',
                        action: async () => {
                            console.log("비밀정보 클릭됨!");
                            const confirmed = await showNativeConfirm(
                                '비밀정보 접근',
                                '비밀정보에 접근하시겠습니까?'
                            );
                            if (confirmed) {
                                await showNativeDialog('비밀정보', '비밀정보에 접근했습니다.');
                            }
                        }
                    }),
                    await PredefinedMenuItem.new({ item: 'Separator' }),
                    await MenuItem.new({
                        id: 'quit',
                        text: '종료',
                        action: async () => {
                            console.log("종료 클릭됨!");
                            const confirmed = await showNativeConfirm(
                                '프로그램 종료',
                                '정말로 프로그램을 종료하시겠습니까?'
                            );
                            if (confirmed) {
                                try {
                                    const { invoke } = await import('@tauri-apps/api/core');
                                    await invoke('exit_app');
                                } catch (error) {
                                    console.error('종료 실패:', error);
                                    await showNativeDialog('오류', '프로그램 종료에 실패했습니다.');
                                }
                            }
                        }
                    })
                ]
            });

            console.log('메뉴 생성 완료');

            // 버튼 위치만 사용 (창 위치 계산 제거)
            const buttonRect = buttonRef.current?.getBoundingClientRect();
            if (buttonRect) {
                console.log('버튼 위치:', buttonRect);

                // 화면 절대 좌표 사용
                const menuX = buttonRect.left;
                const menuY = buttonRect.bottom + 5;

                console.log('메뉴 위치:', { x: menuX, y: menuY });

                // popup 호출
                const { LogicalPosition } = await import('@tauri-apps/api/window');

                // popup 호출 후 바로 로딩 해제 (popup은 비동기로 완료되지 않을 수 있음)
                menu.popup(new LogicalPosition(menuX, menuY));
                setIsLoading(false); // 바로 로딩 해제

                console.log('popup 호출됨 - 로딩 해제');
            }

        } catch (error) {
            console.error('네이티브 메뉴 실패:', error);

            // 폴백: 간단한 HTML 드롭다운
            const isOpen = await showNativeConfirm(
                '메뉴 오류',
                '네이티브 메뉴를 사용할 수 없습니다. 브라우저 드롭다운을 사용하시겠습니까?'
            );
            if (isOpen) {
                // 여기에 HTML 드롭다운 로직 추가 가능
                await showNativeDialog('알림', 'HTML 드롭다운으로 대체하거나, 다른 메뉴 방식을 구현하세요.');
            }
            setIsLoading(false); // 에러 시에도 로딩 해제
        }
        // finally 블록 제거 - 각 경우에서 직접 setIsLoading(false) 호출
    };

    return (
        <button
            ref={buttonRef}
            className={cn(
                "h-full px-3 rounded-none font-bold text-sm",
                "flex items-center gap-1",
                "border-none outline-none cursor-pointer",
                "transition-colors duration-150",
                "bg-slate-700 hover:bg-slate-800 text-white border-r border-slate-600",
                isLoading && "opacity-75 cursor-not-allowed",
                className
            )}
            onClick={showNativeMenu}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={isLoading}
            type="button"
        >
            P
            <ChevronDown className={cn(
                "h-3 w-3 transition-transform duration-150",
                isLoading && "animate-spin"
            )} />
        </button>
    );
}