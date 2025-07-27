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

    get account(){
        return this._accounts[this._currentAccount];
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

    changeAccount(account){
        if(typeof account === "number"){
            this._currentAccount = 0;
        }else if(typeof account === "string"){
            for(let i = 0; i < this._accounts.length; i++){
                if(this._accounts[i].id === account){
                    this._currentAccount = i;
                    break;
                }
            }
        }else{
            for(let i = 0; i < this._accounts.length; i++){
                if(this._accounts[i] === account){
                    this._currentAccount = i;
                    break;
                }
            }
        }
    }

    async decryptAndAddAccount(account){
        const data = await encryptionHandler.decrypt(account.data, account.iv);

        const newAccount = new Account(account.id, account.iv, data);
        this._accounts.push(newAccount);
    }
}
