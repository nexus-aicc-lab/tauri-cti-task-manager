// C:\tauri\cti-task-pilot\src\shared\ui\LoginForm\ConsultantProfile.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { useCurrentProfile, useLogout } from "@/shared/hook/useApiForAuth";

interface ConsultantProfileProps {
    onLogout?: () => void;
}

export default function ConsultantProfile({ onLogout }: ConsultantProfileProps) {
    const { data: user, isLoading, error } = useCurrentProfile();
    const logout = useLogout();
    const [isEditing, setIsEditing] = useState(false);

    const handleLogout = () => {
        logout();
        onLogout?.();
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'READY': return 'default';
            case 'BUSY': return 'destructive';
            case 'BREAK': return 'secondary';
            case 'OFFLINE': return 'outline';
            default: return 'outline';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'READY': return '대기중';
            case 'BUSY': return '통화중';
            case 'BREAK': return '휴식중';
            case 'OFFLINE': return '오프라인';
            default: return '알 수 없음';
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !user) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-destructive text-sm">
                        프로필을 불러올 수 없습니다.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback>
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                            {user.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
                {/* 상태 */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                        현재 상태
                    </span>
                    <Badge variant={getStatusVariant(user.callStatus)}>
                        {getStatusText(user.callStatus)}
                    </Badge>
                </div>

                {/* 가입일 */}
                <div className="text-xs text-muted-foreground">
                    가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Settings className="w-3 h-3 mr-1" />
                        설정
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-3 h-3 mr-1" />
                        로그아웃
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}