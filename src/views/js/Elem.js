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

    addStyle(k, v){
        this.elem.style[k] = v;
        return this;
    }

    text(v){
        this.elem.textContent = v;
        return this;
    }

    innerHtml(v){
        this.elem.innerHTML = v;
        return this;
    }

    checked(v){
        this.elem.checked = v;
        return this;
    }

    type(v){
        this.elem.type = v;
        return this;
    }

    value(v){
        this.elem.value = v;
        return this;
    }

    label(v){
        this.elem.label = v;
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
        if(this.click) this.elem.removeEventListener("click", this.click);
        this.click = v;
        this.elem.addEventListener("click", v);
        return this;
    }

    removeOnclick(){
        if(this.click) this.elem.removeEventListener("click", this.click);
        this.click = undefined;
        return this;
    }

    onkeydown(v){
        if(this.keydown) this.elem.removeEventListener("keydown", this.keydown);
        this.keydown = v;
        this.elem.addEventListener("keydown", v);
        return this;
    }

    removeOnkeydown(v){
        if(this.keydown) this.elem.removeEventListener("keydown", this.keydown);
        this.keydown = undefined;
        return this;
    }

    onchange(v){
        this.elem.onchange = v;
        return this;
    }

    clear(){
        while(this.elem.children.length > 0){
            this.elem.removeChild(this.elem.lastChild);
        }
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

    valueAsDate(v){
        this.elem.valueAsDate = v;
        return this;
    }

    rows(v){
        this.elem.rows = v;
        return this;
    }

    removeChildAt(v){
        this.elem.removeChild(this.elem.children[v]);
        return this;
    }

    getChildAt(v){
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
        v(this);
        return this;
    }

    appendMany(v){
        v(this);
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

    appendNew(v){
        return new Elem("span");
    }

    appendTo(v){
        if(v instanceof this.constructor){
            v.elem.appendChild(this.elem);
        }else{
            v.appendChild(this.elem);
        }
        return this;
    }

    getParent(){
        return new Elem(this.elem.parentElement);
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
