export default class Bill{
    constructor(id, name, amount){
        this._id = id;
        this._name = name;
        this._amount = amount;
    }

    static create(name, amount){
        return new Bill(
            crypto.randomUUID(),
            name,
            amount
        );
    }
}
