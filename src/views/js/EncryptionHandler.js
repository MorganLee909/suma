export default class EncryptionHandler {
    constructor(key){
        this._key = key;
    }

    static async create(password, salt){
        const key = await EncryptionHandler.generateEncryptionKey(password, salt);
        return new EncryptionHandler(key);
    }

    static async hashPassword(password, salt){
        const iterations = 100000;
        const hash = "SHA-256";
        const encoder = new TextEncoder();

        const baseKey = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            {name: "PBKDF2"},
            false,
            ["deriveBits"]
        );

        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt: encoder.encode(salt),
                iterations,
                hash
            },
            baseKey,
            256
        );

        return btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
    }

    static generateSalt(){
        const length = 16;
        const salt = new Uint8Array(length);
        crypto.getRandomValues(salt);
        return btoa(String.fromCharCode(...salt));
    }

    static generateIv(){
        const length = 12;
        const iv = new Uint8Array(length);
        crypto.getRandomValues(iv);
        return btoa(String.fromCharCode(...iv));
    }

    stringToBuffer(str){
        return Uint8Array.from(atob(str), c => c.charCodeAt(0));
    }

    static async generateEncryptionKey(password, salt){
        const passwordKey = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(password),
            "PBKDF2",
            false,
            ["deriveKey"]
        );

        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: Uint8Array.from(atob(salt), c => c.charCodeAt(0)),
                iterations: 100000,
                hash: "SHA-256"
            },
            passwordKey,
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
    }

    async encrypt(data, iv){
        const json = JSON.stringify(data);
        const buff = new TextEncoder().encode(str);

        const encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv
            },
            this._key,
            data
        );

        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    }

    async decrypt(data, key, ivString){
        const encrypted = this.stringToBuffer(data);
        const iv = this.stringToBuffer(ivString);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
            },
            key,
            encrypted
        );

        const json = new TextDecoder().decode(decrypted);
        return JSON.parse(json);
    }
}
