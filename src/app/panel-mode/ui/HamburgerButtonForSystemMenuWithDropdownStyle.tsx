'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { exit, relaunch } from '@tauri-apps/plugin-process';

const menuItems = [
    '멀티계정정보',
    '당일누적통계보기',
    '환경설정',
    '버전정보',
    '종료',
];

export default function HamburgerButtonForSystemMenuWithDropdownStyle() {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleMenuClick = async (item: string) => {
        setIsOpen(false);
        console.log(`[메뉴 클릭됨] ${item}`);

        switch (item) {
            case '종료':
                await exit(0);
                break;
            case '환경설정':
                console.log('환경설정 열기');
                break;
            case '버전정보':
                console.log('버전 정보 보기');
                break;
            default:
                console.log('아직 구현 안 됨');
                break;
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={handleClick}
                className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                title="메뉴"
            >
                <Menu size={16} />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-[2.5] w-44 bg-white border border-gray-400 rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.1)] z-50 overflow-hidden">
                    {menuItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleMenuClick(item)}
                            className={`w-full text-left px-4 py-2 text-sm
        ${idx !== 0 ? 'border-t border-gray-100' : ''}
        hover:bg-blue-50 hover:text-blue-700 text-gray-800 transition-colors duration-150`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

            )}
        </div>
    );
}
