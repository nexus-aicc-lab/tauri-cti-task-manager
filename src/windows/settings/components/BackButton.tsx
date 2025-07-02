// src/windows/settings/components/BackButton.tsx
import React from 'react';

interface BackButtonProps {
    onBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack }) => {
    return (
        <button
            onClick={onBack}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
            <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                />
            </svg>
            뒤로
        </button>
    );
};

export default BackButton;