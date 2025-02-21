use rand::prelude::*;
use rsa::pkcs8::{
    DecodePrivateKey, DecodePublicKey, EncodePrivateKey, EncodePublicKey, LineEnding,
};
use rsa::{Pkcs1v15Encrypt, RsaPrivateKey, RsaPublicKey};
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct KeyPair {
    pub pub_key: String,
    pub priv_key: String,
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[wasm_bindgen]
pub fn generate_keypair(bits: Option<usize>) -> JsValue {
    let mut rng: ThreadRng = rand::thread_rng();
    let bits: usize = bits.unwrap_or(2048);
    let priv_key: RsaPrivateKey =
        RsaPrivateKey::new(&mut rng, bits).expect("failed to generate a key");
    let priv_key_pem = priv_key.to_pkcs8_pem(LineEnding::LF).unwrap();
    let pub_key: RsaPublicKey = RsaPublicKey::from(&priv_key);
    let pub_key_pem: String = pub_key.to_public_key_pem(LineEnding::LF).unwrap();
    let keys: KeyPair = KeyPair {
        pub_key: pub_key_pem,
        priv_key: priv_key_pem.to_string(),
    };
    let keys_obj: String = serde_json::to_string(&keys).unwrap();
    println!("Keys: {:?}", keys_obj);
    JsValue::from_str(&keys_obj)
}

#[wasm_bindgen]
pub fn encrypt(pub_key_pem: String, data: String) -> Vec<u8> {
    let mut rng: ThreadRng = rand::thread_rng();
    let data: &[u8] = data.as_bytes();
    let pub_key: RsaPublicKey = RsaPublicKey::from_public_key_pem(&pub_key_pem).unwrap();
    pub_key
        .encrypt(&mut rng, Pkcs1v15Encrypt, data)
        .expect("failed to encrypt")
}

#[wasm_bindgen]
pub fn decrypt(priv_key_pem: String, enc_data: Vec<u8>) -> String {
    let priv_key = RsaPrivateKey::from_pkcs8_pem(&priv_key_pem).unwrap();
    let dec_data = priv_key
        .decrypt(Pkcs1v15Encrypt, &enc_data)
        .expect("failed to decrypt");
    String::from_utf8(dec_data).unwrap()
}
