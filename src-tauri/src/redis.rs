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

// 상담원 상태 구조체
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentStatusEvent {
    pub channel: String,
    pub data: AgentStatusInfo,
}

pub async fn start_redis_subscriber(app_handle: AppHandle) {
    let redis_url = "redis://127.0.0.1:6379/";

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

    pubsub.subscribe("agent:status:1").await?;
    println!("🔔 Redis 채널 'agent:status:1' 구독 시작");

    loop {
        if let Some(msg) = pubsub.on_message().next().await {
            let channel: String = msg.get_channel_name().to_string();
            let payload: String = msg.get_payload()?;

            println!(
                "📨 Redis 메시지 수신: 채널={}, 내용 길이={}",
                channel,
                payload.len()
            );

            handle_agent_status_info(app_handle, &channel, &payload).await;
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimpleAgentStatus {
    #[serde(rename = "agentId")]
    pub agent_id: u64,
    pub name: String,
    #[serde(rename = "callStatus")]
    pub call_status: String,
}

async fn handle_agent_status_info(app_handle: &AppHandle, channel: &str, payload: &str) {
    match serde_json::from_str::<SimpleAgentStatus>(payload) {
        Ok(agent_status) => {
            println!("✅ 상담원 단건 상태 수신: {:?}", agent_status);

            // 예시: 이벤트로 넘기기
            if let Err(e) = app_handle.emit("redis-agent-status-single", &agent_status) {
                println!("❌ 단건 상담원 상태 이벤트 실패: {}", e);
            }
        }
        Err(e) => {
            println!(
                "❌ 상담원 상태 JSON 파싱 실패: {} - 원본 길이: {}",
                e,
                payload.len()
            );
            let preview = if payload.len() > 200 {
                &payload[..200]
            } else {
                payload
            };
            println!("   JSON 미리보기: {}...", preview);
        }
    }
}
