// // src-tauri/src/commands/context_menu.rs
// use tauri::{command, AppHandle, Manager};

// #[command]
// pub async fn show_tray_context_menu(app: AppHandle) -> Result<(), String> {
//     println!("📋 트레이 메뉴 호출됨");

//     // 가장 간단한 방법: 메뉴 하나만 시도
//     match create_simple_menu(&app) {
//         Ok(_) => println!("✅ 메뉴 생성 성공"),
//         Err(e) => {
//             println!("❌ 메뉴 생성 실패: {}", e);
//             // Fallback: 바로 설정 창 열기
//             use crate::windows::{add_window, WindowMode};
//             add_window(&app, WindowMode::SettingsWithPath("general".to_string()));
//         }
//     }

//     Ok(())
// }

// #[command]
// pub async fn show_context_menu_at_position(app: AppHandle, x: f64, y: f64) -> Result<(), String> {
//     println!("📋 위치 메뉴 호출됨: ({}, {})", x, y);

//     // 위치 기반 메뉴 생성 시도
//     match create_positioned_menu(&app, x, y) {
//         Ok(_) => println!("✅ 위치 메뉴 생성 성공"),
//         Err(e) => {
//             println!("❌ 위치 메뉴 생성 실패: {}", e);
//             // Fallback: 바로 설정 창 열기
//             use crate::windows::{add_window, WindowMode};
//             add_window(&app, WindowMode::SettingsWithPath("personal".to_string()));
//         }
//     }

//     Ok(())
// }

// fn create_simple_menu(app: &AppHandle) -> Result<(), String> {
//     println!("🔄 Tauri v2 Menu API 시도 중...");

//     // Tauri v2 Menu API
//     use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};

//     // 메뉴 아이템들 생성
//     let settings_item = MenuItem::with_id(app, "settings", "⚙️ 설정", true, None::<&str>)
//         .map_err(|e| format!("설정 메뉴 아이템 생성 실패: {}", e))?;

//     let personal_item = MenuItem::with_id(app, "personal", "👤 개인 설정", true, None::<&str>)
//         .map_err(|e| format!("개인 설정 메뉴 아이템 생성 실패: {}", e))?;

//     let separator =
//         PredefinedMenuItem::separator(app).map_err(|e| format!("구분선 생성 실패: {}", e))?;

//     let about_item = MenuItem::with_id(app, "about", "ℹ️ 정보", true, None::<&str>)
//         .map_err(|e| format!("정보 메뉴 아이템 생성 실패: {}", e))?;

//     // 메뉴 생성
//     let menu = Menu::with_items(
//         app,
//         &[&settings_item, &personal_item, &separator, &about_item],
//     )
//     .map_err(|e| format!("메뉴 생성 실패: {}", e))?;

//     // 현재 활성 윈도우에서 메뉴 표시
//     let windows = app.webview_windows();
//     if let Some((_, window)) = windows.iter().next() {
//         window
//             .popup_menu(&menu)
//             .map_err(|e| format!("메뉴 팝업 실패: {}", e))?;
//         println!("✅ 메뉴 팝업 성공!");
//         return Ok(());
//     }

//     Err("활성 윈도우가 없음".to_string())
// }

// fn create_positioned_menu(app: &AppHandle, x: f64, y: f64) -> Result<(), String> {
//     println!("🔄 Tauri v2 위치 기반 Menu API 시도 중...");

//     use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
//     use tauri::{LogicalPosition, Position};

//     // 메뉴 아이템들 생성 (위치 기반용)
//     let general_item = MenuItem::with_id(app, "general", "⚙️ 일반 설정", true, None::<&str>)
//         .map_err(|e| format!("일반 설정 메뉴 생성 실패: {}", e))?;

//     let personal_item = MenuItem::with_id(app, "personal", "👤 개인 설정", true, None::<&str>)
//         .map_err(|e| format!("개인 설정 메뉴 생성 실패: {}", e))?;

//     let separator1 =
//         PredefinedMenuItem::separator(app).map_err(|e| format!("구분선1 생성 실패: {}", e))?;

//     let stats_item = MenuItem::with_id(app, "statistics-view", "📊 통계보기", true, None::<&str>)
//         .map_err(|e| format!("통계 메뉴 생성 실패: {}", e))?;

//     let minibar_item = MenuItem::with_id(app, "minimap", "📱 미니바", true, None::<&str>)
//         .map_err(|e| format!("미니바 메뉴 생성 실패: {}", e))?;

//     let separator2 =
//         PredefinedMenuItem::separator(app).map_err(|e| format!("구분선2 생성 실패: {}", e))?;

//     let about_item = MenuItem::with_id(app, "about", "ℹ️ 정보", true, None::<&str>)
//         .map_err(|e| format!("정보 메뉴 생성 실패: {}", e))?;

//     // 메뉴 생성
//     let menu = Menu::with_items(
//         app,
//         &[
//             &general_item,
//             &personal_item,
//             &separator1,
//             &stats_item,
//             &minibar_item,
//             &separator2,
//             &about_item,
//         ],
//     )
//     .map_err(|e| format!("위치 메뉴 생성 실패: {}", e))?;

//     // 바 윈도우 찾기
//     let windows = app.webview_windows();
//     let bar_window = windows
//         .iter()
//         .find(|(label, _)| label.starts_with("bar_"))
//         .map(|(_, window)| window);

//     if let Some(window) = bar_window {
//         // 🔧 실제 위치 정보 사용!
//         let position = Position::Logical(LogicalPosition { x, y });

//         window
//             .popup_menu(&menu)
//             .map_err(|e| format!("위치 기반 메뉴 팝업 실패: {}", e))?;
//         println!("✅ 위치 기반 메뉴 팝업 성공! 위치: ({}, {})", x, y);
//         return Ok(());
//     }

//     Err("바 윈도우를 찾을 수 없음".to_string())
// }
// pub fn handle_context_menu_event(app: &AppHandle, menu_id: &str) {
//     println!("📋 메뉴 이벤트 받음: {}", menu_id);

//     use crate::windows::{add_window, WindowMode};

//     match menu_id {
//         "settings" | "general" => {
//             println!("📋 일반 설정 메뉴 클릭됨");
//             add_window(app, WindowMode::SettingsWithPath("general".to_string()));
//         }
//         "personal" => {
//             println!("📋 개인 설정 메뉴 클릭됨");
//             add_window(app, WindowMode::SettingsWithPath("personal".to_string()));
//         }
//         "statistics-view" => {
//             println!("📋 통계보기 메뉴 클릭됨");
//             add_window(
//                 app,
//                 WindowMode::SettingsWithPath("statistics-view".to_string()),
//             );
//         }
//         "minimap" => {
//             println!("📋 미니바 설정 메뉴 클릭됨");
//             add_window(app, WindowMode::SettingsWithPath("minimap".to_string()));
//         }
//         "about" => {
//             println!("📋 정보 메뉴 클릭됨");
//             add_window(app, WindowMode::SettingsWithPath("about".to_string()));
//         }
//         _ => {
//             println!("❓ 알 수 없는 메뉴 ID: {}", menu_id);
//         }
//     }
// }

// src-tauri/src/commands/context_menu.rs
use tauri::{command, AppHandle, Manager};

#[command]
pub async fn show_tray_context_menu(app: AppHandle) -> Result<(), String> {
    println!("📋 트레이 메뉴 호출됨");

    match create_simple_menu(&app) {
        Ok(_) => println!("✅ 메뉴 생성 성공"),
        Err(e) => {
            println!("❌ 메뉴 생성 실패: {}", e);
            // Fallback: 바로 설정 창 열기
            use crate::windows::{add_window, WindowMode};
            add_window(&app, WindowMode::SettingsWithPath("general".to_string()));
        }
    }

    Ok(())
}

#[command]
pub async fn show_context_menu_at_position(app: AppHandle, x: f64, y: f64) -> Result<(), String> {
    println!("📋 위치 메뉴 호출됨: ({}, {})", x, y);

    match create_positioned_menu(&app, x, y) {
        Ok(_) => println!("✅ 위치 메뉴 생성 성공"),
        Err(e) => {
            println!("❌ 위치 메뉴 생성 실패: {}", e);
            // Fallback: 바로 설정 창 열기
            use crate::windows::{add_window, WindowMode};
            add_window(&app, WindowMode::SettingsWithPath("personal".to_string()));
        }
    }

    Ok(())
}

fn create_simple_menu(app: &AppHandle) -> Result<(), String> {
    println!("🔄 Tauri v2 Menu API 시도 중...");

    use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};

    // 메뉴 아이템들 생성
    let settings_item = MenuItem::with_id(app, "settings", "⚙️ 설정", true, None::<&str>)
        .map_err(|e| format!("설정 메뉴 아이템 생성 실패: {}", e))?;

    let personal_item = MenuItem::with_id(app, "personal", "👤 개인 설정", true, None::<&str>)
        .map_err(|e| format!("개인 설정 메뉴 아이템 생성 실패: {}", e))?;

    let separator =
        PredefinedMenuItem::separator(app).map_err(|e| format!("구분선 생성 실패: {}", e))?;

    let about_item = MenuItem::with_id(app, "about", "ℹ️ 정보", true, None::<&str>)
        .map_err(|e| format!("정보 메뉴 아이템 생성 실패: {}", e))?;

    // 메뉴 생성
    let menu = Menu::with_items(
        app,
        &[&settings_item, &personal_item, &separator, &about_item],
    )
    .map_err(|e| format!("메뉴 생성 실패: {}", e))?;

    // 현재 활성 윈도우에서 커서 위치에 메뉴 표시
    let windows = app.webview_windows();
    if let Some((_, window)) = windows.iter().next() {
        window
            .popup_menu(&menu)
            .map_err(|e| format!("메뉴 팝업 실패: {}", e))?;
        println!("✅ 메뉴 팝업 성공!");
        return Ok(());
    }

    Err("활성 윈도우가 없음".to_string())
}

fn create_positioned_menu(app: &AppHandle, x: f64, y: f64) -> Result<(), String> {
    println!("🔄 Tauri v2 위치 기반 Menu API 시도 중...");

    use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
    use tauri::{LogicalPosition, Position};

    // 메뉴 아이템들 생성 (위치 기반용)
    let general_item = MenuItem::with_id(app, "general", "⚙️ 일반 설정", true, None::<&str>)
        .map_err(|e| format!("일반 설정 메뉴 생성 실패: {}", e))?;

    let personal_item = MenuItem::with_id(app, "personal", "👤 개인 설정", true, None::<&str>)
        .map_err(|e| format!("개인 설정 메뉴 생성 실패: {}", e))?;

    let separator1 =
        PredefinedMenuItem::separator(app).map_err(|e| format!("구분선1 생성 실패: {}", e))?;

    let stats_item = MenuItem::with_id(app, "statistics-view", "📊 통계보기", true, None::<&str>)
        .map_err(|e| format!("통계 메뉴 생성 실패: {}", e))?;

    let minibar_item = MenuItem::with_id(app, "minimap", "📱 미니바", true, None::<&str>)
        .map_err(|e| format!("미니바 메뉴 생성 실패: {}", e))?;

    let separator2 =
        PredefinedMenuItem::separator(app).map_err(|e| format!("구분선2 생성 실패: {}", e))?;

    let about_item = MenuItem::with_id(app, "about", "ℹ️ 정보", true, None::<&str>)
        .map_err(|e| format!("정보 메뉴 생성 실패: {}", e))?;

    // 메뉴 생성
    let menu = Menu::with_items(
        app,
        &[
            &general_item,
            &personal_item,
            &separator1,
            &stats_item,
            &minibar_item,
            &separator2,
            &about_item,
        ],
    )
    .map_err(|e| format!("위치 메뉴 생성 실패: {}", e))?;

    // 바 윈도우 찾기
    let windows = app.webview_windows();
    let bar_window = windows
        .iter()
        .find(|(label, _)| label.starts_with("bar_"))
        .map(|(_, window)| window);

    if let Some(window) = bar_window {
        // 🎯 정확한 위치에 메뉴 표시 - popup_menu_at 사용!
        let position = Position::Logical(LogicalPosition { x, y });

        window
            .popup_menu_at(&menu, position)
            .map_err(|e| format!("위치 기반 메뉴 팝업 실패: {}", e))?;

        println!("✅ 위치 기반 메뉴 팝업 성공! 위치: ({}, {})", x, y);
        return Ok(());
    }

    Err("바 윈도우를 찾을 수 없음".to_string())
}

pub fn handle_context_menu_event(app: &AppHandle, menu_id: &str) {
    println!("📋 메뉴 이벤트 받음: {}", menu_id);

    use crate::windows::{add_window, WindowMode};

    match menu_id {
        "settings" | "general" => {
            println!("📋 일반 설정 메뉴 클릭됨");
            add_window(app, WindowMode::SettingsWithPath("general".to_string()));
        }
        "personal" => {
            println!("📋 개인 설정 메뉴 클릭됨");
            add_window(app, WindowMode::SettingsWithPath("personal".to_string()));
        }
        "statistics-view" => {
            println!("📋 통계보기 메뉴 클릭됨");
            add_window(
                app,
                WindowMode::SettingsWithPath("statistics-view".to_string()),
            );
        }
        "minimap" => {
            println!("📋 미니바 설정 메뉴 클릭됨");
            add_window(app, WindowMode::SettingsWithPath("minimap".to_string()));
        }
        "about" => {
            println!("📋 정보 메뉴 클릭됨");
            add_window(app, WindowMode::SettingsWithPath("about".to_string()));
        }
        _ => {
            println!("❓ 알 수 없는 메뉴 ID: {}", menu_id);
        }
    }
}
