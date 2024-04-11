use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ErrorResponse {
    pub ok: bool,
    pub error_id: String,
}

impl ErrorResponse {
    #[must_use]
    pub fn new(error_id: &String) -> Self {
        Self {
            ok: false,
            error_id: error_id.to_string(),
        }
    }
}
