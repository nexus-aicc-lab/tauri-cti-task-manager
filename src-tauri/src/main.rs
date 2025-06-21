// src-tauri/src/main.rs (로그인 모드 추가)
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};
use tauri::{Listener, Manager, WebviewUrl, WebviewWindowBuilder};

#[derive(Clone)]
struct AppState {
    current_mode: Arc<Mutex<String>>,
}

fn main() {
    let app_state = AppState {
        current_mode: Arc::new(Mutex::new("launcher".to_string())),
    };

    tauri::Builder::default()
        .manage(app_state)
        .setup(|app| {
            let handle = app.handle().clone();

            println!("🚀 CTI Task Master - Rust 중심 창 관리 (로그인 추가)");

            // 모드 전환 이벤트 (기존 창 교체)
            app.listen("switch-mode", move |event| {
                let payload = event.payload();
                let new_mode = payload.trim_matches('"');
                println!("🔄 모드 전환 요청: {}", new_mode);

                // 새 창 생성
                let (url, width, height, always_on_top, resizable) = match new_mode {
                    "bar" => ("index.html?mode=bar", 1000, 40, true, false),
                    "panel" => ("index.html?mode=panel", 1200, 800, false, true),
                    _ => ("index.html?mode=launcher", 500, 600, false, false),
                };

                let timestamp = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis();

                let new_label = format!("{}_{}", new_mode, timestamp);

                // 새 창 생성
                let window_result = WebviewWindowBuilder::new(
                    &handle,
                    &new_label,
                    WebviewUrl::App(url.parse().unwrap()),
                )
                .title(&format!(
                    "CTI Task Master - {}",
                    match new_mode {
                        "bar" => "바 모드",
                        "panel" => "패널 모드",
                        _ => "런처",
                    }
                ))
                .inner_size(width as f64, height as f64)
                .resizable(resizable)
                .always_on_top(always_on_top)
                .center()
                .visible(true)
                .build();

                match window_result {
                    Ok(new_window) => {
                        println!("✅ 새 {} 창 생성 성공: {}", new_mode, new_label);

                        // 기존 창들 닫기 (새 창 제외)
                        let windows = handle.webview_windows();
                        for (label, window) in windows.iter() {
                            if label != &new_label {
                                println!("🗑️ 기존 창 닫기: {}", label);
                                let _ = window.destroy();
                            }
                        }
                    }
                    Err(e) => {
                        eprintln!("❌ 창 생성 실패: {}", e);
                    }
                }
            });

            // 로그인 창 열기 이벤트 (기존 창 유지하면서 새 창 추가)
            let handle_login = app.handle().clone();
            app.listen("open-login", move |_event| {
                println!("🔐 로그인 창 열기 요청");

                let timestamp = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap()
                    .as_millis();

                let login_label = format!("login_{}", timestamp);

                // 로그인 창 생성 (기존 창 유지)
                let login_window_result = WebviewWindowBuilder::new(
                    &handle_login,
                    &login_label,
                    WebviewUrl::App("index.html?mode=login".parse().unwrap()),
                )
                .title("CTI Task Master - 로그인")
                .inner_size(400.0, 500.0)
                .resizable(false)
                .always_on_top(false)
                .center()
                .visible(true)
                .build();

                match login_window_result {
                    Ok(_) => {
                        println!("✅ 로그인 창 생성 성공: {}", login_label);
                    }
                    Err(e) => {
                        eprintln!("❌ 로그인 창 생성 실패: {}", e);
                    }
                }
            });

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
