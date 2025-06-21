// src-tauri/src/main.rs (경고 해결된 최종 버전)
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::{Arc, Mutex};
use tauri::{Emitter, Listener, Manager, WebviewUrl, WebviewWindowBuilder};

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

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            startup_mode: "launcher".to_string(),
            window_position: None,
            auto_login: false,
            theme: "light".to_string(),
        }
    }
}

#[derive(Clone)]
struct AppState {
    current_mode: Arc<Mutex<String>>,
    settings: Arc<Mutex<AppSettings>>,
}

// 설정 파일 경로 가져오기
fn get_settings_path() -> Result<std::path::PathBuf, String> {
    let app_data_dir = if cfg!(target_os = "windows") {
        std::env::var("APPDATA")
    } else {
        std::env::var("HOME")
    }
    .map_err(|_| "사용자 디렉토리를 찾을 수 없습니다")?;

    let config_dir = std::path::Path::new(&app_data_dir).join("cti-task-master");
    fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    Ok(config_dir.join("settings.json"))
}

// 설정 로드
#[tauri::command]
async fn load_settings() -> Result<AppSettings, String> {
    let settings_path = get_settings_path()?;

    if settings_path.exists() {
        let content = fs::read_to_string(settings_path).map_err(|e| e.to_string())?;
        let settings: AppSettings = serde_json::from_str(&content).map_err(|e| e.to_string())?;
        println!(
            "✅ 설정 로드 완료: startup_mode = {}",
            settings.startup_mode
        );
        Ok(settings)
    } else {
        let default_settings = AppSettings::default();
        save_settings_sync(&default_settings)?;
        println!("ℹ️ 기본 설정 생성 완료");
        Ok(default_settings)
    }
}

// 설정 저장
#[tauri::command]
async fn save_settings(settings: AppSettings) -> Result<(), String> {
    save_settings_sync(&settings)
}

fn save_settings_sync(settings: &AppSettings) -> Result<(), String> {
    let settings_path = get_settings_path()?;
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    fs::write(settings_path, json).map_err(|e| e.to_string())?;
    println!(
        "✅ 설정 저장 완료: startup_mode = {}",
        settings.startup_mode
    );
    Ok(())
}

// 시작 모드 설정
#[tauri::command]
async fn set_startup_mode(mode: String) -> Result<(), String> {
    let mut settings = load_settings().await?;
    settings.startup_mode = mode.clone();
    save_settings_sync(&settings)?;
    println!("🔧 시작 모드 변경: {}", mode);
    Ok(())
}

// 현재 설정 가져오기
#[tauri::command]
async fn get_startup_mode() -> Result<String, String> {
    let settings = load_settings().await?;
    Ok(settings.startup_mode)
}

// 모드별 창 생성 공통 함수
// src-tauri/src/main.rs의 create_mode_window 함수 수정

// 모드별 창 생성 공통 함수 (수정된 버전)
fn create_mode_window(handle: &tauri::AppHandle, mode: &str) {
    let (url, width, height, always_on_top, resizable) = match mode {
        "bar" => ("index.html?mode=bar", 1000, 40, true, false),
        "panel" => ("index.html?mode=panel", 1200, 800, false, true),
        "settings" => ("index.html?mode=settings", 500, 600, false, true),
        _ => ("index.html?mode=launcher", 500, 600, false, false),
    };

    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();

    let new_label = format!("{}_{}", mode, timestamp);

    // 새 창 생성
    let window_result =
        WebviewWindowBuilder::new(handle, &new_label, WebviewUrl::App(url.parse().unwrap()))
            .title(&format!(
                "CTI Task Master - {}",
                match mode {
                    "bar" => "바 모드",
                    "panel" => "패널 모드",
                    "settings" => "환경 설정",
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
        Ok(_) => {
            println!("✅ 새 {} 창 생성 성공: {}", mode, new_label);

            // 🔥 핵심 수정: 창 닫기 로직 개선
            let windows = handle.webview_windows();
            for (label, window) in windows.iter() {
                // 새로 생성된 창이 아니고, 설정이나 로그인 창이 아닌 경우에만 닫기
                if label != &new_label {
                    // 유지해야 할 창들: settings_, login_으로 시작하는 창들
                    let should_keep = label.starts_with("settings_") || label.starts_with("login_");

                    if !should_keep {
                        println!("🗑️ 기존 창 닫기: {}", label);
                        let _ = window.destroy();
                    } else {
                        println!("🔒 창 유지: {}", label);
                    }
                }
            }
        }
        Err(e) => {
            eprintln!("❌ 창 생성 실패: {}", e);
        }
    }
}
fn main() {
    let app_state = AppState {
        current_mode: Arc::new(Mutex::new("launcher".to_string())),
        settings: Arc::new(Mutex::new(AppSettings::default())),
    };

    tauri::Builder::default()
        .manage(app_state)
        .setup(|app| {
            let app_handle = app.handle().clone();

            println!("🚀 CTI Task Master - 시작 모드 설정 지원");

            // 앱 시작시 저장된 모드로 자동 전환 (클로저 문제 해결)
            {
                let handle_startup = app_handle.clone();
                std::thread::spawn(move || {
                    std::thread::sleep(std::time::Duration::from_millis(1000));

                    let rt = tokio::runtime::Runtime::new().unwrap();
                    rt.block_on(async {
                        match load_settings().await {
                            Ok(settings) => {
                                if settings.startup_mode != "launcher" {
                                    println!(
                                        "🔄 저장된 시작 모드로 전환: {}",
                                        settings.startup_mode
                                    );

                                    if let Err(e) = handle_startup
                                        .emit("auto-switch-mode", &settings.startup_mode)
                                    {
                                        eprintln!("❌ 자동 모드 전환 실패: {}", e);
                                    }
                                }
                            }
                            Err(e) => {
                                eprintln!("❌ 설정 로드 실패: {}", e);
                            }
                        }
                    });
                });
            }

            // 모드 전환 이벤트 (handle 클론하여 해결)
            {
                let handle = app_handle.clone();
                app.listen("switch-mode", move |event| {
                    let payload = event.payload();
                    let new_mode = payload.trim_matches('"');
                    println!("🔄 모드 전환 요청: {}", new_mode);
                    create_mode_window(&handle, new_mode);
                });
            }

            // 자동 모드 전환 이벤트
            {
                let handle_auto = app_handle.clone();
                app.listen("auto-switch-mode", move |event| {
                    let payload = event.payload();
                    let new_mode = payload.trim_matches('"');
                    println!("🔄 자동 모드 전환: {}", new_mode);
                    create_mode_window(&handle_auto, new_mode);
                });
            }

            // 환경 설정 창 열기
            {
                let handle_settings = app_handle.clone();
                app.listen("open-settings", move |_event| {
                    println!("⚙️ 환경 설정 창 열기 요청");

                    let timestamp = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap()
                        .as_millis();

                    let settings_label = format!("settings_{}", timestamp);

                    let settings_window_result = WebviewWindowBuilder::new(
                        &handle_settings,
                        &settings_label,
                        WebviewUrl::App("index.html?mode=settings".parse().unwrap()),
                    )
                    .title("CTI Task Master - 환경 설정")
                    .inner_size(500.0, 600.0)
                    .resizable(true)
                    .always_on_top(false)
                    .center()
                    .visible(true)
                    .build();

                    match settings_window_result {
                        Ok(_) => {
                            println!("✅ 환경 설정 창 생성 성공: {}", settings_label);
                        }
                        Err(e) => {
                            eprintln!("❌ 환경 설정 창 생성 실패: {}", e);
                        }
                    }
                });
            }

            // 로그인 창 열기 이벤트
            {
                let handle_login = app_handle.clone();
                app.listen("open-login", move |_event| {
                    println!("🔐 로그인 창 열기 요청");

                    let timestamp = std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap()
                        .as_millis();

                    let login_label = format!("login_{}", timestamp);

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
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_settings,
            save_settings,
            set_startup_mode,
            get_startup_mode,
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
