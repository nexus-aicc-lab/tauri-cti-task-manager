// src/widgets/info-header/ui/InfoHeader.tsx
import { User, Clock } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

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
        // 더 진한 slate 버전
        <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700 select-none shadow-lg">
            {/* 에이전트 섹션 */}
            <div className="flex items-center gap-4">
                {/* 에이전트 배지 */}
                <Badge
                    variant="secondary"
                    className="bg-slate-700 text-slate-100 border border-slate-600 hover:bg-slate-600 transition-colors"
                >
                    <User className="h-3.5 w-3.5 mr-1.5 text-slate-300" />
                    <span className="font-semibold">{agentId}</span>
                </Badge>

                {/* 세션 정보 */}
                <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-mono text-slate-200 font-medium">{sessionTime}</span>
                </div>
            </div>

            {/* 액션 섹션 */}
            <div className="flex items-center gap-5">
                {/* 로그인 정보 */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400 font-medium">로그인</span>
                    <span className="font-semibold text-slate-100">{loginTime}</span>
                </div>

                {/* 로그오프 버튼 */}
                <Button
                    size="sm"
                    onClick={onLogoff}
                    className="bg-slate-100 text-slate-800 hover:bg-white font-bold shadow hover:shadow-lg transition-all"
                >
                    LogOff
                </Button>
            </div>
        </div>
    );
};