'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { exit } from '@tauri-apps/plugin-process';

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
        console.log('🍔 햄버거 메뉴 클릭, isOpen:', !isOpen);
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
        <>
            <div
                className="relative inline-block"
                ref={wrapperRef}
                style={{ zIndex: 1000 }} // 인라인 스타일로 강제 적용
            >
                <button
                    onClick={handleClick}
                    className="text-gray-800 hover:text-black hover:bg-gray-300 p-1 rounded"
                    title="메뉴"
                    style={{
                        backgroundColor: isOpen ? '#d1d5db' : 'transparent',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px'
                    }}
                >
                    <Menu size={16} />
                </button>

                {isOpen && (
                    <div
                        className="absolute left-0 w-44 bg-white border border-gray-400 rounded-md shadow-lg overflow-hidden"
                        style={{
                            top: '32px', // 버튼 아래에 위치
                            zIndex: 9999, // 매우 높은 z-index
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: '1px solid #999',
                        }}
                    >
                        {menuItems.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleMenuClick(item)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 text-gray-800 transition-colors duration-150"
                                style={{
                                    borderTop: idx !== 0 ? '1px solid #f0f0f0' : 'none',
                                    display: 'block',
                                    width: '100%'
                                }}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 디버깅용 - 메뉴가 열려있는지 확인 */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    zIndex: 999,
                    pointerEvents: 'none'
                }} />
            )}
        </>
    );
}