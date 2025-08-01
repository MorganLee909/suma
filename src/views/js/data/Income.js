import Format from "../Format.js";

export default class Income{
    constructor(id, name, amount){
        this._id = id;
        this._name = name;
        this._amount = amount;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get amount(){
        return Format.centsToDollars(this._amount);
    }

    get type(){
        return "Income";
    }

    static create(name, amount){
        return new Income(
            crypto.randomUUID(),
            name,
            amount
        );
    }

    static fromObject(data){
        return new Income(
            data.id,
            data.name,
            data.amount
        );
    }

    serialize(){
        return {
            id: this._id,
            name: this._name,
            amount: this._amount
        };
    }
}
