// src-tauri/src/events.rs
use crate::windows::{add_window, switch_window, WindowMode};
use tauri::{AppHandle, Listener};

pub fn setup_event_listeners(app: &tauri::App, handle: AppHandle) {
    // 🔄 메인 이벤트: 창 교체
    let switch_handle = handle.clone();
    app.listen("switch-mode", move |event| {
        let payload = event.payload();
        println!("🔄 창 교체 요청: {}", payload);

        if let Ok(mode_str) = serde_json::from_str::<String>(payload) {
            let mode = match mode_str.as_str() {
                "launcher" => WindowMode::Launcher,
                "bar" => WindowMode::Bar,
                "panel" => WindowMode::Panel,
                "settings" => WindowMode::Settings,
                "login" => WindowMode::Login,
                "counselor_dashboard" => WindowMode::CounselorDashboard, // ✅ 추가됨!
                _ => {
                    println!("⚠️ 알 수 없는 모드: {}", mode_str);
                    return;
                }
            };

            switch_window(&switch_handle, mode);
        }
    });

    // ➕ 창 추가 이벤트
    let add_handle = handle.clone();
    app.listen("add-window", move |event| {
        let payload = event.payload();
        println!("➕ 창 추가 요청: {}", payload);

        if let Ok(mode_str) = serde_json::from_str::<String>(payload) {
            let mode = match mode_str.as_str() {
                "settings" => WindowMode::Settings,
                "login" => WindowMode::Login,
                // counselor_dashboard는 창 추가가 아닌 switch 창으로만 열리도록 유지
                _ => {
                    println!("⚠️ 알 수 없는 모드: {}", mode_str);
                    return;
                }
            };

            add_window(&add_handle, mode);
        }
    });

    // 🎯 특별 이벤트들
    let settings_handle = handle.clone();
    app.listen("open-settings", move |_| {
        println!("⚙️ 설정 창 열기");
        add_window(&settings_handle, WindowMode::Settings);
    });

    let login_handle = handle.clone();
    app.listen("open-login", move |_| {
        println!("🔐 로그인 창 열기");
        add_window(&login_handle, WindowMode::Login);
    });
}
