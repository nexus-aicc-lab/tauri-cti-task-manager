// C:\tauri\cti-task-manager-tauri\src-tauri\src\windows.rs
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, LogicalPosition, LogicalSize, Manager, WebviewUrl, WebviewWindowBuilder};

/// 앱에서 사용할 윈도우 모드 종류 정의
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum WindowMode {
    Launcher,
    Bar,
    Panel,
    Settings,
    Login,
}

/// 각 모드별 윈도우 옵션을 저장하는 구조체
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct WindowConfig {
    pub url: String,
    pub title: String,
    pub width: f64,
    pub height: f64,
    pub min_width: Option<f64>,
    pub min_height: Option<f64>,
    pub resizable: bool,
    pub always_on_top: bool,
    pub decorations: bool,
}

impl WindowMode {
    /// 이 모드가 메인 윈도우인지 확인 (기존 창을 대체해야 하는지)
    pub fn is_main_window(&self) -> bool {
        matches!(
            self,
            WindowMode::Launcher | WindowMode::Bar | WindowMode::Panel
        )
    }

    /// 모드별 기본 윈도우 설정 반환
    pub fn default_config(&self) -> WindowConfig {
        match self {
            WindowMode::Launcher => WindowConfig {
                url: "index.html?mode=launcher".into(),
                title: "CTI Task Master - 런처".into(),
                width: 500.0,
                height: 600.0,
                min_width: Some(400.0),
                min_height: Some(500.0),
                resizable: true,
                always_on_top: false,
                decorations: true,
            },
            WindowMode::Bar => WindowConfig {
                url: "index.html?mode=bar".into(),
                title: "CTI Task Master - 바 모드".into(),
                width: 1200.0,
                height: 40.0,
                min_width: Some(800.0),
                min_height: Some(40.0),
                resizable: true,
                always_on_top: true,
                decorations: false,
            },
            WindowMode::Panel => WindowConfig {
                url: "index.html?mode=panel".into(),
                title: "CTI Task Master - 패널 모드".into(),
                width: 900.0,            // 기본 크기를 약간 줄임
                height: 350.0,           // 기본 크기를 약간 줄임
                min_width: Some(600.0),  // 🔥 최소 너비 제한 추가 (반응형 대응)
                min_height: Some(200.0), // 🔥 최소 높이 제한 추가 (반응형 대응)
                resizable: true,
                always_on_top: false,
                decorations: false,
            },
            WindowMode::Settings => WindowConfig {
                url: "index.html?mode=settings".into(),
                title: "CTI Task Master - 환경 설정".into(),
                width: 900.0,
                height: 700.0,
                min_width: Some(550.0),
                min_height: Some(450.0),
                resizable: true,
                always_on_top: false,
                decorations: false,
            },
            WindowMode::Login => WindowConfig {
                url: "index.html?mode=login".into(),
                title: "CTI Task Master - 로그인".into(),
                width: 500.0,
                height: 600.0,
                min_width: Some(400.0),
                min_height: Some(500.0),
                resizable: false,
                always_on_top: true,
                decorations: true,
            },
        }
    }
}

/// 공통으로 윈도우를 생성하고, 기존 윈도우를 정리하는 함수
pub fn create_window(handle: &AppHandle, mode: WindowMode) {
    let config = mode.default_config();
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis();

    let label = format!("{:?}_{}", mode, timestamp).to_lowercase();

    let mut window_builder =
        WebviewWindowBuilder::new(handle, &label, WebviewUrl::App(config.url.parse().unwrap()))
            .title(&config.title)
            .inner_size(config.width, config.height)
            .resizable(config.resizable)
            .always_on_top(config.always_on_top)
            .decorations(config.decorations)
            .visible(true);

    // 최소 크기 설정 (resize 가능한 경우에만)
    if config.resizable {
        if let (Some(min_width), Some(min_height)) = (config.min_width, config.min_height) {
            window_builder = window_builder.min_inner_size(min_width, min_height);
            println!("🔧 최소 크기 설정: {}x{}", min_width, min_height);
        }
    }

    // 설정 창일 경우, 부모 창 중앙에 배치
    if matches!(mode, WindowMode::Settings) {
        let windows = handle.webview_windows();
        let mut parent_found = false;

        for (window_label, window) in windows.iter() {
            if window_label.starts_with("bar_")
                || window_label.starts_with("panel_")
                || window_label.starts_with("launcher_")
            {
                if let Ok(position) = window.outer_position() {
                    if let Ok(size) = window.outer_size() {
                        let center_x =
                            position.x + (size.width as i32 / 2) - (config.width as i32 / 2);
                        let center_y =
                            position.y + (size.height as i32 / 2) - (config.height as i32 / 2);

                        window_builder = window_builder.position(center_x as f64, center_y as f64);
                        parent_found = true;
                        break;
                    }
                }
            }
        }

        if !parent_found {
            window_builder = window_builder.center();
        }
    }
    // 로그인 창일 경우, 런처 창의 위치를 찾아서 그 위에 배치
    else if matches!(mode, WindowMode::Login) {
        let windows = handle.webview_windows();
        for (window_label, window) in windows.iter() {
            if window_label.starts_with("launcher_") {
                if let Ok(position) = window.outer_position() {
                    let new_position = LogicalPosition::new(position.x as f64, position.y as f64);
                    window_builder = window_builder.position(new_position.x, new_position.y);
                    break;
                }
            }
        }
        if !windows
            .iter()
            .any(|(label, _)| label.starts_with("launcher_"))
        {
            window_builder = window_builder.center();
        }
    } else {
        window_builder = window_builder.center();
    }

    let window_result = window_builder.build();

    match window_result {
        Ok(window) => {
            println!("✅ 새 창 생성 성공: {}", label);

            // 패널 모드의 경우 추가 설정
            if matches!(mode, WindowMode::Panel) {
                println!("🎯 패널 모드 창 추가 설정");

                // 윈도우가 생성된 후 약간의 지연을 두고 초기 크기 조정
                let window_clone = window.clone();
                tauri::async_runtime::spawn(async move {
                    tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

                    // 초기 크기가 예상과 다를 경우를 대비한 보정
                    if let Ok(current_size) = window_clone.inner_size() {
                        println!(
                            "📏 패널 창 현재 크기: {}x{}",
                            current_size.width, current_size.height
                        );

                        // 너무 크거나 작으면 기본값으로 재조정
                        if current_size.width > 1500 || current_size.height > 800 {
                            let _ = window_clone.set_size(tauri::Size::Physical(
                                tauri::PhysicalSize::new(900, 350),
                            ));
                            println!("🔧 패널 크기 자동 보정 완료");
                        }
                    }
                });
            }

            if mode.is_main_window() {
                println!("🔄 메인 윈도우 모드 - 기존 메인 창 정리");

                let windows = handle.webview_windows();
                for (other_label, window) in windows.iter() {
                    if &label != other_label {
                        let should_keep = other_label.starts_with("settings_")
                            || other_label.starts_with("login_");

                        if !should_keep {
                            println!("🗑️ 기존 창 닫기: {}", other_label);
                            let _ = window.destroy();
                        } else {
                            println!("🔒 창 유지: {}", other_label);
                        }
                    }
                }
            } else {
                println!("📌 보조 윈도우 모드 - 기존 창 모두 유지");
            }
        }
        Err(e) => {
            eprintln!("❌ 창 생성 실패: {:?} - {}", mode, e);
        }
    }
}
