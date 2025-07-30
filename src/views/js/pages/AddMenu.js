import Page from "./Page.js";
import Elem from "../Elem.js";

export default class AddMenu extends Page{
    constructor(){
        super("AddMenu");
        const closeSvg= '<?xml version="1.0" encoding="UTF-8"?><svg stroke-width="2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        this.render(closeSvg);
    }

    render(closeSvg){
        new Elem("button")
            .innerHtml(closeSvg)
            .addClass("circleButton")
            .onclick(()=>{changePage("home")})
            .appendTo(this.container);

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
