// src-tauri/src/deeplink.rs
use serde::{Deserialize, Serialize};
use std::{env, fs, path::PathBuf};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DeepLinkData {
    pub timestamp: String,
    pub url: String,
    pub scheme: String,
    pub path: String,
    pub query_params: Vec<(String, String)>,
}

fn get_config_dir() -> Result<PathBuf, String> {
    let base_dir = if cfg!(target_os = "windows") {
        env::var("APPDATA")
    } else {
        env::var("HOME")
    }
    .map_err(|_| "사용자 디렉토리 없음".to_string())?;

    let config_dir = PathBuf::from(base_dir).join("cti-task-master");
    fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    Ok(config_dir)
}

#[tauri::command]
pub async fn get_deep_link_history() -> Result<String, String> {
    let path = get_config_dir()?.join("deep_link_history.json");

    if path.exists() {
        let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        Ok(content)
    } else {
        Ok("[]".to_string())
    }
}

pub fn process_deep_link_url(url: String) {
    println!("🎯 딥링크 처리: {}", url);

    if let Ok(parsed_url) = url::Url::parse(&url) {
        let data = DeepLinkData {
            timestamp: chrono::Utc::now()
                .format("%Y-%m-%d %H:%M:%S UTC")
                .to_string(),
            url: url.clone(),
            scheme: parsed_url.scheme().to_string(),
            path: parsed_url.path().to_string(),
            query_params: parsed_url
                .query_pairs()
                .map(|(k, v)| (k.to_string(), v.to_string()))
                .collect(),
        };

        if let Err(e) = save_deep_link_data(data) {
            println!("❌ 딥링크 저장 실패: {}", e);
        }
    }
}

fn save_deep_link_data(data: DeepLinkData) -> Result<(), String> {
    let path = get_config_dir()?.join("deep_link_history.json");

    let mut history: Vec<DeepLinkData> = if path.exists() {
        let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        serde_json::from_str(&content).unwrap_or_default()
    } else {
        Vec::new()
    };

    history.push(data);
    if history.len() > 50 {
        history.remove(0);
    }

    let json = serde_json::to_string_pretty(&history).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;

    println!("✅ 딥링크 저장 완료 (총 {}개)", history.len());
    Ok(())
}

#[tauri::command]
pub async fn clear_login_data() -> Result<(), String> {
    println!("🗑️ 로그인 데이터 삭제");
    Ok(())
}

#[tauri::command]
pub fn manual_deep_link_test(url: String) -> Result<(), String> {
    println!("🧪 딥링크 테스트: {}", url);
    process_deep_link_url(url);
    Ok(())
}
