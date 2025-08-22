import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";

export default class Printable extends Page{
    constructor({from, to, transactions}){
        super("Printable", []);

        this.render(from, to, transactions);
    }

    mount(){
        const after = ()=>{
            window.removeEventListener("afterprint", after);
            changePage("viewTransactions");
        }
        window.addEventListener("afterprint", after, {once: true});
        window.print();
    }

    render(from, to, transactions){
        new Elem("h1")
            .text(Format.dateFromTransaction(from))
            .appendTo(this.container);
    }
}
