import Elem from "../Elem.js";

export default class Page {
    constructor(page){
        this.container = new Elem("div")
            .id(page)
            .addClass("page")
            .appendTo(document.body)
            .get();
    }

    close(){
        document.body.removeChild(this.container);
    }
}
