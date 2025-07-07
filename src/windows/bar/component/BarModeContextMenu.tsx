'use client';

import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import {
    Settings,
    User,
    BarChart3,
    Eye,
    List,
    Monitor,
    Bell,
    Info,
    X
} from 'lucide-react';

const BarModeContextMenu = () => {
    const menuItems = [
        {
            id: 'general',
            label: '일반 설정',
            icon: Settings,
            category: 'general'
        },
        {
            id: 'personal',
            label: '개인 설정',
            icon: User,
            category: 'personal'
        },
        {
            id: 'separator1',
            type: 'separator'
        },
        {
            id: 'statistics-range',
            label: '큐 통계범위',
            icon: BarChart3,
            category: 'communication'
        },
        {
            id: 'statistics-view',
            label: '통계보기',
            icon: Eye,
            category: 'statistics-view'
        },
        {
            id: 'statistics-items',
            label: '통계항목',
            icon: List,
            category: 'statistics-items'
        },
        {
            id: 'minibar',
            label: '미니바',
            icon: Monitor,
            category: 'minimap'
        },
        {
            id: 'notifications',
            label: '알림',
            icon: Bell,
            category: 'notifications'
        },
        {
            id: 'separator2',
            type: 'separator'
        },
        {
            id: 'about',
            label: '정보',
            icon: Info,
            category: 'about'
        }
    ];

    const handleMenuItemClick = async (category: string) => {
        try {
            // 설정 창 열기
            await invoke('open_settings_category', { category });
            console.log(`📋 설정 카테고리 열기: ${category}`);

            // 컨텍스트 메뉴 창 닫기
            await handleClose();
        } catch (error) {
            console.error('설정 열기 실패:', error);
        }
    };

    const handleClose = async () => {
        try {
            await getCurrentWebviewWindow().close();
        } catch (error) {
            console.error('창 닫기 실패:', error);
        }
    };

    return (
        <div
            className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
            style={{ backgroundColor: '#FFFFFF' }}
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">메뉴</span>
                <button
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                    style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                >
                    <X size={14} className="text-gray-500" />
                </button>
            </div>

            {/* 메뉴 아이템들 */}
            <div className="py-1">
                {menuItems.map((item) => {
                    if (item.type === 'separator') {
                        return (
                            <div key={item.id} className="h-px bg-gray-200 mx-2 my-1" />
                        );
                    }

                    const IconComponent = item.icon!;

                    return (
                        <button
                            key={item.id}
                            onClick={() => handleMenuItemClick(item.category!)}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
                        >
                            <IconComponent size={16} className="mr-3 text-gray-500" />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 푸터 */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                    CTI Task Manager v1.0
                </div>
            </div>
        </div>
    );
};

export default BarModeContextMenu;