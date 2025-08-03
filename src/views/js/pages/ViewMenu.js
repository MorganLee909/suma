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

        new Elem("button")
            .text("Allowances")
            .addClass("button")
            .onclick(()=>{changePage("viewAllowances")})
            .appendTo(this.container);

        new Elem("button")
            .text("Bills")
            .addClass("button")
            .onclick(()=>{changePage("viewBills")})
            .appendTo(this.container);

        new Elem("button")
            .text("Income")
            .addClass("button")
            .onclick(()=>{changePage("viewIncome")})
            .appendTo(this.container);
    }
}
