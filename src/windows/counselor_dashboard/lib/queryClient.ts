// src/windows/counselor_dashboard/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5분
            gcTime: 1000 * 60 * 10,   // 10분
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});