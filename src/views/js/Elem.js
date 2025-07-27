export default class Elem {
    constructor(elem){
        if(typeof elem === "string"){
            this.elem = document.createElement(elem);
        }else{
            this.elem = elem;
        }
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

    onchange(v){
        this.elem.onchange = v;
        return this;
    }

    min(v){
        this.elem.min = v;
        return this;
    }

    step(v){
        this.elem.step = v;
        return this;
    }

    removeChildAt(v){
        this.elem.removeChild(this.elem.children[v]);
        return this;
    }

    getChildAt(v){
        console.log(v);
        console.log(this.elem);
        console.log(this.elem.children);
        console.log(this.elem.children[v]);
        return new Elem(this.elem.children[v]);
    }

    required(){
        this.elem.required = true;
        return this;
    }

    focus(){
        this.onConnect(()=>this.elem.focus());
        return this;
    }

    toVar(v){
        v(this.elem);
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

    onConnect(cb){
        if(this.elem.isConnected){
            cb();
        }else {
            const observer = new MutationObserver(()=>{
                if(this.elem.isConnected) {
                    observer.disconnect();
                    cb();
                }
            });
            observer.observe(document, {childList: true, subtree: true});
        }
    }
}
