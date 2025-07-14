// C:\tauri\cti-task-pilot\src\windows\counselor_dashboard\components\LoginFormWithDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Loader2, LogOut, User, ChevronDown, LogIn } from "lucide-react";
import { useLogin, useLogout } from "@/shared/hook/useApiForAuth";

interface User {
    id: number;
    email: string;
    name: string;
}

interface LoginDropdownProps {
    user: User | null;
    onUserChange?: (user: User | null) => void;
}

const LoginFormWithDropdown: React.FC<LoginDropdownProps> = ({ user, onUserChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const loginMutation = useLogin();
    const logout = useLogout();

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 로그인 성공 시 드롭다운 닫기 및 폼 초기화
    useEffect(() => {
        if (loginMutation.isSuccess) {
            setIsOpen(false);
            setEmail("");
            setPassword("");
            // 로그인 성공 후 사용자 정보 업데이트
            const userData = localStorage.getItem('user_data');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    onUserChange?.(parsedUser);
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                }
            }
        }
    }, [loginMutation.isSuccess, onUserChange]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        try {
            await loginMutation.mutateAsync({ email, password });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = () => {
        logout();
        onUserChange?.(null);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 트리거 버튼 */}
            <Button
                variant="ghost"
                size="sm"
                onClick={toggleDropdown}
                className="text-white hover:bg-white/10 flex items-center space-x-2"
            >
                {user ? (
                    <>
                        <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-white/20 text-white">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline text-sm">{user.name}</span>
                        <ChevronDown className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        <LogIn className="w-4 h-4" />
                        <span className="text-sm">로그인</span>
                        <ChevronDown className="w-4 h-4" />
                    </>
                )}
            </Button>

            {/* 드롭다운 컨텐츠 */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 z-50">
                    <Card className="w-80 shadow-lg">
                        {user ? (
                            // 로그인된 상태 - 프로필 표시
                            <>
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
                            </>
                        ) : (
                            // 로그인되지 않은 상태 - 로그인 폼 표시
                            <>
                                <CardHeader className="space-y-1">
                                    <CardTitle className="text-lg font-semibold">
                                        로그인
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
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

                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="dropdown-email">이메일</Label>
                                            <Input
                                                id="dropdown-email"
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
                                            <Label htmlFor="dropdown-password">비밀번호</Label>
                                            <Input
                                                id="dropdown-password"
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
                            </>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default LoginFormWithDropdown;