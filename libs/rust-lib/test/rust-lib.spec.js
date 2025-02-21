describe('rust-lib', () => {
  test('e2e flow', async () => {
    const data = 'peanut butter';
    const { encrypt, decrypt, generate_keypair } = await import(
      '../pkg/wasm_encryption.js'
    );
    const keypair = generate_keypair();
    const publicKey = JSON.parse(keypair).pub_key;
    const privateKey = JSON.parse(keypair).priv_key;
    const encrypted = encrypt(publicKey, data);
    const decrypted = decrypt(privateKey, encrypted);
    expect(decrypted).toBe(data);
  });
});
