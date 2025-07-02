
// import React, { useState } from 'react';
// import { X, Plus } from 'lucide-react';

// // 사용 가능한 통계 항목들
// const availableItems = [
//     '실인입호수',
//     '포기호수',
//     '넌서비스호수',
//     '외부호전환호수',
//     '그룹호전환 인입',
//     '그룹호전환포기',
//     '실패호수',
//     '콜호전환 인입',
//     '그룹호전환 큐전환',
//     '그룹호전환 넌서비스',
//     '그룹호전환 ns',
//     '그룹호전환 분배',
// ];

// // 초기 설정된 항목들
// const initialRowSettings = {
//     row1: ['실인입호수', '포기호수'],
//     row2: ['콜호전환 인입', '그룹호전환 큐전환'],
// };

// const StatisticsItemsSettings: React.FC = () => {
//     const [rowSettings, setRowSettings] = useState(initialRowSettings);
//     const [selectedSourceItem, setSelectedSourceItem] = useState<string | null>(null);

//     // 이미 사용된 항목들을 제외한 사용 가능한 항목들
//     const getAvailableItems = () => {
//         const usedItems = [...rowSettings.row1, ...rowSettings.row2];
//         return availableItems.filter(item => !usedItems.includes(item));
//     };

//     // 목적지 행에 아이템 추가
//     const addItemToRow = (rowKey: string) => {
//         if (!selectedSourceItem) return;

//         setRowSettings(prev => ({
//             ...prev,
//             [rowKey]: [...prev[rowKey as keyof typeof prev], selectedSourceItem]
//         }));
//         setSelectedSourceItem(null);
//     };

//     const removeItem = (rowKey: string, item: string) => {
//         setRowSettings(prev => ({
//             ...prev,
//             [rowKey]: prev[rowKey as keyof typeof prev].filter(i => i !== item)
//         }));
//     };

//     // 소스 선택 박스 컴포넌트
//     const SourceBox = () => (
//         <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
//             <h3 className="font-bold text-sm text-gray-700 mb-3">통계 목록</h3>
//             <div className="min-h-[200px] space-y-1 overflow-y-auto">
//                 {getAvailableItems().length === 0 ? (
//                     <div className="text-gray-400 text-xs text-center py-16">
//                         모든 항목이 사용 중입니다
//                     </div>
//                 ) : (
//                     getAvailableItems().map((item, idx) => (
//                         <div
//                             key={idx}
//                             onClick={() => setSelectedSourceItem(item)}
//                             className={`p-2 text-xs cursor-pointer rounded-sm ${selectedSourceItem === item ? 'bg-yellow-200' : 'hover:bg-gray-100'
//                                 }`}
//                         >
//                             {item}
//                         </div>
//                     ))
//                 )}
//             </div>
//             <div className="mt-3 text-xs text-gray-500">
//                 사용 가능: {getAvailableItems().length}개 항목
//             </div>
//         </div>
//     );

//     const RowBox = ({ rowKey, title, items }: { rowKey: string, title: string, items: string[] }) => (
//         <div className="border-2 border-gray-300 rounded-lg p-4 bg-white relative">
//             <div className="flex justify-between items-center mb-3">
//                 <h3 className="font-bold text-sm text-gray-700">{title}</h3>
//                 <button
//                     onClick={() => addItemToRow(rowKey)}
//                     disabled={!selectedSourceItem}
//                     className="px-2 py-1 bg-teal-500 text-white rounded text-xs hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
//                     title={selectedSourceItem ? `"${selectedSourceItem}" 추가` : "왼쪽에서 항목을 선택하세요"}
//                 >
//                     <Plus size={12} />
//                 </button>
//             </div>

//             <div className="min-h-[200px] space-y-2">
//                 {items.length === 0 ? (
//                     <div className="text-gray-400 text-xs text-center py-16">
//                         설정된 항목이 없습니다
//                     </div>
//                 ) : (
//                     items.map((item, idx) => (
//                         <div
//                             key={idx}
//                             className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-xs"
//                         >
//                             <span className="text-xs">{item}</span>
//                             <button
//                                 onClick={() => removeItem(rowKey, item)}
//                                 className="text-red-500 hover:text-red-700 ml-2"
//                                 title="삭제"
//                             >
//                                 <X size={12} />
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>

//             <div className="mt-3 text-xs text-gray-500">
//                 총 {items.length}개 항목
//             </div>
//         </div>
//     );

//     return (
//         <div className="p-4 font-['Malgun_Gothic'] text-gray-800 bg-gray-50 min-h-screen">
//             <div className="max-w-6xl mx-auto">
//                 <h2 className="text-lg font-bold mb-6 text-gray-800">통계 항목 설정</h2>

//                 {/* 메인 레이아웃 */}
//                 <div className="grid grid-cols-3 gap-6">
//                     {/* 왼쪽: 통계 목록 선택 */}
//                     <SourceBox />

//                     {/* 가운데: 1번째 행 */}
//                     <RowBox
//                         rowKey="row1"
//                         title="1번째 행"
//                         items={rowSettings.row1}
//                     />

//                     {/* 오른쪽: 2번째 행 */}
//                     <RowBox
//                         rowKey="row2"
//                         title="2번째 행"
//                         items={rowSettings.row2}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StatisticsItemsSettings;

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

// 사용 가능한 통계 항목들
const availableItems = [
    '실인입호수', '포기호수', '넌서비스호수', '외부호전환호수',
    '그룹호전환 인입', '그룹호전환포기', '실패호수', '콜호전환 인입',
    '그룹호전환 큐전환', '그룹호전환 넌서비스', '그룹호전환 ns', '그룹호전환 분배',
];

// 초기 설정된 항목들
const initialRowSettings = {
    row1: ['실인입호수', '포기호수'],
    row2: ['콜호전환 인입', '그룹호전환 큐전환'],
};

// 소스 박스 컴포넌트
const SourceBox: React.FC<{
    available: string[];
    selected: string | null;
    onSelect: (item: string) => void;
}> = ({ available, selected, onSelect }) => (
    <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-bold text-sm mb-2">통계 목록</h3>
        <div className="h-52 overflow-y-auto space-y-1">
            {available.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-4">모든 항목 사용 중</p>
            ) : (
                available.map(item => (
                    <div
                        key={item}
                        onClick={() => onSelect(item)}
                        className={`p-2 text-xs cursor-pointer rounded ${selected === item ? 'bg-yellow-200' : 'hover:bg-gray-100'
                            }`}
                    >
                        {item}
                    </div>
                ))
            )}
        </div>
        <p className="mt-2 text-xs text-gray-500">남은 항목: {available.length}</p>
    </div>
);

// 행 박스 컴포넌트
const RowBox: React.FC<{
    title: string;
    items: string[];
    canAdd: boolean;
    onAdd: () => void;
    onRemove: (item: string) => void;
    selectedSource: string | null;
}> = ({ title, items, canAdd, onAdd, onRemove, selectedSource }) => (
    <div className="border rounded-lg p-4 bg-white">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">{title}</h3>
            <button
                onClick={onAdd}
                disabled={!canAdd}
                className={`flex items-center px-2 py-1 text-xs rounded ${canAdd ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-200 text-gray-500'
                    }`}
            >
                <Plus size={12} /> 추가
            </button>
        </div>
        <div className="h-52 overflow-y-auto space-y-1">
            {items.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-4">설정된 항목이 없습니다</p>
            ) : (
                items.map(item => (
                    <div
                        key={item}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs"
                    >
                        <span>{item}</span>
                        <button onClick={() => onRemove(item)} className="text-red-500 hover:text-red-700">
                            <X size={12} />
                        </button>
                    </div>
                ))
            )}
        </div>
        <p className="mt-2 text-xs text-gray-500">총 {items.length}개</p>
    </div>
);

const StatisticsItemsSettings: React.FC = () => {
    const [rowSettings, setRowSettings] = useState(initialRowSettings);
    const [selectedSourceItem, setSelectedSourceItem] = useState<string | null>(null);

    // 소스 박스에 남는 항목
    const used = [...rowSettings.row1, ...rowSettings.row2];
    const available = availableItems.filter(i => !used.includes(i));

    const addItem = (rowKey: 'row1' | 'row2') => {
        if (!selectedSourceItem) return;
        setRowSettings(prev => ({
            ...prev,
            [rowKey]: [...prev[rowKey], selectedSourceItem]
        }));
        setSelectedSourceItem(null);
    };

    const removeItem = (rowKey: 'row1' | 'row2', item: string) => {
        setRowSettings(prev => ({
            ...prev,
            [rowKey]: prev[rowKey].filter(i => i !== item)
        }));
    };

    return (
        <div className="p-4 bg-gray-50 font-['Malgun_Gothic'] min-h-screen">
            <h2 className="text-lg font-bold mb-4">통계 항목 설정</h2>
            <div className="grid grid-cols-3 gap-4">
                <SourceBox
                    available={available}
                    selected={selectedSourceItem}
                    onSelect={setSelectedSourceItem}
                />
                <RowBox
                    title="1번째 행"
                    items={rowSettings.row1}
                    canAdd={!!selectedSourceItem}
                    onAdd={() => addItem('row1')}
                    onRemove={item => removeItem('row1', item)}
                    selectedSource={selectedSourceItem}
                />
                <RowBox
                    title="2번째 행"
                    items={rowSettings.row2}
                    canAdd={!!selectedSourceItem}
                    onAdd={() => addItem('row2')}
                    onRemove={item => removeItem('row2', item)}
                    selectedSource={selectedSourceItem}
                />
            </div>
        </div>
    );
};

export default StatisticsItemsSettings;
