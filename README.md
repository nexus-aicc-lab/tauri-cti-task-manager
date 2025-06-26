# CTI Task Manager

> 🚀 Tauri + React + TypeScript로 구축된 현대적인 CTI(Computer Telephony Integration) 작업 관리 시스템

[![GitHub](https://img.shields.io/badge/GitHub-nexus--aicc--lab%2Ftauri--cti--task--manager-blue?logo=github)](https://github.com/nexus-aicc-lab/tauri-cti-task-manager)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-orange?logo=tauri)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

## 📋 목차

- [개요](#-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)
- [빌드 및 배포](#-빌드-및-배포)
- [개발 가이드](#-개발-가이드)
- [설정 파일](#-설정-파일)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## 🎯 개요

CTI Task Manager는 콜센터 및 고객 서비스 환경에서 사용되는 통합 작업 관리 시스템입니다. 다양한 UI 모드를 지원하여 사용자의 작업 환경에 최적화된 인터페이스를 제공합니다.

### ✨ 핵심 특징

- **🔄 다중 모드 지원**: 런처, 바, 패널 모드로 다양한 작업 환경 대응
- **🎨 모던 UI/UX**: React + Tailwind CSS 기반의 직관적이고 반응형 인터페이스
- **⚡ 고성능**: Tauri 프레임워크로 네이티브 수준의 성능
- **🔧 유연한 설정**: 시스템 환경 설정을 통한 개인화 지원
- **🌐 딥링크 지원**: 웹 애플리케이션과의 원활한 연동

## 🚀 주요 기능

### 🖥️ 다중 창 모드

| 모드 | 설명 | 크기 | 용도 |
|------|------|------|------|
| **런처** | 메인 시작 화면 | 500×600 | 모드 선택 및 설정 |
| **바 모드** | 작업 표시줄 형태 | 1100×40 | 상시 모니터링 |
| **패널 모드** | 전체 관리 화면 | 1200×800 | 상세 작업 관리 |
| **로그인** | 사용자 인증 | 500×600 | 보안 인증 |
| **환경설정** | 시스템 설정 | 600×500 | 개인화 설정 |

### 📊 실시간 모니터링

- **통화 상태 추적**: 대기, 통화, 후처리, 휴식 시간 실시간 표시
- **작업 통계**: 처리 건수, 효율성, 오류율 등 성과 지표 제공
- **시각적 대시보드**: 직관적인 차트와 그래프로 데이터 시각화

### 🛠️ 고급 기능

- **딥링크 처리**: `cti-personal://` 스키마를 통한 웹 연동
- **네이티브 메뉴**: 시스템 통합 컨텍스트 메뉴 지원
- **창 관리**: 항상 위, 최소화, 최대화 등 윈도우 제어
- **드래그 앤 드롭**: 사용자 친화적인 인터페이스 조작

## 🛠️ 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스 구성
- **TypeScript** - 타입 안전성과 개발 생산성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Lucide React** - 현대적인 아이콘 라이브러리
- **React Toastify** - 사용자 알림 시스템

### Backend
- **Tauri 2.0** - 크로스 플랫폼 데스크톱 애플리케이션 프레임워크
- **Rust** - 시스템 프로그래밍 언어
- **Serde** - 직렬화/역직렬화 라이브러리

### Development Tools
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅

## 📁 프로젝트 구조

```
tauri-cti-task-manager/
├── src/                          # React 프론트엔드
│   ├── app/                      # 페이지 컴포넌트
│   │   ├── launcher/             # 런처 모드
│   │   ├── bar-mode/            # 바 모드
│   │   ├── panel-mode/          # 패널 모드
│   │   └── system-setting-window/ # 시스템 설정
│   ├── widgets/                  # 재사용 가능한 위젯
│   │   └── titlebar/            # 타이틀바 컴포넌트
│   ├── shared/                   # 공통 모듈
│   │   ├── store/               # 상태 관리
│   │   └── lib/                 # 유틸리티 함수
│   └── App.tsx                   # 메인 애플리케이션
├── src-tauri/                    # Tauri 백엔드
│   ├── src/
│   │   ├── main.rs              # 메인 엔트리포인트
│   │   └── windows.rs           # 윈도우 관리 로직
│   ├── tauri.conf.json          # Tauri 설정
│   └── capabilities/            # 권한 설정
│       └── default.json
├── public/                       # 정적 자원
└── package.json                  # 프로젝트 의존성
```

## 🚀 설치 및 실행

### 시스템 요구사항

- **Node.js** 18 이상
- **Rust** 1.70 이상
- **Tauri CLI** 2.0 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/nexus-aicc-lab/tauri-cti-task-manager.git
cd tauri-cti-task-manager

# 의존성 설치
npm install

# Tauri CLI 설치 (전역)
npm install -g @tauri-apps/cli@next
```

### 개발 서버 실행

```bash
# 개발 모드 실행
npm run tauri dev

# 또는
tauri dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run tauri build

# 또는
tauri build
```

## 🔧 빌드 및 배포

### Windows

```bash
# Windows용 빌드
tauri build --target x86_64-pc-windows-msvc

# 설치 파일 생성 위치
# src-tauri/target/release/bundle/msi/
```

### macOS

```bash
# macOS용 빌드
tauri build --target x86_64-apple-darwin

# ARM Mac용 빌드
tauri build --target aarch64-apple-darwin
```

### Linux

```bash
# Linux용 빌드
tauri build --target x86_64-unknown-linux-gnu
```

## 👨‍💻 개발 가이드

### 개발 서버 시작

1. **프론트엔드 개발 서버**:
   ```bash
   npm run dev
   ```

2. **Tauri 개발 모드**:
   ```bash
   npm run tauri dev
   ```

### 새로운 기능 추가

1. **새 페이지 추가**:
   ```typescript
   // src/app/new-feature/index.tsx
   export default function NewFeature() {
     return <div>새로운 기능</div>;
   }
   ```

2. **라우팅 설정**:
   ```typescript
   // src/App.tsx에서 새 모드 추가
   type Mode = 'launcher' | 'bar' | 'panel' | 'new-feature';
   ```

3. **윈도우 설정**:
   ```rust
   // src-tauri/src/windows.rs에서 설정 추가
   WindowMode::NewFeature => WindowConfig { /* 설정 */ }
   ```

### 상태 관리

```typescript
// Zustand 스토어 사용 예시
import { useCTIStore } from '@/shared/store/useCTIStore';

const MyComponent = () => {
  const status = useCTIStore(state => state.status);
  const setStatus = useCTIStore(state => state.setStatus);
  
  return <div>{status}</div>;
};
```

## ⚙️ 설정 파일

### 주요 설정 파일들

| 파일 | 용도 | 설명 |
|------|------|------|
| `src-tauri/tauri.conf.json` | 기본 윈도우 설정 | Tauri 애플리케이션 기본 구성 |
| `src-tauri/src/windows.rs` | 다양한 윈도우 설정 | 모드별 윈도우 속성 정의 |
| `src-tauri/capabilities/default.json` | 네이티브 권한 설정 | 시스템 권한 및 보안 설정 |
| `src-tauri/src/main.rs` | 네이티브 함수 | Rust 백엔드 로직 |
| `src/App.tsx` | 기본 라우터 설정 | React 라우팅 및 모드 관리 |

### 환경 변수

```bash
# .env.local 파일 생성
VITE_API_URL=https://api.example.com
VITE_APP_VERSION=1.0.0
```

## 🤝 기여하기

### 기여 프로세스

1. **Fork** 후 개발 브랜치 생성
2. **기능 구현** 및 테스트
3. **커밋 메시지** 규칙 준수
4. **Pull Request** 생성

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 도구 등 수정
```

### 코딩 스타일

- **TypeScript**: strict 모드 사용
- **React**: 함수형 컴포넌트 + Hooks
- **CSS**: Tailwind CSS 유틸리티 클래스 우선
- **Rust**: rustfmt 및 clippy 권장사항 준수

## 📄 라이선스

본 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

## 🔗 관련 링크

- **GitHub**: [nexus-aicc-lab/tauri-cti-task-manager](https://github.com/nexus-aicc-lab/tauri-cti-task-manager)
- **Tauri 공식 문서**: [tauri.app](https://tauri.app/)
- **React 공식 문서**: [reactjs.org](https://reactjs.org/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com/)

## 📞 지원 및 문의

- **Issues**: [GitHub Issues](https://github.com/nexus-aicc-lab/tauri-cti-task-manager/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nexus-aicc-lab/tauri-cti-task-manager/discussions)

---

<p align="center">
  <strong>Made with ❤️ by NEXUS AICC Lab</strong>
</p>