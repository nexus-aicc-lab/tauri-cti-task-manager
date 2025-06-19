// // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

// #[cfg_attr(mobile, tauri::mobile_entry_point)]
// pub fn run() {
//     tauri::Builder::default()
//         .plugin(tauri_plugin_opener::init())
//         .invoke_handler(tauri::generate_handler![greet])
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// 다이얼로그 플러그인 사용을 위한 import
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};

// 기존 greet 명령어 - 테스트용
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 정보 메시지 다이얼로그 표시 명령어
// 프론트엔드에서 invoke('show_message_dialog', { title: '제목', message: '내용' })로 호출
#[tauri::command]
fn show_message_dialog(app: tauri::AppHandle, title: String, message: String) {
    tauri::async_runtime::spawn(async move {
        app.dialog()
            .message(&message) // 다이얼로그에 표시할 메시지
            .title(&title) // 다이얼로그 제목
            .kind(MessageDialogKind::Info) // 정보 아이콘 표시
            .show(|_result| {}); // 비동기로 다이얼로그 표시
    });
}

// 확인/취소 다이얼로그 표시 명령어
// 사용자가 "예"를 클릭하면 true, "아니오"를 클릭하면 false 반환
#[tauri::command]
async fn show_confirm_dialog(
    app: tauri::AppHandle,
    title: &str,
    message: &str,
) -> Result<bool, String> {
    let result = app
        .dialog()
        .message(message) // 확인 메시지
        .title(title) // 다이얼로그 제목
        .kind(MessageDialogKind::Info) // 정보 아이콘 (Question이 없으므로 Info 사용)
        .buttons(MessageDialogButtons::OkCancel) // 확인/취소 버튼 추가
        .blocking_show(); // 동기적으로 사용자 응답 대기 후 결과 반환
    Ok(result)
}

// 애플리케이션 종료 명령어
// 프론트엔드에서 invoke('exit_app')로 호출
#[tauri::command]
async fn exit_app(app: tauri::AppHandle) {
    app.exit(0); // 종료 코드 0으로 애플리케이션 종료
}

// Tauri 애플리케이션 메인 실행 함수
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 외부 애플리케이션/URL 열기 플러그인 초기화
        .plugin(tauri_plugin_opener::init())
        // 네이티브 다이얼로그 플러그인 초기화
        .plugin(tauri_plugin_dialog::init())
        // 프로세스 관리 플러그인 초기화
        .plugin(tauri_plugin_process::init())
        // 프론트엔드에서 호출 가능한 명령어들 등록
        .invoke_handler(tauri::generate_handler![
            greet,               // 기존 테스트 명령어
            show_message_dialog, // 정보 다이얼로그 표시
            show_confirm_dialog, // 확인/취소 다이얼로그 표시
            exit_app             // 애플리케이션 종료
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
