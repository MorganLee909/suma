export default class Allowance{
    constructor(id, name, amount, isPercent){
        this._id = id;
        this._name = name;
        this._amount = amount;
        this._isPercent = isPercent;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    static create(name, amount, isPercent){
        return new Allowance(
            crypto.randomUUID(),
            name,
            amount,
            isPercent
        );
    }

    static fromObject(data){
        return new Allowance(
            data.id,
            data.name,
            data.amount,
            data.isPercent
        );
    }

    serialize(){
        return {
            id: this._id,
            name: this._name,
            amount: this._amount,
            isPercent: this._isPercent
        };
    }
}
