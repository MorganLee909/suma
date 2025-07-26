import EncryptionHandler from "../EncryptionHandler.js";
import Account from "./Account.js";

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

    addAccount(account){
        this._accounts.push(account);
    }

    async decryptAndAddAccount(account){
        const data = await encryptionHandler.decrypt(account.data, account.iv);

        this._accounts.push(new Account(account.id, data));
    }
}
