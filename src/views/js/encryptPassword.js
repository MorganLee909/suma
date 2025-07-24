let generateSalt = ()=>{
    const length = 16;
    const salt = new Uint8Array(length);
    crypto.getRandomValues(salt);
    return btoa(String.fromCharCode(...salt));
}

export default async (password) =>{
    const salt = generateSalt();
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

    return {
        hash: btoa(String.fromCharCode(...new Uint8Array(derivedBits))),
        salt: salt
    };
}
