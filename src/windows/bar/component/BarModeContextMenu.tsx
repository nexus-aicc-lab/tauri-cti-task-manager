// BarModeHamburgerButtonForContextMenu.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Menu } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

const BarModeHamburgerButtonForContextMenu: React.FC = () => {
    const [isPressed, setIsPressed] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F10') {
                e.preventDefault();
                console.log('F10 키 눌림 — 메뉴 열기 시도');
                if (wrapperRef.current) {
                    const rect = wrapperRef.current.getBoundingClientRect();
                    openContextMenu(rect);
                } else {
                    console.warn('wrapperRef가 null입니다.');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const openContextMenu = async (
        rect: DOMRect
    ) => {
        const x = rect.left - 1;
        const y = rect.bottom + 10;
        try {
            console.log(`📋 메뉴 열기 위치: x=${x}, y=${y}`);
            await invoke('show_context_menu_at_position', { x, y });
            console.log('📋 컨텍스트 메뉴 열림');
        } catch (error) {
            console.error('위치 기반 메뉴 실패:', error);
            try {
                await invoke('show_tray_context_menu');
                console.log('📋 트레이 메뉴 열림 (fallback)');
            } catch (err) {
                console.error('트레이 메뉴 열기 실패:', err);
            }
        }
    };

    const handleShowContextMenu = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 150);
        if (wrapperRef.current) {
            openContextMenu(wrapperRef.current.getBoundingClientRect());
        }
    };

    return (
        <div ref={wrapperRef} style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleShowContextMenu}
                className={cn(
                    'h-8 w-8 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-200 rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm',
                    isPressed && 'bg-slate-200 scale-95'
                )}
                title="메뉴 (F10)"
            >
                <Menu size={16} className="transition-transform hover:scale-110" />
            </Button>
        </div>
    );
};

export default BarModeHamburgerButtonForContextMenu;