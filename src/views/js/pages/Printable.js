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

    formatAmount(transaction){
        if(transaction.rawCategory === "income"){
            if(transaction.amount < 0){
                return Format.currency(-transaction.amount);
            }else{
                return Format.currency(transaction.amount);
            }
        }else{
            if(transaction.amount < 0){
                return Format.currency(transaction.amount);
            }else{
                return Format.currency(-transaction.amount);
            }
        }
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

    render(from, to, transactions){
        new Elem("h1")
            .text(`${Format.dateFromTransaction(from)} - ${Format.dateFromTransaction(to)}`)
            .appendTo(this.container);

        let tbody;
        new Elem("table")
            .append(new Elem("thead")
                .append(new Elem("tr")
                    .append(new Elem("th").text("Date"))
                    .append(new Elem("th").text("Amount"))
                    .append(new Elem("th").text("Category"))
                    .append(new Elem("th").text("Tags"))
                    .append(new Elem("th").text("Location"))
                    .append(new Elem("th").text("Notes"))
                )
            )
            .append(new Elem("tbody")
                .toVar((e)=>{tbody = e})
            )
            .appendTo(this.container);

        for(let i = 0; i < transactions.length; i++){
            let tags;
            new Elem("tr")
                .append(new Elem("td")
                    .text(Format.dateFromTransaction(transactions[i].date))
                    .addClass("date")
                )
                .append(new Elem("td")
                    .text(this.formatAmount(transactions[i]))
                    .addClass("amount")
                    .addStyle("color", this.transactionColor(transactions[i]))
                )
                .append(new Elem("td")
                    .text(transactions[i].category.name)
                    .addClass("category")
                )
                .append(new Elem("td")
                    .toVar((e)=>{tags = e})
                    .addClass("tags")
                )
                .append(new Elem("td")
                    .text(transactions[i].location)
                    .addClass("location")
                )
                .append(new Elem("td")
                    .text(transactions[i].note)
                )
                .appendTo(tbody);

            for(let j = 0; j < transactions[i].tags.length; j++){
                new Elem("p")
                    .text(transactions[i].tags[j])
                    .appendTo(tags);
            }
        }
    }
}
