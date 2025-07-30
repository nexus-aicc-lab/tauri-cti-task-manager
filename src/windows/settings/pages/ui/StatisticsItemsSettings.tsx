import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

// 사용 가능한 통계 항목들
const availableItems = [
    '실인입호수', '포기호수', '넌서비스호수', '외부호전환호수',
    '그룹호전환 인입', '그룹호전환포기', '실패호수', '콜호전환 인입',
    '그룹호전환 큐전환', '그룹호전환 넌서비스', '그룹호전환 ns', '그룹호전환 분배',
];

interface StatisticsSettings {
    row_settings: Record<string, string[]>;
    active_rows: number[];
    timestamp?: string;
}

const StatisticsItemsSettings: React.FC = () => {
    const [rowSettings, setRowSettings] = useState<Record<string, string[]>>({
        row1: [], row2: [], row3: [],
    });
    const [activeRows, setActiveRows] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentEditingRow, setCurrentEditingRow] = useState<string | null>(null);
    const [tempSelectedItems, setTempSelectedItems] = useState<string[]>([]);

    // ✅ 설정 파일 로드
    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const loadedSettings: StatisticsSettings = await invoke('load_statistics_settings');

            setRowSettings({
                row1: Array.isArray(loadedSettings.row_settings?.row1) ? loadedSettings.row_settings.row1 : [],
                row2: Array.isArray(loadedSettings.row_settings?.row2) ? loadedSettings.row_settings.row2 : [],
                row3: Array.isArray(loadedSettings.row_settings?.row3) ? loadedSettings.row_settings.row3 : [],
            });

            setActiveRows(Array.isArray(loadedSettings.active_rows) ? loadedSettings.active_rows : []);
        } catch (error) {
            console.error('❌ 설정 로드 실패:', error);
            setRowSettings({ row1: [], row2: [], row3: [] });
            setActiveRows([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ 설정 저장
    const saveSettings = async () => {
        try {
            setIsLoading(true);
            const currentSettings: StatisticsSettings = {
                row_settings: rowSettings,
                active_rows: activeRows,
                timestamp: new Date().toISOString(),
            };
            await invoke('save_statistics_settings', { settings: currentSettings });
            alert('✅ 설정이 저장되었습니다!');
        } catch (error) {
            console.error('❌ 설정 저장 실패:', error);
            alert('❌ 설정 저장에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const openPopup = (rowKey: string) => {
        setCurrentEditingRow(rowKey);
        setTempSelectedItems([...rowSettings[rowKey] ?? []]);
    };

    const closePopup = () => {
        setCurrentEditingRow(null);
        setTempSelectedItems([]);
    };

    const applySelection = () => {
        if (currentEditingRow) {
            setRowSettings(prev => ({
                ...prev,
                [currentEditingRow]: [...tempSelectedItems],
            }));
        }
        closePopup();
    };

    const toggleItemSelection = (item: string) => {
        setTempSelectedItems(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const removeItem = (rowKey: string, item: string) => {
        setRowSettings(prev => ({
            ...prev,
            [rowKey]: prev[rowKey]?.filter(i => i !== item) ?? [],
        }));
    };

    const RowBox: React.FC<{ title: string, items?: string[], rowKey: string }> = ({ title, items = [], rowKey }) => (
        <div className="border rounded-lg p-2 bg-white">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">{title}</h3>
                <button
                    onClick={() => openPopup(rowKey)}
                    className="p-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>
            <div className="h-52 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-4">설정된 항목이 없습니다</p>
                ) : (
                    items.map((item, index) => (
                        <div key={`${item}-${index}`} className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs mb-1">
                            <span>{item}</span>
                            <button onClick={() => removeItem(rowKey, item)} className="text-red-500 hover:text-red-700">
                                <X size={12} />
                            </button>
                        </div>
                    ))
                )}
            </div>
            <p className="mt-2 text-xs text-gray-500">총 {items.length}개</p>
        </div>
    );

    return (
        <div className="p-2 font-['Malgun_Gothic'] text-gray-800 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">통계 항목 설정</h2>
                    <button
                        onClick={saveSettings}
                        disabled={isLoading}
                        className={`px-4 py-2 text-white rounded text-sm font-medium transition-colors ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {isLoading ? '⏳ 저장 중...' : '💾 저장'}
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <RowBox title="1번째 행" items={rowSettings.row1} rowKey="row1" />
                    <RowBox title="2번째 행" items={rowSettings.row2} rowKey="row2" />
                    <RowBox title="3번째 행" items={rowSettings.row3} rowKey="row3" />
                </div>

                {currentEditingRow && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    {currentEditingRow === 'row1' ? '1번째 행' : currentEditingRow === 'row2' ? '2번째 행' : '3번째 행'} 항목 선택
                                </h3>
                                <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto mb-4">
                                <div className="space-y-1">
                                    {availableItems.map((item, idx) => {
                                        const isDisabled = Object.values(rowSettings).flat().includes(item);
                                        return (
                                            <label
                                                key={idx}
                                                className={`flex items-center p-2 rounded cursor-pointer transition-colors ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                                                    }`}
                                                style={{
                                                    textDecoration: isDisabled ? 'line-through' : 'none',
                                                    color: isDisabled ? '#b0b0b0' : undefined,
                                                    opacity: isDisabled ? 0.7 : 1,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={tempSelectedItems.includes(item)}
                                                    onChange={() => !isDisabled && toggleItemSelection(item)}
                                                    className="mr-3 accent-teal-500"
                                                    disabled={isDisabled}
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
                                <button onClick={closePopup} className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                                    취소
                                </button>
                                <button onClick={applySelection} className="flex-1 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 text-sm">
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
