// src/windows/counselor_dashboard/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from '@tanstack/react-query'; // ✅ 추가
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // ✅ 추가

// 스타일 가져오기
import "../../main.css";
import "../../App.css";

// ✅ QueryClient import
import { queryClient } from './lib/queryClient';

// 기존 App 컴포넌트
import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}> {/* ✅ QueryClientProvider 추가 */}
            <App />
            {/* ✅ 개발 환경에서만 DevTools 표시 */}
            {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
        </QueryClientProvider>
    </React.StrictMode>
);