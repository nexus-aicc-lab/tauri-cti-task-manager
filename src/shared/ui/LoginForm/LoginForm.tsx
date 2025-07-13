// C:\tauri\cti-task-pilot\src\shared\ui\LoginForm\LoginForm.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/shared/hook/useApiForAuth";

interface LoginFormProps {

}

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) return;

        try {
            await loginMutation.mutateAsync({ email, password });

        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-xl font-semibold text-center">
                        로그인
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                        계정에 로그인하여 시작하세요
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {loginMutation.error && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {loginMutation.error.message || '로그인에 실패했습니다.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="이메일을 입력하세요"
                                disabled={loginMutation.isPending}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">비밀번호</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                disabled={loginMutation.isPending}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loginMutation.isPending || !email.trim() || !password.trim()}
                            className="w-full"
                        >
                            {loginMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {loginMutation.isPending ? '로그인 중...' : '로그인'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}