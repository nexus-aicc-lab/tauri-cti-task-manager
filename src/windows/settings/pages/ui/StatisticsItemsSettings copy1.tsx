// import React, { useState } from 'react';
// import { ChevronRight, ChevronLeft } from 'lucide-react';

// // 초기 통계 목록 데이터
// const initialSourceItems = [
//     '실인입호수',
//     '포기호수',
//     '넌서비스호수',
//     '외부호전환호수',
//     '그룹호전환 인입',
//     '그룹호전환포기',
// ];

// // 초기 배치 항목 데이터 (이미지 참고)
// const initialDestinationItems = [
//     '#1 실패호수',
//     '#2 콜호전환 인입',
//     '#3 그룹호전환 큐전환',
//     '#4 그룹호전환 넌서비스',
//     '#5 그룹호전환 ns',
//     '#6 그룹호전환 분배',
// ];


// const StatisticsItemsSettings: React.FC = () => {
//     const [selectedColumns, setSelectedColumns] = useState(2);
//     const [sourceItems, setSourceItems] = useState<string[]>(initialSourceItems);
//     const [destinationItems, setDestinationItems] = useState<string[]>(initialDestinationItems);

//     const [selectedSourceItem, setSelectedSourceItem] = useState<string | null>(null);
//     const [selectedDestinationItem, setSelectedDestinationItem] = useState<string | null>(null);

//     // 1~12 숫자 버튼
//     const monthButtons = Array.from({ length: 12 }, (_, i) => i + 1);

//     // 오른쪽으로 항목 이동
//     const handleMoveToDestination = () => {
//         if (!selectedSourceItem) return;

//         // 대상 목록에 추가
//         setDestinationItems(prev => [...prev, selectedSourceItem]);
//         // 원본 목록에서 제거
//         setSourceItems(prev => prev.filter(item => item !== selectedSourceItem));
//         // 선택 해제
//         setSelectedSourceItem(null);
//     };

//     // 왼쪽으로 항목 이동
//     const handleMoveToSource = () => {
//         if (!selectedDestinationItem) return;

//         // 원본 목록에 추가
//         setSourceItems(prev => [...prev, selectedDestinationItem]);
//         // 대상 목록에서 제거
//         setDestinationItems(prev => prev.filter(item => item !== selectedDestinationItem));
//         // 선택 해제
//         setSelectedDestinationItem(null);
//     };

//     return (
//         <div className="p-0 font-['Malgun_Gothic'] text-gray-800 bg-white text-xs space-y-2">
//             {/* 상단: 큐 설정 */}
//             <div className="space-y-2 p-0">
//                 {/* <h6 className="font-bold text-sm">큐 설정</h6> */}
//                 <div className="flex justify-start mb-4">
//                     <div className="w-35">
//                         <h3 className="font-bold mb-2 text-xs">표현 행수</h3>
//                         <select
//                             value={selectedColumns}
//                             onChange={e => setSelectedColumns(+e.target.value)}
//                             className="w-[90%] px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
//                         >
//                             {[2, 3, 4, 6].map(n => <option key={n} value={n}>{n}</option>)}
//                         </select>
//                     </div>
//                     <div className="flex-1">
//                         <h4 className="font-bold mb-2 text-xs">1번째 행</h4>
//                         <div className="">
//                             {monthButtons.slice(0, 6).map(num => (
//                                 <button key={num} className="w-6 h-6 mr-[2px] text-xs border border-gray-300 rounded-sm hover:bg-gray-100">{num}</button>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="flex-1">
//                         <h4 className="font-bold mb-2 text-xs">2번째 행</h4>
//                         <div className="">
//                             {monthButtons.slice(6, 12).map(num => (
//                                 <button key={num} className="w-6 h-6 mr-[2px] text-xs border border-gray-300 rounded-sm hover:bg-gray-100">{num}</button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* 하단: 목록들 */}
//             <div className="flex gap-4 items-start">
//                 {/* 통계 목록 (좌측) */}
//                 <div className="flex-1">
//                     <h3 className="font-bold mb-1">통계 목록</h3>
//                     <div className="border border-gray-300 rounded-sm h-60 overflow-y-auto">
//                         <div className="p-1 space-y-px">
//                             {sourceItems.map((item, idx) => (
//                                 <div
//                                     key={idx}
//                                     onClick={() => {
//                                         setSelectedSourceItem(item);
//                                         setSelectedDestinationItem(null); // 다른 목록 선택 해제
//                                     }}
//                                     className={`p-1.5 text-xs cursor-pointer rounded-sm ${selectedSourceItem === item ? 'bg-yellow-200' : 'hover:bg-gray-100'}`}
//                                 >{item}</div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {/* 화살표 버튼 */}
//                 <div className="flex flex-col items-center justify-center gap-2 pt-16">
//                     <button onClick={handleMoveToDestination} className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled={!selectedSourceItem}>
//                         <ChevronRight size={16} />
//                     </button>
//                     <button onClick={handleMoveToSource} className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled={!selectedDestinationItem}>
//                         <ChevronLeft size={16} />
//                     </button>
//                 </div>

//                 {/* 배치 항목 (우측) */}
//                 <div className="flex-1">
//                     <div className="flex justify-between items-center mb-1">
//                         <h4 className="font-bold text-xs">배치 항목</h4>
//                         <span className="text-[11px] text-gray-500">배치 항목 {destinationItems.length}개</span>
//                     </div>
//                     <div className="border border-gray-300 rounded-sm h-60 overflow-y-auto">
//                         <div className="p-1 space-y-px">
//                             {destinationItems.map((item, idx) => (
//                                 <div
//                                     key={idx}
//                                     onClick={() => {
//                                         setSelectedDestinationItem(item);
//                                         setSelectedSourceItem(null); // 다른 목록 선택 해제
//                                     }}
//                                     className={`p-1.5 text-xs cursor-pointer rounded-sm ${selectedDestinationItem === item ? 'bg-sky-100' : 'hover:bg-gray-100'}`}
//                                 >{item}</div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StatisticsItemsSettings;

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// 초기 통계 목록 데이터
const initialSourceItems = [
    '실인입호수',
    '포기호수',
    '넌서비스호수',
    '외부호전환호수',
    '그룹호전환 인입',
    '그룹호전환포기',
];

// 초기 배치 항목 데이터 (이미지 참고)
const initialDestinationItems = [
    '#1 실패호수',
    '#2 콜호전환 인입',
    '#3 그룹호전환 큐전환',
    '#4 그룹호전환 넌서비스',
    '#5 그룹호전환 ns',
    '#6 그룹호전환 분배',
];


const StatisticsItemsSettings: React.FC = () => {
    const [selectedColumns, setSelectedColumns] = useState(2);
    const [sourceItems, setSourceItems] = useState<string[]>(initialSourceItems);
    const [destinationItems, setDestinationItems] = useState<string[]>(initialDestinationItems);

    const [selectedSourceItem, setSelectedSourceItem] = useState<string | null>(null);
    const [selectedDestinationItem, setSelectedDestinationItem] = useState<string | null>(null);

    // 1~12 숫자 버튼
    const monthButtons = Array.from({ length: 12 }, (_, i) => i + 1);

    // 오른쪽으로 항목 이동
    const handleMoveToDestination = () => {
        if (!selectedSourceItem) return;

        // 대상 목록에 추가
        setDestinationItems(prev => [...prev, selectedSourceItem]);
        // 원본 목록에서 제거
        setSourceItems(prev => prev.filter(item => item !== selectedSourceItem));
        // 선택 해제
        setSelectedSourceItem(null);
    };

    // 왼쪽으로 항목 이동
    const handleMoveToSource = () => {
        if (!selectedDestinationItem) return;

        // 원본 목록에 추가
        setSourceItems(prev => [...prev, selectedDestinationItem]);
        // 대상 목록에서 제거
        setDestinationItems(prev => prev.filter(item => item !== selectedDestinationItem));
        // 선택 해제
        setSelectedDestinationItem(null);
    };

    return (
        <div className="p-0 font-['Malgun_Gothic'] text-gray-800 bg-white text-xs space-y-2">
            {/* 상단: 큐 설정 */}
            <div className="space-y-2 p-0">
                {/* <h6 className="font-bold text-sm">큐 설정</h6> */}
                <div className="flex justify-start mb-4">
                    <div className="w-35">
                        <h3 className="font-bold mb-2 text-xs">표현 행수</h3>
                        <select
                            value={selectedColumns}
                            onChange={e => setSelectedColumns(+e.target.value)}
                            className="w-[90%] px-2 py-1 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs"
                        >
                            {[2, 3, 4, 6].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold mb-2 text-xs">1번째 행</h4>
                        <div className="">
                            {monthButtons.slice(0, 6).map(num => (
                                <button key={num} className="w-6 h-6 mr-[2px] text-xs border border-gray-300 rounded-sm hover:bg-gray-100">{num}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold mb-2 text-xs">2번째 행</h4>
                        <div className="">
                            {monthButtons.slice(6, 12).map(num => (
                                <button key={num} className="w-6 h-6 mr-[2px] text-xs border border-gray-300 rounded-sm hover:bg-gray-100">{num}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단: 목록들 */}
            <div className="flex gap-4 items-start">
                {/* 통계 목록 (좌측) */}
                <div className="flex-1">
                    <h3 className="font-bold mb-1">통계 목록</h3>
                    <div className="border border-gray-300 rounded-sm h-60 overflow-y-auto">
                        <div className="p-1 space-y-px">
                            {sourceItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setSelectedSourceItem(item);
                                        setSelectedDestinationItem(null); // 다른 목록 선택 해제
                                    }}
                                    className={`p-1.5 text-xs cursor-pointer rounded-sm ${selectedSourceItem === item ? 'bg-yellow-200' : 'hover:bg-gray-100'}`}
                                >{item}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 화살표 버튼 */}
                <div className="flex flex-col items-center justify-center gap-2 pt-16">
                    <button onClick={handleMoveToDestination} className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled={!selectedSourceItem}>
                        <ChevronRight size={16} />
                    </button>
                    <button onClick={handleMoveToSource} className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled={!selectedDestinationItem}>
                        <ChevronLeft size={16} />
                    </button>
                </div>

                {/* 배치 항목 (우측) */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-xs">배치 항목</h4>
                        <span className="text-[11px] text-gray-500">배치 항목 {destinationItems.length}개</span>
                    </div>
                    <div className="border border-gray-300 rounded-sm h-60 overflow-y-auto">
                        <div className="p-1 space-y-px">
                            {destinationItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setSelectedDestinationItem(item);
                                        setSelectedSourceItem(null); // 다른 목록 선택 해제
                                    }}
                                    className={`p-1.5 text-xs cursor-pointer rounded-sm ${selectedDestinationItem === item ? 'bg-sky-100' : 'hover:bg-gray-100'}`}
                                >{item}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsItemsSettings;