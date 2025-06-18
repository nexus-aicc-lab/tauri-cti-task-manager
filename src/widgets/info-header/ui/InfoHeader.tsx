// src/widgets/info-header/ui/InfoHeader.tsx
import { User, Clock } from "lucide-react";

interface InfoHeaderProps {
    agentId: string;
    sessionTime: string;
    loginTime: string;
    onLogoff: () => void;
}

export const InfoHeader = ({
    agentId,
    sessionTime,
    loginTime,
    onLogoff
}: InfoHeaderProps) => {
    return (
        <div className="flex items-center justify-between px-6 py-2 bg-gray-900 border-b border-gray-800 select-none">
            {/* 에이전트 섹션 */}
            <div className="flex items-center gap-4">
                {/* 에이전트 배지 */}
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-300">{agentId}</span>
                </div>

                {/* 세션 정보 */}
                <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-sm font-mono">{sessionTime}</span>
                </div>
            </div>

            {/* 액션 섹션 */}
            <div className="flex items-center gap-4">
                {/* 로그인 정보 */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">로그인</span>
                    <span className="text-gray-300 font-medium">{loginTime}</span>
                </div>

                {/* 로그오프 버튼 */}
                <button
                    className="px-4 py-1.5 text-sm font-medium text-red-300 bg-red-900/20 border border-red-500/30 rounded hover:bg-red-900/30 hover:border-red-500/50 hover:text-red-200 transition-all duration-200 active:scale-95"
                    onClick={onLogoff}
                >
                    LogOff
                </button>
            </div>
        </div>
    );
};