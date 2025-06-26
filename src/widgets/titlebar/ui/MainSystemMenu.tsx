// C:\tauri\cti-task-manager-tauri\src\widgets\titlebar\ui\MainSystemMenu.tsx
'use client';

import { useRef } from 'react';
import { Menu } from 'lucide-react';
import { exit, relaunch } from '@tauri-apps/plugin-process';

export default function MainSystemMenu() {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const onClickMenu = async () => {
        console.log("✅ 시스템 메뉴 버튼 클릭됨");

        try {
            const { Menu: TauriMenu, MenuItem } = await import('@tauri-apps/api/menu');
            const { LogicalPosition } = await import('@tauri-apps/api/window');
            const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');

            // 멀티계정정보
            const multiAccountItem = await MenuItem.new({
                id: 'multi-account',
                text: '멀티계정정보',
                action: async () => {
                    console.log("👤 멀티계정정보 클릭됨!");
                    // TODO: 멀티계정정보 창 열기 로직
                },
            });

            // 당일누적통계보기
            const dailyStatsItem = await MenuItem.new({
                id: 'daily-stats',
                text: '당일누적통계보기',
                action: async () => {
                    console.log("📊 당일누적통계보기 클릭됨!");
                    // TODO: 통계 창 열기 로직
                },
            });

            // 환경설정
            const settingsItem = await MenuItem.new({
                id: 'settings',
                text: '환경설정',
                action: async () => {
                    console.log("⚙️ 환경설정 클릭됨!");

                    try {
                        const win = new WebviewWindow('settings', {
                            url: '/settings',
                            title: '환경설정',
                            width: 600,
                            height: 400,
                            resizable: true,
                            decorations: true,
                            center: true,
                        });

                        win.once('tauri://created', () => console.log('✅ 설정 창 생성 완료'));
                        win.once('tauri://error', (e) => console.error('❌ 설정 창 생성 실패:', e));
                    } catch (error) {
                        console.error('❌ 환경설정 창 열기 실패:', error);
                    }
                },
            });

            // 버전정보
            const versionItem = await MenuItem.new({
                id: 'version',
                text: '버전정보',
                action: async () => {
                    console.log("ℹ️ 버전정보 클릭됨!");

                    try {
                        const win = new WebviewWindow('version', {
                            url: '/version',
                            title: '버전정보',
                            width: 400,
                            height: 300,
                            resizable: false,
                            decorations: true,
                            center: true,
                        });

                        win.once('tauri://created', () => console.log('✅ 버전정보 창 생성 완료'));
                        win.once('tauri://error', (e) => console.error('❌ 버전정보 창 생성 실패:', e));
                    } catch (error) {
                        console.error('❌ 버전정보 창 열기 실패:', error);
                    }
                },
            });

            // 종료
            const exitItem = await MenuItem.new({
                id: 'exit',
                text: '종료',
                action: async () => {
                    console.log("🚪 종료 클릭됨!");
                    try {
                        await exit(0);
                    } catch (error) {
                        console.error('❌ 종료 실패:', error);
                    }
                },
            });

            // 네이티브 메뉴 생성
            const menu = await TauriMenu.new({
                items: [
                    multiAccountItem,
                    dailyStatsItem,
                    settingsItem,
                    versionItem,
                    exitItem
                ],
            });

            // 버튼 위치 계산
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) {
                console.error('❌ 버튼 위치를 찾을 수 없음');
                return;
            }

            // 메뉴 팝업 표시
            const LogicalPos = new LogicalPosition(rect.left, rect.bottom + 5);
            await menu.popup(LogicalPos);

            console.log('📢 네이티브 메뉴 popup 호출됨');
        } catch (e) {
            console.error("❌ 네이티브 메뉴 생성 또는 popup 중 오류:", e);
        }
    };

    return (
        <button
            ref={buttonRef}
            onClick={onClickMenu}
            className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
            title="시스템 메뉴"
            style={{
                border: '1px solid #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                backgroundColor: 'transparent'
            }}
        >
            <Menu size={16} />
        </button>
    );
}