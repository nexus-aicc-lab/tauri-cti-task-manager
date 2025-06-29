// C:\tauri\cti-task-manager-tauri\src-tauri\src\commands\panel.rs

use serde::{Deserialize, Serialize};
use std::{env, fs, path::PathBuf};
use tauri::{Manager, PhysicalSize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct WindowSize {
    pub width: f64,
    pub height: f64,
}

impl Default for WindowSize {
    fn default() -> Self {
        Self {
            width: 1000.0,
            height: 500.0,
        }
    }
}

/// 윈도우 크기 설정 파일 경로
fn get_window_config_path() -> Result<PathBuf, String> {
    let base_dir = if cfg!(target_os = "windows") {
        env::var("APPDATA")
    } else if cfg!(target_os = "macos") {
        env::var("HOME").map(|home| format!("{}/Library/Application Support", home))
    } else {
        env::var("HOME").map(|home| format!("{}/.config", home))
    }
    .map_err(|_| "사용자 디렉토리를 찾을 수 없습니다".to_string())?;

    let config_dir = PathBuf::from(base_dir).join("cti-task-master");
    fs::create_dir_all(&config_dir).map_err(|e| format!("설정 디렉토리 생성 실패: {}", e))?;

    Ok(config_dir.join("window_size.json"))
}

/// 윈도우 크기 저장
#[tauri::command]
pub async fn save_window_size(width: f64, height: f64) -> Result<(), String> {
    let size = WindowSize { width, height };
    let path = get_window_config_path()?;
    let json =
        serde_json::to_string_pretty(&size).map_err(|e| format!("JSON 직렬화 실패: {}", e))?;

    fs::write(&path, json).map_err(|e| format!("파일 저장 실패: {}", e))?;

    println!("💾 윈도우 크기 저장: {}x{}", width, height);
    Ok(())
}

/// 윈도우 크기 불러오기
#[tauri::command]
pub async fn load_window_size() -> Result<WindowSize, String> {
    let path = get_window_config_path()?;

    if path.exists() {
        let content = fs::read_to_string(&path).map_err(|e| format!("파일 읽기 실패: {}", e))?;

        let size: WindowSize = serde_json::from_str(&content).unwrap_or_else(|_| {
            println!("⚠️ 설정 파일 파싱 실패, 기본값 사용");
            WindowSize::default()
        });

        println!("📖 윈도우 크기 로드: {}x{}", size.width, size.height);
        Ok(size)
    } else {
        println!("📄 설정 파일 없음, 기본값 사용");
        let default = WindowSize::default();
        let _ = save_window_size(default.width, default.height).await;
        Ok(default)
    }
}

/// 윈도우 크기 적용
#[tauri::command]
pub async fn apply_window_size(
    app_handle: tauri::AppHandle,
    width: f64,
    height: f64,
) -> Result<(), String> {
    let windows = app_handle.webview_windows();

    // 패널 윈도우 찾기
    let panel_window = windows
        .iter()
        .find(|(label, _)| label.starts_with("panel_"))
        .map(|(_, window)| window);

    if let Some(window) = panel_window {
        let size = PhysicalSize::new(width as u32, height as u32);
        window
            .set_size(tauri::Size::Physical(size))
            .map_err(|e| format!("윈도우 크기 적용 실패: {}", e))?;

        println!("✅ 윈도우 크기 적용: {}x{}", width, height);
        Ok(())
    } else {
        // 패널 윈도우가 없으면 메인 윈도우에 적용
        if let Some(window) = app_handle.get_webview_window("main") {
            let size = PhysicalSize::new(width as u32, height as u32);
            window
                .set_size(tauri::Size::Physical(size))
                .map_err(|e| format!("메인 윈도우 크기 적용 실패: {}", e))?;

            println!("✅ 메인 윈도우 크기 적용: {}x{}", width, height);
            Ok(())
        } else {
            Err("적용할 윈도우를 찾을 수 없습니다".to_string())
        }
    }
}
