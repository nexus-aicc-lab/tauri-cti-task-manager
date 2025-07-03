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
//         <div className="p-2 font-['Malgun_Gothic'] text-gray-800 bg-gray-50 min-h-screen">
//             <div className="max-w-6xl mx-auto">
//                 <h2 className="text-lg font-bold mb-2 text-gray-800">통계 항목 설정</h2>

//                 {/* 상단 토글 버튼들 */}
//                 <div className="mb-2 p-3 bg-white rounded border border-gray-300">
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

import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';

// Tauri API 임포트 (실제 환경에서는 이렇게 사용)
// import { invoke } from '@tauri-apps/api/tauri';

// 데모용 mock 함수들 (1단계용)
let mockSavedData: any = null;

const mockInvoke = async (command: string, args?: any) => {
    console.log(`🎯 Mock Tauri Command: ${command}`, args);

    // 약간의 지연 시뮬레이션 (실제 파일 I/O 느낌)
    await new Promise(resolve => setTimeout(resolve, 300));

    switch (command) {
        case 'save_statistics_settings':
            mockSavedData = args?.settings;
            console.log('💾 Mock: 파일에 저장됨', mockSavedData);
            return { success: true, path: '/mock/path/statistics_settings.json' };

        case 'load_statistics_settings':
            if (mockSavedData) {
                console.log('📂 Mock: 파일에서 불러옴', mockSavedData);
                return mockSavedData;
            } else {
                console.log('📂 Mock: 파일이 없음, 기본값 반환');
                return {
                    row_settings: {
                        row1: ['실인입호수', '포기호수'],
                        row2: ['콜호전환 인입', '그룹호전환 큐전환'],
                        row3: ['그룹호전환 넌서비스', '그룹호전환 ns']
                    },
                    active_rows: [1, 2]
                };
            }

        default:
            return null;
    }
};

// 사용 가능한 통계 항목들
const availableItems = [
    '실인입호수',
    '포기호수',
    '넌서비스호수',
    '외부호전환호수',
    '그룹호전환 인입',
    '그룹호전환포기',
    '실패호수',
    '콜호전환 인입',
    '그룹호전환 큐전환',
    '그룹호전환 넌서비스',
    '그룹호전환 ns',
    '그룹호전환 분배',
];

interface StatisticsSettings {
    row_settings: Record<string, string[]>;
    active_rows: number[];
}

const StatisticsItemsSettings: React.FC = () => {
    const [rowSettings, setRowSettings] = useState<Record<string, string[]>>({
        row1: [],
        row2: [],
        row3: []
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentEditingRow, setCurrentEditingRow] = useState<string | null>(null);
    const [tempSelectedItems, setTempSelectedItems] = useState<string[]>([]);
    const [activeRows, setActiveRows] = useState<number[]>([1, 2]);

    // 토글 버튼 (1~3만)
    const toggleButtons = [1, 2, 3];

    // 컴포넌트 마운트 시 콘솔 로그
    useEffect(() => {
        console.log('📊 통계 설정 컴포넌트 마운트 완료');
        console.log('💡 Save 버튼으로 현재 설정 저장, Init 버튼으로 설정 불러오기');
    }, []);

    const loadSettings = async () => {
        // 🎯 1단계에서는 사용하지 않음 (handleInit으로 대체)
        console.log('⚠️ loadSettings는 1단계에서 비활성화됨');
    };

    const saveSettings = async () => {
        // 🎯 1단계에서는 사용하지 않음 (handleSave로 대체)
        console.log('⚠️ saveSettings는 1단계에서 비활성화됨');
    };

    const toggleRowVisibility = (rowNumber: number) => {
        setActiveRows(prev => {
            const newActiveRows = prev.includes(rowNumber)
                ? prev.filter(n => n !== rowNumber)
                : [...prev, rowNumber].sort();

            console.log(`🔄 ${rowNumber}행 토글 →`, newActiveRows);
            return newActiveRows;
        });
    };

    // 🎯 1단계: Save 버튼 핸들러
    const handleSave = async () => {
        try {
            const currentSettings = {
                row_settings: rowSettings,
                active_rows: activeRows,
                timestamp: new Date().toISOString()
            };

            console.log('💾 저장할 설정:', currentSettings);

            // 실제 환경에서는 Tauri 명령 호출
            // await invoke('save_statistics_settings', { settings: currentSettings });
            await mockInvoke('save_statistics_settings', { settings: currentSettings });

            alert('✅ 설정이 저장되었습니다!');

        } catch (error) {
            console.error('❌ 저장 실패:', error);
            alert('❌ 저장에 실패했습니다.');
        }
    };

    // 🎯 1단계: Init 버튼 핸들러
    const handleInit = async () => {
        try {
            console.log('🔄 설정 초기화 시작...');

            // 실제 환경에서는 Tauri 명령 호출
            // const loadedSettings = await invoke('load_statistics_settings');
            const loadedSettings = await mockInvoke('load_statistics_settings');

            console.log('📂 불러온 설정:', loadedSettings);

            if (loadedSettings) {
                setRowSettings(loadedSettings.row_settings);
                setActiveRows(loadedSettings.active_rows);
                alert('✅ 설정을 불러왔습니다!');
            } else {
                console.log('🔄 설정 파일이 없어서 기본값 사용');
                alert('⚠️ 설정 파일이 없습니다. 기본값을 사용합니다.');
            }

        } catch (error) {
            console.error('❌ 초기화 실패:', error);
            alert('❌ 설정 불러오기에 실패했습니다.');
        }
    };

    const openPopup = (rowKey: string) => {
        setCurrentEditingRow(rowKey);
        setTempSelectedItems([...rowSettings[rowKey]]);
        setIsPopupOpen(true);

        console.log(`📝 ${rowKey} 편집 시작 - 현재 선택된 항목:`, rowSettings[rowKey]);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setCurrentEditingRow(null);
        setTempSelectedItems([]);
    };

    const toggleItemSelection = (item: string) => {
        setTempSelectedItems(prev =>
            prev.includes(item)
                ? prev.filter(i => i !== item)
                : [...prev, item]
        );
    };

    const applySelection = () => {
        if (currentEditingRow) {
            setRowSettings(prev => ({
                ...prev,
                [currentEditingRow]: [...tempSelectedItems]
            }));

            console.log(`📝 ${currentEditingRow} 항목 적용:`, tempSelectedItems);
        }
        closePopup();
    };

    const removeItem = (rowKey: string, item: string) => {
        setRowSettings(prev => ({
            ...prev,
            [rowKey]: prev[rowKey].filter(i => i !== item)
        }));

        console.log(`🗑️ ${rowKey}에서 "${item}" 제거`);
    };

    const RowBox = ({ rowKey, title, items, isActive = true }: { rowKey: string, title: string, items: string[], isActive?: boolean }) => (
        <div className={`border-2 rounded-lg p-4 relative transition-colors ${isActive
            ? 'border-gray-300 bg-white'
            : 'border-gray-200 bg-gray-50 opacity-60'
            }`}>
            <div className="flex justify-between items-center mb-3">
                <h3 className={`font-bold text-sm ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                    {title}
                </h3>
                <button
                    onClick={() => isActive && openPopup(rowKey)}
                    disabled={!isActive}
                    className={`p-1.5 rounded transition-colors ${isActive
                        ? 'bg-teal-500 text-white hover:bg-teal-600'
                        : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                        }`}
                    title={isActive ? "항목 설정" : "비활성화된 행입니다"}
                >
                    <Settings size={14} />
                </button>
            </div>

            <div className="min-h-[120px] space-y-2">
                {!isActive ? (
                    <div className="text-gray-400 text-xs text-center py-8">
                        비활성화된 행입니다
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-gray-400 text-xs text-center py-8">
                        설정된 항목이 없습니다
                    </div>
                ) : (
                    items.map((item, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-xs"
                        >
                            <span className="text-xs">{item}</span>
                            <button
                                onClick={() => removeItem(rowKey, item)}
                                className="text-red-500 hover:text-red-700 ml-2"
                                title="삭제"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className={`mt-3 text-xs ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                총 {items.length}개 항목
            </div>
        </div>
    );

    return (
        <div className="p-2 font-['Malgun_Gothic'] text-gray-800 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-gray-800">통계 항목 설정</h2>

                    {/* Save/Init 버튼들 */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium transition-colors"
                        >
                            💾 Save
                        </button>
                        <button
                            onClick={handleInit}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium transition-colors"
                        >
                            🔄 Init
                        </button>
                    </div>
                </div>

                {/* 상단 토글 버튼들 */}
                <div className="mb-2 p-3 bg-white rounded border border-gray-300">
                    <div className="flex gap-2">
                        {toggleButtons.map(num => (
                            <button
                                key={num}
                                onClick={() => toggleRowVisibility(num)}
                                className={`px-4 py-1.5 text-sm rounded transition-colors ${activeRows.includes(num)
                                    ? 'bg-teal-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {num}행
                            </button>
                        ))}
                    </div>
                </div>

                {/* 행 설정 박스들 - 항상 3열로 표시 */}
                <div className="grid grid-cols-3 gap-4">
                    <RowBox
                        rowKey="row1"
                        title="1번째 행"
                        items={rowSettings.row1}
                        isActive={activeRows.includes(1)}
                    />
                    <RowBox
                        rowKey="row2"
                        title="2번째 행"
                        items={rowSettings.row2}
                        isActive={activeRows.includes(2)}
                    />
                    <RowBox
                        rowKey="row3"
                        title="3번째 행"
                        items={rowSettings.row3}
                        isActive={activeRows.includes(3)}
                    />
                </div>

                {/* 팝업 */}
                {isPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    {currentEditingRow === 'row1' ? '1번째 행' :
                                        currentEditingRow === 'row2' ? '2번째 행' : '3번째 행'} 항목 선택
                                </h3>
                                <button
                                    onClick={closePopup}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto mb-4">
                                <div className="space-y-1">
                                    {availableItems.map((item, idx) => {
                                        // 이미 다른 row에 등록된 항목인지 체크
                                        const isAlreadyRegistered =
                                            Object.entries(rowSettings)
                                                .filter(([row]) => row !== currentEditingRow)
                                                .some(([, items]) => items.includes(item));

                                        return (
                                            <label
                                                key={idx}
                                                className={`flex items-center p-2 rounded cursor-pointer transition-colors
                                                    ${isAlreadyRegistered ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}
                                                `}
                                                style={{
                                                    textDecoration: isAlreadyRegistered ? 'line-through' : 'none',
                                                    color: isAlreadyRegistered ? '#b0b0b0' : undefined,
                                                    opacity: isAlreadyRegistered ? 0.7 : 1,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={tempSelectedItems.includes(item)}
                                                    onChange={() => !isAlreadyRegistered && toggleItemSelection(item)}
                                                    className="mr-3 accent-teal-500"
                                                    disabled={isAlreadyRegistered}
                                                />
                                                <span className="text-sm">{item}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 mb-4">
                                선택된 항목: {tempSelectedItems.length}개
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={closePopup}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={applySelection}
                                    className="flex-1 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 text-sm"
                                >
                                    적용
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatisticsItemsSettings;