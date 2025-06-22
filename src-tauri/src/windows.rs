// src-tauri/src/windows.rs
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

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
    pub resizable: bool,
    pub always_on_top: bool,
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
                resizable: false,
                always_on_top: false,
            },
            WindowMode::Bar => WindowConfig {
                url: "index.html?mode=bar".into(),
                title: "CTI Task Master - 바 모드".into(),
                width: 1000.0,
                height: 40.0,
                resizable: false,
                always_on_top: true,
            },
            WindowMode::Panel => WindowConfig {
                url: "index.html?mode=panel".into(),
                title: "CTI Task Master - 패널 모드".into(),
                width: 1200.0,
                height: 800.0,
                resizable: true,
                always_on_top: false,
            },
            WindowMode::Settings => WindowConfig {
                url: "index.html?mode=settings".into(),
                title: "CTI Task Master - 환경 설정".into(),
                width: 500.0,
                height: 600.0,
                resizable: true,
                always_on_top: false,
            },
            WindowMode::Login => WindowConfig {
                url: "index.html?mode=login".into(),
                title: "CTI Task Master - 로그인".into(),
                width: 400.0,
                height: 500.0,
                resizable: false,
                always_on_top: false,
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

    let window_result =
        WebviewWindowBuilder::new(handle, &label, WebviewUrl::App(config.url.parse().unwrap()))
            .title(&config.title)
            .inner_size(config.width, config.height)
            .resizable(config.resizable)
            .always_on_top(config.always_on_top)
            .center()
            .visible(true)
            .build();

    match window_result {
        Ok(_) => {
            println!("✅ 새 창 생성 성공: {}", label);

            // 🔥 중요: 메인 윈도우일 때만 기존 메인 창들을 정리
            if mode.is_main_window() {
                println!("🔄 메인 윈도우 모드 - 기존 메인 창 정리");

                let windows = handle.webview_windows();
                for (other_label, window) in windows.iter() {
                    if &label != other_label {
                        // 설정이나 로그인 창은 유지
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
