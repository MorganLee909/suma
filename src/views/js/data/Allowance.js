import Format from "../Format.js";

export default class Allowance{
    constructor(id, name, amount, isPercent, active){
        this._id = id;
        this._name = name;
        this._amount = amount;
        this._isPercent = isPercent;
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

    set amount(v){
        if(this._isPercent){
            this._amount = v;
        }else{
            this._amount = Format.dollarsToCents(v);
        }
    }

    get isPercent(){
        return this._isPercent;
    }

    set isPercent(v){
        if(typeof v !== "boolean") throw new TypeError("'isPercent' must be of type boolean");
        this._isPercent = v;
    }

    get type(){
        return "Allowance";
    }

    get active(){
        return this._active;
    }

    set active(v){
        if(typeof v !== "boolean") throw new TypeError("'active' must be of type boolean");
        this._active = v;
    }

    amountInDollars(income){
        if(this._isPercent) return Format.centsToDollars(income * (this._amount / 100));
        return Format.centsToDollars(this._amount);
    }

    rawAmount(){
        if(this._isPercent) return this._amount;
        return Format.centsToDollars(this._amount);
    }

    displayAmount(income){
        if(this._isPercent) return this._amount;
        return Format.centsToDollars(income * (this._amount / 100));
    }

    static create(name, amount, isPercent){
        return new Allowance(
            crypto.randomUUID(),
            name,
            amount,
            isPercent,
            true
        );
    }

    static fromObject(data){
        return new Allowance(
            data.id,
            data.name,
            data.amount,
            data.isPercent,
            data.active
        );
    }

    serialize(){
        return {
            id: this._id,
            name: this._name,
            amount: this._amount,
            isPercent: this._isPercent,
            active: this._active
        };
    }
}
