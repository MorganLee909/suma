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
