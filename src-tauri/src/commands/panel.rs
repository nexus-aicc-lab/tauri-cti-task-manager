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

/// 윈도우 타입별 크기 설정 파일 경로
fn get_window_config_path(window_type: &str) -> Result<PathBuf, String> {
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

    // 윈도우 타입별로 다른 파일명 사용
    let filename = if window_type == "main" {
        "window_size.json".to_string()
    } else {
        format!("window_size_{}.json", window_type)
    };

    Ok(config_dir.join(filename))
}

/// 윈도우 타입별 기본 크기 (windows.rs 반영)
fn get_default_size(window_type: &str) -> WindowSize {
    match window_type {
        "panel-mode" => WindowSize {
            width: 900.0,
            height: 350.0,
        }, // windows.rs 기본값 반영
        "launcher" => WindowSize {
            width: 500.0,
            height: 600.0,
        }, // windows.rs 기본값 반영
        "bar" => WindowSize {
            width: 1200.0,
            height: 40.0,
        }, // windows.rs 기본값 반영
        "settings" => WindowSize {
            width: 900.0,
            height: 700.0,
        }, // windows.rs 기본값 반영
        "login" => WindowSize {
            width: 500.0,
            height: 600.0,
        }, // windows.rs 기본값 반영
        _ => WindowSize::default(), // main 등 기타 (1000x500)
    }
}

/// 윈도우 크기 저장
#[tauri::command]
pub async fn save_window_size(
    width: f64,
    height: f64,
    window_type: Option<String>,
) -> Result<(), String> {
    let window_type = window_type.unwrap_or_else(|| "main".to_string());
    let size = WindowSize { width, height };
    let path = get_window_config_path(&window_type)?;
    let json =
        serde_json::to_string_pretty(&size).map_err(|e| format!("JSON 직렬화 실패: {}", e))?;

    fs::write(&path, json).map_err(|e| format!("파일 저장 실패: {}", e))?;

    println!(
        "💾 윈도우 크기 저장 [{}]: {}x{}",
        window_type, width, height
    );
    Ok(())
}

/// 윈도우 크기 불러오기
#[tauri::command]
pub async fn load_window_size(window_type: Option<String>) -> Result<WindowSize, String> {
    let window_type = window_type.unwrap_or_else(|| "main".to_string());
    let path = get_window_config_path(&window_type)?;

    if path.exists() {
        let content = fs::read_to_string(&path).map_err(|e| format!("파일 읽기 실패: {}", e))?;

        let size: WindowSize = serde_json::from_str(&content).unwrap_or_else(|_| {
            println!("⚠️ 설정 파일 파싱 실패, 기본값 사용");
            get_default_size(&window_type)
        });

        println!(
            "📖 윈도우 크기 로드 [{}]: {}x{}",
            window_type, size.width, size.height
        );
        Ok(size)
    } else {
        println!("📄 설정 파일 없음, 기본값 사용 [{}]", window_type);
        let default = get_default_size(&window_type);
        let _ = save_window_size(default.width, default.height, Some(window_type)).await;
        Ok(default)
    }
}

/// 윈도우 크기 적용
#[tauri::command]
pub async fn apply_window_size(
    app_handle: tauri::AppHandle,
    width: f64,
    height: f64,
    window_type: Option<String>,
) -> Result<(), String> {
    let window_type = window_type.unwrap_or_else(|| "main".to_string());
    let windows = app_handle.webview_windows();

    // 윈도우 타입에 따른 윈도우 찾기
    let target_window = match window_type.as_str() {
        "panel-mode" => {
            // panel_ 로 시작하는 윈도우 찾기
            windows
                .into_iter()
                .find(|(label, _)| label.starts_with("panel_"))
                .map(|(_, window)| window.clone())
        }
        "main" => app_handle.get_webview_window("main"),
        "launcher" => windows
            .into_iter()
            .find(|(label, _)| label.starts_with("launcher_"))
            .map(|(_, window)| window.clone())
            .or_else(|| app_handle.get_webview_window("launcher")),
        "bar" => windows
            .into_iter()
            .find(|(label, _)| label.starts_with("bar_"))
            .map(|(_, window)| window.clone())
            .or_else(|| app_handle.get_webview_window("bar")),
        "settings" => windows
            .into_iter()
            .find(|(label, _)| label.starts_with("settings_"))
            .map(|(_, window)| window.clone())
            .or_else(|| app_handle.get_webview_window("settings")),
        "login" => windows
            .into_iter()
            .find(|(label, _)| label.starts_with("login_"))
            .map(|(_, window)| window.clone())
            .or_else(|| app_handle.get_webview_window("login")),
        _ => {
            // 기타 윈도우 타입인 경우 정확한 라벨로 찾기
            app_handle.get_webview_window(&window_type)
        }
    };

    if let Some(window) = target_window {
        let size = PhysicalSize::new(width as u32, height as u32);
        window
            .set_size(tauri::Size::Physical(size))
            .map_err(|e| format!("윈도우 크기 적용 실패: {}", e))?;

        println!(
            "✅ 윈도우 크기 적용 [{}]: {}x{}",
            window_type, width, height
        );
        Ok(())
    } else {
        // 윈도우를 찾을 수 없으면 메인 윈도우에 적용 (기존 로직 유지)
        if let Some(window) = app_handle.get_webview_window("main") {
            let size = PhysicalSize::new(width as u32, height as u32);
            window
                .set_size(tauri::Size::Physical(size))
                .map_err(|e| format!("메인 윈도우 크기 적용 실패: {}", e))?;

            println!("✅ 메인 윈도우 크기 적용 (대체): {}x{}", width, height);
            Ok(())
        } else {
            Err(format!(
                "윈도우 타입 [{}]에 해당하는 윈도우를 찾을 수 없습니다",
                window_type
            ))
        }
    }
}
