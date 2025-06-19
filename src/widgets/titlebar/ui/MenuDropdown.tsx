'use client';

import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { getPopupPosition } from '@/shared/lib/tauri/getPopupPosition';

export function MenuDropdown() {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const onClickMenu = async () => {
        console.log("✅ 메뉴 버튼 클릭됨");

        try {
            const { Menu, MenuItem } = await import('@tauri-apps/api/menu');
            const { LogicalPosition } = await import('@tauri-apps/api/window');
            const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');

            const helloItem = await MenuItem.new({
                id: 'hello',
                text: 'Hello!',
                action: async () => {
                    console.log("👋 Hello 클릭됨!");

                    const { x, y } = await getPopupPosition({
                        width: 400,
                        height: 300,
                    });

                    const helloWin = new WebviewWindow('hello', {
                        url: '/hello',
                        title: 'Hello Window',
                        width: 400,
                        height: 300,
                        resizable: true,
                        decorations: true,
                        x,
                        y,
                    });

                    helloWin.once('tauri://created', () => {
                        console.log('✅ Hello 창 생성 완료');
                    });

                    helloWin.once('tauri://error', (e) => {
                        console.error('❌ Hello 창 생성 실패:', e);
                    });
                },
            });

            const menu = await Menu.new({ items: [helloItem] });

            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) return;

            const LogicalPos = new LogicalPosition(rect.left, rect.bottom + 5);
            await menu.popup(LogicalPos);

            console.log('📢 메뉴 popup 호출됨');
        } catch (e) {
            console.error("❌ 메뉴 생성 또는 popup 중 오류:", e);
        }
    };

    return (
        <button
            ref={buttonRef}
            className="px-2 py-1 bg-blue-600 text-white flex items-center gap-1"
            onClick={onClickMenu}
        >
            P <ChevronDown className="w-3 h-3" />
        </button>
    );
}
