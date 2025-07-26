export default class Elem {
    constructor(elem){
        this.elem = document.createElement(elem);
    }

    id(v){
        this.elem.id = v;
        return this;
    }

    addClass(...v){
        this.elem.classList.add(...v);
        return this;
    }

    text(v){
        this.elem.textContent = v;
        return this;
    }

    type(v){
        this.elem.type = v;
        return this;
    }

    placeholder(v){
        this.elem.placeholder = v;
        return this;
    }

    onsubmit(v){
        this.elem.onsubmit = v;
        return this;
    }

    onclick(v){
        this.elem.onclick = v;
        return this;
    }

    append(v){
        if(v instanceof this.constructor){
            this.elem.appendChild(v.elem);
        }else{
            this.elem.appendChild(v);
        }
        return this;
    }

    appendTo(v){
        if(v instanceof this.constructor){
            v.elem.appendChild(this.elem);
        }else{
            v.appendChild(this.elem);
        }
        return this;
    }

    get(){
        return this.elem;
    }
}
