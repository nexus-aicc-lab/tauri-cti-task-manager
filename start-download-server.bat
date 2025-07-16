@echo off
title CTI Task Master Download Server
echo.
echo ================================================
echo   CTI Task Master 다운로드 서버
echo ================================================
echo.

REM 현재 디렉토리를 스크립트 위치로 변경
cd /d "%~dp0"

REM 설치 파일 존재 확인
set SETUP_FILE="src-tauri\target\release\bundle\nsis\CTI Task Master_07151050.exe"
if not exist %SETUP_FILE% (
    echo ❌ 설치 파일을 찾을 수 없습니다!
    echo 📁 경로: %SETUP_FILE%
    echo.
    echo 빌드를 먼저 실행하세요:
    echo   npm run tauri build
    echo.
    pause
    exit /b 1
)

REM 파일 정보 표시
echo ✅ 설치 파일이 준비되었습니다!
echo 📦 파일: CTI Task Master_07151050.exe
for %%A in (%SETUP_FILE%) do echo 💾 크기: %%~zA bytes
echo.

REM Python 버전 확인
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python이 설치되어 있지 않습니다!
    echo 🔗 Python 다운로드: https://python.org/downloads
    echo.
    pause
    exit /b 1
)

echo 🐍 Python 확인 완료
python --version

REM 서버 시작
echo.
echo 🚀 다운로드 서버를 시작합니다...
echo 📍 주소: http://localhost:8000
echo 🛑 서버 중지: Ctrl+C
echo.
echo ================================================
echo.

REM Python 서버 실행
python download-server.py

REM 서버 종료 시 메시지
echo.
echo 🛑 서버가 중지되었습니다.
pause
