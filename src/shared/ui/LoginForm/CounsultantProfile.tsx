// C:\tauri\cti-task-pilot\src\shared\ui\LoginForm\SimpleConsultantProfile.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useLogout } from "@/shared/hook/useApiForAuth";

interface CounsultantProfile {
    user: {
        id: number;
        email: string;
        name: string;
    };
    onLogout?: () => void;
}

export default function CounsultantProfile({ user, onLogout }: CounsultantProfile) {
    const logout = useLogout();

    const handleLogout = () => {
        logout();
        onLogout?.();
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    프로필
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarFallback>
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                            {user.name} ({user.id})
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                >
                    <LogOut className="w-3 h-3 mr-1" />
                    로그아웃
                </Button>
            </CardContent>
        </Card>
    );
}