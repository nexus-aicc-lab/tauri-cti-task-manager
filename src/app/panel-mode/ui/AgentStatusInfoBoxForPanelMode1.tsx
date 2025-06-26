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
            color: '#14b8a6',
        },
        {
            label: '대기중',
            time: '12:03:45',
            icon: <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#3b82f6',
        },
        {
            label: '후처리',
            time: '00:34:20',
            icon: <ClipboardList className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#f97316',
        },
        {
            label: '휴식중',
            time: '00:01:45',
            icon: <Coffee className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#8b5cf6',
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
                
                .radar-container {
                    position: relative;
                    display: inline-block;
                    border-radius: 50%;
                    padding: 12px;
                    filter: drop-shadow(0 0 10px currentColor);
                }
                
                .radar-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                }
                
                .radar-sweep {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                    animation: smooth-rotate 3s linear infinite;
                }
                
                .teal-bg {
                    background: #14b8a6;
                }
                
                .teal-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 75%,
                        #5eead4 85%,
                        #ffffff 90%,
                        #5eead4 95%,
                        transparent 100%
                    );
                }
                
                .blue-bg {
                    background: #3b82f6;
                }
                
                .blue-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 75%,
                        #93c5fd 85%,
                        #ffffff 90%,
                        #93c5fd 95%,
                        transparent 100%
                    );
                }
                
                .orange-bg {
                    background: #f97316;
                }
                
                .orange-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 75%,
                        #fdba74 85%,
                        #ffffff 90%,
                        #fdba74 95%,
                        transparent 100%
                    );
                }
                
                .purple-bg {
                    background: #8b5cf6;
                }
                
                .purple-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 75%,
                        #c4b5fd 85%,
                        #ffffff 90%,
                        #c4b5fd 95%,
                        transparent 100%
                    );
                }
                `
            }} />

            <div className="h-full bg-white p-3 sm:p-6 rounded-xl shadow-md border border-gray-200 flex flex-col min-h-0">
                {/* 원형 상태 박스 */}
                <div className="flex-1 flex justify-center items-center mb-3 sm:mb-6 min-h-0">
                    <div
                        className="radar-container shadow-lg"
                        style={{ color: current.color }}
                    >
                        {/* 고정 배경 */}
                        <div
                            className={`radar-background ${statusIndex === 0 ? 'teal-bg' :
                                    statusIndex === 1 ? 'blue-bg' :
                                        statusIndex === 2 ? 'orange-bg' :
                                            'purple-bg'
                                }`}
                        ></div>

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
                            className="relative z-10 w-24 h-24 sm:w-32 md:w-40 lg:w-48 sm:h-32 md:h-40 lg:h-48 rounded-full bg-white flex flex-col items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
                        >
                            <div className="mb-1 sm:mb-3">{current.icon}</div>
                            <div
                                className="text-sm sm:text-lg lg:text-xl font-bold mb-1"
                                style={{ color: current.color }}
                            >
                                {current.label}
                            </div>
                            <div
                                className="text-xs sm:text-sm lg:text-lg font-medium opacity-90"
                                style={{ color: current.color }}
                            >
                                {current.time}
                            </div>
                        </button>
                    </div>
                </div>

                {/* 하단 통계 카드 */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 flex-shrink-0">
                    {/* 대기호 */}
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium">대기호</div>
                                <div className="text-lg sm:text-2xl font-bold text-gray-900">
                                    {waitQueueCount}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 대기 상담사 */}
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs sm:text-sm text-gray-600 font-medium">대기 상담</div>
                                <div className="text-lg sm:text-2xl font-bold text-gray-900">
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