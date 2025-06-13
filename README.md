# CTI Task Master (Tauri Version)

Tauri + Vite + React로 만든 가로 막대바 형태의 CTI 업무용 상태창 애플리케이션

## 📋 프로젝트 개요

- **기술 스택**: Tauri, Vite, React, TypeScript
- **UI 형태**: 가로 막대바 (400x80)
- **기능**: 상태 관리(대기중/통화중/후처리), 실시간 시계, 처리 건수 카운트
- **특징**: 항상 맨 위에 표시, 드래그 이동, 프레임리스 창

## 🚀 설치 및 실행

### 1. 프로젝트 생성
```bash
npm create tauri-app@latest
# React + TypeScript 선택
```

### 2. 개발 실행
```bash
npm install
npm run tauri dev
```

### 3. EXE 빌드
```bash
npm run tauri build
# 결과: src-tauri/target/release/cti-task-master.exe
```

## ⚙️ 핵심 코드

### tauri.conf.json
```json
{
  "app": {
    "windows": [
      {
        "title": "CTI Task Master",
        "width": 400,
        "height": 80,
        "resizable": false,
        "alwaysOnTop": true,
        "decorations": false,
        "skipTaskbar": true,
        "center": true
      }
    ]
  }
}
```

### App.tsx (완전한 코드)
```tsx
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState<'대기중' | '통화중' | '후처리'>('대기중');
  const [time, setTime] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString());
    
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextStatus = () => {
    setStatus(prev => {
      if (prev === '대기중') return '통화중';
      if (prev === '통화중') return '후처리';
      return '대기중';
    });
    
    if (status === '후처리') {
      setTaskCount(prev => prev + 1);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case '대기중': return 'status-waiting';
      case '통화중': return 'status-calling';
      case '후처리': return 'status-processing';
      default: return 'status-default';
    }
  };

  if (!mounted) return null;

  return (
    <main className="task-master">
      <div className="drag-area"></div>
      <button className="close-btn">×</button>
      
      <div className="content">
        <div className="left-section">
          <h1 className="title">CTI Task Master</h1>
          <div className="time">{time}</div>
        </div>
        
        <div className="center-section">
          <div 
            className={`status ${getStatusColor()}`}
            onClick={nextStatus}
          >
            {status}
          </div>
        </div>
        
        <div className="right-section">
          <div className="counter">처리 완료: {taskCount}건</div>
        </div>
      </div>
    </main>
  );
}

export default App;
```

### App.css (완전한 코드)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  color: #ffffff;
  background-color: #1a1a1a;
}

body, html {
  height: 100%;
  overflow: hidden;
}

#root {
  height: 100vh;
  width: 100vw;
}

.task-master {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 6px;
  border: 1px solid #444;
  padding: 0 15px;
}

.drag-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 25px;
  height: 100%;
  -webkit-app-region: drag;
  cursor: move;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: all 0.2s ease;
  -webkit-app-region: no-drag;
  z-index: 10;
}

.close-btn:hover {
  background: #ff4444;
  color: white;
}

.content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  width: 100%;
  -webkit-app-region: no-drag;
}

.left-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 2px;
}

.time {
  font-size: 10px;
  color: #cccccc;
}

.center-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.status {
  padding: 6px 20px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  min-width: 80px;
  text-align: center;
}

.status:hover {
  transform: scale(1.05);
}

.status:active {
  transform: scale(0.95);
}

.status-waiting {
  background: #2196F3;
  color: white;
}

.status-waiting:hover {
  background: #1976D2;
}

.status-calling {
  background: #f44336;
  color: white;
}

.status-calling:hover {
  background: #d32f2f;
}

.status-processing {
  background: #ff9800;
  color: white;
}

.status-processing:hover {
  background: #f57c00;
}

.status-default {
  background: #666;
  color: white;
}

.right-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.counter {
  font-size: 10px;
  color: #999;
  text-align: right;
}
```

## 🔗 Spring Boot 연동

### 1. 프로세스 실행 (간단)
```java
@PostMapping("/launch-task-master")
public ResponseEntity<String> launchTaskMaster() {
    ProcessBuilder pb = new ProcessBuilder("C:/path/to/cti-task-master.exe");
    pb.start();
    return ResponseEntity.ok("Launched");
}
```

### 2. 실시간 상태 연동 (SSE)
```java
// Spring Boot - SSE 스트림
@GetMapping(value = "/api/task/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamTaskStatus() {
    SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
    // Redis Pub/Sub로 실시간 데이터 전송
    return emitter;
}
```

```tsx
// Tauri App - SSE 수신
useEffect(() => {
    const eventSource = new EventSource('https://your-ec2.com/api/task/stream');
    
    eventSource.onmessage = (event) => {
        const realtimeData = JSON.parse(event.data);
        setRealTimeStats(realtimeData);
    };
    
    return () => eventSource.close();
}, []);
```

## 🎯 배포 아키텍처

```
상담사 PC                     EC2 서버
┌─────────────┐              ┌─────────────┐
│ JSP Web     │←─ HTTPS ────→│ Spring Boot │
│ Tauri App   │              │ + Redis     │
│ (.exe)      │              │ + Database  │
└─────────────┘              └─────────────┘
```

## 📋 .gitignore
```
node_modules
dist
*.local
src-tauri/target/
src-tauri/Cargo.lock
```

## 🚀 Tauri vs Electron
| 특징 | Tauri | Electron |
|------|-------|----------|
| **크기** | ~10MB | ~150MB |
| **메모리** | ~30MB | ~100MB |
| **빌드** | 간단 | 복잡 |
| **속도** | 빠름 | 느림 |