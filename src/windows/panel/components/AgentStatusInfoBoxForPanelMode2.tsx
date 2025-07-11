import React from 'react';

const AgentStatusInfoBoxForPanelMode2: React.FC = () => {
    const formatTime = (hours: number, minutes: number, seconds: number) => {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const items = [
        {
            icon: (
                <img
                    src="/icons/panel-mode/hourglass.png"
                    alt="대기"
                    className="w-6 h-6"
                    style={{ objectFit: 'contain' }}
                />
            ),
            label: '대기',
            time: formatTime(12, 0, 34),
            count: 15,
            bg: '#EAF3FF',
            textColor: '#2563eb',
        },
        {
            icon: (
                <img
                    src="/icons/panel-mode/cell_phone.png"
                    alt="통화"
                    className="w-6 h-6"
                    style={{ objectFit: 'contain' }}
                />
            ),
            label: '통화',
            time: formatTime(12, 50, 20),
            count: 12,
            bg: '#ECF9FA',
            textColor: '#14b8a6',
        },
        {
            icon: (
                <img
                    src="/icons/panel-mode/pencel.png"
                    alt="후처리"
                    className="w-6 h-6"
                    style={{ objectFit: 'contain' }}
                />
            ),
            label: '후처리',
            time: formatTime(0, 34, 20),
            count: 15,
            bg: '#FFEFDE',
            textColor: '#f97316',
        },
        {
            icon: (
                <img
                    src="/icons/panel-mode/coffe.png"
                    alt="휴식"
                    className="w-6 h-6"
                    style={{ objectFit: 'contain' }}
                />
            ),
            label: '휴식',
            time: formatTime(0, 0, 0),
            count: 0,
            bg: '#F4ECFA',
            textColor: '#8b5cf6',
        },
    ];

    return (
        // 전체 컨테이너의 padding을 p-2로 변경
        <div className="h-full bg-white p-1 rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* grid의 gap을 gap-2로 변경하여 박스 사이의 간격을 넓힘 */}
            <div className="grid grid-cols-2 gap-2 h-full">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        style={{ backgroundColor: item.bg }}
                        // 각 아이템의 padding과 내부 요소(아이콘, 흰 박스)의 gap을 p-2, gap-2로 변경
                        // justify-center를 추가하여 수직 중앙 정렬
                        className="rounded-md p-2 flex flex-col items-center justify-center shadow-sm gap-3"
                    >
                        {/* 아이콘 (별도 div 제거하여 코드 간소화) */}
                        <div className='pt-2'>
                            {item.icon}
                        </div>

                        {/* 콘텐츠 */}
                        <div className="bg-white rounded px-2 py-1 w-full text-center min-h-0">
                            <div className="text-xs font-medium text-gray-800 mb-0.5 truncate leading-tight">
                                {item.label}
                            </div>
                            <div className="flex flex-col items-center gap-0">
                                <span className="text-sm font-bold leading-none" style={{ color: item.textColor }}>
                                    {item.time}
                                </span>
                                <span className="text-xs font-semibold leading-none" style={{ color: item.textColor }}>
                                    ({item.count})
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentStatusInfoBoxForPanelMode2;