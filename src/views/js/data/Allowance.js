export default class Allowance{
    constructor(id, name, amount, isPercent){
        this._id = id;
        this._name = name;
        this._amount = amount;
        this._isPercent = isPercent;
    }

    static create(name, amount, isPercent){
        return new Allowance(
            crypto.randomUUID(),
            name,
            amount,
            isPercent
        );
    }
}
