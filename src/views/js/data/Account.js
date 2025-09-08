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
        this._income = data.income.map(Income.fromObject);
        this._bills = data.bills.map(Bill.fromObject);
        this._allowances = data.allowances.map(Allowance.fromObject);
        this._transactions = [];
        this._populated = false;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get balance(){
        return this._balance;
    }

    set balance(v){
        this._balance = v;
    }

    get transactions(){
        return this._transactions;
    }

    get income(){
        return this._income;
    }

    get bills(){
        return this._bills;
    }

    get allowances(){
        return this._allowances;
    }

    get isPopulated(){
        return this._populated;
    }

    getDiscretionary(){
        const income = this.incomeTotal();
        return income - this.billsTotal() - this.allowancesTotal(income);
    }

    set isPopulated(v){
        if(typeof v === "boolean") this._populated = v;
    }

    getDiscretionarySpent(){
        let total = 0;
        for(let i = 0; i < this._transactions.length; i++){
            if(this._transactions[i].category.name === "Discretionary") total += this._transactions[i].amount;
        }
        return total;
    }

    getIncomeSum(){
        let total = 0;
        for(let i = 0; i < this._income.length; i++){
            if(this._income[i].active) total += this._income[i].amount;
        }
        return total;
    }

    getCategory(category, categoryId){
        if(category === "discretionary") return {name: "Discretionary"};

        let list;
        switch(category){
            case "income": list = this._income; break;
            case "bill": list = this._bills; break;
            case "allowance": list = this._allowances; break;
        }

        for(let i = 0; i < list.length; i++){
            if(list[i].id === categoryId) return list[i];
        }
    }

    categorySpent(category){
        let total = 0;
        for(let i = 0; i < this._transactions.length; i++){
            if(this._transactions[i].categoryId === category.id){
                total += this._transactions[i].rawAmount;
            }
        }
        return total;
    }

    incomeTotal(){
        let income = 0;
        for(let i = 0; i < this._income.length; i++){
            if(this._income[i].active){
                income += this._income[i].amount;
            }
        }
        return income;
    }

    billsTotal(){
        let bills = 0;
        for(let i = 0; i < this._bills.length; i++){
            bills += this._bills[i].amount;
        }
        return bills;
    }

    allowancesTotal(income){
        let allowances = 0;
        for(let i = 0; i < this._allowances.length; i++){
            if(!this._allowances[i].active) continue;

            if(this._allowances[i].isPercent){
                allowances += (this._allowances[i].amount / 100) * income;
            }else{
                allowances += this._allowances[i].amount;
            }
        }
        return allowances;
    }

    static async create(name, balance){
        const data = {
            name: name,
            balance: Format.dollarsToCents(balance),
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
            response = await response.json();
        }catch(e){
            new Notifier("error", "Something went wrong, try refreshing the page");
        }

        if(response.error) new Notifier("error", response.error.message);

        return new Account(response.id, iv, data);
    }

    async addIncome(name, amount){
        this._income.push(Income.create(name, amount));

        await this.save();
    }

    async addBill(name, amount){
        this._bills.push(Bill.create(name, Format.dollarsToCents(amount)));

        await this.save();
    }

    async addAllowance(name, amount, isPercent){
        if(isPercent){
            amount = Number(amount);
        }else{
            amount = Format.dollarsToCents(amount);
        }

        this._allowances.push(Allowance.create(name, amount, isPercent));

        await this.save();
    }

    addTransaction(transaction){
        this._transactions.push(transaction);

        if(transaction.category.type === "Income"){
            this._balance += transaction.amount;
        }else{
            this._balance -= transaction.amount;
        }

        this.save();
        this.sortTransactions();
    }

    addManyTransactions(transactions){
        this._transactions.push(...transactions);
        this.sortTransactions();
    }

    removeTransaction(transaction){
        if(transaction instanceof Transaction){
            for(let i = 0; i < this._transactions.length; i++){
                if(this._transactions[i] === transaction){
                    this._transactions.splice(i, 1);
                    break;
                }
            }
        }
    }

    sortTransactions(){
        this._transactions.sort((a, b)=>{a > b ? 1 : -1});
    }

    listIncome(){
        const income = [];
        for(let i = 0; i < this._income.length; i++){
            if(!this._income[i].active) continue;
            income.push({
                id: this._income[i].id,
                name: this._income[i].name
            });
        }
        return income;
    }

    listBills(){
        const bills = [];
        for(let i = 0; i < this._bills.length; i++){
            if(!this._bills[i].active) continue;
            bills.push({
                id: this._bills[i].id,
                name: this._bills[i].name
            });
        }
        return bills;
    }

    listAllowances(){
        const allowances = [];
        for(let i = 0; i < this._allowances.length; i++){
            if(!this._allowances[i].active) continue;
            allowances.push({
                id: this._allowances[i].id,
                name: this._allowances[i].name
            });
        }
        return allowances;
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
            income: this._income.map(i => i.serialize()),
            bills: this._bills.map(b => b.serialize()),
            allowances: this._allowances.map(a => a.serialize())
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
