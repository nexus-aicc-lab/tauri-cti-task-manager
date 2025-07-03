// 주의: 콘솔 로그 보이게 하기 위해 아래 라인은 주석 처리!
/*
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
*/

mod commands;
mod deeplink;
mod devtools;
mod events;
mod windows;

use commands::panel::{apply_window_size, load_window_size, save_window_size};
use deeplink::{
    clear_login_data, get_deep_link_history, manual_deep_link_test, process_deep_link_url,
};
use devtools::{close_devtools, get_always_on_top_state, open_devtools, toggle_always_on_top};
use events::setup_event_listeners;
use tauri::{generate_handler, Manager};
use tauri_plugin_deep_link::DeepLinkExt;
use url::Url;
use windows::{add_window, switch_window, WindowMode};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 실행 인자 확인 및 딥링크 직접 처리
            let args: Vec<String> = std::env::args().collect();

            for arg in &args {
                println!("🧪 실행 인자: {}", arg);
            }

            if args.len() > 1 {
                let url_str = &args[1];
                if url_str.starts_with("cti-personal://") {
                    println!("📥 딥링크 직접 처리: {}", url_str);

                    if let Ok(parsed_url) = Url::parse(url_str) {
                        let cmd = parsed_url.host_str().map(|s| s.to_string()).or_else(|| {
                            let p = parsed_url.path().trim_start_matches('/');
                            if !p.is_empty() {
                                Some(p.to_string())
                            } else {
                                None
                            }
                        });

                        match cmd.as_deref() {
                            Some("settings") => {
                                let path = parsed_url.path().trim_start_matches('/');
                                let full_path = if path.is_empty() {
                                    "general".to_string()
                                } else {
                                    path.to_string()
                                };
                                println!("🧭 SettingsWithPath 창 열기: {}", full_path);
                                add_window(&app.handle(), WindowMode::SettingsWithPath(full_path));
                                return Ok(());
                            }

                            Some("login") => {
                                println!("🧭 Login 창 열기");
                                add_window(&app.handle(), WindowMode::Login);
                                return Ok(());
                            }
                            Some("panel") => {
                                println!("🧭 Panel 모드 전환");
                                switch_window(&app.handle(), WindowMode::Panel);
                                return Ok(());
                            }
                            Some("bar") => {
                                println!("🧭 Bar 모드 전환");
                                switch_window(&app.handle(), WindowMode::Bar);
                                return Ok(());
                            }
                            _ => {
                                println!("🧭 알 수 없는 딥링크 → Launcher");
                                switch_window(&app.handle(), WindowMode::Launcher);
                                return Ok(());
                            }
                        }
                    } else {
                        println!("❌ 딥링크 URL 파싱 실패: {}", url_str);
                    }
                }
            }

            // 💡 일반 실행 (딥링크 없을 경우)
            println!("🟡 앱 일반 실행 → Launcher");
            switch_window(&app.handle(), WindowMode::Launcher);

            // 이벤트 리스너 등록
            setup_event_listeners(app, app.handle().clone());

            Ok(())
        })
        .invoke_handler(generate_handler![
            get_deep_link_history,
            clear_login_data,
            manual_deep_link_test,
            open_devtools,
            close_devtools,
            toggle_always_on_top,
            get_always_on_top_state,
            save_window_size,
            load_window_size,
            apply_window_size
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_deep_link::init())
        .run(tauri::generate_context!())
        .expect("❌ 앱 실행 실패");
}
