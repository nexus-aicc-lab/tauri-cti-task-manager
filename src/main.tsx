// 📄 C:\tauri\cti-task-manager-tauri\src\main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "sonner"; // ✅ 알림 컴포넌트

import "./main.css";
import { router } from "./route";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="top-center"   // ✅ 여기만 추가
      richColors
      closeButton
    />
  </React.StrictMode>
);
