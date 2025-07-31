import Page from "./Page.js";
import Elem from "../Elem.js";

export default class ViewMenu extends Page{
    constructor(){
        super("ViewMenu", ["back-home", "logout"]);

        this.render();
    }

    render(){
        new Elem("button")
            .text("Transactions")
            .addClass("button")
            .onclick(()=>{changePage("viewTransactions")})
            .focus()
            .appendTo(this.container);
    }
}
