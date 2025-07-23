export default class Elem {
    constructor(elem){
        this.elem = document.createElement(elem);
    }

    id(v){
        this.elem.id = v;
        return this;
    }

    .appendTo(v){
        v.appendChild(this.elem);
        return this;
    }

    get(){
        return this.elem;
    }
}
