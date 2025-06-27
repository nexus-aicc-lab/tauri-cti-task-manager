// commands/mod.rs
pub mod panel;

// 패널 관련 명령어들 re-export
pub use panel::{
    get_active_metrics_count, load_panel_settings, reset_panel_settings, save_panel_settings,
    toggle_all_metrics, toggle_metric_visibility,
};
