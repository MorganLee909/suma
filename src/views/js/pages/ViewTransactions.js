import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";

export default class ViewTransactions extends Page{
    constructor(){
        super("ViewTransactions");

        this.render();
    }

    render(){
        new Elem("h1")
            .text(`${user.account.name} transactions`)
            .appendTo(this.container);

        this.transactions = new Elem("div")
            .addClass("transactions")
            .appendTo(this.container);

        const transactions = user.account.transactions;
        for(let i = 0; i < transactions.length; i++){
            new Elem("div")
                .addClass("transaction")
                .append(new Elem("p")
                    .addClass("date")
                    .text(transactions[i].date)
                )
                .append(new Elem("p")
                    .addClass("category")
                    .text(transactions[i].category.name)
                )
                .append(new Elem("p")
                    .addClass("location")
                    .text(transactions[i].location)
                )
                .append(new Elem("p")
                    .addClass("amount")
                    .text(Format.currency(transactions[i].amount))
                )
                .appendTo(this.transactions);
        }
    }
}
