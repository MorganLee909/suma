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

    get type(){
        return "Allowance";
    }

    get active(){
        return this._active;
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
