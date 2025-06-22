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

fn main() {
    tauri::Builder::default()
        .manage(AppState::new())
        .setup(|app| {
            let handle = app.handle();

            // 초기 런처 창 띄우기
            create_window(&handle, WindowMode::Launcher);

            // 이벤트 리스너 설정 (app.listen 사용)
            let event_handle = handle.clone();
            app.listen("switch-mode", move |event| {
                let payload = event.payload();

                // 문자열로 받은 경우와 JSON으로 받은 경우 모두 처리
                if let Ok(mode) = serde_json::from_str::<WindowMode>(payload) {
                    create_window(&event_handle, mode);
                } else if let Ok(mode_str) = serde_json::from_str::<String>(payload) {
                    // 문자열로 받은 경우 WindowMode로 변환
                    match mode_str.as_str() {
                        "launcher" => create_window(&event_handle, WindowMode::Launcher),
                        "bar" => create_window(&event_handle, WindowMode::Bar),
                        "panel" => create_window(&event_handle, WindowMode::Panel),
                        "settings" => create_window(&event_handle, WindowMode::Settings),
                        "login" => create_window(&event_handle, WindowMode::Login),
                        _ => println!("⚠️ Unknown mode: {}", mode_str),
                    }
                } else {
                    println!("⚠️ Failed to parse mode from payload: {}", payload);
                }
            });

            // 설정 창 열기 이벤트
            let settings_handle = handle.clone();
            app.listen("open-settings", move |_| {
                println!("⚙️ 환경 설정 창 열기 요청");
                create_window(&settings_handle, WindowMode::Settings);
            });

            // 로그인 창 열기 이벤트
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

                                // emit 메서드 사용 (emit_all 대신)
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
            get_startup_mode
        ])
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("❌ Error while running Tauri application");
}
