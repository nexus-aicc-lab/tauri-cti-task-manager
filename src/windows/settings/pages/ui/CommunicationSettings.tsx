import React, { useState } from 'react';

// Sample data for the queues
const initialQueues = [
    { id: 'q1', name: '[7001]J7001', checked: false },
    { id: 'q2', name: '[7001]J7001', checked: false },
    { id: 'q3', name: '[7001]J7001', checked: true },
    { id: 'q4', name: '[7001]J7001', checked: false },
    { id: 'q5', name: '[7001]J7001', checked: false },
];

const CommunicationSettings = () => {
    const [queues, setQueues] = useState(initialQueues);

    // Handles individual checkbox toggles
    const handleCheckboxChange = (id: string) => {
        setQueues(
            queues.map((queue) =>
                queue.id === id ? { ...queue, checked: !queue.checked } : queue
            )
        );
    };

    // Handles "Select All" button click
    const handleSelectAll = () => {
        setQueues(queues.map((queue) => ({ ...queue, checked: true })));
    };

    // Handles "Deselect All" button click
    const handleDeselectAll = () => {
        setQueues(queues.map((queue) => ({ ...queue, checked: false })));
    };

    return (
        <div className="p-4 font-['Malgun_Gothic'] text-gray-800 bg-white text-sm">
            {/* Header Section */}
            <div className="pb-3 border-b border-gray-200 mb-4">
                <h3 className="text-base font-bold mb-1">큐 설정</h3>
                <p className="text-xs text-gray-600">
                    모니터링 하는 큐를 선택합니다. (한개 이상의 큐를 선택하세요)
                </p>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
                {/* Left Panel - Statistics List */}
                <div className="w-44 flex-shrink-0">
                    <p className="font-bold mb-3 text-sm">✳︎ cf 큐에 영향을 받는 통계</p>
                    <ul className="pl-4 space-y-1 text-xs text-gray-600">
                        <li>- 넌서비스</li>
                        <li>- 포기호수</li>
                        <li>- 실 인입호수</li>
                        <li>- 넌서비스호수</li>
                        <li>- 실패호수</li>
                        <li>- 처리호수</li>
                    </ul>
                </div>

                {/* Right Panel - Queue Checkboxes */}
                <div className="flex-1 border border-gray-200 rounded p-4">
                    <div className="space-y-2">
                        {queues.map((queue) => (
                            <div key={queue.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={queue.id}
                                    checked={queue.checked}
                                    onChange={() => handleCheckboxChange(queue.id)}
                                    className="w-4 h-4 mr-2 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                                />
                                <label htmlFor={queue.id} className="text-sm cursor-pointer">
                                    {queue.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Button Container */}
            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-xs border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    전체선택
                </button>
                <button
                    onClick={handleDeselectAll}
                    className="px-3 py-1 text-xs border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    전체해제
                </button>
            </div>
        </div>
    );
};

export default CommunicationSettings;