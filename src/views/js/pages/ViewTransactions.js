import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";

export default class ViewTransactions extends Page{
    constructor(){
        super("ViewTransactions", ["home", "back-viewMenu", "logout"]);

        this.render();
    }

    transactionColor(transaction){
        if(transaction.rawCategory === "income"){
            if(transaction.amount < 0){
                return "red";
            }else{
                return "green";
            }
        }else{
            if(transaction.amount < 0){
                return "green";
            }else{
                return "red";
            }
        }
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
                .append(new Elem("div")
                    .append(new Elem("p")
                        .addClass("date")
                        .text(Format.dateFromTransaction(transactions[i].date))
                    )
                    .append(new Elem("p")
                        .addClass("amount", this.transactionColor(transactions[i]))
                        .text(Format.currency(transactions[i].amount))
                    )
                )
                .append(new Elem("div")
                    .addClass("right")
                    .append(new Elem("p")
                        .addClass("category")
                        .text(transactions[i].category.name)
                    )
                    .append(new Elem("p")
                        .addClass("location")
                        .text(transactions[i].location)
                    )
                )
                .appendTo(this.transactions);
        }
    }
}
