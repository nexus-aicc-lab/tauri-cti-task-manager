// // 주의: 콘솔 로그 보이게 하기 위해 아래 라인은 주석 처리!
// /*
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// */
// mod commands;
// mod deeplink;
// mod devtools;
// mod events;
// mod redis; // ✅ Redis 모듈 추가
// mod windows;

// use commands::panel::{apply_window_size, load_window_size, save_window_size};
// use commands::statistics::{
//     export_statistics_settings, get_statistics_settings_path, import_statistics_settings,
//     load_statistics_settings, reset_statistics_settings, save_statistics_settings,
// }; // 🆕 commands 폴더 하위로 이동!

// use commands::context_menu::{
//     handle_context_menu_event, show_context_menu_at_position, show_tray_context_menu,
// }; // 🆕 컨텍스트 메뉴 이벤트 핸들러

// use commands::notifications::{
//     play_notification_sound, show_desktop_notification, test_all_notifications,
// }; // ✅ 알림 명령어들 임포트

// use deeplink::{get_login_info, process_deep_link_url};

// use devtools::{close_devtools, get_always_on_top_state, open_devtools, toggle_always_on_top};
// use events::setup_event_listeners;
// use redis::{start_redis_subscriber, test_redis_connection}; // ✅ Redis 함수들 임포트
// use tauri::{async_runtime, generate_handler, Manager};
// use tauri_plugin_deep_link::DeepLinkExt;
// use url::Url;
// use windows::{add_window, create_window, switch_window, WindowMode}; // 🆕 메뉴 명령어 추가

// fn main() {
//     tauri::Builder::default()
//         .setup(|app| {
//             // ✅ Tauri의 async runtime 사용
//             let app_handle = app.handle().clone();
//             async_runtime::spawn(async move {
//                 start_redis_subscriber(app_handle).await;
//             });

//             // 실행 인자 확인 및 딥링크 직접 처리
//             let args: Vec<String> = std::env::args().collect();

//             for arg in &args {
//                 println!("🧪 실행 인자: {}", arg);
//             }

//             if args.len() > 1 {
//                 let url_str = &args[1];
//                 if url_str.starts_with("cti-personal://") {
//                     println!("📥 딥링크 직접 처리: {}", url_str);

//                     // 딥링크 URL 파싱 및 처리
//                     process_deep_link_url(url_str.to_string());

//                     if let Ok(parsed_url) = Url::parse(url_str) {
//                         let cmd = parsed_url.host_str().map(|s| s.to_string()).or_else(|| {
//                             let p = parsed_url.path().trim_start_matches('/');
//                             if !p.is_empty() {
//                                 Some(p.to_string())
//                             } else {
//                                 None
//                             }
//                         });

//                         match cmd.as_deref() {
//                             Some("settings") => {
//                                 let path = parsed_url.path().trim_start_matches('/');
//                                 let full_path = if path.is_empty() {
//                                     "general".to_string()
//                                 } else {
//                                     path.to_string()
//                                 };
//                                 println!("🧭 SettingsWithPath 창 열기: {}", full_path);
//                                 add_window(&app.handle(), WindowMode::SettingsWithPath(full_path));
//                                 return Ok(());
//                             }

//                             Some("login") => {
//                                 println!("🧭 Login 창 열기");
//                                 add_window(&app.handle(), WindowMode::Login);
//                                 return Ok(());
//                             }
//                             Some("panel") => {
//                                 println!("🧭 Panel 모드 전환");
//                                 switch_window(&app.handle(), WindowMode::Panel);
//                                 return Ok(());
//                             }
//                             Some("bar") => {
//                                 println!("🧭 Bar 모드 전환");
//                                 switch_window(&app.handle(), WindowMode::Bar);
//                                 return Ok(());
//                             }
//                             _ => {
//                                 println!("🧭 알 수 없는 딥링크 → Launcher");
//                                 switch_window(&app.handle(), WindowMode::Launcher);
//                                 return Ok(());
//                             }
//                         }
//                     } else {
//                         println!("❌ 딥링크 URL 파싱 실패: {}", url_str);
//                     }
//                 }
//             }

//             // 💡 일반 실행 (딥링크 없을 경우)
//             println!("🟡 앱 일반 실행 → Launcher");
//             create_window(&app.handle(), WindowMode::Launcher);

//             // 이벤트 리스너 등록
//             setup_event_listeners(app, app.handle().clone());

//             Ok(())
//         })
//         .invoke_handler(generate_handler![
//             open_devtools,
//             close_devtools,
//             toggle_always_on_top,
//             get_always_on_top_state,
//             save_window_size,
//             load_window_size,
//             apply_window_size,
//             // 새로 추가된 통계 설정 명령들
//             save_statistics_settings,
//             load_statistics_settings,
//             get_statistics_settings_path,
//             reset_statistics_settings,
//             export_statistics_settings,
//             import_statistics_settings,
//             show_tray_context_menu,
//             show_context_menu_at_position,
//             test_redis_connection,
//             get_login_info,
//             // ✅ Redis 테스트 커맨드 추가
//             test_redis_connection,
//             // ✅ 알림 명령어들 추가
//             show_desktop_notification,
//             play_notification_sound,
//             test_all_notifications
//         ])
//         .on_menu_event(|app, event| {
//             // 🆕 컨텍스트 메뉴 이벤트 처리 추가
//             handle_context_menu_event(app, event.id().as_ref());
//         })
//         .plugin(tauri_plugin_dialog::init())
//         .plugin(tauri_plugin_process::init())
//         .plugin(tauri_plugin_fs::init())
//         .plugin(tauri_plugin_deep_link::init())
//         .run(tauri::generate_context!())
//         .expect("❌ 앱 실행 실패");
// }

// 주의: 콘솔 로그 보이게 하기 위해 아래 라인은 주석 처리!
/*
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
*/

mod commands;
mod deeplink;
mod devtools;
mod events;
mod redis; // ✅ Redis 모듈 추가
mod windows;

use commands::panel::{apply_window_size, load_window_size, save_window_size};
use commands::statistics::{
    export_statistics_settings, get_statistics_settings_path, import_statistics_settings,
    load_statistics_settings, reset_statistics_settings, save_statistics_settings,
}; // 🆕 commands 폴더 하위로 이동!

use commands::context_menu::{
    handle_context_menu_event, show_context_menu_at_position, show_tray_context_menu,
}; // 🆕 컨텍스트 메뉴 이벤트 핸들러

// 🔄 플러그인 방식으로 변경 (레거시는 호환성용으로 유지)
use commands::notifications::{
    get_notification_capabilities,
    play_custom_sound_file,
    play_notification_sound,
    show_desktop_notification,
    test_all_notifications,
    // 🆕 플러그인 테스트용 추가 명령어들
    test_plugin_notification,
}; // ✅ 알림 명령어들 임포트

use deeplink::{get_login_info, process_deep_link_url};

use devtools::{close_devtools, get_always_on_top_state, open_devtools, toggle_always_on_top};
use events::setup_event_listeners;
use redis::{start_redis_subscriber, test_redis_connection}; // ✅ Redis 함수들 임포트
use tauri::{async_runtime, generate_handler, Manager};
use tauri_plugin_deep_link::DeepLinkExt;
use url::Url;
use windows::{add_window, create_window, switch_window, WindowMode}; // 🆕 메뉴 명령어 추가

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // ✅ Tauri의 async runtime 사용
            let app_handle = app.handle().clone();
            async_runtime::spawn(async move {
                start_redis_subscriber(app_handle).await;
            });

            // 실행 인자 확인 및 딥링크 직접 처리
            let args: Vec<String> = std::env::args().collect();

            for arg in &args {
                println!("🧪 실행 인자: {}", arg);
            }

            if args.len() > 1 {
                let url_str = &args[1];
                if url_str.starts_with("cti-personal://") {
                    println!("📥 딥링크 직접 처리: {}", url_str);

                    // 딥링크 URL 파싱 및 처리
                    process_deep_link_url(url_str.to_string());

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
            create_window(&app.handle(), WindowMode::Launcher);

            // 이벤트 리스너 등록
            setup_event_listeners(app, app.handle().clone());

            Ok(())
        })
        .invoke_handler(generate_handler![
            open_devtools,
            close_devtools,
            toggle_always_on_top,
            get_always_on_top_state,
            save_window_size,
            load_window_size,
            apply_window_size,
            // 새로 추가된 통계 설정 명령들
            save_statistics_settings,
            load_statistics_settings,
            get_statistics_settings_path,
            reset_statistics_settings,
            export_statistics_settings,
            import_statistics_settings,
            show_tray_context_menu,
            show_context_menu_at_position,
            test_redis_connection,
            get_login_info,
            // ✅ 기존 레거시 알림 명령어들 (호환성 유지)
            show_desktop_notification,
            play_notification_sound,
            test_all_notifications,
            // 🆕 새로운 플러그인 테스트 명령어들
            test_plugin_notification,
            get_notification_capabilities,
            // 🎵 커스텀 사운드 추가
            play_custom_sound_file
        ])
        .on_menu_event(|app, event| {
            // 🆕 컨텍스트 메뉴 이벤트 처리 추가
            handle_context_menu_event(app, event.id().as_ref());
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_notification::init()) // 🎉 알림 플러그인 등록!
        .run(tauri::generate_context!())
        .expect("❌ 앱 실행 실패");
}
