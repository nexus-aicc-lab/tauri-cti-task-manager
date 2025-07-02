// src-tauri/src/windows.rs
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};
use uuid::Uuid;

/// 윈도우 모드
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum WindowMode {
    Launcher,
    Bar,
    Panel,
    Settings,
    Login,
}

/// 윈도우 설정
#[derive(Clone, Debug)]
struct WindowConfig {
    url: String,
    title: String,
    width: f64,
    height: f64,
    min_width: Option<f64>,
    min_height: Option<f64>,
    resizable: bool,
    always_on_top: bool,
    decorations: bool,
    is_main: bool,        // ✅ 메인 창 여부 추가
    is_independent: bool, // ✅ 독립 창 여부 추가
}

impl WindowMode {
    fn config(&self) -> WindowConfig {
        match self {
            WindowMode::Launcher => WindowConfig {
                url: "launcher.html".into(),
                title: "CTI Task Master - 런처".into(),
                width: 500.0,
                height: 600.0,
                min_width: Some(400.0),
                min_height: Some(500.0),
                resizable: true,
                always_on_top: false,
                decorations: true,
                is_main: true, // ✅ 메인 창
                is_independent: false,
            },
            WindowMode::Bar => WindowConfig {
                url: "bar.html".into(),
                title: "CTI Task Master - 바 모드".into(),
                width: 1200.0,
                height: 40.0,
                min_width: Some(800.0),
                min_height: Some(40.0),
                resizable: true,
                always_on_top: true,
                decorations: false,
                is_main: true, // ✅ 메인 창
                is_independent: false,
            },
            WindowMode::Panel => WindowConfig {
                url: "panel.html".into(),
                title: "CTI Task Master - 패널 모드".into(),
                width: 900.0,
                height: 350.0,
                min_width: Some(600.0),
                min_height: Some(200.0),
                resizable: true,
                always_on_top: false,
                decorations: false,
                is_main: true, // ✅ 메인 창
                is_independent: false,
            },
            // WindowMode::Settings => WindowConfig {
            //     url: "settings.html".into(),
            //     title: "CTI Task Master - 환경 설정".into(),
            //     width: 900.0,
            //     height: 700.0,
            //     min_width: Some(550.0),
            //     min_height: Some(450.0),
            //     resizable: true,
            //     always_on_top: false,
            //     decorations: false,
            //     is_main: true, // ✅ 메인 창
            //     is_independent: false,
            // },
            WindowMode::Settings => WindowConfig {
                url: "settings.html".into(),
                title: "CTI Task Master - 환경 설정".into(),
                width: 650.0,
                height: 420.0,
                min_width: Some(550.0),
                min_height: None,
                resizable: true,
                always_on_top: false,
                decorations: false,
                is_main: true,
                is_independent: false,
            },
            WindowMode::Login => WindowConfig {
                url: "login.html".into(),
                title: "CTI Task Master - 로그인".into(),
                width: 500.0,
                height: 600.0,
                min_width: Some(400.0),
                min_height: Some(500.0),
                resizable: false,
                always_on_top: true,
                decorations: true,
                is_main: false,       // ✅ 메인 창 아님
                is_independent: true, // ✅ 독립 창
            },
        }
    }

    // ✅ config에서 가져오는 방식으로 변경
    fn is_main(&self) -> bool {
        self.config().is_main
    }

    fn is_independent(&self) -> bool {
        self.config().is_independent
    }
}

/// 🔄 창 교체 (메인 기능) - 안전한 순서: 새 창 생성 → 기존 창 닫기
pub fn switch_window(handle: &AppHandle, mode: WindowMode) {
    println!("🔄 창 교체 시작: {:?}", mode);

    // ✅ 1단계: 새 창을 먼저 생성
    let new_window_created = create_window(handle, mode.clone());

    if new_window_created {
        println!("✅ 새 창 생성 완료, 기존 창 정리 시작");

        // ✅ 2단계: 새 창이 성공적으로 생성된 후에만 기존 창들 닫기
        // 🚨 중요: 잠시 대기 후 닫기 (앱 종료 방지)
        std::thread::sleep(std::time::Duration::from_millis(100));

        if mode.is_main() {
            close_main_windows_safely(handle);
        } else if mode.is_independent() {
            close_same_type_windows(handle, &mode);
        }

        println!("✅ 창 교체 완료: {:?}", mode);
    } else {
        println!("❌ 새 창 생성 실패: {:?}", mode);
    }
}

/// 🪟 창 생성 - 성공/실패 반환
pub fn create_window(handle: &AppHandle, mode: WindowMode) -> bool {
    let config = mode.config();
    let label = format!(
        "{}_{}",
        match mode {
            WindowMode::Launcher => "launcher",
            WindowMode::Bar => "bar",
            WindowMode::Panel => "panel",
            WindowMode::Settings => "settings",
            WindowMode::Login => "login",
        },
        Uuid::new_v4()
    );

    println!("🏗️ 창 생성 시작: {} ({})", config.title, label);

    let mut builder =
        WebviewWindowBuilder::new(handle, label.clone(), WebviewUrl::App(config.url.into()))
            .title(&config.title)
            .inner_size(config.width, config.height)
            .resizable(config.resizable)
            .always_on_top(config.always_on_top)
            .decorations(config.decorations);

    if let Some(min_width) = config.min_width {
        builder = builder.min_inner_size(min_width, config.min_height.unwrap_or(0.0));
    }

    match builder.build() {
        Ok(_) => {
            println!("✅ 창 생성 성공: {}", label);
            true
        }
        Err(e) => {
            println!("❌ 창 생성 실패: {} - {:?}", label, e);
            false
        }
    }
}

/// ➕ 창 추가
pub fn add_window(handle: &AppHandle, mode: WindowMode) {
    println!("➕ 창 추가: {:?}", mode);
    let success = create_window(handle, mode);
    if !success {
        println!("❌ 창 추가 실패");
    }
}

/// 🗑️ 메인 창들 안전하게 닫기 (앱 종료 방지)
fn close_main_windows_safely(handle: &AppHandle) {
    let windows = handle.webview_windows();
    let mut windows_to_close = Vec::new();

    // 닫을 창들을 수집
    for (label, _) in windows.iter() {
        if label.starts_with("launcher_")
            || label.starts_with("bar_")
            || label.starts_with("panel_")
            || label.starts_with("settings_")
        {
            windows_to_close.push(label.clone());
        }
    }

    println!("🔍 닫을 대상 창들: {:?}", windows_to_close);

    // 🚨 중요: 최소 2개 이상의 창이 있을 때만 이전 창들을 닫기 (앱 종료 방지)
    if windows_to_close.len() > 1 {
        // 정렬하여 가장 오래된 창들부터 닫기 (최신 창 보호)
        windows_to_close.sort();

        // 마지막 창(최신)은 보호하고 나머지만 닫기
        for label in &windows_to_close[..windows_to_close.len() - 1] {
            if let Some(window) = windows.get(label) {
                println!("🗑️ 이전 메인 창 닫기: {}", label);
                let _ = window.destroy();

                // 창 닫기 간 약간의 딜레이 (안정성)
                std::thread::sleep(std::time::Duration::from_millis(50));
            }
        }
        println!("✅ 이전 창들 정리 완료, 최신 창 유지");
    } else {
        println!("ℹ️ 단일 창 상태, 정리하지 않음 (앱 종료 방지)");
    }
}

/// 🗑️ 동일한 타입의 창들 닫기 (Login 등 독립 창용)
fn close_same_type_windows(handle: &AppHandle, mode: &WindowMode) {
    let windows = handle.webview_windows();
    let prefix = match mode {
        WindowMode::Login => "login_",
        _ => return,
    };

    let mut windows_to_close = Vec::new();
    for (label, _) in windows.iter() {
        if label.starts_with(prefix) {
            windows_to_close.push(label.clone());
        }
    }

    // 독립 창도 최신 것은 보호
    if windows_to_close.len() > 1 {
        windows_to_close.sort();
        for label in &windows_to_close[..windows_to_close.len() - 1] {
            if let Some(window) = windows.get(label) {
                println!("🗑️ 동일 타입 이전 창 닫기: {}", label);
                let _ = window.destroy();
            }
        }
    }
}
