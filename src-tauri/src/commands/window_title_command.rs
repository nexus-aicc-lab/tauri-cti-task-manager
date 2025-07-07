// C:\tauri\cti-task-manager-tauri\src-tauri\src\commands\window_title_command.rs
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager, WebviewWindow};

#[derive(Serialize, Deserialize)]
pub struct WindowSettings {
    pub always_on_top: bool,
}

// 파일 경로 얻기
fn get_window_settings_path() -> Result<PathBuf, String> {
    tauri::api::path::app_config_dir(&tauri::Config::default())
        .ok_or("⚠️ 설정 경로 불러오기 실패".into())
        .map(|dir| dir.join("window_settings.json"))
}

#[tauri::command]
pub fn load_window_settings() -> Result<WindowSettings, String> {
    let path = get_window_settings_path()?;
    if path.exists() {
        let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        let settings: WindowSettings = serde_json::from_str(&content).map_err(|e| e.to_string())?;
        Ok(settings)
    } else {
        Ok(WindowSettings {
            always_on_top: false,
        })
    }
}

#[tauri::command]
pub fn save_window_settings(new_state: bool) -> Result<(), String> {
    let path = get_window_settings_path()?;
    let settings = WindowSettings {
        always_on_top: new_state,
    };
    let json = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

/// 실제로 항상 위 상태 적용 + 저장까지 처리
#[tauri::command]
pub fn toggle_always_on_top(window: WebviewWindow) -> Result<bool, String> {
    let current = window.is_always_on_top().map_err(|e| e.to_string())?;
    let new_state = !current;

    window
        .set_always_on_top(new_state)
        .map_err(|e| e.to_string())?;
    save_window_settings(new_state)?; // ✅ 저장도 같이!

    println!("📌 항상 위에: {}", new_state);
    Ok(new_state)
}

#[tauri::command]
pub fn get_always_on_top_state(window: WebviewWindow) -> Result<bool, String> {
    window.is_always_on_top().map_err(|e| e.to_string())
}
