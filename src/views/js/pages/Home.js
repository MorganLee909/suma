import Page from "./Page.js";
import Elem from "../Elem.js";

export default class Home extends Page{
    constructor(){
        super("Home");

        this.render();
    }

    render(){
        new Elem("div")
            .addClass("buttonBox")
            .append(new Elem("button")
                .text("+")
                .addClass("button", "circle")
            )
            .appendTo(this.container);
    }
}
