// lib.rs - 라이브러리 파일 (최소한으로 정리)
// 실제 앱은 main.rs에서 실행되므로 이 파일은 공통 유틸리티만 포함

use serde::{Deserialize, Serialize};

// 🔧 공통으로 사용할 수 있는 구조체들만 정의
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub app_name: String,
    pub version: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            app_name: "CTI Task Manager".to_string(),
            version: "0.1.0".to_string(),
        }
    }
}

// 🔧 기본 유틸리티 함수 (필요한 경우에만)
pub fn get_app_info() -> AppConfig {
    AppConfig::default()
}

// ⚠️ 주의: 실제 앱 로직은 모두 main.rs에서 처리됩니다
// 이 파일은 라이브러리용이므로 최소한으로 유지
