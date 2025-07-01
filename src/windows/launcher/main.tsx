// src/windows/launcher/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";

// 스타일 가져오기
import "../../main.css";
import "../../App.css";
import LauncherApp from "./LauncherApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <LauncherApp />
    </React.StrictMode>
);