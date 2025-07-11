// // C:\tauri\cti-task-manager-tauri\src-tauri\src\deeplink.rs

// use serde::{Deserialize, Serialize};
// use std::{env, fs, path::PathBuf};

// #[derive(Clone, Debug, Serialize, Deserialize)]
// pub struct DeepLinkData {
//     pub timestamp: String,
//     pub url: String,
//     pub scheme: String,
//     pub path: String,
//     pub query_params: Vec<(String, String)>,
// }

// fn get_config_dir() -> Result<PathBuf, String> {
//     let base_dir = if cfg!(target_os = "windows") {
//         env::var("APPDATA")
//     } else {
//         env::var("HOME")
//     }
//     .map_err(|_| "사용자 디렉토리 없음".to_string())?;

//     let config_dir = PathBuf::from(base_dir).join("cti-task-master");
//     fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
//     Ok(config_dir)
// }

// #[tauri::command]
// pub async fn get_deep_link_history() -> Result<String, String> {
//     let path = get_config_dir()?.join("deep_link_history.json");

//     if path.exists() {
//         let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
//         Ok(content)
//     } else {
//         Ok("[]".to_string())
//     }
// }

// pub fn process_deep_link_url(url: String) {
//     println!("🎯 딥링크 처리: {}", url);

//     if let Ok(parsed_url) = url::Url::parse(&url) {
//         let data = DeepLinkData {
//             timestamp: chrono::Utc::now()
//                 .format("%Y-%m-%d %H:%M:%S UTC")
//                 .to_string(),
//             url: url.clone(),
//             scheme: parsed_url.scheme().to_string(),
//             path: parsed_url.path().to_string(),
//             query_params: parsed_url
//                 .query_pairs()
//                 .map(|(k, v)| (k.to_string(), v.to_string()))
//                 .collect(),
//         };

//         if let Err(e) = save_deep_link_data(data) {
//             println!("❌ 딥링크 저장 실패: {}", e);
//         }
//     }
// }

// fn save_deep_link_data(data: DeepLinkData) -> Result<(), String> {
//     let path = get_config_dir()?.join("deep_link_history.json");

//     let mut history: Vec<DeepLinkData> = if path.exists() {
//         let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
//         serde_json::from_str(&content).unwrap_or_default()
//     } else {
//         Vec::new()
//     };

//     history.push(data);
//     if history.len() > 50 {
//         history.remove(0);
//     }

//     let json = serde_json::to_string_pretty(&history).map_err(|e| e.to_string())?;
//     fs::write(&path, json).map_err(|e| e.to_string())?;

//     println!("✅ 딥링크 저장 완료 (총 {}개)", history.len());
//     Ok(())
// }

// #[tauri::command]
// pub async fn clear_login_data() -> Result<(), String> {
//     println!("🗑️ 로그인 데이터 삭제");
//     Ok(())
// }

// #[tauri::command]
// pub fn manual_deep_link_test(url: String) -> Result<(), String> {
//     println!("🧪 딥링크 테스트: {}", url);
//     process_deep_link_url(url);
//     Ok(())
// }

use serde::{Deserialize, Serialize};
use std::{env, fs, path::PathBuf};
use url::Url;

// 로그인 정보만 저장하는 구조체
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LoginInfo {
    pub safe_token: Option<String>,
    pub username: Option<String>,
    pub department: Option<String>,
    pub role: Option<String>,
    pub email: Option<String>,
    pub session_id: Option<String>,
    pub login_method: Option<String>,
    pub timestamp: Option<String>,
    pub received_at: String,
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

// 딥링크 URL 처리 - 로그인 정보만 추출
pub fn process_deep_link_url(url: String) {
    println!("🎯 딥링크 처리: {}", url);

    if let Ok(parsed_url) = Url::parse(&url) {
        if parsed_url.scheme() == "cti-personal" {
            println!("🔍 로그인 정보 추출 중...");

            let mut login_info = LoginInfo {
                safe_token: None,
                username: None,
                department: None,
                role: None,
                email: None,
                session_id: None,
                login_method: None,
                timestamp: None,
                received_at: chrono::Utc::now()
                    .format("%Y-%m-%d %H:%M:%S UTC")
                    .to_string(),
            };

            // 쿼리 파라미터 추출
            for (key, value) in parsed_url.query_pairs() {
                match key.as_ref() {
                    "safe_token" => login_info.safe_token = Some(value.to_string()),
                    "username" => login_info.username = Some(value.to_string()),
                    "department" => login_info.department = Some(value.to_string()),
                    "role" => login_info.role = Some(value.to_string()),
                    "email" => login_info.email = Some(value.to_string()),
                    "session_id" => login_info.session_id = Some(value.to_string()),
                    "login_method" => login_info.login_method = Some(value.to_string()),
                    "timestamp" => login_info.timestamp = Some(value.to_string()),
                    _ => {}
                }
            }

            // 저장
            if let Err(e) = save_login_info(login_info) {
                println!("❌ 로그인 정보 저장 실패: {}", e);
            }
        }
    }
}

// 로그인 정보 저장 (기존 파일 덮어쓰기)
fn save_login_info(login_info: LoginInfo) -> Result<(), String> {
    let path: PathBuf = get_config_dir()?.join("login_info.json");

    println!("💾 로그인 정보 저장: {:?}", login_info);

    let json = serde_json::to_string_pretty(&login_info).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;

    println!(
        "✅ 로그인 정보 저장: {}",
        login_info.username.as_deref().unwrap_or("알 수 없음")
    );
    Ok(())
}

// 런처에서 호출할 명령어: 로그인 정보 가져오기
#[tauri::command]
pub async fn get_login_info() -> Result<String, String> {
    let path = get_config_dir()?.join("login_info.json");

    if path.exists() {
        let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        Ok(content)
    } else {
        Ok("{}".to_string())
    }
}

// 런처에서 호출할 명령어: 로그인 정보 삭제
#[tauri::command]
pub async fn clear_login_info() -> Result<(), String> {
    let path = get_config_dir()?.join("login_info.json");

    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
        println!("✅ 로그인 정보 삭제 완료");
    }

    Ok(())
}
