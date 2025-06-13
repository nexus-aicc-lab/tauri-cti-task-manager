# CTI Task Master (Tauri Version)

Tauri + Vite + React로 만든 가로 막대바 형태의 CTI 업무용 상태창 애플리케이션

## 📋 프로젝트 개요

- **프로젝트명**: CTI Task Master (Tauri)
- **기술 스택**: Tauri, Vite, React, TypeScript
- **UI 형태**: 가로 막대바 (400x80)
- **기능**: 상태 관리(대기중/통화중/후처리), 실시간 시계, 처리 건수 카운트
- **특징**: 항상 맨 위에 표시, 드래그로 이동 가능, 프레임리스 창

## 🚀 프로젝트 설정

### 1. Tauri 프로젝트 생성

```bash
# Tauri 프로젝트 생성
npm create tauri-app@latest

# 설정 선택
✔ Project name: › cti-task-manager-tauri
✔ Choose which language to use for your frontend › TypeScript / JavaScript
✔ Choose your package manager › npm
✔ Choose your UI template › React
✔ Choose your UI flavor › TypeScript
```

### 2. 프로젝트 구조

```
cti-task-manager-tauri/
├── src/
│   ├── App.tsx              # 메인 React 컴포넌트
│   ├── App.css              # 스타일시트
│   └── main.tsx             # React 엔트리포인트
├── src-tauri/
│   ├── src/
│   │   └── main.rs          # Rust 메인 파일
│   ├── tauri.conf.json      # Tauri 설정
│   └── Cargo.toml           # Rust 의존성
├── package.json
└── README.md
```

## ⚙️ 주요 설정 파일

### tauri.conf.json (가로 막대바 설정)

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "CTI Task Master",
  "version": "0.1.0",
  "identifier": "com.cti-task-master.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
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
    ],
    "security": {
      "csp": null
    }
  }
}
```

### App.tsx (메인 컴포넌트)

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

## 🎨 주요 기능

### 상태 관리
- **대기중** (파란색): 초기 상태
- **통화중** (빨간색): 통화 진행 중
- **후처리** (노란색): 통화 후 업무 처리
- 상태 클릭으로 순환 변경 가능

### UI 특징
- **가로 막대바 형태** (400x80 픽셀)
- **실시간 시계** 표시
- **처리 완료 건수** 카운트
- **드래그로 창 이동** 가능
- **오른쪽 상단 닫기 버튼**
- **항상 화면 최상단**에 표시
- **프레임리스 창**

## 🔧 개발 및 빌드

### 개발 모드 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run tauri dev
```

### 프로덕션 빌드

```bash
# EXE 파일 빌드
npm run tauri build
```

**빌드 결과물 위치:**
```
src-tauri/target/release/
├── cti-task-master.exe          # 실행 파일
└── bundle/
    ├── msi/                     # Windows 설치 파일
    └── nsis/                    # NSIS 설치 파일
```

## 🔗 Spring Boot 연동 방법

### 방법 1: 프로세스 실행
```java
@RestController
public class TaskMasterController {
    
    @PostMapping("/launch-task-master")
    public ResponseEntity<String> launchTaskMaster() {
        try {
            String exePath = "C:/path/to/cti-task-master.exe";
            ProcessBuilder pb = new ProcessBuilder(exePath);
            pb.start();
            return ResponseEntity.ok("Task Master launched");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Launch failed");
        }
    }
}
```

### 방법 2: REST API 연동
```javascript
// Tauri 앱에서 Spring Boot로 상태 전송
const sendStatusToServer = async (status) => {
    try {
        await fetch('http://localhost:8080/api/task-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, timestamp: new Date() })
        });
    } catch (error) {
        console.error('Status update failed:', error);
    }
};
```

### 방법 3: WebSocket 실시간 연동
```java
@Component
public class TaskMasterWebSocketHandler extends TextWebSocketHandler {
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // Tauri 앱에서 실시간 상태 수신
        String status = message.getPayload();
        updateTaskStatus(status);
    }
}
```

## 🚀 Tauri vs Electron 비교

| 특징 | Tauri | Electron |
|------|-------|----------|
| **번들 크기** | ~10-15MB | ~150MB |
| **메모리 사용량** | ~20-50MB | ~100-200MB |
| **빌드 속도** | 빠름 (Vite) | 느림 (Webpack) |
| **개발 경험** | 매우 좋음 | 복잡함 |
| **정적 파일 문제** | 없음 | 자주 발생 |
| **보안** | 우수 | 보통 |

## 📁 파일 구조

```
cti-task-manager-tauri/
├── dist/                        # Vite 빌드 결과
├── src/
│   ├── App.tsx                  # 메인 컴포넌트
│   ├── App.css                  # 스타일시트
│   └── main.tsx                 # React 엔트리
├── src-tauri/
│   ├── src/main.rs              # Rust 백엔드
│   ├── tauri.conf.json          # Tauri 설정
│   └── target/release/          # 빌드 결과물
│       └── cti-task-master.exe  # 실행 파일
├── package.json
└── README.md
```

## 🎯 실행 방법

### 개발 모드
1. `npm install` - 의존성 설치
2. `npm run tauri dev` - 개발 서버 실행

### 프로덕션 빌드
1. `npm run tauri build` - EXE 파일 생성
2. `src-tauri/target/release/cti-task-master.exe` 실행

## 📝 주요 특징

- ✅ **즉시 실행**: 개발 모드에서도 네이티브 앱으로 실행
- ✅ **빠른 빌드**: Vite 기반으로 초고속 개발
- ✅ **작은 크기**: Electron 대비 1/10 크기
- ✅ **안정적**: 정적 파일 로딩 문제 없음
- ✅ **실시간 반영**: 코드 변경 시 즉시 반영
- ✅ **간단한 설정**: 복잡한 설정 파일 불필요

## 🔧 문제 해결

### 빌드 시간 단축
- 첫 빌드는 Rust 컴파일로 시간이 걸림
- 두 번째부터는 빠른 증분 빌드

### Windows Defender 경고
- 새로운 실행 파일 경고 정상
- "자세히 보기" → "실행" 선택

## 📜 라이센스

개인/회사 프로젝트용