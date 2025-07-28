import EncryptionHandler from "../EncryptionHandler.js";
import Notifier from "../Notifier.js";
import Format from "../Format.js";
import Transaction from "./Transaction.js";
import Income from "./Income.js";
import Bill from "./Bill.js";
import Allowance from "./Allowance.js";

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
        this._populated = false;
    }

    get balance(){
        return this.toDollars(this._balance);
    }

    incomeTotal(){
        let income = 0;
        for(let i = 0; i < this._income.length; i++){
            income += this._income[i].amount;
        }
        return this.toDollars(income);
    }

    billsTotal(){
        let bills = 0;
        for(let i = 0; i < this._bills.length; i++){
            bills += this._bills[i].amount;
        }
        return this.toDollars(bills);
    }

    static async create(name, balance){
        const data = {
            name: name,
            balance: Account.toCents(balance),
            income: [],
            bills: [],
            allowances: []
        };
        const iv = encryptionHandler.generateIv();
        const encryptedData = await encryptionHandler.encrypt(data, iv);

        let response;
        try{
            response = await fetch("/api/account", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({data: encryptedData, iv})
            });
        }catch(e){
            new Notifier("error", "Something went wrong, try refreshing the page");
        }

        if(response.error) new Notifier("error", response.error.message);

        return new Account(response.id, iv, data);
    }

    async addIncome(name, amount){
        this._income.push(Income.create(name, this.toCents(amount)));

        await this.save();
    }

    async addBill(name, amount){
        this._bills.push(Bill.create(name, this.toCents(amount)));

        await this.save();
    }

    async addAllowance(name, amount, isPercent){
        if(isPercent){
            amount = Number(amount);
        }else{
            amount = this.toCents(amount);
        }

        this._allowances.push(Allowance.create(name, amount, isPercent));

        await this.save();
    }

    toCents(num){
        if(typeof num === "string") num = Number(num);

        return Math.round(num * 100);
    }

    static toCents(num){
        if(typeof num === "string") num = Number(num);

        return Math.round(num * 100);
    }

    toDollars(num){
        return num / 100;
    }

    async populateTransactions(){
        if(this._populated) return;

        let from = new Date();
        from.setDate(1);
        const to = new Date();
        let response;
        try{
            response = await fetch("/api/transaction/search", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    account: this._id,
                    from: Format.transactionDate(from),
                    to: Format.transactionDate(to)
                })
            });
        }catch(e){
            new Notifier("error", "Something went wrong, try refreshing the page");
        }

        if(response.error){
            new Notifier("error", response.error.message);
        }else{
            for(let i = 0; i < response.length; i++){
                this._transactions = Transaction.decrypt(response[i]);
            }
            this._populated = true;
        }
    }

    async save(){
        const data = {
            name: this._name,
            balance: this._balance,
            income: this._income,
            bills: this._bills,
            allowances: this._allowances
        };
        const encryptedData = await encryptionHandler.encrypt(data, this._iv);

        let response;
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
