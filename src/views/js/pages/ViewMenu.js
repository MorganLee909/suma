import Page from "./Page.js";
import Elem from "../Elem.js";

export default class ViewMenu extends Page{
    constructor(){
        super("ViewMenu");
        const closeSvg = '<svg stroke-width="2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        this.render(closeSvg);
    }

    render(closeSvg){
        new Elem("button")
            .innerHtml(closeSvg)
            .addClass("circleButton")
            .onclick(()=>{changePage("home")})
            .appendTo(this.container);

        new Elem("button")
            .text("Transactions")
            .addClass("button")
            .onclick(()=>{changePage("viewTransactions")})
            .focus()
            .appendTo(this.container);
    }
}
