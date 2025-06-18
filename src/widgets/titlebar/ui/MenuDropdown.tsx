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
                        action: () => {
                            console.log("작업보기 클릭됨!");
                            alert('작업보기가 클릭되었습니다!');
                        }
                    }),
                    await MenuItem.new({
                        id: 'agent_info',
                        text: '엡티게정보',
                        action: () => {
                            console.log("엡티게정보 클릭됨!");
                            alert('엡티게정보가 클릭되었습니다!');
                        }
                    }),
                    await MenuItem.new({
                        id: 'terminal_stats',
                        text: '단말누적통계보기',
                        action: () => {
                            console.log("단말누적통계보기 클릭됨!");
                            alert('단말누적통계보기가 클릭되었습니다!');
                        }
                    }),
                    await PredefinedMenuItem.new({ item: 'Separator' }),
                    await MenuItem.new({
                        id: 'settings',
                        text: '환경설정',
                        action: () => {
                            console.log("환경설정 클릭됨!");
                            alert('환경설정이 클릭되었습니다!');
                        }
                    }),
                    await MenuItem.new({
                        id: 'stats_config',
                        text: '통계표 설정',
                        action: () => {
                            console.log("통계표 설정 클릭됨!");
                            alert('통계표 설정이 클릭되었습니다!');
                        }
                    }),
                    await MenuItem.new({
                        id: 'secret_info',
                        text: '비밀정보',
                        action: () => {
                            console.log("비밀정보 클릭됨!");
                            alert('비밀정보가 클릭되었습니다!');
                        }
                    }),
                    await PredefinedMenuItem.new({ item: 'Separator' }),
                    await MenuItem.new({
                        id: 'quit',
                        text: '종료',
                        action: () => {
                            console.log("종료 클릭됨!");
                            alert('종료가 클릭되었습니다!');
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
            const isOpen = confirm('네이티브 메뉴를 사용할 수 없습니다. 브라우저 드롭다운을 사용하시겠습니까?');
            if (isOpen) {
                // 여기에 HTML 드롭다운 로직 추가 가능
                alert('HTML 드롭다운으로 대체하거나, 다른 메뉴 방식을 구현하세요.');
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