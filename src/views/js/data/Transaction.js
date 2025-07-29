import Format from "../Format.js";

export default class Transaction{
    constructor(parent, id, iv, date, data,){
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

    static create(account, date, amount, tags, location, note, category){j
        let categoryId = null;
        if(category !== "discretionary"){
            let categorySplit = category.split("-");
            category = categorySplit[0];
            categoryId = categorySplit[1];
        }

        return new Transaction(
            account,
            null,
            encryptionHandler.generateIv(),
            Format.transactionDate(date),
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

    static decrypt(transaction){
        let data = encryptionHandler.decrypt(transaction.data, transaction.iv);

        return new Transaction(
            transaction.id,
            transaction.account,
            transaction.date,
            data.amount,
            data.tags,
            data.location,
            data.note,
            transaction.iv,
            data.type,
            data.typeId
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
        }

        fetch("/api/transactions", {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: body
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
