// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::{Listener, Manager, WebviewUrl, WebviewWindowBuilder};

// fn main() {
//     tauri::Builder::default()
//         .setup(|app| {
//             let handle = app.handle().clone();

//             // 앱 시작 시 기본 윈도우 생성
//             let initial_window = WebviewWindowBuilder::new(
//                 &handle,
//                 "main",
//                 WebviewUrl::App("index.html".parse().unwrap()),
//             )
//             .title("CTI Task Master")
//             .inner_size(900.0, 32.0)
//             .resizable(true)
//             .visible(true)
//             .build();

//             match initial_window {
//                 Ok(_) => println!("초기 윈도우 생성 성공"),
//                 Err(e) => eprintln!("초기 윈도우 생성 실패: {}", e),
//             }

//             // 앱 전체에서 커스텀 이벤트 리스닝
//             app.listen("switch-view-mode", move |event| {
//                 let payload = event.payload();
//                 let mode = payload.trim_matches('"');
//                 let mode = if mode == "panel" { "panel" } else { "bar" };

//                 println!("모드 전환 요청: {}", mode);

//                 // 기존 main 윈도우가 있으면 JavaScript로 라우팅
//                 if let Some(main_window) = handle.get_webview_window("main") {
//                     let route_path = match mode {
//                         "panel" => "/MainWindowWithPanelMode",
//                         _ => "/MainWindowWithBarMode",
//                     };

//                     // JavaScript로 React Router 네비게이션
//                     let navigate_script = format!(
//                         r#"
//                         console.log('모드 전환:', '{}');
//                         if (window.router && window.router.navigate) {{
//                             window.router.navigate('{}').catch(console.error);
//                         }} else {{
//                             console.log('Router not ready, using hash change');
//                             window.location.hash = '{}';
//                         }}
//                         "#,
//                         mode, route_path, route_path
//                     );

//                     if let Err(e) = main_window.eval(&navigate_script) {
//                         eprintln!("JavaScript 실행 실패: {}", e);
//                     }

//                     // 크기 변경
//                     let (width, height) = if mode == "bar" { (900, 32) } else { (900, 700) };
//                     if let Err(e) = main_window.set_size(tauri::LogicalSize::new(width, height)) {
//                         eprintln!("크기 변경 실패: {}", e);
//                     }

//                     println!("윈도우 모드 전환 완료: {}", mode);
//                 } else {
//                     // main 윈도우가 없으면 새로 생성
//                     let url = match mode {
//                         "panel" => "index.html#/MainWindowWithPanelMode",
//                         _ => "index.html#/MainWindowWithBarMode",
//                     };

//                     let window_result = WebviewWindowBuilder::new(
//                         &handle,
//                         "main",
//                         WebviewUrl::App(url.parse().unwrap()),
//                     )
//                     .title("CTI Task Master")
//                     .inner_size(900.0, if mode == "bar" { 32.0 } else { 700.0 })
//                     .resizable(true)
//                     .visible(true)
//                     .build();

//                     match window_result {
//                         Ok(_) => println!("윈도우 생성 성공: {}", mode),
//                         Err(e) => eprintln!("윈도우 생성 실패: {}", e),
//                     }
//                 }
//             });

//             Ok(())
//         })
//         .plugin(tauri_plugin_dialog::init())
//         .plugin(tauri_plugin_process::init())
//         .plugin(tauri_plugin_fs::init())
//         .run(tauri::generate_context!())
//         .expect("error while running Tauri application");
// }

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Listener, Manager};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            println!("앱 시작 - 윈도우는 TypeScript에서 관리");

            // 모드 전환 이벤트만 리스닝 (실제 윈도우 관리는 TypeScript에서)
            app.listen("switch-view-mode", |event| {
                let payload = event.payload();
                let mode = payload.trim_matches('"');
                println!("모드 전환 요청: {} → TypeScript로 전달", mode);
            });

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
