#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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
use windows::{switch_window, WindowMode};

use tauri::{generate_handler, Manager};

// 딥링크
use tauri_plugin_deep_link;
use tauri_plugin_deep_link::DeepLinkExt;

// ========== 메인 함수 ==========

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();

            // 딥링크 초기화
            #[cfg(desktop)]
            app.deep_link().register("cti-personal")?;

            println!("🟡 앱 초기화 중...");

            // 딥링크 이벤트
            app.deep_link().on_open_url(|event| {
                for url in event.urls() {
                    process_deep_link_url(url.to_string());
                }
            });

            // 🚀 초기 런처 창
            switch_window(&handle, WindowMode::Launcher);

            // 🎯 이벤트 리스너 설정
            setup_event_listeners(app, handle.clone());

            println!("✅ 앱 초기화 완료");
            Ok(())
        })
        .invoke_handler(generate_handler![
            // 딥링크 관련
            get_deep_link_history,
            clear_login_data,
            manual_deep_link_test,
            // 개발자 도구 관련
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
