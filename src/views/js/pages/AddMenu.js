import Page from "./Page.js";
import Elem from "../Elem.js";

export default class AddMenu extends Page{
    constructor(){
        super("AddMenu");

        this.render();
    }

    render(){
        new Elem("button")
            .text("New Account")
            .addClass("button")
            .onclick(()=>{changePage("createAccount")})
            .appendTo(this.container);
    }
}
