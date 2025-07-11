// use futures_util::StreamExt;
// use redis::{AsyncCommands, Client};
// use serde::{Deserialize, Serialize};
// use tauri::{AppHandle, Emitter, Manager};
// use tokio::time::{sleep, Duration};

// #[derive(Debug, Clone, Serialize, Deserialize)]
// pub struct UserProfileUpdate {
//     #[serde(rename = "userId")]
//     pub user_id: u64,
//     pub field: String,
//     #[serde(rename = "newValue")]
//     pub new_value: String,
//     pub timestamp: u64,
// }

// #[derive(Debug, Clone, Serialize, Deserialize)]
// pub struct RedisEvent {
//     pub channel: String,
//     pub data: UserProfileUpdate,
// }

// pub async fn start_redis_subscriber(app_handle: AppHandle) {
//     let redis_url = "redis://127.0.0.1:6379/";

//     loop {
//         match connect_and_subscribe(&app_handle, redis_url).await {
//             Ok(_) => {
//                 println!("✅ Redis 구독이 정상적으로 종료되었습니다");
//             }
//             Err(e) => {
//                 println!("❌ Redis 연결 오류: {}. 5초 후 재시도...", e);
//                 sleep(Duration::from_secs(5)).await;
//             }
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

//     // user:profile:updated 채널 구독
//     pubsub.subscribe("user:profile:updated").await?;
//     println!("🔔 Redis 채널 'user:profile:updated' 구독 시작");

//     loop {
//         let msg = pubsub.on_message().next().await;

//         if let Some(msg) = msg {
//             let channel: String = msg.get_channel_name().to_string();
//             let payload: String = msg.get_payload()?;

//             println!("📨 Redis 메시지 수신: 채널={}, 내용={}", channel, payload);

//             // JSON 파싱
//             match serde_json::from_str::<UserProfileUpdate>(&payload) {
//                 Ok(user_update) => {
//                     let redis_event = RedisEvent {
//                         channel: channel.clone(),
//                         data: user_update,
//                     };

//                     // 모든 윈도우에 이벤트 브로드캐스트
//                     if let Err(e) = app_handle.emit("redis-user-profile-update", &redis_event) {
//                         println!("❌ 이벤트 브로드캐스트 실패: {}", e);
//                     } else {
//                         println!("✅ 이벤트 브로드캐스트 성공: {:?}", redis_event);
//                     }
//                 }
//                 Err(e) => {
//                     println!("❌ JSON 파싱 실패: {} - 원본: {}", e, payload);
//                 }
//             }
//         }
//     }
// }

// // 수동 테스트용 커맨드 (선택사항)
// #[tauri::command]
// pub async fn test_redis_connection() -> Result<String, String> {
//     let client = Client::open("redis://127.0.0.1:6379/")
//         .map_err(|e| format!("Redis 클라이언트 생성 실패: {}", e))?;

//     let mut con = client
//         .get_async_connection()
//         .await
//         .map_err(|e| format!("Redis 연결 실패: {}", e))?;

//     let _: () = con
//         .set("test_key", "test_value")
//         .await
//         .map_err(|e| format!("Redis 쓰기 실패: {}", e))?;

//     let result: String = con
//         .get("test_key")
//         .await
//         .map_err(|e| format!("Redis 읽기 실패: {}", e))?;

//     Ok(format!("Redis 연결 성공! 테스트 값: {}", result))
// }

use futures_util::StreamExt;
use redis::{AsyncCommands, Client};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager};
use tokio::time::{sleep, Duration};

// ✅ 기존 UserProfileUpdate 유지 (호환성)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfileUpdate {
    #[serde(rename = "userId")]
    pub user_id: u64,
    pub field: String,
    #[serde(rename = "newValue")]
    pub new_value: String,
    pub timestamp: u64,
}

// ✅ 새로운 상담원 상태 정보 구조체
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentInfo {
    pub id: u64,
    pub name: String,
    pub email: String,
    #[serde(rename = "callStatus")]
    pub call_status: String,
    #[serde(rename = "statusIndex")]
    pub status_index: u32,
    #[serde(rename = "waitingCalls")]
    pub waiting_calls: u32,
    #[serde(rename = "currentCallDuration")]
    pub current_call_duration: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentStatistics {
    #[serde(rename = "totalAgents")]
    pub total_agents: u32,
    #[serde(rename = "availableCount")]
    pub available_count: u64,
    #[serde(rename = "onCallCount")]
    pub on_call_count: u64,
    #[serde(rename = "wrapUpCount")]
    pub wrap_up_count: u64,
    #[serde(rename = "breakCount")]
    pub break_count: u64,
    #[serde(rename = "totalWaitingCalls")]
    pub total_waiting_calls: u32,
    #[serde(rename = "avgWaitTime")]
    pub avg_wait_time: String,
    #[serde(rename = "longestWaitTime")]
    pub longest_wait_time: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentStatusInfo {
    pub agents: Vec<AgentInfo>,
    pub statistics: AgentStatistics,
    pub timestamp: u64,
}

// ✅ Redis 이벤트 래퍼들
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RedisEvent {
    pub channel: String,
    pub data: UserProfileUpdate,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentStatusEvent {
    pub channel: String,
    pub data: AgentStatusInfo,
}

pub async fn start_redis_subscriber(app_handle: AppHandle) {
    let redis_url = "redis://127.0.0.1:6379/"; // ✅ IP와 database 4 설정

    loop {
        match connect_and_subscribe(&app_handle, redis_url).await {
            Ok(_) => {
                println!("✅ Redis 구독이 정상적으로 종료되었습니다");
            }
            Err(e) => {
                println!("❌ Redis 연결 오류: {}. 5초 후 재시도...", e);
                sleep(Duration::from_secs(5)).await;
            }
        }
    }
}

async fn connect_and_subscribe(
    app_handle: &AppHandle,
    redis_url: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client = Client::open(redis_url)?;
    let mut con = client.get_async_connection().await?;
    let mut pubsub = con.into_pubsub();

    // ✅ 두 채널 모두 구독
    pubsub.subscribe("user:profile:updated").await?;
    pubsub.subscribe("agent:call-status:info").await?;
    println!("🔔 Redis 채널 구독 시작:");
    println!("   - user:profile:updated");
    println!("   - agent:call-status:info");

    loop {
        let msg = pubsub.on_message().next().await;

        if let Some(msg) = msg {
            let channel: String = msg.get_channel_name().to_string();
            let payload: String = msg.get_payload()?;

            println!(
                "📨 Redis 메시지 수신: 채널={}, 내용 길이={}",
                channel,
                payload.len()
            );

            match channel.as_str() {
                // ✅ 기존 사용자 프로필 업데이트 처리
                "user:profile:updated" => {
                    handle_user_profile_update(app_handle, &channel, &payload).await;
                }
                // ✅ 새로운 상담원 상태 정보 처리
                "agent:call-status:info" => {
                    handle_agent_status_info(app_handle, &channel, &payload).await;
                }
                _ => {
                    println!("⚠️ 알 수 없는 채널: {}", channel);
                }
            }
        }
    }
}

async fn handle_user_profile_update(app_handle: &AppHandle, channel: &str, payload: &str) {
    match serde_json::from_str::<UserProfileUpdate>(payload) {
        Ok(user_update) => {
            let redis_event = RedisEvent {
                channel: channel.to_string(),
                data: user_update,
            };

            if let Err(e) = app_handle.emit("redis-user-profile-update", &redis_event) {
                println!("❌ 사용자 프로필 이벤트 브로드캐스트 실패: {}", e);
            } else {
                println!("✅ 사용자 프로필 이벤트 브로드캐스트 성공");
            }
        }
        Err(e) => {
            println!("❌ 사용자 프로필 JSON 파싱 실패: {} - 원본: {}", e, payload);
        }
    }
}

async fn handle_agent_status_info(app_handle: &AppHandle, channel: &str, payload: &str) {
    match serde_json::from_str::<AgentStatusInfo>(payload) {
        Ok(agent_status) => {
            let agent_event = AgentStatusEvent {
                channel: channel.to_string(),
                data: agent_status,
            };

            // ✅ 새로운 이벤트명으로 브로드캐스트
            if let Err(e) = app_handle.emit("redis-agent-status-update", &agent_event) {
                println!("❌ 상담원 상태 이벤트 브로드캐스트 실패: {}", e);
            } else {
                println!(
                    "✅ 상담원 상태 이벤트 브로드캐스트 성공 - {} 명",
                    agent_event.data.agents.len()
                );
            }
        }
        Err(e) => {
            println!(
                "❌ 상담원 상태 JSON 파싱 실패: {} - 원본 길이: {}",
                e,
                payload.len()
            );
            // 디버깅용: 처음 200자만 출력
            let preview = if payload.len() > 200 {
                &payload[..200]
            } else {
                payload
            };
            println!("   JSON 미리보기: {}...", preview);
        }
    }
}

#[tauri::command]
pub async fn test_redis_connection() -> Result<String, String> {
    let client = Client::open("redis://127.0.0.1:6379/") // ✅ 설정 통일
        .map_err(|e| format!("Redis 클라이언트 생성 실패: {}", e))?;

    let mut con = client
        .get_async_connection()
        .await
        .map_err(|e| format!("Redis 연결 실패: {}", e))?;

    let _: () = con
        .set("test_key", "test_value")
        .await
        .map_err(|e| format!("Redis 쓰기 실패: {}", e))?;

    let result: String = con
        .get("test_key")
        .await
        .map_err(|e| format!("Redis 읽기 실패: {}", e))?;

    Ok(format!("Redis 연결 성공! 테스트 값: {}", result))
}
