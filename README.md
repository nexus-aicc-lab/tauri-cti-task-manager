# 🚀 CTI Task Master

> Tauri + Vite + React 기반의 데스크탑 업무 상태바 애플리케이션
상담사 개인 상태 표시, 실시간 시간 및 완료 건수를 제공


## 📦 기술 스택

- **프레임워크**: Tauri, Vite, React
- **스타일링**: Tailwind CSS, ShadCN UI
- **상태 관리**: Zustand
- **라우팅**: TanStack Router
- **저장 방식**: File System 기반 로컬 설정 저장



## 🚀 설치 및 실행


### 1. 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run tauri dev
```


### 2. 배포용 빌드

```bash
# EXE 파일 빌드
npm run tauri build

# 빌드 결과 위치: src-tauri/target/release/cti-task-master.exe
```


## 📜 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Vite 개발 서버 실행 (웹 전용) |
| `npm run start` | Tauri 앱 개발 모드 실행 (Vite + Tauri) |
| `npm run build` | TypeScript 타입 검사 후 Vite 빌드 |
| `npm run preview` | Vite 빌드 결과 확인 서버 실행 |
| `npm run tauri` | Tauri CLI 실행용 (예: `npm run tauri build`) |


## ✅ 완료된 기능

- [x] Tauri + Vite + TailwindCSS + ShadCN UI 개발 환경 구축
- [x] 기본 네이티브 메뉴 및 다이얼로그 팝업 테스트 완료
- [x] FSD 기반 폴더 구조 설계 및 Zustand 스토어 셋업
- [x] TanStack Router 기반 페이지 라우터 구성
- [x] 사용자 바/패널 모드 설정 → 로컬 파일 시스템 저장 기능 구현


## 🔧 TODO 리스트

- [ ] 상담사 실시간 데이터 polling 테스트 (TanStack Query, REST or Redis 연동)
- [ ] 웹 로그인 후 개인화 툴 자동 실행 연계
- [ ] 배포 및 설치 자동화 프로세스 구축 (예: .msi or .exe)
- [ ] 전체 UI 메뉴 시스템 구성 및 파일 기반 설정 저장
- [ ] 기타 고도화 작업 (테마, 다국어 등)


## 📁 폴더 구조 (FSD)

```
src/
├── app/          # 애플리케이션 설정 및 초기화
├── pages/        # 페이지 컴포넌트
├── widgets/      # 독립적인 UI 블록
├── features/     # 비즈니스 로직 기능
├── entities/     # 비즈니스 엔티티
└── shared/       # 공통 리소스
    ├── lib/      # 유틸리티 함수
    ├── store/    # Zustand 상태 관리
    └── config/   # 설정 관련
```


## 🔗 참고 자료

| 주제 | 링크 |
|------|------|
| 📘 Tauri 공식문서 | [https://v2.tauri.app/](https://v2.tauri.app/) |
| ⚡ Vite 가이드 | [https://ko.vite.dev/guide/](https://ko.vite.dev/guide/) |
| 🧠 React 공식문서 | [https://ko.react.dev/learn](https://ko.react.dev/learn) |
| 🐻 Zustand | [https://zustand-demo.pmnd.rs/](https://zustand-demo.pmnd.rs/) |
| 🧭 TanStack Router | [https://tanstack.com/router/latest](https://tanstack.com/router/latest) |


## 🔍 Tauri vs Electron 비교

| 항목 | Tauri | Electron |
|------|-------|----------|
| 앱 크기 | ✅ 작음 (~10MB) | ❌ 큼 (~150MB) |
| 메모리 사용량 | ✅ 낮음 (~30MB) | ❌ 높음 (~100MB) |
| 빌드 속도 | ✅ 빠름 | ❌ 느림 |
| 성능 | ✅ 네이티브 성능 | ❌ 웹 뷰 기반 |

