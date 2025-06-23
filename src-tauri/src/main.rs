#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod windows;

use serde::{Deserialize, Serialize};
use std::{
    env, fs,
    path::PathBuf,
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};
use tauri::{generate_handler, Emitter, Listener, Manager};
use tokio::runtime::Runtime;
use windows::{create_window, WindowMode};

// 🆕 딥링크 관련 라이브러리 추가
use tauri_plugin_deep_link::DeepLinkExt;

// 웹에서 deep link를 처리하기 위한 플러그인
use tauri_plugin_deep_link;

#[derive(Clone, Debug, Serialize, Deserialize)]
struct AppSettings {
    startup_mode: String,
    window_position: Option<WindowPosition>,
    auto_login: bool,
    theme: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
struct WindowPosition {
    x: i32,
    y: i32,
    width: u32,
    height: u32,
}

// 🆕 딥링크 데이터 구조체 추가
#[derive(Clone, Debug, Serialize, Deserialize)]
struct DeepLinkData {
    timestamp: String,
    url: String,
    scheme: String,
    path: String,
    query_params: Vec<(String, String)>,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            startup_mode: "launcher".into(),
            window_position: None,
            auto_login: false,
            theme: "dark".into(), // 기본값을 dark로 변경
        }
    }
}

#[derive(Clone)]
struct AppState {
    settings: Arc<Mutex<AppSettings>>,
}

impl AppState {
    fn new() -> Self {
        Self {
            settings: Arc::new(Mutex::new(AppSettings::default())),
        }
    }
}

fn get_settings_path() -> Result<PathBuf, String> {
    let base_dir = if cfg!(target_os = "windows") {
        env::var("APPDATA")
    } else {
        env::var("HOME")
    }
    .map_err(|_| "사용자 디렉토리를 찾을 수 없습니다".to_string())?;

    let config_dir = PathBuf::from(base_dir).join("cti-task-master");
    fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    Ok(config_dir.join("settings.json"))
}

#[tauri::command]
async fn load_settings() -> Result<AppSettings, String> {
    let path = get_settings_path()?;
    if path.exists() {
        let txt = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        let mut settings: AppSettings = serde_json::from_str(&txt).map_err(|e| e.to_string())?;

        // 기존 설정 파일에 theme 필드가 없는 경우를 위한 처리
        // theme이 "light"인 경우 "dark"로 변경 (마이그레이션)
        if settings.theme == "light" {
            settings.theme = "dark".into();
            save_settings_sync(&settings)?;
        }

        Ok(settings)
    } else {
        let default = AppSettings::default();
        save_settings_sync(&default)?;
        Ok(default)
    }
}

#[tauri::command]
async fn save_settings(settings: AppSettings) -> Result<(), String> {
    save_settings_sync(&settings)
}

fn save_settings_sync(settings: &AppSettings) -> Result<(), String> {
    let path = get_settings_path()?;
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}

#[tauri::command]
async fn set_startup_mode(mode: String) -> Result<(), String> {
    let mut settings = load_settings().await?;
    settings.startup_mode = mode.clone();
    save_settings_sync(&settings)?;
    Ok(())
}

#[tauri::command]
async fn get_startup_mode() -> Result<String, String> {
    let settings = load_settings().await?;
    Ok(settings.startup_mode)
}

// 🆕 딥링크 파일 경로 가져오기
fn get_deep_link_file_path() -> Result<PathBuf, String> {
    let base_dir = if cfg!(target_os = "windows") {
        env::var("APPDATA")
    } else {
        env::var("HOME")
    }
    .map_err(|_| "사용자 디렉토리를 찾을 수 없습니다".to_string())?;

    let config_dir = PathBuf::from(base_dir).join("cti-task-master");
    fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    Ok(config_dir.join("deep_link_history.json"))
}

// 🆕 딥링크 히스토리 불러오기 명령어
#[tauri::command]
async fn get_deep_link_history() -> Result<String, String> {
    let file_path = get_deep_link_file_path()?;
    if file_path.exists() {
        let content =
            fs::read_to_string(&file_path).map_err(|e| format!("파일 읽기 실패: {}", e))?;
        Ok(content)
    } else {
        Ok("[]".to_string()) // 빈 배열 반환
    }
}

// 🔧 개발자 도구 제어 명령어들 수정 (Tauri v2 방식)
#[tauri::command]
fn open_devtools(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.open_devtools();
        println!("🔧 개발자 도구 열기");
        Ok(())
    } else {
        Err("메인 창을 찾을 수 없습니다".to_string())
    }
}

#[tauri::command]
fn close_devtools(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        window.close_devtools();
        println!("🔧 개발자 도구 닫기");
        Ok(())
    } else {
        Err("메인 창을 찾을 수 없습니다".to_string())
    }
}

// 🆕 딥링크 데이터를 파일에 저장
fn save_deep_link_to_file(deep_link_data: DeepLinkData) -> Result<(), String> {
    let file_path = get_deep_link_file_path()?;

    // 기존 데이터 읽기
    let mut history: Vec<DeepLinkData> = if file_path.exists() {
        let content =
            fs::read_to_string(&file_path).map_err(|e| format!("파일 읽기 실패: {}", e))?;
        serde_json::from_str(&content).unwrap_or_else(|_| Vec::new())
    } else {
        Vec::new()
    };

    // 새 데이터 추가 (최대 50개까지만 저장)
    history.push(deep_link_data);
    if history.len() > 50 {
        history.remove(0);
    }

    // 파일에 저장
    let json_content =
        serde_json::to_string_pretty(&history).map_err(|e| format!("JSON 변환 실패: {}", e))?;
    fs::write(&file_path, json_content).map_err(|e| format!("파일 저장 실패: {}", e))?;

    println!("✅ 딥링크가 파일에 저장되었습니다: {}", file_path.display());
    Ok(())
}

// fn main() {
//     tauri::Builder::default()
//         .manage(AppState::new())
//         .setup(|app| {
//             let handle = app.handle();

//             // 🔗 딥링크 스킴 등록 추가!
//             #[cfg(desktop)]
//             app.deep_link().register("cti-personal")?;

//             println!("🟡 딥링크 핸들러 등록 시도...");

//             // 🆕 딥링크 핸들러 추가
//             app.deep_link().on_open_url(|event| {
//                 let urls = event.urls();
//                 println!("🟡 딥링크 핸들러 등록 시도..2");

//                 println!("🔗 딥링크 URLs 받음: {:?}", urls);

//                 for url in urls {
//                     println!("처리할 URL: {}", url);

//                     if let Ok(parsed_url) = url::Url::parse(url.as_str()) {
//                         // 현재 시간 가져오기
//                         let timestamp = chrono::Utc::now()
//                             .format("%Y-%m-%d %H:%M:%S UTC")
//                             .to_string();

//                         // 쿼리 파라미터 수집
//                         let query_params: Vec<(String, String)> = parsed_url
//                             .query_pairs()
//                             .map(|(key, value)| (key.to_string(), value.to_string()))
//                             .collect();

//                         let deep_link_data = DeepLinkData {
//                             timestamp,
//                             url: url.to_string(),
//                             scheme: parsed_url.scheme().to_string(),
//                             path: parsed_url.path().to_string(),
//                             query_params,
//                         };

//                         // 파일에 저장
//                         if let Err(e) = save_deep_link_to_file(deep_link_data) {
//                             println!("❌ 딥링크 저장 실패: {}", e);
//                         } else {
//                             println!("✅ 딥링크가 성공적으로 저장되었습니다");
//                         }
//                     }
//                 }
//             });

//             println!("🟡 딥링크 핸들러 등록 시도...3");

//             // 초기 런처 창 띄우기
//             create_window(&handle, WindowMode::Launcher);

//             // 이벤트 리스너 설정 (app.listen 사용)
//             let event_handle = handle.clone();
//             app.listen("switch-mode", move |event| {
//                 let payload = event.payload();

//                 // 문자열로 받은 경우와 JSON으로 받은 경우 모두 처리
//                 if let Ok(mode) = serde_json::from_str::<WindowMode>(payload) {
//                     create_window(&event_handle, mode);
//                 } else if let Ok(mode_str) = serde_json::from_str::<String>(payload) {
//                     // 문자열로 받은 경우 WindowMode로 변환
//                     match mode_str.as_str() {
//                         "launcher" => create_window(&event_handle, WindowMode::Launcher),
//                         "bar" => create_window(&event_handle, WindowMode::Bar),
//                         "panel" => create_window(&event_handle, WindowMode::Panel),
//                         "settings" => create_window(&event_handle, WindowMode::Settings),
//                         "login" => create_window(&event_handle, WindowMode::Login),
//                         _ => println!("⚠️ Unknown mode: {}", mode_str),
//                     }
//                 } else {
//                     println!("⚠️ Failed to parse mode from payload: {}", payload);
//                 }
//             });

//             // 설정 창 열기 이벤트
//             let settings_handle = handle.clone();
//             app.listen("open-settings", move |_| {
//                 println!("⚙️ 환경 설정 창 열기 요청");
//                 create_window(&settings_handle, WindowMode::Settings);
//             });

//             // 로그인 창 열기 이벤트
//             let login_handle = handle.clone();
//             app.listen("open-login", move |_| {
//                 println!("🔐 로그인 창 열기 요청");
//                 create_window(&login_handle, WindowMode::Login);
//             });

//             // 자동 시작 모드 전환
//             {
//                 let auto_handle = handle.clone();
//                 thread::spawn(move || {
//                     thread::sleep(Duration::from_millis(500));

//                     let rt = Runtime::new().unwrap();
//                     rt.block_on(async {
//                         if let Ok(settings) = load_settings().await {
//                             if settings.startup_mode != "launcher" {
//                                 println!("🔄 저장된 시작 모드로 전환: {}", settings.startup_mode);

//                                 // emit 메서드 사용 (emit_all 대신)
//                                 if let Err(e) =
//                                     auto_handle.emit("switch-mode", settings.startup_mode)
//                                 {
//                                     eprintln!("❌ 자동 모드 전환 실패: {}", e);
//                                 }
//                             }
//                         }
//                     });
//                 });
//             }

//             Ok(())
//         })
//         .invoke_handler(generate_handler![
//             load_settings,
//             save_settings,
//             set_startup_mode,
//             get_startup_mode,
//             get_deep_link_history,
//             open_devtools,
//             close_devtools
//         ])
//         .plugin(tauri_plugin_dialog::init())
//         .plugin(tauri_plugin_process::init())
//         .plugin(tauri_plugin_fs::init())
//         .plugin(tauri_plugin_deep_link::init()) // 👈 요거 추가!
//         .run(tauri::generate_context!())
//         .expect("❌ Error while running Tauri application");
// }

fn main() {
    tauri::Builder::default()
        .manage(AppState::new())
        .setup(|app| {
            let handle = app.handle();

            // 🔗 딥링크 스킴 등록
            #[cfg(desktop)]
            app.deep_link().register("cti-personal")?;

            println!("🟡 딥링크 시스템 초기화 시작...");

            // 🔥 방법 1: 커맨드 라인 인자 확인
            let args: Vec<String> = std::env::args().collect();
            println!("🔍 커맨드 라인 인자들: {:?}", args);

            for arg in &args {
                if arg.starts_with("cti-personal://") {
                    println!("🎯 커맨드 라인에서 딥링크 발견: {}", arg);
                    process_deep_link_url(arg.clone());
                }
            }

            // 🔥 방법 2: 초기 딥링크 URL 확인 (앱 시작 시)
            match app.deep_link().get_current() {
                Ok(Some(urls)) => {
                    println!("🚀 앱 시작 시 딥링크 발견: {:?}", urls);
                    for url in urls {
                        println!("🎯 시작 URL 처리: {}", url);
                        process_deep_link_url(url.to_string());
                    }
                }
                Ok(None) => println!("📭 시작 시 딥링크 없음"),
                Err(e) => println!("❌ 딥링크 확인 실패: {}", e),
            }

            // 🔥 방법 3: 기존 이벤트 리스너 (혹시 모르니 유지)
            println!("🟡 이벤트 리스너 등록...");
            app.deep_link().on_open_url(|event| {
                println!("🚨 on_open_url 이벤트 발생!");
                let urls = event.urls();
                println!("🔗 이벤트로 받은 URLs: {:?}", urls);

                for url in urls {
                    println!("🎯 이벤트 URL 처리: {}", url);
                    process_deep_link_url(url.to_string());
                }
            });

            // 🔥 방법 4: 주기적 파일 체크 (백그라운드)
            let file_handle = handle.clone();
            thread::spawn(move || {
                loop {
                    thread::sleep(Duration::from_millis(1000)); // 1초마다 체크

                    if let Some(url) = check_deep_link_file() {
                        println!("📁 파일에서 딥링크 발견: {}", url);
                        process_deep_link_url(url);
                    }
                }
            });

            // 🔥 방법 5: 커스텀 이벤트 리스너
            let custom_handle = handle.clone();
            app.listen("custom-deep-link", move |event| {
                println!("🔥 커스텀 딥링크 이벤트 받음!");
                if let Ok(url) = serde_json::from_str::<String>(event.payload()) {
                    println!("🎯 커스텀 URL 처리: {}", url);
                    process_deep_link_url(url);
                }
            });

            println!("✅ 딥링크 시스템 초기화 완료!");

            // 초기 런처 창 띄우기
            create_window(&handle, WindowMode::Launcher);

            // 기존 이벤트 리스너들...
            let event_handle = handle.clone();
            app.listen("switch-mode", move |event| {
                let payload = event.payload();
                if let Ok(mode) = serde_json::from_str::<WindowMode>(payload) {
                    create_window(&event_handle, mode);
                } else if let Ok(mode_str) = serde_json::from_str::<String>(payload) {
                    match mode_str.as_str() {
                        "launcher" => create_window(&event_handle, WindowMode::Launcher),
                        "bar" => create_window(&event_handle, WindowMode::Bar),
                        "panel" => create_window(&event_handle, WindowMode::Panel),
                        "settings" => create_window(&event_handle, WindowMode::Settings),
                        "login" => create_window(&event_handle, WindowMode::Login),
                        _ => println!("⚠️ Unknown mode: {}", mode_str),
                    }
                }
            });

            let settings_handle = handle.clone();
            app.listen("open-settings", move |_| {
                println!("⚙️ 환경 설정 창 열기 요청");
                create_window(&settings_handle, WindowMode::Settings);
            });

            let login_handle = handle.clone();
            app.listen("open-login", move |_| {
                println!("🔐 로그인 창 열기 요청");
                create_window(&login_handle, WindowMode::Login);
            });

            // 자동 시작 모드 전환
            {
                let auto_handle = handle.clone();
                thread::spawn(move || {
                    thread::sleep(Duration::from_millis(500));
                    let rt = Runtime::new().unwrap();
                    rt.block_on(async {
                        if let Ok(settings) = load_settings().await {
                            if settings.startup_mode != "launcher" {
                                println!("🔄 저장된 시작 모드로 전환: {}", settings.startup_mode);
                                if let Err(e) =
                                    auto_handle.emit("switch-mode", settings.startup_mode)
                                {
                                    eprintln!("❌ 자동 모드 전환 실패: {}", e);
                                }
                            }
                        }
                    });
                });
            }

            Ok(())
        })
        .invoke_handler(generate_handler![
            load_settings,
            save_settings,
            set_startup_mode,
            get_startup_mode,
            get_deep_link_history,
            open_devtools,
            close_devtools,
            manual_deep_link_test // ➕ 수동 테스트 명령어 추가
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_deep_link::init())
        .run(tauri::generate_context!())
        .expect("❌ Error while running Tauri application");
}

// 🔥 딥링크 URL 처리 함수 (공통)
fn process_deep_link_url(url: String) {
    println!("🎯 딥링크 URL 처리 시작: {}", url);

    if let Ok(parsed_url) = url::Url::parse(&url) {
        let timestamp = chrono::Utc::now()
            .format("%Y-%m-%d %H:%M:%S UTC")
            .to_string();
        let query_params: Vec<(String, String)> = parsed_url
            .query_pairs()
            .map(|(key, value)| (key.to_string(), value.to_string()))
            .collect();

        let deep_link_data = DeepLinkData {
            timestamp,
            url: url.clone(),
            scheme: parsed_url.scheme().to_string(),
            path: parsed_url.path().to_string(),
            query_params,
        };

        if let Err(e) = save_deep_link_to_file(deep_link_data) {
            println!("❌ 딥링크 저장 실패: {}", e);
        } else {
            println!("✅ 딥링크 저장 성공: {}", url);
        }
    } else {
        println!("❌ URL 파싱 실패: {}", url);
    }
}

// 🔥 파일 기반 딥링크 체크
fn check_deep_link_file() -> Option<String> {
    let temp_file = std::env::temp_dir().join("cti_deeplink.txt");
    if temp_file.exists() {
        if let Ok(content) = std::fs::read_to_string(&temp_file) {
            let _ = std::fs::remove_file(&temp_file);
            return Some(content.trim().to_string());
        }
    }
    None
}

// 🔥 수동 테스트용 명령어
#[tauri::command]
fn manual_deep_link_test(url: String) -> Result<(), String> {
    println!("🧪 수동 딥링크 테스트: {}", url);
    process_deep_link_url(url);
    Ok(())
}
