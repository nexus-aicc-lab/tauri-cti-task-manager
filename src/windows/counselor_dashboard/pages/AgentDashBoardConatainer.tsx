'use client';

import React, { useEffect, useState, useRef } from 'react';
import CustomTitlebar from '../components/CustomTitlebar';
import DashboardContent from '../components/DashboardContent';
import { adjustWindowSize } from '../lib/windowResize';

const AgentDashBoardContainer: React.FC = () => {
    const [user, setUser] = useState<{ id: number, email: string; name: string } | null>(null);

    // DOM 참조
    const contentRef = useRef<HTMLDivElement>(null);
    const topGridRef = useRef<HTMLDivElement>(null);

    // ✅ 로그인 상태 확인
    useEffect(() => {
        const checkUserStatus = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user_data');

            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUserStatus();
        window.addEventListener('storage', checkUserStatus);
        return () => window.removeEventListener('storage', checkUserStatus);
    }, []);

    // ✅ 초기 크기 조정
    useEffect(() => {
        const timer = setTimeout(() => {
            adjustWindowSize(contentRef, topGridRef);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            {/* CustomTitlebar에 user와 onUserChange props 전달 */}
            <CustomTitlebar
                title='상담사 대쉬 보드'
                user={user}
                onUserChange={setUser}
            />

            <DashboardContent
                user={user}
                onUserChange={setUser}
                contentRef={contentRef}
                topGridRef={topGridRef}
            />
        </div>
    );
};

export default AgentDashBoardContainer;