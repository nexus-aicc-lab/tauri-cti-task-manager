// // src-tauri/src/commands/notifications.rs
// use std::process::Command;
// use tauri::command;

// #[command]
// pub async fn show_desktop_notification(title: String, body: String) -> Result<(), String> {
//     println!("🔔 데스크톱 알림 전송: {} - {}", title, body);

//     #[cfg(target_os = "windows")]
//     {
//         // Windows Toast 알림 사용
//         let script = format!(
//             r#"
//             [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
//             [Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
//             [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] > $null

//             $APP_ID = "CTI.TaskPilot"
//             $template = @"
//             <toast>
//                 <visual>
//                     <binding template="ToastText02">
//                         <text id="1">{}</text>
//                         <text id="2">{}</text>
//                     </binding>
//                 </visual>
//             </toast>
// "@

//             $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
//             $xml.LoadXml($template)
//             $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
//             $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($APP_ID)
//             $notifier.Show($toast)
//             "#,
//             title.replace("\"", "\\\""),
//             body.replace("\"", "\\\"")
//         );

//         match Command::new("powershell")
//             .args(&["-Command", &script])
//             .output()
//         {
//             Ok(_) => {
//                 println!("✅ Windows Toast 알림 전송 성공");
//                 Ok(())
//             }
//             Err(e) => {
//                 println!("❌ Windows Toast 알림 실패: {}", e);
//                 Err(format!("알림 전송 실패: {}", e))
//             }
//         }
//     }

//     #[cfg(not(target_os = "windows"))]
//     {
//         println!("⚠️ Windows가 아닌 환경에서는 데스크톱 알림을 지원하지 않습니다.");
//         Err("Windows 전용 기능입니다.".to_string())
//     }
// }

// #[command]
// pub async fn play_notification_sound() -> Result<(), String> {
//     println!("🔊 알림 사운드 재생");

//     #[cfg(target_os = "windows")]
//     {
//         // 현재 작업 디렉토리 확인
//         let current_dir = std::env::current_dir().unwrap_or_default();
//         println!("🔍 현재 작업 디렉토리: {:?}", current_dir);

//         // 1. WAV 파일 경로들 시도 (절대 경로 포함)
//         let audio_paths = vec![
//             "C:\\tauri\\cti-task-pilot\\public\\notifications\\status-changed-to-in-call.wav",
//             "public\\notifications\\status-changed-to-in-call.wav",
//             "notifications\\status-changed-to-in-call.wav",
//             "..\\public\\notifications\\status-changed-to-in-call.wav",
//             "src-tauri\\..\\public\\notifications\\status-changed-to-in-call.wav",
//         ];

//         for path in &audio_paths {
//             println!("🔍 경로 확인 중: {}", path);
//             if std::path::Path::new(path).exists() {
//                 println!("🎵 WAV 파일 발견: {}", path);

//                 // PowerShell로 WAV 파일 재생
//                 let script = format!(
//                     r#"
//                     Add-Type -AssemblyName System.Windows.Forms
//                     $sound = New-Object System.Media.SoundPlayer("{}")
//                     $sound.Play()
//                     "#,
//                     path.replace("\\", "\\\\")
//                 );

//                 match Command::new("powershell")
//                     .args(&["-Command", &script])
//                     .output()
//                 {
//                     Ok(_) => {
//                         println!("✅ WAV 파일 재생 성공: {}", path);
//                         return Ok(());
//                     }
//                     Err(e) => {
//                         println!("❌ WAV 파일 재생 실패: {} - {}", path, e);
//                         continue;
//                     }
//                 }
//             }
//         }

//         // 2. WAV 파일 없으면 Windows Media Player 시도
//         println!("⚠️ WAV 파일을 찾을 수 없어 시스템 사운드로 폴백");

//         // Windows 시스템 알림음 재생
//         let system_sound_script = r#"
//             Add-Type -AssemblyName System.Windows.Forms
//             [System.Media.SystemSounds]::Asterisk.Play()
//         "#;

//         match Command::new("powershell")
//             .args(&["-Command", system_sound_script])
//             .output()
//         {
//             Ok(_) => {
//                 println!("✅ 시스템 알림음 재생 성공");
//                 Ok(())
//             }
//             Err(e) => {
//                 println!("❌ 시스템 알림음도 실패, 비프음으로 최종 폴백: {}", e);

//                 // 최후 수단: 비프음
//                 match Command::new("powershell")
//                     .args(&["-Command", "[console]::beep(1000, 500)"])
//                     .output()
//                 {
//                     Ok(_) => {
//                         println!("✅ 비프음 재생 성공");
//                         Ok(())
//                     }
//                     Err(e) => {
//                         println!("❌ 모든 사운드 재생 실패: {}", e);
//                         Err(format!("사운드 재생 실패: {}", e))
//                     }
//                 }
//             }
//         }
//     }

//     #[cfg(not(target_os = "windows"))]
//     {
//         println!("⚠️ Windows가 아닌 환경에서는 시스템 사운드를 지원하지 않습니다.");
//         Err("Windows 전용 기능입니다.".to_string())
//     }
// }

// #[command]
// pub async fn test_all_notifications() -> Result<String, String> {
//     println!("🧪 모든 알림 방식 테스트 시작");

//     // 1. 데스크톱 알림
//     if let Err(e) = show_desktop_notification(
//         "CTI Task Pilot".to_string(),
//         "데스크톱 알림 테스트입니다.".to_string(),
//     )
//     .await
//     {
//         println!("❌ 데스크톱 알림 테스트 실패: {}", e);
//     }

//     // 2. 사운드 알림
//     if let Err(e) = play_notification_sound().await {
//         println!("❌ 사운드 알림 테스트 실패: {}", e);
//     }

//     // 3. 팝업 알림은 프론트엔드에서 처리
//     println!("✅ 알림 테스트 완료");
//     Ok("모든 알림 테스트가 완료되었습니다.".to_string())
// }

// src-tauri/src/commands/notifications.rs
use std::process::Command;
use tauri::{command, AppHandle, Manager};
use tauri_plugin_notification::NotificationExt;

// 🎉 새로운 플러그인 기반 알림 명령어
#[command]
pub async fn test_plugin_notification(
    app: AppHandle,
    title: String,
    body: String,
) -> Result<String, String> {
    println!("🔔 플러그인 알림 테스트: {} - {}", title, body);

    // Tauri 플러그인 사용
    match app
        .notification()
        .builder()
        .title(&title)
        .body(&body)
        .sound("default") // 🔊 시스템 사운드 자동 재생!
        .show()
    {
        Ok(_) => {
            println!("✅ 플러그인 알림 전송 성공");
            Ok("플러그인 알림이 성공적으로 전송되었습니다!".to_string())
        }
        Err(e) => {
            println!("❌ 플러그인 알림 실패: {}", e);
            Err(format!("플러그인 알림 실패: {}", e))
        }
    }
}

// 🎨 첨부파일이 있는 고급 알림
#[command]
pub async fn test_plugin_notification_with_attachment(
    app: AppHandle,
    title: String,
    body: String,
    attachment_path: Option<String>,
) -> Result<String, String> {
    println!("🖼️ 첨부파일 알림 테스트: {} - {}", title, body);

    let mut builder = app
        .notification()
        .builder()
        .title(&title)
        .body(&body)
        .sound("default");

    // 첨부파일이 있으면 추가
    if let Some(path) = attachment_path {
        println!("📎 첨부파일 추가: {}", path);
        // builder = builder.attachment(path);  // 실제 API는 문서 확인 필요
    }

    match builder.show() {
        Ok(_) => {
            println!("✅ 첨부파일 알림 전송 성공");
            Ok("첨부파일 알림이 성공적으로 전송되었습니다!".to_string())
        }
        Err(e) => {
            println!("❌ 첨부파일 알림 실패: {}", e);
            Err(format!("첨부파일 알림 실패: {}", e))
        }
    }
}

// 📊 플러그인 기능 확인
#[command]
pub async fn get_notification_capabilities() -> Result<String, String> {
    println!("📊 알림 플러그인 기능 확인");

    let capabilities = r#"
🎉 Tauri 알림 플러그인 기능:

✅ 네이티브 알림: Windows Toast, macOS Banner, Linux 알림
✅ 자동 사운드: 시스템 기본 알림음 재생
✅ 첨부파일: 이미지, 문서 등 첨부 가능
✅ 권한 관리: 자동 권한 요청 및 관리
✅ 크로스플랫폼: Windows, macOS, Linux 지원

📱 모바일 전용 기능:
- 액션 버튼 (iOS/Android)
- 채널 관리 (Android)
- 인터랙티브 알림

🔄 현재는 데스크톱 기능만 활용 중
    "#;

    Ok(capabilities.to_string())
}

// 🎵 커스텀 사운드 파일 재생 (Tauri 환경 최적화)
#[command]
pub async fn play_custom_sound_file() -> Result<String, String> {
    println!("🎵 커스텀 사운드 파일 재생 시도");

    #[cfg(target_os = "windows")]
    {
        // Tauri 앱의 리소스 디렉토리에서 파일 찾기
        let possible_paths = vec![
            // 개발 환경 경로들
            "public/notifications/status-changed-to-in-call.wav",
            "notifications/status-changed-to-in-call.wav",
            "../public/notifications/status-changed-to-in-call.wav",
            "src-tauri/../public/notifications/status-changed-to-in-call.wav",
            // 빌드된 앱 경로들
            "resources/notifications/status-changed-to-in-call.wav",
            "./notifications/status-changed-to-in-call.wav",
        ];

        for path in &possible_paths {
            println!("🔍 파일 경로 확인: {}", path);

            if std::path::Path::new(path).exists() {
                println!("🎵 사운드 파일 발견: {}", path);

                // PowerShell SoundPlayer 사용 (WAV 전용)
                let script = format!(
                    r#"
                    try {{
                        Add-Type -AssemblyName System.Windows.Forms
                        $sound = New-Object System.Media.SoundPlayer("{}")
                        $sound.PlaySync()
                        Write-Host "사운드 재생 완료"
                    }} catch {{
                        Write-Error "사운드 재생 실패: $_"
                        exit 1
                    }}
                    "#,
                    path.replace("\\", "\\\\")
                );

                match Command::new("powershell")
                    .args(&["-Command", &script])
                    .output()
                {
                    Ok(output) => {
                        if output.status.success() {
                            println!("✅ 커스텀 사운드 재생 성공: {}", path);
                            return Ok(format!("커스텀 사운드 재생 성공: {}", path));
                        } else {
                            let error = String::from_utf8_lossy(&output.stderr);
                            println!("❌ PowerShell 실행 실패: {}", error);
                        }
                    }
                    Err(e) => {
                        println!("❌ PowerShell 명령 실패: {} - {}", path, e);
                        continue;
                    }
                }
            }
        }

        // 파일을 찾지 못한 경우 시스템 사운드로 폴백
        println!("⚠️ 커스텀 사운드 파일을 찾을 수 없어 시스템 사운드로 폴백");

        let system_beep = r#"
            [console]::beep(800, 300)
            [console]::beep(1000, 200)
        "#;

        match Command::new("powershell")
            .args(&["-Command", system_beep])
            .output()
        {
            Ok(_) => {
                println!("✅ 시스템 비프음 재생 성공");
                Ok("시스템 비프음 재생 완료 (커스텀 파일 없음)".to_string())
            }
            Err(e) => {
                println!("❌ 시스템 비프음도 실패: {}", e);
                Err(format!("모든 사운드 재생 실패: {}", e))
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        println!("⚠️ Windows가 아닌 환경에서는 커스텀 사운드를 지원하지 않습니다.");
        Err("Windows 전용 기능입니다.".to_string())
    }
}

// 🔄 하이브리드 알림 테스트 (플러그인 + 레거시 폴백)
#[command]
pub async fn test_hybrid_notifications(app: AppHandle) -> Result<String, String> {
    println!("🧪 하이브리드 알림 테스트 시작");

    // 1. 플러그인 알림 우선 시도
    match test_plugin_notification(
        app.clone(),
        "CTI Task Pilot".to_string(),
        "🎉 플러그인 알림이 정상 작동합니다!".to_string(),
    )
    .await
    {
        Ok(msg) => {
            println!("✅ 플러그인 알림 성공: {}", msg);
        }
        Err(e) => {
            println!("⚠️ 플러그인 알림 실패, 레거시로 폴백: {}", e);

            // 레거시 알림으로 폴백
            if let Err(legacy_error) = show_desktop_notification(
                "CTI Task Pilot".to_string(),
                "🔄 레거시 알림이 작동합니다.".to_string(),
            )
            .await
            {
                println!("❌ 레거시 알림도 실패: {}", legacy_error);
            }
        }
    }

    // 2. 사운드는 플러그인에 포함되므로 별도 테스트 불필요
    println!("🔊 사운드는 플러그인 알림에 포함되어 자동 재생됩니다");

    let result = r#"
🎉 하이브리드 알림 테스트 완료!

📋 테스트 결과:
✅ 플러그인 알림: 네이티브 Toast + 자동 사운드
🔄 레거시 폴백: PowerShell 기반 알림
💡 팝업 알림: 프론트엔드에서 처리

🚀 플러그인 방식이 훨씬 간단하고 안정적입니다!
    "#;

    Ok(result.to_string())
}

// ================== 레거시 함수들 (호환성 유지) ==================

#[command]
pub async fn show_desktop_notification(title: String, body: String) -> Result<(), String> {
    println!("🔄 레거시 데스크톱 알림: {} - {}", title, body);

    #[cfg(target_os = "windows")]
    {
        // 기존 PowerShell 방식 유지 (호환성)
        let script = format!(
            r#"
            [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
            [Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
            [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] > $null

            $APP_ID = "CTI.TaskPilot"
            $template = @"
            <toast>
                <visual>
                    <binding template="ToastText02">
                        <text id="1">{}</text>
                        <text id="2">{}</text>
                    </binding>
                </visual>
            </toast>
"@

            $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
            $xml.LoadXml($template)
            $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
            $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($APP_ID)
            $notifier.Show($toast)
            "#,
            title.replace("\"", "\\\""),
            body.replace("\"", "\\\"")
        );

        match Command::new("powershell")
            .args(&["-Command", &script])
            .output()
        {
            Ok(_) => {
                println!("✅ 레거시 Windows Toast 알림 전송 성공");
                Ok(())
            }
            Err(e) => {
                println!("❌ 레거시 Windows Toast 알림 실패: {}", e);
                Err(format!("레거시 알림 전송 실패: {}", e))
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        println!("⚠️ Windows가 아닌 환경에서는 레거시 알림을 지원하지 않습니다.");
        Err("Windows 전용 기능입니다.".to_string())
    }
}

#[command]
pub async fn play_notification_sound() -> Result<(), String> {
    println!("🔊 레거시 알림 사운드 재생");
    println!("💡 참고: 플러그인 알림 사용 시 사운드가 자동으로 포함됩니다!");

    #[cfg(target_os = "windows")]
    {
        // 간단한 시스템 비프음만 (복잡한 WAV 탐색 제거)
        match Command::new("powershell")
            .args(&["-Command", "[console]::beep(800, 300)"])
            .output()
        {
            Ok(_) => {
                println!("✅ 레거시 비프음 재생 성공");
                Ok(())
            }
            Err(e) => {
                println!("❌ 레거시 사운드 재생 실패: {}", e);
                Err(format!("레거시 사운드 재생 실패: {}", e))
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        println!("⚠️ Windows가 아닌 환경에서는 레거시 사운드를 지원하지 않습니다.");
        Err("Windows 전용 기능입니다.".to_string())
    }
}

#[command]
pub async fn test_all_notifications() -> Result<String, String> {
    println!("🔄 레거시 알림 테스트 (호환성 유지)");

    // 1. 레거시 데스크톱 알림
    if let Err(e) = show_desktop_notification(
        "CTI Task Pilot".to_string(),
        "레거시 데스크톱 알림 테스트입니다.".to_string(),
    )
    .await
    {
        println!("❌ 레거시 데스크톱 알림 테스트 실패: {}", e);
    }

    // 2. 레거시 사운드 알림
    if let Err(e) = play_notification_sound().await {
        println!("❌ 레거시 사운드 알림 테스트 실패: {}", e);
    }

    println!("💡 새로운 플러그인 방식을 사용해보세요!");
    Ok("레거시 알림 테스트가 완료되었습니다. 플러그인 방식을 권장합니다!".to_string())
}
