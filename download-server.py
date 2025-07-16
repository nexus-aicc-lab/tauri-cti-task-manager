#!/usr/bin/env python3
"""
CTI Task Master 다운로드 서버
로컬에서 실행하여 설치 파일을 제공합니다.
"""

import os
import sys
import http.server
import socketserver
import urllib.parse
import mimetypes
from pathlib import Path

# 설정
PORT = 8000
SETUP_FILE_PATH = r"C:\tauri\cti-task-pilot2\src-tauri\target\release\bundle\nsis\CTI Task Master_07151050.exe"
SETUP_FILE_NAME = "CTI_Task_Master_Setup.exe"

class DownloadHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(SETUP_FILE_PATH), **kwargs)
    
    def do_GET(self):
        """GET 요청 처리"""
        parsed_path = urllib.parse.urlparse(self.path)
        
        # 루트 경로 요청 시 HTML 페이지 제공
        if parsed_path.path == '/':
            self.serve_download_page()
            return
        
        # 다운로드 요청 처리
        if parsed_path.path == '/download':
            self.serve_download_file()
            return
        
        # 파일 요청 처리
        if parsed_path.path.endswith('.exe'):
            self.serve_download_file()
            return
        
        # 기본 처리
        super().do_GET()
    
    def serve_download_page(self):
        """다운로드 페이지 제공"""
        file_exists = os.path.exists(SETUP_FILE_PATH)
        file_size = os.path.getsize(SETUP_FILE_PATH) if file_exists else 0
        file_size_mb = file_size / (1024 * 1024)
        
        html_content = f"""
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CTI Task Master - 다운로드</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }}
        .container {{
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }}
        .logo {{
            font-size: 3rem;
            margin-bottom: 20px;
        }}
        .title {{
            color: #333;
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 30px;
        }}
        .file-info {{
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: left;
        }}
        .file-info h3 {{
            color: #333;
            margin-bottom: 15px;
        }}
        .file-info p {{
            color: #666;
            margin-bottom: 8px;
        }}
        .btn {{
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            margin: 10px;
            transition: all 0.3s;
        }}
        .btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }}
        .btn-success {{
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        }}
        .status {{
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-weight: 500;
        }}
        .status.success {{
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }}
        .status.error {{
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">📦</div>
        <h1 class="title">CTI Task Master</h1>
        
        {"<div class='status success'>✅ 파일이 준비되었습니다!</div>" if file_exists else "<div class='status error'>❌ 파일을 찾을 수 없습니다.</div>"}
        
        <div class="file-info">
            <h3>📋 파일 정보</h3>
            <p><strong>파일명:</strong> {SETUP_FILE_NAME}</p>
            <p><strong>크기:</strong> {file_size_mb:.1f} MB</p>
            <p><strong>경로:</strong> {SETUP_FILE_PATH}</p>
            <p><strong>상태:</strong> {"✅ 준비됨" if file_exists else "❌ 파일 없음"}</p>
        </div>
        
        {"<a href='/download' class='btn btn-success'>📥 다운로드 시작</a>" if file_exists else ""}
        <a href='http://localhost:{PORT}/app-launcher-advanced.html' class='btn'>🎯 웹 런처 열기</a>
        
        <div style="margin-top: 30px; padding: 20px; background: #e9ecef; border-radius: 10px; text-align: left;">
            <h4>📝 사용 방법</h4>
            <ol>
                <li>위의 "다운로드 시작" 버튼을 클릭하여 설치 파일을 다운로드합니다.</li>
                <li>다운로드된 파일을 실행하여 프로그램을 설치합니다.</li>
                <li>"웹 런처 열기" 버튼을 클릭하여 로그인 페이지로 이동합니다.</li>
                <li>로그인 정보를 입력하고 프로그램을 실행합니다.</li>
            </ol>
        </div>
    </div>
</body>
</html>
        """
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))
    
    def serve_download_file(self):
        """설치 파일 다운로드 제공"""
        if not os.path.exists(SETUP_FILE_PATH):
            self.send_error(404, "설치 파일을 찾을 수 없습니다.")
            return
        
        # 파일 크기 확인
        file_size = os.path.getsize(SETUP_FILE_PATH)
        
        # 헤더 설정
        self.send_response(200)
        self.send_header('Content-Type', 'application/octet-stream')
        self.send_header('Content-Disposition', f'attachment; filename="{SETUP_FILE_NAME}"')
        self.send_header('Content-Length', str(file_size))
        self.end_headers()
        
        # 파일 전송
        with open(SETUP_FILE_PATH, 'rb') as f:
            while True:
                chunk = f.read(8192)
                if not chunk:
                    break
                self.wfile.write(chunk)
        
        print(f"📥 파일 다운로드 완료: {SETUP_FILE_NAME}")

def main():
    """메인 함수"""
    # 파일 존재 확인
    if not os.path.exists(SETUP_FILE_PATH):
        print(f"❌ 설치 파일을 찾을 수 없습니다: {SETUP_FILE_PATH}")
        print("빌드를 먼저 실행하여 설치 파일을 생성하세요.")
        return
    
    # 서버 시작
    try:
        with socketserver.TCPServer(("", PORT), DownloadHandler) as httpd:
            print(f"🚀 CTI Task Master 다운로드 서버 시작")
            print(f"📍 주소: http://localhost:{PORT}")
            print(f"📦 파일: {SETUP_FILE_NAME}")
            print(f"💾 크기: {os.path.getsize(SETUP_FILE_PATH) / (1024*1024):.1f} MB")
            print(f"🔗 다운로드: http://localhost:{PORT}/download")
            print("🛑 서버 중지: Ctrl+C")
            print("-" * 50)
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 서버가 중지되었습니다.")
    except Exception as e:
        print(f"❌ 서버 오류: {e}")

if __name__ == "__main__":
    main()
