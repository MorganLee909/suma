import EncryptionHandler from "../EncryptionHandler.js";

export default class User{
    constructor(id, name, email, accounts = []){
        this._id = id;
        this._name = name;
        this._email = email;
        this._accounts = accounts;
        this._currentAccount = 0;
    }

    static async create(name, email, password){
        const passwordSalt = EncryptionHandler.generateSalt();

        return {
            name: name,
            email: email,
            password_hash: await EncryptionHandler.hashPassword(password, passwordSalt),
            password_salt: passwordSalt,
            encryption_salt: EncryptionHandler.generateSalt()
        };
    }
}
