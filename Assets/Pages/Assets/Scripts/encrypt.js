function generateKey() {
    const key = Math.random().toString(36).substring(2, 15);
    document.getElementById('key').value = key;
}

function encryptText() {
    const inputText = document.getElementById('inputText').value;
    const key = document.getElementById('key').value;
    if (!inputText || !key) {
        alert('Please enter both text and key.');
        return;
    }
    const encryptedText = btoa(inputText + key);
    document.getElementById('outputText').value = encryptedText;
}

function decryptText() {
    const encryptedText = document.getElementById('inputText').value;
    const key = document.getElementById('key').value;
    if (!encryptedText || !key) {
        alert('Please enter both encrypted text and key.');
        return;
    }
    const decryptedText = atob(encryptedText).replace(key, '');
    document.getElementById('outputText').value = decryptedText;
}