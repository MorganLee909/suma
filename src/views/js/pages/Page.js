import Elem from "../Elem.js";
import Navigator from "../Navigator.js";

export default class Page{
    constructor(page, navOptions){
        this.container = new Elem("div")
            .id(page)
            .addClass("page")
            .appendTo(document.body)
            .get();

        new Navigator(this.container, navOptions);
    }

    close(){
        document.body.removeChild(this.container);
    }
}
