import Format from "../Format.js";

export default class Bill{
    constructor(id, name, amount, active){
        this._id = id;
        this._name = name;
        this._amount = amount;
        this._active = active;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    set name(v){
        this._name = v;
    }

    get amount(){
        return Format.centsToDollars(this._amount);
    }

    set amount(v){
        if(typeof v !== "string") v = Number(v);
        this._amount = Format.dollarsToCents(v);
    }

    get type(){
        return "Bill";
    }

    get active(){
        return this._active;
    }

    set active(v){
        if(typeof v !== "boolean") throw new TypeError("'value' requires a boolean");
        this._active = v;
    }

    static create(name, amount){
        return new Bill(
            crypto.randomUUID(),
            name,
            amount,
            true
        );
    }

    static fromObject(data){
        return new Bill(
            data.id,
            data.name,
            data.amount,
            data.active
        );
    }

    serialize(){
        return {
            id: this._id,
            name: this._name,
            amount: this._amount,
            active: this._active
        };
    }
}
