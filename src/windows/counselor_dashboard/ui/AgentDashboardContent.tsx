// /components/pages/AgentDashboardContent.tsx
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

const dummyCalls = [
    { time: '14:21', name: '홍길동', duration: '2분 43초' },
    { time: '14:17', name: '이순신', duration: '1분 12초' },
];

const dummyQueue = [
    { name: '김유신', expected: '1분' },
    { name: '강감찬', expected: '2분' },
    { name: '을지문덕', expected: '3분' },
];

const AgentDashboardContent = () => {
    return (
        <div className="px-4 py-6 space-y-6 max-w-7xl mx-auto">
            {/* 메인 3열 구성 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-full">
                    <AgentStatus1 />
                </div>
                <div className="col-span-1 space-y-4">
                    <AgentStatus2 />
                </div>
                <div className="col-span-1 space-y-4">
                    <AgentStatus3 />
                </div>
            </div>

            {/* 하단 2열 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="min-h-[160px] flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                            <ListTodo className="w-4 h-4" /> 대기 목록
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {dummyQueue.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span>{item.name}</span>
                                <span className="text-muted-foreground">예상 {item.expected}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="min-h-[160px] flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                            <PhoneIncoming className="w-4 h-4" /> 최근 통화 목록
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
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

export default AgentDashboardContent;
