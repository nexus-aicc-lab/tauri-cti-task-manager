// // src/pages/PanelMode/index.tsx

// interface PanelComponentProps {
//     onBackToLauncher: () => void;
// }

// export default function PanelComponent({ onBackToLauncher }: PanelComponentProps) {
//     return (
//         <div className="h-full bg-green-100">
//             {/* 런처로 돌아가기 버튼 */}
//             <div className="absolute top-4 right-4 z-50">
//                 <button
//                     onClick={onBackToLauncher}
//                     className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded"
//                 >
//                     🏠 런처로 돌아가기
//                 </button>
//             </div>

//             <div className="p-8">
//                 <h1 className="text-2xl font-bold">패널 모드</h1>
//                 <p>1200x800 크기의 패널 모드입니다.</p>
//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect } from 'react';
import {
    Phone,
    PhoneCall,
    Clock,
    Users,
    BarChart3,
    Settings,
    User,
    Calendar,
    MessageSquare,
    Timer,
    Headphones,
    Minus,
    Square,
    X,
    Maximize2,
    Minimize2
} from 'lucide-react';

interface PanelComponentProps {
    onBackToLauncher: () => void;
}

// 커스텀 타이틀바 컴포넌트
const CustomTitlebar: React.FC<{ title: string; onBackToLauncher: () => void }> = ({
    title,
    onBackToLauncher
}) => {
    const [isMaximized, setIsMaximized] = useState(false);

    // 윈도우 상태 체크
    useEffect(() => {
        const checkWindowState = async () => {
            try {
                // Tauri v2 API 사용
                const { getCurrentWindow } = await import('@tauri-apps/api/window');
                const appWindow = getCurrentWindow();
                const maximized = await appWindow.isMaximized();
                setIsMaximized(maximized);
            } catch (e) {
                console.log('Tauri API not available:', e);
            }
        };
        checkWindowState();
    }, []);

    const handleMinimize = async () => {
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();
            await appWindow.minimize();
        } catch (e) {
            console.log('Minimize failed:', e);
        }
    };

    const handleMaximize = async () => {
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();
            if (isMaximized) {
                await appWindow.unmaximize();
            } else {
                await appWindow.maximize();
            }
            setIsMaximized(!isMaximized);
        } catch (e) {
            console.log('Maximize failed:', e);
        }
    };

    const handleClose = async () => {
        try {
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();
            await appWindow.close();
        } catch (e) {
            console.log('Close failed:', e);
        }
    };

    return (
        <div
            className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between px-4 select-none"
            data-tauri-drag-region
        >
            <div className="flex items-center space-x-3">
                <div className="text-white font-semibold text-sm">{title}</div>
                <button
                    onClick={onBackToLauncher}
                    className="text-white/80 hover:text-white hover:bg-white/10 px-2 py-1 rounded text-xs transition-colors"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    🏠 런처
                </button>
            </div>

            <div className="flex items-center space-x-1">
                <button
                    onClick={handleMinimize}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                    title="최소화"
                >
                    <Minus size={14} />
                </button>

                <button
                    onClick={handleMaximize}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                    title={isMaximized ? "복원" : "최대화"}
                >
                    {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>

                <button
                    onClick={handleClose}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-white/80 hover:text-white hover:bg-red-500 p-1 rounded transition-colors"
                    title="닫기"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default function PanelComponent({ onBackToLauncher }: PanelComponentProps) {
    const [activeTab, setActiveTab] = useState('dashboard');

    const mockData = {
        agent: {
            name: "홍길동(NE2101)",
            status: "대기",
            loginTime: "44:42:17"
        },
        stats: {
            waiting: { count: 5, time: "00:53:44(10)" },
            incoming: { count: 1, time: "02:53:44(20)" },
            outgoing: { count: 1, time: "00:43:44(13)" },
            services: [
                { name: "서비스예약", value: 58 },
                { name: "요금문의", value: 58 },
                { name: "상담요청", value: 58 }
            ],
            groups: [
                { name: "그룹호전환(인입)", value: 5 },
                { name: "그룹호전환(발신)", value: 5 },
                { name: "그룹호전환(전체)", value: 5 }
            ]
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* 커스텀 타이틀바 */}
            <CustomTitlebar
                title="CTI Task Master - 패널 모드"
                onBackToLauncher={onBackToLauncher}
            />

            {/* 메인 콘텐츠 */}
            <div className="flex-1 flex">
                {/* 사이드바 */}
                <div className="w-64 bg-white border-r border-gray-200 p-4">
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'dashboard'
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <BarChart3 size={18} />
                            <span>대시보드</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('calls')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'calls'
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <PhoneCall size={18} />
                            <span>통화 관리</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('customers')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'customers'
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <Users size={18} />
                            <span>고객 관리</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'settings'
                                ? 'bg-blue-100 text-blue-700'
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <Settings size={18} />
                            <span>설정</span>
                        </button>
                    </div>
                </div>

                {/* 메인 콘텐츠 영역 */}
                <div className="flex-1 p-6">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            {/* 상단 상태 카드들 */}
                            <div className="grid grid-cols-4 gap-4">
                                {/* 에이전트 상태 */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">상담원</span>
                                        <User className="text-blue-500" size={20} />
                                    </div>
                                    <div className="text-xl font-bold">{mockData.agent.name}</div>
                                    <div className="text-sm text-gray-500">상태: {mockData.agent.status}</div>
                                </div>

                                {/* 대기 시간 */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">대기</span>
                                        <Timer className="text-green-500" size={20} />
                                    </div>
                                    <div className="text-xl font-bold">{mockData.stats.waiting.count}</div>
                                    <div className="text-sm text-gray-500">{mockData.stats.waiting.time}</div>
                                </div>

                                {/* 인입 통화 */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">인입</span>
                                        <Phone className="text-blue-500" size={20} />
                                    </div>
                                    <div className="text-xl font-bold">{mockData.stats.incoming.count}</div>
                                    <div className="text-sm text-gray-500">{mockData.stats.incoming.time}</div>
                                </div>

                                {/* 발신 통화 */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">발신</span>
                                        <PhoneCall className="text-purple-500" size={20} />
                                    </div>
                                    <div className="text-xl font-bold">{mockData.stats.outgoing.count}</div>
                                    <div className="text-sm text-gray-500">{mockData.stats.outgoing.time}</div>
                                </div>
                            </div>

                            {/* 통계 차트 영역 */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* 서비스 통계 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h3 className="text-lg font-semibold mb-4">서비스별 통계</h3>
                                    <div className="space-y-3">
                                        {mockData.stats.services.map((service, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-gray-700">{service.name}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{ width: `${service.value}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium">{service.value}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 그룹 통계 */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <h3 className="text-lg font-semibold mb-4">그룹별 통계</h3>
                                    <div className="space-y-3">
                                        {mockData.stats.groups.map((group, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-gray-700">{group.name}</span>
                                                <span className="text-lg font-bold text-blue-600">{group.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 하단 로그 영역 */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h3 className="text-lg font-semibold mb-4">실시간 로그</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>LogOn : 44:42:17</span>
                                        <span className="text-green-600">● 온라인</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'calls' && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-2xl font-bold mb-4">통화 관리</h2>
                            <p className="text-gray-600">통화 내역 및 관리 기능이 여기에 표시됩니다.</p>
                        </div>
                    )}

                    {activeTab === 'customers' && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-2xl font-bold mb-4">고객 관리</h2>
                            <p className="text-gray-600">고객 정보 및 관리 기능이 여기에 표시됩니다.</p>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-2xl font-bold mb-4">설정</h2>
                            <p className="text-gray-600">각종 설정 옵션들이 여기에 표시됩니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}