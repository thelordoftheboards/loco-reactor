use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ErrorResponse {
    pub error_id: String,
    pub error_message: String,
}

impl ErrorResponse {
    #[must_use]
    pub fn new(error_id: &String, error_message: &String) -> Self {
        Self {
            error_id: error_id.to_string(),
            error_message: error_message.to_string(),
        }
    }
}
