// src/windows/settings/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";

// 스타일 가져오기
import "../../main.css";
import "../../App.css";
import SettingsApp from "./SettingsApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <SettingsApp />
    </React.StrictMode>
);