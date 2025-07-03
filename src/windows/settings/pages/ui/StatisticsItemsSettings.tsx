import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';

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

// 초기 설정된 항목들
const initialRowSettings = {
    row1: ['실인입호수', '포기호수'],
    row2: ['콜호전환 인입', '그룹호전환 큐전환'],
    row3: ['그룹호전환 넌서비스', '그룹호전환 ns'],
};

const StatisticsItemsSettings: React.FC = () => {
    const [rowSettings, setRowSettings] = useState(initialRowSettings);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentEditingRow, setCurrentEditingRow] = useState<string | null>(null);
    const [tempSelectedItems, setTempSelectedItems] = useState<string[]>([]);
    const [activeRows, setActiveRows] = useState<number[]>([1, 2]); // 기본으로 1행, 2행 활성화

    // 토글 버튼 (1~3만)
    const toggleButtons = [1, 2, 3];

    const toggleRowVisibility = (rowNumber: number) => {
        setActiveRows(prev => {
            if (prev.includes(rowNumber)) {
                return prev.filter(n => n !== rowNumber);
            } else {
                return [...prev, rowNumber].sort();
            }
        });
    };

    const openPopup = (rowKey: string) => {
        setCurrentEditingRow(rowKey);
        setTempSelectedItems([...rowSettings[rowKey as keyof typeof rowSettings]]);
        setIsPopupOpen(true);
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
        }
        closePopup();
    };

    const removeItem = (rowKey: string, item: string) => {
        setRowSettings(prev => ({
            ...prev,
            [rowKey]: prev[rowKey as keyof typeof prev].filter(i => i !== item)
        }));
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
        <div className="p-4 font-['Malgun_Gothic'] text-gray-800 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-lg font-bold mb-6 text-gray-800">통계 항목 설정</h2>

                {/* 상단 토글 버튼들 */}
                <div className="mb-4 p-3 bg-white rounded border border-gray-300">
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
                                    {availableItems.map((item, idx) => (
                                        <label
                                            key={idx}
                                            className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={tempSelectedItems.includes(item)}
                                                onChange={() => toggleItemSelection(item)}
                                                className="mr-3 accent-teal-500"
                                            />
                                            <span className="text-sm">{item}</span>
                                        </label>
                                    ))}
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