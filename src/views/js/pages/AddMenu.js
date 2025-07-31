import Page from "./Page.js";
import Elem from "../Elem.js";

export default class AddMenu extends Page{
    constructor(){
        super("AddMenu", ["back-home"]);

        this.render();
    }

    render(closeSvg){
        new Elem("button")
            .text("New Transaction")
            .addClass("button")
            .onclick(()=>{changePage("createTransaction")})
            .focus()
            .appendTo(this.container);

        new Elem("button")
            .text("New Income")
            .addClass("button")
            .onclick(()=>{changePage("createIncome")})
            .appendTo(this.container);

        new Elem("button")
            .text("New Bill")
            .addClass("button")
            .onclick(()=>{changePage("createBill")})
            .appendTo(this.container);

        new Elem("button")
            .text("New Allowance")
            .addClass("button")
            .onclick(()=>{changePage("createAllowance")})
            .appendTo(this.container);

        new Elem("button")
            .text("New Account")
            .addClass("button")
            .onclick(()=>{changePage("createAccount")})
            .appendTo(this.container);
    }
}
