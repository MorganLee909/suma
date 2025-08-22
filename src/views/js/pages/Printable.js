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
            new Elem("tr")
                .append(new Elem("td")
                    .text(Format.dateFromTransaction(transactions[i].date))
                )
                .append(new Elem("td")
                    .text(Format.currency(transactions[i].amount))
                )
                .append(new Elem("td")
                    .text(transactions[i].category.name)
                )
                .append(new Elem("td")
                    .text(transactions[i].tags)
                )
                .append(new Elem("td")
                    .text(transactions[i].location)
                )
                .append(new Elem("td")
                    .text(transactions[i].note)
                )
                .appendTo(tbody);
        }
    }
}
