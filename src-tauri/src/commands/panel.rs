// C:\tauri\cti-task-manager-tauri\src-tauri\src\commands\panel.rs
// C:\tauri\cti-task-manager-tauri\src-tauri\src\commands\panel.rs

use serde::{Deserialize, Serialize};
use std::{env, fs, path::PathBuf};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MetricVisibility {
    pub service_level: bool,
    pub response_rate: bool,
    pub real_incoming_calls: bool,
    pub answered_calls: bool,
    pub abandoned_calls: bool,
    pub unanswered_calls: bool,
    pub transfer_incoming: bool,
    pub transfer_answered: bool,
    pub transfer_distributed: bool,
    pub transfer_turn_service: bool,
    pub transfer_failed: bool,
    pub transfer_regular: bool,
}

impl Default for MetricVisibility {
    fn default() -> Self {
        Self {
            service_level: true,
            response_rate: true,
            real_incoming_calls: true,
            answered_calls: true,
            abandoned_calls: true,
            unanswered_calls: true,
            transfer_incoming: true,
            transfer_answered: true,
            transfer_distributed: true,
            transfer_turn_service: true,
            transfer_failed: true,
            transfer_regular: true,
        }
    }
}

/// 패널 설정 파일 경로를 가져옵니다
fn get_panel_settings_path() -> Result<PathBuf, String> {
    let base_dir = if cfg!(target_os = "windows") {
        env::var("APPDATA")
    } else if cfg!(target_os = "macos") {
        env::var("HOME").map(|home| format!("{}/Library/Application Support", home))
    } else {
        env::var("HOME").map(|home| format!("{}/.config", home))
    }
    .map_err(|_| "사용자 디렉토리를 찾을 수 없습니다".to_string())?;

    let config_dir = PathBuf::from(base_dir).join("cti-task-master");

    // 디렉토리가 없으면 생성
    fs::create_dir_all(&config_dir).map_err(|e| format!("설정 디렉토리 생성 실패: {}", e))?;

    Ok(config_dir.join("panel_metrics.json"))
}

/// 패널 설정을 동기적으로 저장합니다
fn save_panel_settings_sync(settings: &MetricVisibility) -> Result<(), String> {
    let path = get_panel_settings_path()?;
    let json =
        serde_json::to_string_pretty(settings).map_err(|e| format!("JSON 직렬화 실패: {}", e))?;

    fs::write(&path, json).map_err(|e| format!("파일 저장 실패 ({}): {}", path.display(), e))?;

    println!("✅ 패널 설정 저장 완료: {}", path.display());
    Ok(())
}

/// 패널 메트릭 설정을 로드합니다
#[tauri::command]
pub async fn load_panel_settings() -> Result<MetricVisibility, String> {
    let path = get_panel_settings_path()?;

    if path.exists() {
        let content = fs::read_to_string(&path)
            .map_err(|e| format!("파일 읽기 실패 ({}): {}", path.display(), e))?;

        let settings: MetricVisibility = serde_json::from_str(&content)
            .map_err(|e| format!("JSON 파싱 실패: {} - 기본값으로 복원합니다", e))
            .unwrap_or_else(|err| {
                println!("⚠️ {}", err);
                let default = MetricVisibility::default();
                // 파싱 실패 시 기본값으로 파일을 다시 저장
                let _ = save_panel_settings_sync(&default);
                default
            });

        println!("📖 패널 설정 로드 완료: {}", path.display());
        Ok(settings)
    } else {
        println!("📄 패널 설정 파일이 없어 기본값 생성");
        let default = MetricVisibility::default();
        save_panel_settings_sync(&default)?;
        Ok(default)
    }
}

/// 패널 메트릭 설정을 저장합니다
#[tauri::command]
pub async fn save_panel_settings(settings: MetricVisibility) -> Result<(), String> {
    save_panel_settings_sync(&settings)?;
    Ok(())
}

/// 특정 메트릭의 표시 여부를 토글합니다
#[tauri::command]
pub async fn toggle_metric_visibility(metric_key: String, enabled: bool) -> Result<(), String> {
    let mut settings = load_panel_settings().await?;

    match metric_key.as_str() {
        "serviceLevel" => settings.service_level = enabled,
        "responseRate" => settings.response_rate = enabled,
        "realIncomingCalls" => settings.real_incoming_calls = enabled,
        "answeredCalls" => settings.answered_calls = enabled,
        "abandonedCalls" => settings.abandoned_calls = enabled,
        "unansweredCalls" => settings.unanswered_calls = enabled,
        "transferIncoming" => settings.transfer_incoming = enabled,
        "transferAnswered" => settings.transfer_answered = enabled,
        "transferDistributed" => settings.transfer_distributed = enabled,
        "transferTurnService" => settings.transfer_turn_service = enabled,
        "transferFailed" => settings.transfer_failed = enabled,
        "transferRegular" => settings.transfer_regular = enabled,
        _ => return Err(format!("알 수 없는 메트릭 키: {}", metric_key)),
    }

    save_panel_settings_sync(&settings)?;
    println!("🔄 메트릭 토글: {} = {}", metric_key, enabled);
    Ok(())
}

/// 모든 메트릭을 활성화/비활성화합니다
#[tauri::command]
pub async fn toggle_all_metrics(enabled: bool) -> Result<(), String> {
    let settings = if enabled {
        MetricVisibility {
            service_level: true,
            response_rate: true,
            real_incoming_calls: true,
            answered_calls: true,
            abandoned_calls: true,
            unanswered_calls: true,
            transfer_incoming: true,
            transfer_answered: true,
            transfer_distributed: true,
            transfer_turn_service: true,
            transfer_failed: true,
            transfer_regular: true,
        }
    } else {
        MetricVisibility {
            service_level: false,
            response_rate: false,
            real_incoming_calls: false,
            answered_calls: false,
            abandoned_calls: false,
            unanswered_calls: false,
            transfer_incoming: false,
            transfer_answered: false,
            transfer_distributed: false,
            transfer_turn_service: false,
            transfer_failed: false,
            transfer_regular: false,
        }
    };

    save_panel_settings_sync(&settings)?;
    println!(
        "🔄 모든 메트릭 {}",
        if enabled { "활성화" } else { "비활성화" }
    );
    Ok(())
}

/// 패널 설정을 기본값으로 초기화합니다
#[tauri::command]
pub async fn reset_panel_settings() -> Result<MetricVisibility, String> {
    let default = MetricVisibility::default();
    save_panel_settings_sync(&default)?;
    println!("🔄 패널 설정 초기화 완료");
    Ok(default)
}

/// 현재 활성화된 메트릭 개수를 반환합니다
#[tauri::command]
pub async fn get_active_metrics_count() -> Result<u32, String> {
    let settings = load_panel_settings().await?;

    let count = [
        settings.service_level,
        settings.response_rate,
        settings.real_incoming_calls,
        settings.answered_calls,
        settings.abandoned_calls,
        settings.unanswered_calls,
        settings.transfer_incoming,
        settings.transfer_answered,
        settings.transfer_distributed,
        settings.transfer_turn_service,
        settings.transfer_failed,
        settings.transfer_regular,
    ]
    .iter()
    .filter(|&&x| x)
    .count() as u32;

    Ok(count)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_visibility() {
        let default = MetricVisibility::default();
        assert!(default.service_level);
        assert!(default.response_rate);
        assert!(default.transfer_incoming);
    }

    #[test]
    fn test_serialization() {
        let settings = MetricVisibility::default();
        let json = serde_json::to_string(&settings).unwrap();
        let deserialized: MetricVisibility = serde_json::from_str(&json).unwrap();

        assert_eq!(settings.service_level, deserialized.service_level);
        assert_eq!(settings.response_rate, deserialized.response_rate);
    }
    // panel.rs 파일 끝에 추가

    use tauri::{Manager, PhysicalSize};

    /// 메트릭 개수에 따른 최적 윈도우 크기 계산
    #[derive(Clone, Debug, Serialize, Deserialize)]
    pub struct WindowSize {
        pub width: f64,
        pub height: f64,
    }

    /// 활성화된 메트릭 개수에 따라 최적 윈도우 크기를 계산합니다
    #[tauri::command]
    pub async fn calculate_optimal_window_size() -> Result<WindowSize, String> {
        let settings = load_panel_settings().await?;

        // 활성화된 메트릭 개수 계산
        let top_metrics_count = [
            settings.service_level,
            settings.response_rate,
            settings.real_incoming_calls,
            settings.answered_calls,
            settings.abandoned_calls,
            settings.unanswered_calls,
        ]
        .iter()
        .filter(|&&x| x)
        .count();

        let transfer_metrics_count = [
            settings.transfer_incoming,
            settings.transfer_answered,
            settings.transfer_distributed,
            settings.transfer_turn_service,
            settings.transfer_failed,
            settings.transfer_regular,
        ]
        .iter()
        .filter(|&&x| x)
        .count();

        // 크기 계산 로직
        let base_width = 800.0;
        let base_height = 200.0;

        let top_height = if top_metrics_count > 0 {
            let rows = ((top_metrics_count as f64) / 6.0).ceil();
            rows * 40.0 + 20.0
        } else {
            0.0
        };

        let transfer_height = if transfer_metrics_count > 0 {
            let rows = ((transfer_metrics_count as f64) / 6.0).ceil();
            rows * 40.0 + 20.0
        } else {
            0.0
        };

        let empty_height = if top_metrics_count == 0 && transfer_metrics_count == 0 {
            100.0
        } else {
            0.0
        };

        let total_height = base_height + top_height + transfer_height + empty_height;
        let width = base_width.max(600.0).min(1400.0);
        let height = total_height.max(250.0).min(800.0);

        Ok(WindowSize { width, height })
    }

    /// 현재 패널 윈도우 크기를 동적으로 조절합니다
    #[tauri::command]
    pub async fn resize_panel_window(app_handle: tauri::AppHandle) -> Result<(), String> {
        let optimal_size = calculate_optimal_window_size().await?;

        let windows = app_handle.webview_windows();
        let panel_window = windows
            .iter()
            .find(|(label, _)| label.starts_with("panel_"))
            .map(|(_, window)| window);

        if let Some(window) = panel_window {
            let new_size = PhysicalSize::new(optimal_size.width as u32, optimal_size.height as u32);
            window
                .set_size(tauri::Size::Physical(new_size))
                .map_err(|e| format!("윈도우 크기 변경 실패: {}", e))?;

            println!(
                "✅ 패널 윈도우 크기 변경: {}x{}",
                optimal_size.width, optimal_size.height
            );
            Ok(())
        } else {
            Err("패널 윈도우를 찾을 수 없습니다".to_string())
        }
    }

    /// 메트릭 개수 정보와 함께 윈도우 크기 정보를 반환합니다
    #[tauri::command]
    pub async fn get_panel_metrics_info() -> Result<serde_json::Value, String> {
        let settings = load_panel_settings().await?;
        let optimal_size = calculate_optimal_window_size().await?;

        let top_count = [
            settings.service_level,
            settings.response_rate,
            settings.real_incoming_calls,
            settings.answered_calls,
            settings.abandoned_calls,
            settings.unanswered_calls,
        ]
        .iter()
        .filter(|&&x| x)
        .count();

        let transfer_count = [
            settings.transfer_incoming,
            settings.transfer_answered,
            settings.transfer_distributed,
            settings.transfer_turn_service,
            settings.transfer_failed,
            settings.transfer_regular,
        ]
        .iter()
        .filter(|&&x| x)
        .count();

        Ok(serde_json::json!({
            "top_metrics_count": top_count,
            "transfer_metrics_count": transfer_count,
            "total_count": top_count + transfer_count,
            "optimal_width": optimal_size.width,
            "optimal_height": optimal_size.height
        }))
    }
}
