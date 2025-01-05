// Function to generate a random key
async function generateKey() {
    const key = await crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
    const exportedKey = await crypto.subtle.exportKey("jwk", key);
    document.getElementById("key").value = JSON.stringify(exportedKey);
}

// Function to encrypt text
async function encryptText() {
    const text = document.getElementById("inputText").value;
    const key = JSON.parse(document.getElementById("key").value);
    const importedKey = await crypto.subtle.importKey(
        "jwk",
        key,
        {
            name: "AES-GCM",
        },
        false,
        ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encodedText = new TextEncoder().encode(text);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        importedKey,
        encodedText
    );

    const buffer = new Uint8Array(encrypted);
    const ivAndCiphertext = new Uint8Array(iv.length + buffer.length);
    ivAndCiphertext.set(iv);
    ivAndCiphertext.set(buffer, iv.length);

    document.getElementById("outputText").value = btoa(String.fromCharCode(...ivAndCiphertext));
}

// Function to decrypt text
async function decryptText() {
    const encryptedText = document.getElementById("outputText").value;
    const key = JSON.parse(document.getElementById("key").value);
    const importedKey = await crypto.subtle.importKey(
        "jwk",
        key,
        {
            name: "AES-GCM",
        },
        false,
        ["decrypt"]
    );

    const ivAndCiphertext = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    const iv = ivAndCiphertext.slice(0, 12);
    const ciphertext = ivAndCiphertext.slice(12);

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        importedKey,
        ciphertext
    );

    const decodedText = new TextDecoder().decode(decrypted);
    document.getElementById("inputText").value = decodedText;
}