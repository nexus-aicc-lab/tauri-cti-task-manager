'use client';

import React, { useState } from 'react';
import { PauseCircle, PhoneCall, ClipboardList, Users, Phone, Coffee, Clock } from 'lucide-react';

interface Status {
    label: string;
    time: string;
    icon: React.ReactNode;
    color: string;
}

const AgentStatusInfoBoxForPanelMode1: React.FC = () => {
    const [statusIndex, setStatusIndex] = useState<number>(0);

    const statuses: Status[] = [
        {
            label: '통화중',
            time: '00:03:45',
            icon: <PhoneCall className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#14b8a6'
        },
        {
            label: '대기중',
            time: '12:03:45',
            icon: <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#3b82f6'
        },
        {
            label: '후처리',
            time: '00:34:20',
            icon: <ClipboardList className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#f97316'
        },
        {
            label: '휴식중',
            time: '00:01:45',
            icon: <Coffee className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#8b5cf6'
        },
    ];

    const current = statuses[statusIndex];
    const waitQueueCount = 5;
    const waitAgentCount = 1;

    const handleClick = (): void => {
        setStatusIndex((prev) => (prev + 1) % statuses.length);
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes smooth-rotate {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                
                @keyframes pulse-glow {
                    0%, 100% {
                        filter: none;
                    }
                    50% {
                        filter: none;
                    }
                }
                
                .radar-container {
                    position: relative;
                    display: inline-block;
                    border-radius: 50%;
                    padding: 20px;
                }
                
                .radar-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                }
                
                .teal-bg {
                    background: #14b8a6;
                }
                
                .blue-bg {
                    background: #3b82f6;
                }
                
                .orange-bg {
                    background: #f97316;
                }
                
                .purple-bg {
                    background: #8b5cf6;
                }
                
                .radar-sweep {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                    animation: smooth-rotate 2s linear infinite;
                }
                
                .teal-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 70%,
                        rgba(110, 231, 183, 0.6) 75%,
                        rgba(110, 231, 183, 1) 80%,
                        rgba(110, 231, 183, 0.6) 85%,
                        transparent 90%,
                        transparent 100%
                    );
                }
                
                .blue-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 70%,
                        rgba(147, 197, 253, 0.6) 75%,
                        rgba(147, 197, 253, 1) 80%,
                        rgba(147, 197, 253, 0.6) 85%,
                        transparent 90%,
                        transparent 100%
                    );
                }
                
                .orange-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 70%,
                        rgba(253, 186, 116, 0.6) 75%,
                        rgba(253, 186, 116, 1) 80%,
                        rgba(253, 186, 116, 0.6) 85%,
                        transparent 90%,
                        transparent 100%
                    );
                }
                
                .purple-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 70%,
                        rgba(196, 181, 253, 0.6) 75%,
                        rgba(196, 181, 253, 1) 80%,
                        rgba(196, 181, 253, 0.6) 85%,
                        transparent 90%,
                        transparent 100%
                    );
                }

                .card-shimmer {
                    position: relative;
                    overflow: hidden;
                }
                
                .card-shimmer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(156,163,175,0.08),
                        transparent
                    );
                    animation: shimmer 4s infinite;
                }
                
                @keyframes shimmer {
                    0% {
                        left: -100%;
                    }
                    100% {
                        left: 100%;
                    }
                }
                `
            }} />

            <div className="h-full bg-gray-50 p-3 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col min-h-0">

                {/* 원형 상태 박스 */}
                <div className="flex-1 flex justify-center items-center mb-3 sm:mb-6 min-h-0">
                    <div className="radar-container shadow-lg">
                        {/* 고정 배경 */}
                        <div className={`radar-background ${statusIndex === 0 ? 'teal-bg' :
                            statusIndex === 1 ? 'blue-bg' :
                                statusIndex === 2 ? 'orange-bg' :
                                    'purple-bg'
                            }`}></div>

                        {/* 회전하는 레이더 스윕 */}
                        <div
                            className={`radar-sweep ${statusIndex === 0 ? 'teal-sweep' :
                                statusIndex === 1 ? 'blue-sweep' :
                                    statusIndex === 2 ? 'orange-sweep' :
                                        'purple-sweep'
                                }`}
                        ></div>

                        <button
                            onClick={handleClick}
                            className="relative z-10 w-24 h-24 sm:w-32 md:w-40 lg:w-48 sm:h-32 md:h-40 lg:h-48 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 bg-white"
                            style={{
                                boxShadow: `
                                    inset 0 2px 8px rgba(0,0,0,0.1),
                                    0 4px 20px rgba(0,0,0,0.15)
                                `
                            }}
                        >
                            <div className="mb-1 sm:mb-3">
                                {statusIndex === 0 ? <PhoneCall className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600" /> :
                                    statusIndex === 1 ? <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600" /> :
                                        statusIndex === 2 ? <ClipboardList className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600" /> :
                                            <Coffee className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600" />}
                            </div>
                            <div className="text-sm sm:text-lg lg:text-xl font-bold mb-1 text-gray-800">
                                {current.label}
                            </div>
                            <div className="text-xs sm:text-sm lg:text-lg font-medium text-gray-600">
                                {current.time}
                            </div>
                        </button>
                    </div>
                </div>

                {/* 하단 통계 카드 */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
                    {/* 대기호 */}
                    <div className="rounded-lg p-3 sm:p-4 bg-white border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105 card-shimmer">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs sm:text-sm text-gray-500 font-medium">대기호</div>
                                <div className="text-lg sm:text-2xl font-bold text-gray-800">
                                    {waitQueueCount}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 대기 상담사 */}
                    <div className="rounded-lg p-3 sm:p-4 bg-white border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105 card-shimmer">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs sm:text-sm text-gray-500 font-medium">대기 상담</div>
                                <div className="text-lg sm:text-2xl font-bold text-gray-800">
                                    {waitAgentCount}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AgentStatusInfoBoxForPanelMode1;