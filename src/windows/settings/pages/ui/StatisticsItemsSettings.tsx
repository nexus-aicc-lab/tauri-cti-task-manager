
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
