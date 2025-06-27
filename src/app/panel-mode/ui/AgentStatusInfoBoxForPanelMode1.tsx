
'use client';

import React, { useState } from 'react';
import { Phone, Edit, Users, Hourglass, Coffee } from 'lucide-react';

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
            icon: <Phone className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#059669'
        },
        {
            label: '대기중',
            time: '12:03:45',
            icon: <Hourglass className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
            color: '#3b82f6'
        },
        {
            label: '후처리',
            time: '00:34:20',
            icon: <Edit className="w-6 sm:w-8 h-6 sm:h-8 text-white" />,
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
                
                @keyframes wave-rotate {
                    0% {
                        transform: rotate(120deg);
                    }
                    100% {
                        transform: rotate(480deg);
                    }
                }
                
                @keyframes pulse-glow {
                    0%, 100% {
                        filter: brightness(1.1) saturate(1.3);
                    }
                    50% {
                        filter: brightness(1.2) saturate(1.5);
                    }
                }
                
                @keyframes organic-wave {
                    0% {
                        transform: rotate(0deg) scale(0.95);
                        opacity: 0.6;
                    }
                    25% {
                        transform: rotate(90deg) scale(1.02);
                        opacity: 0.8;
                    }
                    50% {
                        transform: rotate(180deg) scale(0.98);
                        opacity: 0.7;
                    }
                    75% {
                        transform: rotate(270deg) scale(1.01);
                        opacity: 0.75;
                    }
                    100% {
                        transform: rotate(360deg) scale(0.95);
                        opacity: 0.6;
                    }
                }
                
                .radar-container {
                    position: relative;
                    display: inline-block;
                    border-radius: 50%;
                    padding: 30px;
                    overflow: hidden;
                }
                
                .radar-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                    transition: background-color 0.8s ease-in-out;
                    animation: pulse-glow 3s ease-in-out infinite;
                }
                
                .green-bg {
                    background: linear-gradient(135deg, #064e3b, #047857, #059669, #065f46);
                    box-shadow: 0 0 30px rgba(6, 95, 70, 0.5), inset 0 0 15px rgba(6, 78, 59, 0.3);
                }
                
                .blue-bg {
                    background: linear-gradient(135deg, #1e3a8a, #1e40af, #2563eb, #1d4ed8);
                    box-shadow: 0 0 30px rgba(30, 58, 138, 0.5), inset 0 0 15px rgba(23, 37, 84, 0.3);
                }
                
                .orange-bg {
                    background: linear-gradient(135deg, #9a3412, #c2410c, #ea580c, #b45309);
                    box-shadow: 0 0 30px rgba(154, 52, 18, 0.5), inset 0 0 15px rgba(124, 45, 18, 0.3);
                }
                
                .purple-bg {
                    background: linear-gradient(135deg, #581c87, #6d28d9, #7c3aed, #6b21a8);
                    box-shadow: 0 0 30px rgba(88, 28, 135, 0.5), inset 0 0 15px rgba(55, 16, 107, 0.3);
                }
                
                .radar-sweep {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                    animation: smooth-rotate 2.5s linear infinite;
                    transition: background 0.8s ease-in-out;
                }
                
                .radar-wave {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                    animation: wave-rotate 3.5s linear infinite;
                    transition: background 0.8s ease-in-out;
                }
                
                .green-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 55%,
                        rgba(22, 163, 74, 0.4) 58%,
                        rgba(15, 118, 110, 0.5) 62%,
                        rgba(6, 95, 70, 0.6) 66%,
                        rgba(4, 120, 87, 0.7) 70%,
                        rgba(6, 78, 59, 0.8) 74%,
                        rgba(5, 46, 22, 0.85) 78%,
                        rgba(6, 78, 59, 0.75) 82%,
                        rgba(4, 120, 87, 0.65) 86%,
                        rgba(6, 95, 70, 0.55) 90%,
                        rgba(15, 118, 110, 0.45) 94%,
                        rgba(22, 163, 74, 0.35) 97%,
                        transparent 100%
                    );
                }
                
                .green-wave {
                    background: conic-gradient(
                        from 60deg,
                        transparent 0%,
                        transparent 50%,
                        rgba(15, 118, 110, 0.3) 55%,
                        rgba(6, 95, 70, 0.4) 60%,
                        rgba(4, 120, 87, 0.5) 65%,
                        rgba(6, 78, 59, 0.6) 70%,
                        rgba(5, 46, 22, 0.65) 75%,
                        rgba(6, 78, 59, 0.55) 80%,
                        rgba(4, 120, 87, 0.45) 85%,
                        rgba(6, 95, 70, 0.35) 90%,
                        rgba(15, 118, 110, 0.25) 95%,
                        transparent 100%
                    );
                }
                
                .blue-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 55%,
                        rgba(37, 99, 235, 0.4) 58%,
                        rgba(29, 78, 216, 0.5) 62%,
                        rgba(30, 64, 175, 0.6) 66%,
                        rgba(30, 58, 138, 0.7) 70%,
                        rgba(23, 37, 84, 0.8) 74%,
                        rgba(15, 23, 42, 0.85) 78%,
                        rgba(23, 37, 84, 0.75) 82%,
                        rgba(30, 58, 138, 0.65) 86%,
                        rgba(30, 64, 175, 0.55) 90%,
                        rgba(29, 78, 216, 0.45) 94%,
                        rgba(37, 99, 235, 0.35) 97%,
                        transparent 100%
                    );
                }
                
                .blue-wave {
                    background: conic-gradient(
                        from 60deg,
                        transparent 0%,
                        transparent 50%,
                        rgba(29, 78, 216, 0.3) 55%,
                        rgba(30, 64, 175, 0.4) 60%,
                        rgba(30, 58, 138, 0.5) 65%,
                        rgba(23, 37, 84, 0.6) 70%,
                        rgba(15, 23, 42, 0.65) 75%,
                        rgba(23, 37, 84, 0.55) 80%,
                        rgba(30, 58, 138, 0.45) 85%,
                        rgba(30, 64, 175, 0.35) 90%,
                        rgba(29, 78, 216, 0.25) 95%,
                        transparent 100%
                    );
                }
                
                .orange-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 55%,
                        rgba(234, 88, 12, 0.4) 58%,
                        rgba(194, 65, 12, 0.5) 62%,
                        rgba(154, 52, 18, 0.6) 66%,
                        rgba(124, 45, 18, 0.7) 70%,
                        rgba(92, 25, 2, 0.8) 74%,
                        rgba(69, 10, 10, 0.85) 78%,
                        rgba(92, 25, 2, 0.75) 82%,
                        rgba(124, 45, 18, 0.65) 86%,
                        rgba(154, 52, 18, 0.55) 90%,
                        rgba(194, 65, 12, 0.45) 94%,
                        rgba(234, 88, 12, 0.35) 97%,
                        transparent 100%
                    );
                }
                
                .orange-wave {
                    background: conic-gradient(
                        from 60deg,
                        transparent 0%,
                        transparent 50%,
                        rgba(194, 65, 12, 0.3) 55%,
                        rgba(154, 52, 18, 0.4) 60%,
                        rgba(124, 45, 18, 0.5) 65%,
                        rgba(92, 25, 2, 0.6) 70%,
                        rgba(69, 10, 10, 0.65) 75%,
                        rgba(92, 25, 2, 0.55) 80%,
                        rgba(124, 45, 18, 0.45) 85%,
                        rgba(154, 52, 18, 0.35) 90%,
                        rgba(194, 65, 12, 0.25) 95%,
                        transparent 100%
                    );
                }
                
                .purple-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%,
                        transparent 55%,
                        rgba(124, 58, 237, 0.4) 58%,
                        rgba(109, 40, 217, 0.5) 62%,
                        rgba(88, 28, 135, 0.6) 66%,
                        rgba(76, 29, 149, 0.7) 70%,
                        rgba(55, 16, 107, 0.8) 74%,
                        rgba(36, 7, 59, 0.85) 78%,
                        rgba(55, 16, 107, 0.75) 82%,
                        rgba(76, 29, 149, 0.65) 86%,
                        rgba(88, 28, 135, 0.55) 90%,
                        rgba(109, 40, 217, 0.45) 94%,
                        rgba(124, 58, 237, 0.35) 97%,
                        transparent 100%
                    );
                }
                
                .purple-wave {
                    background: conic-gradient(
                        from 60deg,
                        transparent 0%,
                        transparent 50%,
                        rgba(109, 40, 217, 0.3) 55%,
                        rgba(88, 28, 135, 0.4) 60%,
                        rgba(76, 29, 149, 0.5) 65%,
                        rgba(55, 16, 107, 0.6) 70%,
                        rgba(36, 7, 59, 0.65) 75%,
                        rgba(55, 16, 107, 0.55) 80%,
                        rgba(76, 29, 149, 0.45) 85%,
                        rgba(88, 28, 135, 0.35) 90%,
                        rgba(109, 40, 217, 0.25) 95%,
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
                        <div className={`radar-background ${statusIndex === 0 ? 'green-bg' :
                            statusIndex === 1 ? 'blue-bg' :
                                statusIndex === 2 ? 'orange-bg' :
                                    'purple-bg'
                            }`}></div>

                        {/* 회전하는 레이더 스윕 */}
                        <div
                            className={`radar-sweep ${statusIndex === 0 ? 'green-sweep' :
                                statusIndex === 1 ? 'blue-sweep' :
                                    statusIndex === 2 ? 'orange-sweep' :
                                        'purple-sweep'
                                }`}
                        ></div>

                        {/* 꿈틀거리는 웨이브 */}
                        <div
                            className="radar-wave"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: '50%',
                                animation: 'organic-wave 5s ease-in-out infinite',
                                background: statusIndex === 0
                                    ? 'radial-gradient(circle at 30% 70%, rgba(6, 78, 59, 0.3) 0%, rgba(5, 150, 105, 0.2) 50%, transparent 100%)'
                                    : statusIndex === 1
                                        ? 'radial-gradient(circle at 30% 70%, rgba(30, 58, 138, 0.3) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 100%)'
                                        : statusIndex === 2
                                            ? 'radial-gradient(circle at 30% 70%, rgba(154, 52, 18, 0.3) 0%, rgba(234, 88, 12, 0.2) 50%, transparent 100%)'
                                            : 'radial-gradient(circle at 30% 70%, rgba(88, 28, 135, 0.3) 0%, rgba(124, 58, 237, 0.2) 50%, transparent 100%)'
                            }}
                        ></div>

                        {/* 파도 효과 */}
                        <div
                            className={`radar-wave ${statusIndex === 0 ? 'green-wave' :
                                statusIndex === 1 ? 'blue-wave' :
                                    statusIndex === 2 ? 'orange-wave' :
                                        'purple-wave'
                                }`}
                        ></div>

                        <button
                            onClick={handleClick}
                            className="relative z-10 w-24 h-24 sm:w-32 md:w-40 lg:w-48 sm:h-32 md:h-40 lg:h-48 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 bg-white bg-opacity-95 backdrop-blur-sm"
                            style={{
                                boxShadow: `
                                    inset 0 2px 8px rgba(0,0,0,0.1),
                                    0 4px 20px rgba(0,0,0,0.15),
                                    0 0 0 2px ${current.color}20,
                                    0 0 20px ${current.color}30
                                `,
                                transition: 'box-shadow 0.8s ease-in-out'
                            }}
                        >
                            <div className="mb-1 sm:mb-3">
                                {statusIndex === 0 ? <Phone className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600" /> :
                                    statusIndex === 1 ? <Hourglass className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600" /> :
                                        statusIndex === 2 ? <Edit className="w-6 sm:w-8 h-6 sm:h-8 text-gray-600" /> :
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
                                <div className="text-lg sm:text-2xl font-bold text-red-600">
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