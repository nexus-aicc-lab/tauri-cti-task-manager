// src/windows/counselor_dashboard/components/UserList.tsx
import React from 'react';
import { useUsers } from '../hooks/useUserQueries';

export const UserList: React.FC = () => {
    const { data: users, isLoading, error } = useUsers();

    if (isLoading) return <div>사용자 목록 로딩 중...</div>;
    if (error) return <div>에러: {error.message}</div>;

    return (
        <div className="user-list">
            <h2>사용자 목록</h2>
            <div className="grid gap-4">
                {users?.map((user) => (
                    <div key={user.id} className="border p-4 rounded bg-white shadow">
                        <h3 className="font-bold">{user.name}</h3>
                        <p>이메일: {user.email}</p>
                        <p>상태: {user.callStatus}</p>
                        <p>ID: {user.id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};