import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";
import Notifier from "../Notifier.js";

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

    closeModal(){
        const modal = this.container.querySelector(".deleteModal");
        modal.parentElement.removeChild(modal);
    }

    async delete(transaction){
        try{
            if(transaction.category.type === "Income"){
                user.account.balance -= transaction.amount;
            }else{
                user.account.balance += transaction.amount;
            }
            transaction.delete();
            user.account.save();
        }catch(e){
            if(e.error){
                new Notifier("error", e.error.message);
            }else{
                new Notifier("error", "Something went wrong, try refreshing the page");
            }
        }

        changePage("viewTransactions");
    }

    confirmDelete(transaction){
        new Elem("div")
            .addClass("deleteModal")
            .append(new Elem("p")
                .text("Deleting is permanent and cannot be undone, are you sure you want to delete this transaction?")
            )
            .append(new Elem("button")
                .text("Delete")
                .addClass("button")
                .onclick(()=>{this.delete(transaction)})
            )
            .append(new Elem("button")
                .text("Cancel")
                .addClass("button")
                .onclick(this.closeModal.bind(this))
            )
            .appendTo(this.container);
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
                .onclick(()=>{changePage("editTransaction", transaction)})
            )
            .append(new Elem("button")
                .text("Delete")
                .addClass("button")
                .onclick(()=>{this.confirmDelete(transaction)})
            )
            .appendTo(this.container);
    }
}
