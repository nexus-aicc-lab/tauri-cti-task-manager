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
    User as UserIcon,
    Mail,
    Clock,
} from 'lucide-react';
import AgentStatus1 from '../ui/AgentStatus1';
import AgentStatus2 from '../ui/AgentStatus2';
import AgentStatus3 from '../ui/AgentStatus3';

// ✅ User 타입 정의
interface User {
    id: number;
    email: string;
    name: string;
    profileImage?: string;
    callStatus: 'READY' | 'BUSY' | 'BREAK' | 'OFFLINE';
    createdAt: string;
}

interface AgentDashboardContentProps {
    user?: User; // ✅ user props 추가
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

// ✅ 상태별 스타일 함수
const getStatusStyle = (status: User['callStatus']) => {
    switch (status) {
        case 'READY': return 'bg-green-100 text-green-800 border-green-200';
        case 'BUSY': return 'bg-red-100 text-red-800 border-red-200';
        case 'BREAK': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'OFFLINE': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusText = (status: User['callStatus']) => {
    switch (status) {
        case 'READY': return '대기중';
        case 'BUSY': return '통화중';
        case 'BREAK': return '휴식중';
        case 'OFFLINE': return '오프라인';
        default: return '알 수 없음';
    }
};

const AgentDashboardContent: React.FC<AgentDashboardContentProps> = ({ user }) => {
    return (
        <div className="px-4 py-6 space-y-6 max-w-7xl mx-auto">
            {/* ✅ 사용자 정보 카드 추가 */}
            {user && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <UserIcon className="w-5 h-5" />
                            상담사 정보
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <strong>이름:</strong>
                                <span>{user.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <strong>상태:</strong>
                                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusStyle(user.callStatus)}`}>
                                    {getStatusText(user.callStatus)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">
                                    가입일: {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

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

            {/* ✅ 디버깅용 사용자 데이터 출력 */}
            {user && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">
                            🔍 API 응답 데이터 (개발용)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
                            {JSON.stringify(user, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AgentDashboardContent;