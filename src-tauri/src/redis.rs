// use futures_util::StreamExt;
// use redis::{AsyncCommands, Client};
// use serde::{Deserialize, Serialize};
// use tauri::{AppHandle, Emitter, Manager};
// use tokio::time::{sleep, Duration};

// #[derive(Debug, Clone, Serialize, Deserialize)]
// pub struct SimpleAgentStatus {
//     #[serde(rename = "agentId")]
//     pub agent_id: u64,
//     pub name: String,
//     #[serde(rename = "callStatus")]
//     pub call_status: String,
// }

// pub async fn start_redis_subscriber(app_handle: AppHandle) {
//     let redis_url = "redis://127.0.0.1:6379/";
//     loop {
//         if let Err(e) = connect_and_subscribe(&app_handle, redis_url).await {
//             println!("❌ Redis 연결 실패: {} → 5초 후 재시도", e);
//             sleep(Duration::from_secs(5)).await;
//         } else {
//             println!("✅ Redis 구독 정상 종료");
//         }
//     }
// }

// async fn connect_and_subscribe(
//     app_handle: &AppHandle,
//     redis_url: &str,
// ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
//     let client = Client::open(redis_url)?;
//     let mut con = client.get_async_connection().await?;
//     let mut pubsub = con.into_pubsub();

//     pubsub.subscribe("personal:agent-info:2").await?;
//     println!("📡 Redis 채널 구독 시작: personal:agent-info:2");

//     while let Some(msg) = pubsub.on_message().next().await {
//         let payload: String = msg.get_payload()?;
//         handle_agent_status_info(app_handle, &payload).await;
//     }
//     Ok(())
// }

// async fn handle_agent_status_info(app_handle: &AppHandle, payload: &str) {
//     match serde_json::from_str::<SimpleAgentStatus>(payload) {
//         Ok(agent_status) => {
//             println!("✅ 상담원 상태 수신: {:?}", agent_status);
//             if let Err(e) = app_handle.emit("redis-agent-status-single", &agent_status) {
//                 println!("❌ 이벤트 전송 실패: {}", e);
//             }
//         }
//         Err(e) => {
//             println!("❌ JSON 파싱 실패: {} | 길이: {}", e, payload.len());
//         }
//     }
// }

use futures_util::StreamExt;
use redis::{AsyncCommands, Client};
use serde::{Deserialize, Serialize};
use std::{env, fs, path::PathBuf};
use tauri::{AppHandle, Emitter, Manager};
use tokio::time::{sleep, Duration};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimpleAgentStatus {
    #[serde(rename = "agentId")]
    pub agent_id: u64,
    pub name: String,
    #[serde(rename = "callStatus")]
    pub call_status: String,
}

// 로그인 정보 구조체 (deeplink.rs와 동일)
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LoginInfo {
    pub safe_token: Option<String>,
    pub username: Option<String>,
    pub user_id: Option<String>,
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

// 로그인 정보에서 user_id 가져오기
async fn get_user_id_from_login_info() -> Result<String, String> {
    let path = get_config_dir()?.join("login_info.json");

    if !path.exists() {
        return Err("로그인 정보 파일이 존재하지 않습니다".to_string());
    }

    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let login_info: LoginInfo =
        serde_json::from_str(&content).map_err(|e| format!("로그인 정보 파싱 실패: {}", e))?;

    match login_info.user_id {
        Some(user_id) => {
            println!("✅ 로그인 정보에서 user_id 확인: {}", user_id);
            Ok(user_id)
        }
        None => Err("로그인 정보에 user_id가 없습니다".to_string()),
    }
}

pub async fn start_redis_subscriber(app_handle: AppHandle) {
    let redis_url = "redis://127.0.0.1:6379/";

    println!("🔗 Redis 구독 시작: {}", redis_url);

    loop {
        // 로그인 정보에서 user_id 가져오기
        match get_user_id_from_login_info().await {
            Ok(user_id) => {
                println!("🔍 사용자 ID 확인: {}", user_id);

                if let Err(e) = connect_and_subscribe(&app_handle, redis_url, &user_id).await {
                    println!("❌ Redis 연결 실패: {} → 5초 후 재시도", e);
                    sleep(Duration::from_secs(5)).await;
                } else {
                    println!("✅ Redis 구독 정상 종료");
                }
            }
            Err(e) => {
                println!("❌ 사용자 ID 획득 실패: {} → 10초 후 재시도", e);
                sleep(Duration::from_secs(10)).await;
            }
        }
    }
}

async fn connect_and_subscribe(
    app_handle: &AppHandle,
    redis_url: &str,
    user_id: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client = Client::open(redis_url)?;
    let mut con = client.get_async_connection().await?;
    let mut pubsub = con.into_pubsub();

    // 동적으로 채널명 생성
    let channel = format!("personal:agent-info:{}", user_id);
    println!("📡 Redis 채널 구독 시작1: {}", channel);
    pubsub.subscribe(&channel).await?;
    println!("📡 Redis 채널 구독 시작2: {}", channel);

    while let Some(msg) = pubsub.on_message().next().await {
        let payload: String = msg.get_payload()?;
        handle_agent_status_info(app_handle, &payload).await;
    }
    Ok(())
}

async fn handle_agent_status_info(app_handle: &AppHandle, payload: &str) {
    match serde_json::from_str::<SimpleAgentStatus>(payload) {
        Ok(agent_status) => {
            println!("✅ 상담원 상태 수신: {:?}", agent_status);
            if let Err(e) = app_handle.emit("redis-agent-status-single", &agent_status) {
                println!("❌ 이벤트 전송 실패: {}", e);
            }
        }
        Err(e) => {
            println!("❌ JSON 파싱 실패: {} | 길이: {}", e, payload.len());
        }
    }
}

// 수동으로 Redis 구독을 재시작할 수 있는 커맨드 (선택사항)
#[tauri::command]
pub async fn restart_redis_subscription(app_handle: AppHandle) -> Result<String, String> {
    match get_user_id_from_login_info().await {
        Ok(user_id) => {
            println!("🔄 Redis 구독 재시작 - 사용자 ID: {}", user_id);
            // 백그라운드에서 새로운 구독 시작
            tokio::spawn(start_redis_subscriber(app_handle));
            Ok(format!("Redis 구독 재시작됨 (사용자 ID: {})", user_id))
        }
        Err(e) => Err(format!("사용자 ID 획득 실패: {}", e)),
    }
}
