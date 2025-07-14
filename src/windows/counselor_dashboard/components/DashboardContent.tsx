// src/windows/counselor_dashboard/DashboardContent.tsx
'use client';

import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import {
    PhoneIncoming,
    ListTodo,
} from 'lucide-react';
import AgentStatus1 from '../ui/AgentStatus1';
import AgentStatus2 from '../ui/AgentStatus2';
import AgentStatus3 from '../ui/AgentStatus3';
import LoginForm from '@/shared/ui/LoginForm/LoginForm';
import SimpleConsultantProfile from '@/shared/ui/LoginForm/CounsultantProfile';

interface DashboardContentProps {
    user: { id: number; email: string; name: string } | null;
    onUserChange: (user: { id: number; email: string; name: string } | null) => void;
    contentRef: React.RefObject<HTMLDivElement>;
    topGridRef: React.RefObject<HTMLDivElement>;
}

const dummyCalls = [
    { time: '14:21', name: '홍길동', duration: '2분 43초' },
    { time: '14:17', name: '이순신', duration: '1분 12초' },
];

const dummyQueue = [
    { name: '김유신', expected: '1분' },
    { name: '강감찬', expected: '2분' },
    { name: '을지문덕', expected: '3분' },
];

const DashboardContent: React.FC<DashboardContentProps> = ({
    user,
    onUserChange,
    contentRef,
    topGridRef,
}) => {
    return (
        <div
            ref={contentRef}
            style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                overflow: 'auto',
                width: '100%',
                boxSizing: 'border-box',
            }}
            className="space-y-4"
        >
            {/* 메인 카드 그리드 */}
            <div
                ref={topGridRef}
                className="flex gap-4 w-full"
                style={{
                    flexWrap: 'nowrap',
                    justifyContent: 'flex-start',
                }}
            >
                {/* AgentStatus1만 user prop 넘겨주기 */}
                <Card className="h-auto flex-shrink-0" style={{ width: '350px' }}>
                    <CardContent className="p-4">
                        <AgentStatus1 user={user} />
                    </CardContent>
                </Card>

                {/* AgentStatus2, AgentStatus3 는 원래 코드 그대로 */}
                <Card className="h-auto flex-shrink-0" style={{ width: '350px' }}>
                    <CardContent className="p-4">
                        <AgentStatus2 />
                    </CardContent>
                </Card>

                <Card className="h-auto flex-shrink-0" style={{ width: '350px' }}>
                    <CardContent className="p-4">
                        <AgentStatus3 />
                    </CardContent>
                </Card>
            </div>

            {/* 하단 2열 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Card className="min-h-[140px] h-auto flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                            <ListTodo className="w-4 h-4" /> 대기 목록
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 flex-1">
                        {dummyQueue.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span>{item.name}</span>
                                <span className="text-muted-foreground">
                                    예상 {item.expected}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="min-h-[140px] h-auto flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                            <PhoneIncoming className="w-4 h-4" /> 최근 통화 목록
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 flex-1">
                        {dummyCalls.map((call, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span>{call.time}</span>
                                <span>{call.name}</span>
                                <span>{call.duration}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardContent;
