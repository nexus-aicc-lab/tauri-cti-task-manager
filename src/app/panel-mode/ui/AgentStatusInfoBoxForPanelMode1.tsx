
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
            icon: <Phone className="w-4 h-4 text-white" />,
            color: '#3698A2'
        },
        {
            label: '대기중',
            time: '12:03:45',
            icon: <Hourglass className="w-4 h-4 text-white" />,
            color: '#4199E0'
        },
        {
            label: '후처리',
            time: '00:34:20',
            icon: <Edit className="w-4 h-4 text-white" />,
            color: '#FF947A'
        },
        {
            label: '휴식중',
            time: '00:01:45',
            icon: <Coffee className="w-4 h-4 text-white" />,
            color: '#8B68A5'
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
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { filter: brightness(1.1) saturate(1.3); }
                    50% { filter: brightness(1.2) saturate(1.5); }
                }
                
                .radar-container {
                    position: relative;
                    display: inline-block;
                    border-radius: 50%;
                    padding: 15px;
                    overflow: hidden;
                }
                
                .radar-background {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-radius: 50%;
                    transition: background-color 0.8s ease-in-out;
                    animation: pulse-glow 3s ease-in-out infinite;
                }
                
                .green-bg {
                    background: linear-gradient(135deg, #2e7d7d, #3698A2, #55BDC7, #4fb3bd);
                    box-shadow: 0 0 20px rgba(54, 152, 162, 0.5), inset 0 0 10px rgba(46, 125, 125, 0.3);
                }
                
                .blue-bg {
                    background: linear-gradient(135deg, #2d7bc0, #4199E0, #71BFFF, #5cb3f0);
                    box-shadow: 0 0 20px rgba(65, 153, 224, 0.5), inset 0 0 10px rgba(45, 123, 192, 0.3);
                }
                
                .orange-bg {
                    background: linear-gradient(135deg, #e6806a, #FF947A, #FFCAAD, #ffb299);
                    box-shadow: 0 0 20px rgba(255, 148, 122, 0.5), inset 0 0 10px rgba(230, 128, 106, 0.3);
                }
                
                .purple-bg {
                    background: linear-gradient(135deg, #7a5c95, #8B68A5, #C0A2D7, #a385c1);
                    box-shadow: 0 0 20px rgba(139, 104, 165, 0.5), inset 0 0 10px rgba(122, 92, 149, 0.3);
                }
                
                .radar-sweep {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    border-radius: 50%;
                    animation: smooth-rotate 2.5s linear infinite;
                    transition: background 0.8s ease-in-out;
                }
                
                .green-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%, transparent 55%,
                        rgba(54, 152, 162, 0.4) 58%,
                        rgba(85, 189, 199, 0.5) 62%,
                        rgba(79, 179, 189, 0.6) 66%,
                        rgba(46, 125, 125, 0.7) 70%,
                        rgba(40, 110, 110, 0.8) 74%,
                        rgba(30, 85, 85, 0.85) 78%,
                        transparent 100%
                    );
                }
                
                .blue-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%, transparent 55%,
                        rgba(65, 153, 224, 0.4) 58%,
                        rgba(113, 191, 255, 0.5) 62%,
                        rgba(92, 179, 240, 0.6) 66%,
                        rgba(45, 123, 192, 0.7) 70%,
                        rgba(35, 95, 150, 0.8) 74%,
                        rgba(25, 70, 110, 0.85) 78%,
                        transparent 100%
                    );
                }
                
                .orange-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%, transparent 55%,
                        rgba(255, 148, 122, 0.4) 58%,
                        rgba(255, 202, 173, 0.5) 62%,
                        rgba(255, 178, 153, 0.6) 66%,
                        rgba(230, 128, 106, 0.7) 70%,
                        rgba(200, 100, 80, 0.8) 74%,
                        rgba(170, 75, 60, 0.85) 78%,
                        transparent 100%
                    );
                }
                
                .purple-sweep {
                    background: conic-gradient(
                        from 0deg,
                        transparent 0%, transparent 55%,
                        rgba(139, 104, 165, 0.4) 58%,
                        rgba(192, 162, 215, 0.5) 62%,
                        rgba(163, 133, 193, 0.6) 66%,
                        rgba(122, 92, 149, 0.7) 70%,
                        rgba(100, 75, 120, 0.8) 74%,
                        rgba(80, 60, 95, 0.85) 78%,
                        transparent 100%
                    );
                }
                `
            }} />

            <div className="h-full bg-gray-50 p-2 rounded-lg shadow-md border border-gray-200 flex flex-col min-h-0">
                {/* 원형 상태 박스 */}
                <div className="flex-1 flex justify-center items-center mb-2 min-h-0">
                    <div className="radar-container shadow-md">
                        {/* 고정 배경 */}
                        <div className={`radar-background ${statusIndex === 0 ? 'green-bg' :
                            statusIndex === 1 ? 'blue-bg' :
                                statusIndex === 2 ? 'orange-bg' :
                                    'purple-bg'
                            }`}></div>

                        {/* 회전하는 레이더 스윕 */}
                        <div className={`radar-sweep ${statusIndex === 0 ? 'green-sweep' :
                            statusIndex === 1 ? 'blue-sweep' :
                                statusIndex === 2 ? 'orange-sweep' :
                                    'purple-sweep'
                            }`}></div>

                        <button
                            onClick={handleClick}
                            className="relative z-10 w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 active:scale-95 bg-white bg-opacity-95 backdrop-blur-sm"
                            style={{
                                boxShadow: `
                                    inset 0 2px 6px rgba(0,0,0,0.1),
                                    0 3px 15px rgba(0,0,0,0.15),
                                    0 0 0 2px ${current.color}20,
                                    0 0 15px ${current.color}30
                                `,
                                transition: 'box-shadow 0.8s ease-in-out'
                            }}
                        >
                            <div className="mb-1">
                                {statusIndex === 0 ? <Phone className="w-3 h-3 text-gray-600" /> :
                                    statusIndex === 1 ? <Hourglass className="w-3 h-3 text-gray-600" /> :
                                        statusIndex === 2 ? <Edit className="w-3 h-3 text-gray-600" /> :
                                            <Coffee className="w-3 h-3 text-gray-600" />}
                            </div>
                            <div className="text-xs font-bold text-gray-800">
                                {current.label}
                            </div>
                            <div className="text-xs font-medium text-gray-600">
                                {current.time}
                            </div>
                        </button>
                    </div>
                </div>

                {/* 하단 통계 카드 */}
                <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                    {/* 대기호 */}
                    <div className="rounded-md p-2 bg-white border border-gray-200 hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200">
                                <Phone className="w-3 h-3 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs text-gray-500 font-medium">대기호</div>
                                <div className="text-sm font-bold text-red-600">
                                    {waitQueueCount}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 대기 상담사 */}
                    <div className="rounded-md p-2 bg-white border border-gray-200 hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200">
                                <Users className="w-3 h-3 text-gray-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs text-gray-500 font-medium">대기 상담</div>
                                <div className="text-sm font-bold text-gray-800">
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