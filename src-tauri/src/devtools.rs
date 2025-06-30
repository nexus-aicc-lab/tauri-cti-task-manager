// src-tauri/src/devtools.rs
use tauri::Manager;

pub fn find_main_window(app: &tauri::AppHandle) -> Option<(String, tauri::WebviewWindow)> {
    let windows = app.webview_windows();

    for (label, window) in windows.iter() {
        if label.starts_with("launcher_")
            || label.starts_with("bar_")
            || label.starts_with("panel_")
        {
            return Some((label.clone(), window.clone()));
        }
    }
    None
}

#[tauri::command]
pub fn open_devtools(app: tauri::AppHandle) -> Result<(), String> {
    if let Some((_, window)) = find_main_window(&app) {
        window.open_devtools();
        println!("🔧 개발자 도구 열기");
        Ok(())
    } else {
        Err("메인 창 없음".to_string())
    }
}

#[tauri::command]
pub fn close_devtools(app: tauri::AppHandle) -> Result<(), String> {
    if let Some((_, window)) = find_main_window(&app) {
        window.close_devtools();
        println!("🔧 개발자 도구 닫기");
        Ok(())
    } else {
        Err("메인 창 없음".to_string())
    }
}

#[tauri::command]
pub fn toggle_always_on_top(app: tauri::AppHandle) -> Result<bool, String> {
    if let Some((_, window)) = find_main_window(&app) {
        let current = window.is_always_on_top().map_err(|e| e.to_string())?;
        let new_state = !current;

        window
            .set_always_on_top(new_state)
            .map_err(|e| e.to_string())?;
        println!("📌 항상 위에: {}", new_state);
        Ok(new_state)
    } else {
        Err("메인 창 없음".to_string())
    }
}

#[tauri::command]
pub fn get_always_on_top_state(app: tauri::AppHandle) -> Result<bool, String> {
    if let Some((_, window)) = find_main_window(&app) {
        window.is_always_on_top().map_err(|e| e.to_string())
    } else {
        Err("메인 창 없음".to_string())
    }
}
