import Format from "../Format.js";
import Notifier from "../Notifier.js";

export default class Transaction{
    constructor(parent, id, iv, date, data){
        this._parent = parent;
        this._id = id;
        this._iv = iv;
        this._date = date;
        this._category = data.category;
        this._categoryId = data.categoryId;
        this._amount = data.amount;
        this._tags = data.tags;
        this._location = data.location;
        this._note = data.note;
    }

    get date(){
        return this._date;
    }

    set date(v){
        if(v instanceof Date){
            this._date = Format.transactionDate(v);
        }else{
            this._date = v;
        }
    }

    get category(){
        return this._parent.getCategory(this._category, this._categoryId);
    }

    set category(v){
        if(v === "discretionary"){
            this._category = v;
            this._categoryId = null;
        }else{
            v = v.split(":");
            this._category = v[0];
            this._categoryId = v[1];
        }
    }

    get categoryId(){
        return this._categoryId;
    }

    get rawCategory(){
        return this._category;
    }

    get location(){
        return this._location;
    }

    set location(v){
        this._location = v;
    }

    get amount(){
        return this._amount;
    }

    get rawAmount(){
        return this._amount;
    }

    set amount(v){
        if(typeof v !== "number") v = Number(v);
        this._amount = Format.dollarsToCents(v);
    }

    get tags(){
        return this._tags;
    }

    set tags(v){
        this._tags = [];
        let tags = v.split(",");
        for(let i = 0; i < tags.length; i++){
            this._tags.push(tags[i].trim());
        }
    }

    get note(){
        return this._note;
    }

    set note(v){
        this._note = v;
    }

    selectValue(){
        if(this._category === "discretionary") return this._category;
        return `${this._category}:${this._categoryId}`;
    }

    static create(account, date, amount, tags, location, note, category){
        let categoryId = null;
        if(category !== "discretionary"){
            let categorySplit = category.split(":");
            category = categorySplit[0];
            categoryId = categorySplit[1];
        }

        return new Transaction(
            account,
            null,
            encryptionHandler.generateIv(),
            date,
            {
                category: category,
                categoryId: categoryId,
                amount: Format.dollarsToCents(amount),
                tags: tags.split(","),
                location: location,
                note: note
            }
        );
    }

    static async fetch(account, from, to){
        let response;
        try{
            response = await fetch("/api/transaction/search", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({account, from, to})
            });
            response = await response.json();

            const promises = [];
            for(let i = 0; i < response.length; i++){
                promises.push(Transaction.decrypt(response[i]));
            }
            
            if(promises.length === 0) return [];
            return await Promise.all(promises);
        }catch(e){
            new Notifier("error", "Something went wrong, try refreshing the page");
        }

        if(response.error){
            new Notifier("error", response.error.message);
            return;
        }
    }

    static async decrypt(transaction){
        let data = await encryptionHandler.decrypt(transaction.data, transaction.iv);

        return new Transaction(
            user.account,
            transaction.id,
            transaction.iv,
            transaction.date,
            data
        );
    }

    serialize(){
        return {
            category: this._category,
            categoryId: this._categoryId,
            amount: this._amount,
            tags: this._tags,
            location: this._location,
            note: this._note
        };
    }

    async delete(){
        let response = await fetch(`/api/transaction/${this._id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        });
        response = await response.json(); 

        if(response.error) throw response.error;

        this._parent.removeTransaction(this);
    }

    async save(isNew = false){
        const data = await encryptionHandler.encrypt(this.serialize(), this._iv);

        let method, body;
        if(isNew){
            method = "POST";
            body = {
                account: this._parent.id,
                date: this._date,
                data: data,
                iv: this._iv
            };
        }else{
            method = "PUT";
            body = {
                id: this._id,
                date: this._date,
                data: data
            }
        }

        fetch("/api/transaction", {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
            .then(r=>r.json())
            .then((response)=>{
                if(response.error){
                    new Notifier("error", response.error.message);
                    this._parent.removeTransaction(this);
                }else{
                    this._id = response.id;
                }
            })
            .catch((err)=>{
                new Notifier("error", "Something went wrong, try refreshing the page");
                this._parent.removeTransaction(this);
            });
   }
}
