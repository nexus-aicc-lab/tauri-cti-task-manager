use tauri::{Manager, WebviewWindow};

/// 선택적으로 다른 메인 창 관련 기능 유지하고 싶을 때 사용
pub fn find_main_window(app: &tauri::AppHandle) -> Option<(String, WebviewWindow)> {
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

/// ✅ 현재 호출된 창을 기준으로 AlwaysOnTop 토글
#[tauri::command]
pub fn toggle_always_on_top(window: WebviewWindow) -> Result<bool, String> {
    let current = window.is_always_on_top().map_err(|e| e.to_string())?;
    let new_state = !current;

    window
        .set_always_on_top(new_state)
        .map_err(|e| e.to_string())?;
    println!("📌 항상 위에: {}", new_state);
    Ok(new_state)
}

/// ✅ 현재 창의 AlwaysOnTop 상태 반환
#[tauri::command]
pub fn get_always_on_top_state(window: WebviewWindow) -> Result<bool, String> {
    window.is_always_on_top().map_err(|e| e.to_string())
}
