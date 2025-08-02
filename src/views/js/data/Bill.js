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

    get amount(){
        return this._amount;
    }

    get type(){
        return "Bill";
    }

    get active(){
        return this._active;
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
