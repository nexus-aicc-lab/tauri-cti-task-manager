// src/windows/launcher/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";

// 스타일 가져오기
import "../../main.css";
import "../../App.css";

// ✅ 새로운 FSD App 컴포넌트 사용
import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);