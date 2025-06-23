// src/pages/BarMode/index.tsx
import Titlebar from '@/widgets/titlebar/ui/Titlebar';

interface BarComponentProps {
    onBackToLauncher: () => void;
}

export default function BarComponent({ onBackToLauncher }: BarComponentProps) {
    return (
        <div className="h-full">
            {/* 런처로 돌아가기 버튼 추가 */}
            <div className="absolute top-1 right-1 z-50">
                <button
                    onClick={onBackToLauncher}
                    className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded text-xs"
                >
                    🏠2
                </button>
            </div>
            <Titlebar />
        </div>
    );
}