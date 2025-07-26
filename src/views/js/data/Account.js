import EncryptionHandler from "../EncryptionHandler.js";

export default class Account{
    constructor(id, data){
        this._id = id;
        this._name = data.name;
        this._balance = data.balance;
        this._income = data.income;
        this._bills = data.bills;
        this._allowances = data.allowances;
        this._transactions = [];
    }
}
