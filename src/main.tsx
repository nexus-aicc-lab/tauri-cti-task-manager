// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'  // 단순한 App 컴포넌트
// main..css 필요
import './main.css'  // 기본 스타일 적용

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)