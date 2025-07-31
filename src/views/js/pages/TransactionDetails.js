import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";

export default class TransactionDetails extends Page{
    constructor(transaction){
        super("TransactionDetails", ["home", "back-viewTransactions", "logout"]);

        this.render(transaction);
    }

    displayCategory(category){
        if(category.name === "Discretionary") return category.name;
        return `${category.name} (${category.type})`;
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

    render(transaction){
        new Elem("div")
            .addClass("dataContainer")
            .append(new Elem("h1")
                .text("Transaction")
            )
            .append(new Elem("dl")
                .append(new Elem("dt")
                    .text("Date")
                )
                .append(new Elem("dd")
                    .text(Format.dateFromTransaction(transaction.date, true))
                )
            )
            .append(new Elem("dl")
                .append(new Elem("dt")
                    .text("Amount")
                )
                .append(new Elem("dd")
                    .text(Format.currency(transaction.amount))
                    .addClass(this.transactionColor(transaction))
                )
            )
            .append(new Elem("dl")
                .append(new Elem("dt")
                    .text("Location ")
                )
                .append(new Elem("dd")
                    .text(transaction.location)
                )
            )
            .append(new Elem("dl")
                .append(new Elem("dt")
                    .text("Category")
                )
                .append(new Elem("dd")
                    .text(this.displayCategory(transaction.category))
                )
            )
            .append(new Elem("dl")
                .append(new Elem("dt")
                    .text("Tags")
                )
                .append(new Elem("dd")
                    .text(transaction.tags.join(", "))
                )
            )
            .append(new Elem("dl")
                .append(new Elem("dt")
                    .text("Note")
                )
                .append(new Elem("dd")
                    .text(transaction.note)
                )
            )
            .append(new Elem("button")
                .text("Edit")
                .addClass("button")
            )
            .append(new Elem("button")
                .text("Delete")
                .addClass("button")
            )
            .appendTo(this.container);
    }
}
