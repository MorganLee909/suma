import Elem from "./Elem.js";

export default class Notifier{
    constructor(type, message){
        this.elem = new Elem("p")
            .addClass("notifier")
            .addClass(type)
            .text(message)
            .appendTo(document.body)
            .get();

        setTimeout(()=>{
            document.body.removeChild(this.elem);
        }, 7500);
    }
}
