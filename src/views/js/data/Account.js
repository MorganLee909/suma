import EncryptionHandler from "../EncryptionHandler.js";

export default class Account{
    constructor(parent, id, data){
        this._parent = parent;
        this._id = id;
        this._balance = data.balance;
        this._income = data.income;
        this._bills = data.bills;
        this._allowances = data.allowances;
        this._transactions = [];
    }

    static async decryptAndCreate(parent, id, data){
        
    }
}
