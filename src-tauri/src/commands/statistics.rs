// C:\tauri\cti-task-manager-tauri\src-tauri\src\commands\statistics.rs

use serde::{Deserialize, Serialize};
use std::{collections::HashMap, env, fs, path::PathBuf};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StatisticsSettings {
    pub row_settings: HashMap<String, Vec<String>>,
    pub active_rows: Vec<u32>,
    pub timestamp: String,
}

impl Default for StatisticsSettings {
    fn default() -> Self {
        let mut row_settings = HashMap::new();
        row_settings.insert(
            "row1".to_string(),
            vec!["실인입호수".to_string(), "포기호수".to_string()],
        );
        row_settings.insert(
            "row2".to_string(),
            vec!["콜호전환 인입".to_string(), "그룹호전환 큐전환".to_string()],
        );
        row_settings.insert(
            "row3".to_string(),
            vec![
                "그룹호전환 넌서비스".to_string(),
                "그룹호전환 ns".to_string(),
            ],
        );

        Self {
            row_settings,
            active_rows: vec![1, 2],
            timestamp: chrono::Utc::now()
                .format("%Y-%m-%d %H:%M:%S UTC")
                .to_string(),
        }
    }
}

fn get_config_dir() -> Result<PathBuf, String> {
    let base_dir = if cfg!(target_os = "windows") {
        env::var("APPDATA")
    } else {
        env::var("HOME")
    }
    .map_err(|_| "사용자 디렉토리를 찾을 수 없습니다".to_string())?;

    let config_dir = PathBuf::from(base_dir).join("cti-task-master");
    fs::create_dir_all(&config_dir).map_err(|e| format!("설정 디렉토리 생성 실패: {}", e))?;
    Ok(config_dir)
}

fn get_settings_file_path() -> Result<PathBuf, String> {
    Ok(get_config_dir()?.join("statistics_settings.json"))
}

#[tauri::command]
pub async fn save_statistics_settings(
    settings: StatisticsSettings,
) -> Result<serde_json::Value, String> {
    let path = get_settings_file_path()?;

    // 타임스탬프 업데이트
    let mut settings_with_timestamp = settings;
    settings_with_timestamp.timestamp = chrono::Utc::now()
        .format("%Y-%m-%d %H:%M:%S UTC")
        .to_string();

    let json = serde_json::to_string_pretty(&settings_with_timestamp)
        .map_err(|e| format!("JSON 직렬화 실패: {}", e))?;

    fs::write(&path, json).map_err(|e| format!("파일 저장 실패: {}", e))?;

    println!("✅ 통계 설정 저장 완료: {:?}", path);

    Ok(serde_json::json!({
        "success": true,
        "path": path.to_string_lossy(),
        "timestamp": settings_with_timestamp.timestamp
    }))
}

#[tauri::command]
pub async fn load_statistics_settings() -> Result<StatisticsSettings, String> {
    let path = get_settings_file_path()?;

    if path.exists() {
        let content = fs::read_to_string(&path).map_err(|e| format!("파일 읽기 실패: {}", e))?;
        let settings: StatisticsSettings =
            serde_json::from_str(&content).map_err(|e| format!("JSON 파싱 실패: {}", e))?;
        Ok(settings)
    } else {
        Ok(StatisticsSettings {
            row_settings: HashMap::new(),
            active_rows: vec![],
            timestamp: chrono::Utc::now().to_string(),
        })
    }
}

#[tauri::command]
pub async fn get_statistics_settings_path() -> Result<String, String> {
    let path = get_settings_file_path()?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn reset_statistics_settings() -> Result<StatisticsSettings, String> {
    let path = get_settings_file_path()?;

    // 기존 파일이 있다면 백업
    if path.exists() {
        let backup_path = path.with_extension("json.backup");
        fs::copy(&path, &backup_path).map_err(|e| format!("백업 생성 실패: {}", e))?;
        println!("🔄 기존 설정 백업 완료: {:?}", backup_path);
    }

    let default_settings = StatisticsSettings::default();

    let json = serde_json::to_string_pretty(&default_settings)
        .map_err(|e| format!("JSON 직렬화 실패: {}", e))?;

    fs::write(&path, json).map_err(|e| format!("파일 저장 실패: {}", e))?;

    println!("🔄 통계 설정 초기화 완료");
    Ok(default_settings)
}

#[tauri::command]
pub async fn export_statistics_settings(export_path: String) -> Result<String, String> {
    let settings_path = get_settings_file_path()?;
    let export_path = PathBuf::from(export_path);

    if !settings_path.exists() {
        return Err("저장된 설정이 없습니다".to_string());
    }

    fs::copy(&settings_path, &export_path).map_err(|e| format!("내보내기 실패: {}", e))?;

    println!("📤 통계 설정 내보내기 완료: {:?}", export_path);
    Ok(export_path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn import_statistics_settings(import_path: String) -> Result<StatisticsSettings, String> {
    let import_path = PathBuf::from(import_path);
    let settings_path = get_settings_file_path()?;

    if !import_path.exists() {
        return Err("가져올 파일이 존재하지 않습니다".to_string());
    }

    // 파일 검증
    let content = fs::read_to_string(&import_path).map_err(|e| format!("파일 읽기 실패: {}", e))?;

    let settings: StatisticsSettings =
        serde_json::from_str(&content).map_err(|e| format!("잘못된 설정 파일 형식: {}", e))?;

    // 기존 설정 백업
    if settings_path.exists() {
        let backup_path = settings_path.with_extension("json.backup");
        fs::copy(&settings_path, &backup_path).map_err(|e| format!("백업 생성 실패: {}", e))?;
    }

    // 새 설정 저장
    fs::copy(&import_path, &settings_path).map_err(|e| format!("설정 가져오기 실패: {}", e))?;

    println!("📥 통계 설정 가져오기 완료: {:?}", import_path);
    Ok(settings)
}
