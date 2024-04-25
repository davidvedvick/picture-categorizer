#[derive(Clone)]
pub struct EmailIdentifiedCatEmployee {
    pub email: String,
}

unsafe impl Send for EmailIdentifiedCatEmployee {}

unsafe impl Sync for EmailIdentifiedCatEmployee {}
