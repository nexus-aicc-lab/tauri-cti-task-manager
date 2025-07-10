// src-tauri/src/commands/notifications.rs
use std::process::Command;
use tauri::command;

#[command]
pub async fn show_desktop_notification(title: String, body: String) -> Result<(), String> {
    println!("🔔 데스크톱 알림 전송: {} - {}", title, body);

    #[cfg(target_os = "windows")]
    {
        // Windows Toast 알림 사용
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
                println!("✅ Windows Toast 알림 전송 성공");
                Ok(())
            }
            Err(e) => {
                println!("❌ Windows Toast 알림 실패: {}", e);
                Err(format!("알림 전송 실패: {}", e))
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        println!("⚠️ Windows가 아닌 환경에서는 데스크톱 알림을 지원하지 않습니다.");
        Err("Windows 전용 기능입니다.".to_string())
    }
}

#[command]
pub async fn play_notification_sound() -> Result<(), String> {
    println!("🔊 알림 사운드 재생");

    #[cfg(target_os = "windows")]
    {
        // 현재 작업 디렉토리 확인
        let current_dir = std::env::current_dir().unwrap_or_default();
        println!("🔍 현재 작업 디렉토리: {:?}", current_dir);

        // 1. WAV 파일 경로들 시도 (절대 경로 포함)
        let audio_paths = vec![
            "C:\\tauri\\cti-task-pilot\\public\\notifications\\status-changed-to-in-call.wav",
            "public\\notifications\\status-changed-to-in-call.wav",
            "notifications\\status-changed-to-in-call.wav",
            "..\\public\\notifications\\status-changed-to-in-call.wav",
            "src-tauri\\..\\public\\notifications\\status-changed-to-in-call.wav",
        ];

        for path in &audio_paths {
            println!("🔍 경로 확인 중: {}", path);
            if std::path::Path::new(path).exists() {
                println!("🎵 WAV 파일 발견: {}", path);

                // PowerShell로 WAV 파일 재생
                let script = format!(
                    r#"
                    Add-Type -AssemblyName System.Windows.Forms
                    $sound = New-Object System.Media.SoundPlayer("{}")
                    $sound.Play()
                    "#,
                    path.replace("\\", "\\\\")
                );

                match Command::new("powershell")
                    .args(&["-Command", &script])
                    .output()
                {
                    Ok(_) => {
                        println!("✅ WAV 파일 재생 성공: {}", path);
                        return Ok(());
                    }
                    Err(e) => {
                        println!("❌ WAV 파일 재생 실패: {} - {}", path, e);
                        continue;
                    }
                }
            }
        }

        // 2. WAV 파일 없으면 Windows Media Player 시도
        println!("⚠️ WAV 파일을 찾을 수 없어 시스템 사운드로 폴백");

        // Windows 시스템 알림음 재생
        let system_sound_script = r#"
            Add-Type -AssemblyName System.Windows.Forms
            [System.Media.SystemSounds]::Asterisk.Play()
        "#;

        match Command::new("powershell")
            .args(&["-Command", system_sound_script])
            .output()
        {
            Ok(_) => {
                println!("✅ 시스템 알림음 재생 성공");
                Ok(())
            }
            Err(e) => {
                println!("❌ 시스템 알림음도 실패, 비프음으로 최종 폴백: {}", e);

                // 최후 수단: 비프음
                match Command::new("powershell")
                    .args(&["-Command", "[console]::beep(1000, 500)"])
                    .output()
                {
                    Ok(_) => {
                        println!("✅ 비프음 재생 성공");
                        Ok(())
                    }
                    Err(e) => {
                        println!("❌ 모든 사운드 재생 실패: {}", e);
                        Err(format!("사운드 재생 실패: {}", e))
                    }
                }
            }
        }
    }

    #[cfg(not(target_os = "windows"))]
    {
        println!("⚠️ Windows가 아닌 환경에서는 시스템 사운드를 지원하지 않습니다.");
        Err("Windows 전용 기능입니다.".to_string())
    }
}

#[command]
pub async fn test_all_notifications() -> Result<String, String> {
    println!("🧪 모든 알림 방식 테스트 시작");

    // 1. 데스크톱 알림
    if let Err(e) = show_desktop_notification(
        "CTI Task Pilot".to_string(),
        "데스크톱 알림 테스트입니다.".to_string(),
    )
    .await
    {
        println!("❌ 데스크톱 알림 테스트 실패: {}", e);
    }

    // 2. 사운드 알림
    if let Err(e) = play_notification_sound().await {
        println!("❌ 사운드 알림 테스트 실패: {}", e);
    }

    // 3. 팝업 알림은 프론트엔드에서 처리
    println!("✅ 알림 테스트 완료");
    Ok("모든 알림 테스트가 완료되었습니다.".to_string())
}
