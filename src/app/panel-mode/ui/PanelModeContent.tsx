// src/app/panel-mode/ui/PanelModeContent.tsx
import React from 'react';
import { Timer, PhoneCall, Phone, Clock, Coffee } from 'lucide-react';

const PanelModeContent = () => {
    // 2영역 데이터: bg, border, text 클래스를 명시적으로 지정
    const secondAreaItems = [
        {
            icon: <PhoneCall size={24} className="text-blue-600 mb-2" />,
            label: '통화',
            value: 20,
            bg: 'bg-blue-100',
            border: 'border-blue-200',
            text: 'text-blue-700',
        },
        {
            icon: <Phone size={24} className="text-green-600 mb-2" />,
            label: '대기',
            value: 5,
            bg: 'bg-green-100',
            border: 'border-green-200',
            text: 'text-green-700',
        },
        {
            icon: <Clock size={24} className="text-orange-600 mb-2" />,
            label: '후처리',
            value: 20,
            bg: 'bg-orange-100',
            border: 'border-orange-200',
            text: 'text-orange-700',
        },
        {
            icon: <Coffee size={24} className="text-purple-600 mb-2" />,
            label: '휴식',
            value: 13,
            bg: 'bg-purple-100',
            border: 'border-purple-200',
            text: 'text-purple-700',
        },
    ];

    // 3영역 데이터
    const thirdAreaItems = [
        { label: '서비스레벨', value: 58 },
        { label: '응답률', value: 58 },
        { label: '실인입호수', value: 58 },
        { label: '응답호수', value: 50 },
    ];

    // 4영역 데이터
    const fourthAreaItems: [string, number][] = [
        ['그룹호전환 (인입)', 5],
        ['그룹호전환 (응답)', 5],
        ['그룹호전환 (분배)', 5],
        ['그룹호전환 (턴서비스)', 5],
        ['그룹호전환 (실패)', 5],
        ['그룹호전환 (규전환)', 5],
    ];

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            {/* 상단 3박스 영역 */}
            <div className="flex-1 grid grid-cols-3 gap-4">
                {/* 1영역 */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">1영역</h2>
                    <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center border-4 border-blue-300">
                        <Timer size={48} className="text-blue-700" />
                    </div>
                    <div className="mt-4 text-center">
                        <div className="text-xl font-bold text-gray-800">대기중</div>
                        <div className="text-blue-600 font-semibold">00:03:44</div>
                    </div>
                </div>

                {/* 2영역 */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">2영역</h2>
                    <div className="grid grid-cols-2 grid-rows-2 gap-3 w-full">
                        {secondAreaItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`
                  flex flex-col items-center p-4 
                  ${item.bg} ${item.border} rounded-lg 
                `}
                            >
                                {item.icon}
                                <div className="text-sm font-medium text-gray-700 mb-1">{item.label}</div>
                                <div className={`font-bold ${item.text}`}>{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3영역 */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col justify-center">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">3영역</h2>
                    <div className="space-y-3">
                        {thirdAreaItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col gap-1 bg-gray-50 p-3 rounded-lg border border-gray-200"
                            >
                                <div className="flex justify-between text-sm font-medium text-gray-700">
                                    <span>{item.label}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 하단 4영역 */}
            <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">4영역</h2>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                    {fourthAreaItems.map(([label, value], j) => (
                        <div
                            key={j}
                            className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md border border-gray-200"
                        >
                            <span>{label}</span>
                            <span className="font-semibold">{value}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">LogOn : 44:42:17</span>
                    <span className="text-green-600 font-bold">● 온라인</span>
                </div>
            </div>
        </div>
    );
};

export default PanelModeContent;
