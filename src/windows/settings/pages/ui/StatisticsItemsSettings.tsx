
import React, { useState, useEffect } from 'react';
import { Settings, X, Plus } from 'lucide-react';

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

    // 행 박스 컴포넌트
    const RowBox: React.FC<{
        title: string;
        items: string[];
        canAdd: boolean;
        onAdd: () => void;
        onRemove: (item: string) => void;
        selectedSource: string | null;
    }> = ({ title, items, canAdd, onAdd, onRemove, selectedSource }) => (
        <div className="border rounded-lg p-2 bg-white"> {/* p-2 → p-1로 패딩 줄임 */}
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
            <div className="h-52 overflow-y-auto">
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

    return (
        <div className="p-2 font-['Malgun_Gothic'] text-gray-800 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-1">
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
                <div className="mb-1 p-1 bg-white rounded border border-gray-300">
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
                        title="1번째 행"
                        items={rowSettings.row1}
                        canAdd={activeRows.includes(1)}
                        onAdd={() => openPopup('row1')}
                        onRemove={(item) => removeItem('row1', item)}
                        selectedSource={null}
                    />
                    <RowBox
                        title="2번째 행"
                        items={rowSettings.row2}
                        canAdd={activeRows.includes(2)}
                        onAdd={() => openPopup('row2')}
                        onRemove={(item) => removeItem('row2', item)}
                        selectedSource={null}
                    />
                    <RowBox
                        title="3번째 행"
                        items={rowSettings.row3}
                        canAdd={activeRows.includes(3)}
                        onAdd={() => openPopup('row3')}
                        onRemove={(item) => removeItem('row3', item)}
                        selectedSource={null}
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