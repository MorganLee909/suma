import EncryptionHandler from "../EncryptionHandler.js";

export default class User{
    constructor(id, name, email, salt, accounts = []){
        this._id = id;
        this._name = name;
        this._email = email;
        this._salt = salt;
        this._accounts = accounts;
    }

    static async create(name, email, password){
        const passwordSalt = EncryptionHandler.generateSalt();

        return {
            name: name,
            email: email,
            password_hash: await EncryptionHandler.hashPassword(password, salt),
            password_salt: passwordSalt,
            encryption_salt: EncryptionHandler.generateSalt()
        };
    }

    get id(){
        return this._id;
    }

    get salt(){
        return this._salt;
    }
}
