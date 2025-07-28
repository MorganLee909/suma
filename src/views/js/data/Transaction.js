export default class Transaction{
    constructor(id, account, date, amount, tags, location, note, iv, type, typeId){
        this._id = id;
        this._account = account;
        this._date = date;
        this._type = type;
        this._typeId = typeId;
        this._amount = amount;
        this._tags = tags;
        this._location = location;
        this._note = note;
        this._iv = iv;
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
}
