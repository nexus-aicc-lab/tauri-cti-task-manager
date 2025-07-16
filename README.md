<<<<<<< HEAD
# CTI Task Manager

> 🚀 **Tauri + React + FSD**로 구축된 현대적인 멀티윈도우 CTI 시스템

[![Tauri](https://img.shields.io/badge/Tauri-2.0-orange?logo=tauri)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

## ✨ 핵심 특징

- **🏢 멀티윈도우 아키텍처**: 각 윈도우가 독립적인 앱으로 동작 (Frontend MSA)
- **📐 FSD 구조**: Feature-Sliced Design으로 체계적인 코드 관리
- **⚡ 네이티브 성능**: Tauri 기반으로 웹 기술 + 데스크톱 파워
- **🔄 이벤트 기반 통신**: 윈도우간 안정적인 상태 동기화
- **🌐 딥링크 지원**: 웹 애플리케이션과의 원활한 연동

## 🖥️ 윈도우 모드

| 윈도우 | 용도 | 크기 | 특징 |
|--------|------|------|------|
| **🚀 Launcher** | 앱 시작 및 선택 | 500×600 | 딥링크 히스토리, 모드 전환 |
| **💼 Panel** | 메인 작업 공간 | 1200×800 | CTI 통화 관리, 고객 정보 |
| **📊 Bar** | 최소화 상태바 | 1100×40 | 실시간 상태 모니터링 |
| **⚙️ Settings** | 환경 설정 | 600×500 | 시스템 설정 관리 |
| **🔐 Login** | 사용자 인증 | 500×600 | 보안 인증 처리 |

## 🏗️ 아키텍처

### **Frontend MSA + FSD**
```
src/windows/          # 🏢 각 윈도우 = 독립 앱
├── launcher/         # 🚀 런처 앱
├── panel/           # 💼 CTI 메인 앱  
├── bar/             # 📊 상태바 앱
├── settings/        # ⚙️ 설정 앱
└── login/           # 🔐 인증 앱

각 윈도우 내부:
├── app/             # 앱 설정
├── pages/           # 화면들
├── widgets/         # 복합 위젯
├── features/        # 사용자 기능
├── entities/        # 비즈니스 엔티티
└── shared/          # 윈도우 전용 공통
```

### **Backend (Rust)**
```
src-tauri/src/
├── main.rs          # 메인 진입점
├── windows.rs       # 윈도우 관리 (핵심)
├── events.rs        # 이벤트 시스템 (핵심)
├── deeplink.rs      # 딥링크 처리
└── commands/        # Frontend ↔ Backend 통신
```

## 🚀 설치 및 실행

### 요구사항
- Node.js 18+
- Rust 1.70+
- Tauri CLI 2.0+

### 개발 환경
```bash
# 프로젝트 클론
git clone <repository-url>
cd cti-task-manager-tauri

# 의존성 설치
npm install

# 개발 서버 실행
npm run tauri dev
```

### 빌드
```bash
# 프로덕션 빌드
npm run tauri build
```

## 🛠️ 기술 스택

**Frontend**
- React 18 + TypeScript
- Tailwind CSS
- Zustand (상태 관리)
- Tauri API

**Backend** 
- Rust + Tauri 2.0
- Serde (직렬화)
- 네이티브 시스템 API

**Development**
- Vite (번들러)
- FSD (아키텍처)

## 🔗 딥링크 지원

```bash
# 런처 열기
cti-personal://launcher

# 설정의 특정 탭 열기  
cti-personal://settings/panel
cti-personal://settings/call

# 로그인 페이지 열기
cti-personal://login
```

## 🎯 주요 기능

- **멀티윈도우 전환**: 런처에서 원클릭으로 모드 변경
- **실시간 상태 동기화**: 윈도우간 이벤트 기반 통신
- **딥링크 처리**: 웹에서 특정 기능 직접 실행
- **네이티브 통합**: 시스템 트레이, 파일 접근, DB 직접 연결
- **개인화 설정**: 테마, 레이아웃, 시작 모드 등

## 👨‍💻 개발 가이드

### 새 윈도우 추가
```bash
# 1. 윈도우 폴더 생성
mkdir src/windows/new-window

# 2. FSD 구조 생성  
mkdir -p src/windows/new-window/{app,pages,widgets,features,entities,shared}

# 3. Rust에서 윈도우 모드 추가
# src-tauri/src/windows.rs에 WindowMode::NewWindow 추가
```

### 윈도우간 통신
```typescript
// 이벤트 발송
await emit('custom-event', data);

// 이벤트 수신  
listen('custom-event', (event) => {
  console.log(event.payload);
});
```

### 상태 관리
```typescript
// 윈도우 내부 상태 (Zustand)
const useLocalStore = create((set) => ({
  data: null,
  setData: (data) => set({ data })
}));

// 윈도우간 공유 상태 (Tauri Events)
await emit('global-state-update', newState);
```

## 📁 핵심 파일 구조

```
├── src/
│   ├── windows/                 # 각 윈도우 앱들
│   └── shared/                  # 전역 공통 모듈
├── src-tauri/
│   ├── src/
│   │   ├── windows.rs          # 윈도우 관리  
│   │   ├── events.rs           # 이벤트 시스템
│   │   └── main.rs             # 메인 진입점
│   └── tauri.conf.json         # Tauri 설정
├── *.html                      # 각 윈도우 진입점들
└── vite.config.ts              # Vite 설정
```

## 🤝 기여하기

1. Fork 후 feature 브랜치 생성
2. FSD 구조 준수하여 개발
3. 커밋 메시지 규칙 준수 (`feat:`, `fix:`, `refactor:` 등)
4. Pull Request 생성

---

**Frontend MSA + FSD 아키텍처로 구축된 차세대 CTI 시스템** 🚀
=======
# personalTool



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin http://121.170.212.213/lab09/personaltool.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](http://121.170.212.213/lab09/personaltool/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Automatically merge when pipeline succeeds](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing(SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thank you to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README
Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> gitlab/main
