'use client';

import { useApiForGetSkillGroupFilter } from "@/shared/hook/useApiForGetSkillGroupFilter";


export default function HelloPage() {
    // 🔽 임시 테스트용 요청 파라미터 (Spring API에 맞게 수정 가능)
    const { data, isLoading, error, refetch } = useApiForGetSkillGroupFilter({
        groupType: 'TEST', // 여긴 Spring 서버에 맞게 바꿔야 함
    });

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-white gap-4 p-4">
            <h1 className="text-3xl font-bold">👋 Hello from Tauri + TanStack Query</h1>

            <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => refetch()}
            >
                Redis Skill Group 조회
            </button>

            {isLoading && <p>📡 불러오는 중...</p>}
            {error && <p className="text-red-500">❌ 에러 발생</p>}

            {data && (
                <pre className="mt-4 w-full max-w-2xl bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            )}
        </div>
    );
}
