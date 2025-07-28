export default class Income{
    constructor(id, name, amount){
        this._id = id;
        this._name = name;
        this._amount = amount;
    }

    static create(name, amount){
        return new Income(
            crypto.randomUUID(),
            name,
            amount
        );
    }
}
