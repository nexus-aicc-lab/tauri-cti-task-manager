// import React, { useState } from 'react';
// import { Settings, X } from 'lucide-react';

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
//     row3: ['그룹호전환 넌서비스', '그룹호전환 ns'],
// };

// const StatisticsItemsSettings: React.FC = () => {
//     const [rowSettings, setRowSettings] = useState(initialRowSettings);
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [currentEditingRow, setCurrentEditingRow] = useState<string | null>(null);
//     const [tempSelectedItems, setTempSelectedItems] = useState<string[]>([]);
//     const [activeRows, setActiveRows] = useState<number[]>([1, 2]); // 기본으로 1행, 2행 활성화

//     // 토글 버튼 (1~3만)
//     const toggleButtons = [1, 2, 3];

//     const toggleRowVisibility = (rowNumber: number) => {
//         setActiveRows(prev => {
//             if (prev.includes(rowNumber)) {
//                 return prev.filter(n => n !== rowNumber);
//             } else {
//                 return [...prev, rowNumber].sort();
//             }
//         });
//     };

//     const openPopup = (rowKey: string) => {
//         setCurrentEditingRow(rowKey);
//         setTempSelectedItems([...rowSettings[rowKey as keyof typeof rowSettings]]);
//         setIsPopupOpen(true);
//     };

//     const closePopup = () => {
//         setIsPopupOpen(false);
//         setCurrentEditingRow(null);
//         setTempSelectedItems([]);
//     };

//     const toggleItemSelection = (item: string) => {
//         setTempSelectedItems(prev =>
//             prev.includes(item)
//                 ? prev.filter(i => i !== item)
//                 : [...prev, item]
//         );
//     };

//     const applySelection = () => {
//         if (currentEditingRow) {
//             setRowSettings(prev => ({
//                 ...prev,
//                 [currentEditingRow]: [...tempSelectedItems]
//             }));
//         }
//         closePopup();
//     };

//     const removeItem = (rowKey: string, item: string) => {
//         setRowSettings(prev => ({
//             ...prev,
//             [rowKey]: prev[rowKey as keyof typeof prev].filter(i => i !== item)
//         }));
//     };

//     const RowBox = ({ rowKey, title, items, isActive = true }: { rowKey: string, title: string, items: string[], isActive?: boolean }) => (
//         <div className={`border-2 rounded-lg p-4 relative transition-colors ${isActive
//             ? 'border-gray-300 bg-white'
//             : 'border-gray-200 bg-gray-50 opacity-60'
//             }`}>
//             <div className="flex justify-between items-center mb-3">
//                 <h3 className={`font-bold text-sm ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
//                     {title}
//                 </h3>
//                 <button
//                     onClick={() => isActive && openPopup(rowKey)}
//                     disabled={!isActive}
//                     className={`p-1.5 rounded transition-colors ${isActive
//                         ? 'bg-teal-500 text-white hover:bg-teal-600'
//                         : 'bg-gray-300 text-gray-400 cursor-not-allowed'
//                         }`}
//                     title={isActive ? "항목 설정" : "비활성화된 행입니다"}
//                 >
//                     <Settings size={14} />
//                 </button>
//             </div>

//             <div className="min-h-[120px] space-y-2">
//                 {!isActive ? (
//                     <div className="text-gray-400 text-xs text-center py-8">
//                         비활성화된 행입니다
//                     </div>
//                 ) : items.length === 0 ? (
//                     <div className="text-gray-400 text-xs text-center py-8">
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

//             <div className={`mt-3 text-xs ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
//                 총 {items.length}개 항목
//             </div>
//         </div>
//     );

//     return (
//         <div className="p-4 font-['Malgun_Gothic'] text-gray-800 bg-gray-50 min-h-screen">
//             <div className="max-w-6xl mx-auto">
//                 <h2 className="text-lg font-bold mb-6 text-gray-800">통계 항목 설정</h2>

//                 {/* 상단 토글 버튼들 */}
//                 <div className="mb-4 p-3 bg-white rounded border border-gray-300">
//                     <div className="flex gap-2">
//                         {toggleButtons.map(num => (
//                             <button
//                                 key={num}
//                                 onClick={() => toggleRowVisibility(num)}
//                                 className={`px-4 py-1.5 text-sm rounded transition-colors ${activeRows.includes(num)
//                                     ? 'bg-teal-500 text-white'
//                                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                     }`}
//                             >
//                                 {num}행
//                             </button>
//                         ))}
//                     </div>

//                 </div>

//                 {/* 행 설정 박스들 - 항상 3열로 표시 */}
//                 <div className="grid grid-cols-3 gap-4">
//                     <RowBox
//                         rowKey="row1"
//                         title="1번째 행"
//                         items={rowSettings.row1}
//                         isActive={activeRows.includes(1)}
//                     />
//                     <RowBox
//                         rowKey="row2"
//                         title="2번째 행"
//                         items={rowSettings.row2}
//                         isActive={activeRows.includes(2)}
//                     />
//                     <RowBox
//                         rowKey="row3"
//                         title="3번째 행"
//                         items={rowSettings.row3}
//                         isActive={activeRows.includes(3)}
//                     />
//                 </div>

//                 {/* 팝업 */}
//                 {isPopupOpen && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                         <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden flex flex-col">
//                             <div className="flex justify-between items-center mb-4">
//                                 <h3 className="text-lg font-bold">
//                                     {currentEditingRow === 'row1' ? '1번째 행' :
//                                         currentEditingRow === 'row2' ? '2번째 행' : '3번째 행'} 항목 선택
//                                 </h3>
//                                 <button
//                                     onClick={closePopup}
//                                     className="text-gray-500 hover:text-gray-700"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                             </div>

//                             <div className="flex-1 overflow-y-auto mb-4">
//                                 <div className="space-y-1">
//                                     {availableItems.map((item, idx) => (
//                                         <label
//                                             key={idx}
//                                             className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
//                                         >
//                                             <input
//                                                 type="checkbox"
//                                                 checked={tempSelectedItems.includes(item)}
//                                                 onChange={() => toggleItemSelection(item)}
//                                                 className="mr-3 accent-teal-500"
//                                             />
//                                             <span className="text-sm">{item}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="text-xs text-gray-500 mb-4">
//                                 선택된 항목: {tempSelectedItems.length}개
//                             </div>

//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={closePopup}
//                                     className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
//                                 >
//                                     취소
//                                 </button>
//                                 <button
//                                     onClick={applySelection}
//                                     className="flex-1 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 text-sm"
//                                 >
//                                     적용
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default StatisticsItemsSettings;


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

// import React, { useState } from 'react';
// import { X, Plus } from 'lucide-react';

// // 사용 가능한 통계 항목들
// const availableItems = [
//     '실인입호수', '포기호수', '넌서비스호수', '외부호전환호수',
//     '그룹호전환 인입', '그룹호전환포기', '실패호수', '콜호전환 인입',
//     '그룹호전환 큐전환', '그룹호전환 넌서비스', '그룹호전환 ns', '그룹호전환 분배',
// ];

// // 초기 설정된 항목들
// const initialRowSettings = {
//     row1: ['실인입호수', '포기호수'],
//     row2: ['콜호전환 인입', '그룹호전환 큐전환'],
// };

// // 소스 박스 컴포넌트
// const SourceBox: React.FC<{
//     available: string[];
//     selected: string | null;
//     onSelect: (item: string) => void;
// }> = ({ available, selected, onSelect }) => (
//     <div className="border rounded-lg p-4 bg-white">
//         <h3 className="font-bold text-sm mb-2">통계 목록</h3>
//         <div className="h-52 overflow-y-auto space-y-1">
//             {available.length === 0 ? (
//                 <p className="text-center text-xs text-gray-400 py-4">모든 항목 사용 중</p>
//             ) : (
//                 available.map(item => (
//                     <div
//                         key={item}
//                         onClick={() => onSelect(item)}
//                         className={`p-2 text-xs cursor-pointer rounded ${selected === item ? 'bg-yellow-200' : 'hover:bg-gray-100'
//                             }`}
//                     >
//                         {item}
//                     </div>
//                 ))
//             )}
//         </div>
//         <p className="mt-2 text-xs text-gray-500">남은 항목: {available.length}</p>
//     </div>
// );

// // 행 박스 컴포넌트
// const RowBox: React.FC<{
//     title: string;
//     items: string[];
//     canAdd: boolean;
//     onAdd: () => void;
//     onRemove: (item: string) => void;
//     selectedSource: string | null;
// }> = ({ title, items, canAdd, onAdd, onRemove, selectedSource }) => (
//     <div className="border rounded-lg p-4 bg-white">
//         <div className="flex justify-between items-center mb-2">
//             <h3 className="font-bold text-sm">{title}</h3>
//             <button
//                 onClick={onAdd}
//                 disabled={!canAdd}
//                 className={`flex items-center px-2 py-1 text-xs rounded ${canAdd ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-200 text-gray-500'
//                     }`}
//             >
//                 <Plus size={12} /> 추가
//             </button>
//         </div>
//         <div className="h-52 overflow-y-auto space-y-1">
//             {items.length === 0 ? (
//                 <p className="text-center text-xs text-gray-400 py-4">설정된 항목이 없습니다</p>
//             ) : (
//                 items.map(item => (
//                     <div
//                         key={item}
//                         className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs"
//                     >
//                         <span>{item}</span>
//                         <button onClick={() => onRemove(item)} className="text-red-500 hover:text-red-700">
//                             <X size={12} />
//                         </button>
//                     </div>
//                 ))
//             )}
//         </div>
//         <p className="mt-2 text-xs text-gray-500">총 {items.length}개</p>
//     </div>
// );

// const StatisticsItemsSettings: React.FC = () => {
//     const [rowSettings, setRowSettings] = useState(initialRowSettings);
//     const [selectedSourceItem, setSelectedSourceItem] = useState<string | null>(null);

//     // 소스 박스에 남는 항목
//     const used = [...rowSettings.row1, ...rowSettings.row2];
//     const available = availableItems.filter(i => !used.includes(i));

//     const addItem = (rowKey: 'row1' | 'row2') => {
//         if (!selectedSourceItem) return;
//         setRowSettings(prev => ({
//             ...prev,
//             [rowKey]: [...prev[rowKey], selectedSourceItem]
//         }));
//         setSelectedSourceItem(null);
//     };

//     const removeItem = (rowKey: 'row1' | 'row2', item: string) => {
//         setRowSettings(prev => ({
//             ...prev,
//             [rowKey]: prev[rowKey].filter(i => i !== item)
//         }));
//     };

//     return (
//         <div className="p-4 bg-gray-50 font-['Malgun_Gothic'] min-h-screen">
//             <h2 className="text-lg font-bold mb-4">통계 항목 설정</h2>
//             <div className="grid grid-cols-3 gap-4">
//                 <SourceBox
//                     available={available}
//                     selected={selectedSourceItem}
//                     onSelect={setSelectedSourceItem}
//                 />
//                 <RowBox
//                     title="1번째 행"
//                     items={rowSettings.row1}
//                     canAdd={!!selectedSourceItem}
//                     onAdd={() => addItem('row1')}
//                     onRemove={item => removeItem('row1', item)}
//                     selectedSource={selectedSourceItem}
//                 />
//                 <RowBox
//                     title="2번째 행"
//                     items={rowSettings.row2}
//                     canAdd={!!selectedSourceItem}
//                     onAdd={() => addItem('row2')}
//                     onRemove={item => removeItem('row2', item)}
//                     selectedSource={selectedSourceItem}
//                 />
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