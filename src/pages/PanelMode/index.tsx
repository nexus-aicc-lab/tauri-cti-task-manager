// src/pages/PanelMode/index.tsx
import React from 'react';

interface PanelComponentProps {
    onBackToLauncher: () => void;
}

export default function PanelComponent({ onBackToLauncher }: PanelComponentProps) {
    return (
        <div className="h-full bg-green-100">
            {/* 런처로 돌아가기 버튼 */}
            <div className="absolute top-4 right-4 z-50">
                <button
                    onClick={onBackToLauncher}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded"
                >
                    🏠 런처로 돌아가기
                </button>
            </div>

            <div className="p-8">
                <h1 className="text-2xl font-bold">패널 모드</h1>
                <p>1200x800 크기의 패널 모드입니다.</p>
            </div>
        </div>
    );
}