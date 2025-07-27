import EncryptionHandler from "../EncryptionHandler.js";
import Notifier from "../Notifier.js";

export default class Account{
    constructor(id, iv, data){
        this._id = id;
        this._iv = iv;
        this._name = data.name;
        this._balance = data.balance;
        this._income = data.income;
        this._bills = data.bills;
        this._allowances = data.allowances;
        this._transactions = [];
    }

    async addIncome(name, amount){
        this._income.push({
            id: crypto.randomUUID(),
            name: name,
            amount: this.toCents(amount)
        });

        await this.save();
    }

    toCents(num){
        if(typeof num === "string") num = Number(num);

        return Math.round(num * 100);
    }

    async save(){
        const data = JSON.stringify({
            name: this._name,
            balance: this._balance,
            income: this._income,
            bills: this._bills,
            allowances: this._allowances
        });
        const encryptedData = await encryptionHandler.encrypt(data, this._iv);

        let response
        try{
            response = await fetch("/api/account", {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    id: this._id,
                    data: encryptedData
                })
            });
        }catch(e){
            new Notifier("error", "Something went wrong, try refreshing the page");
        }

        if(response.error) new Notifier("error", response.error.message);
    }
}
