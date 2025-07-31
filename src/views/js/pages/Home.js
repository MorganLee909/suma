import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";
import Notifier from "../Notifier.js";
import Transaction from "../data/Transaction.js";

export default class Home extends Page{
    constructor(){
        super("Home", ["addMenu", "viewMenu", "logout"]);

        const date = new Date();
        const month = date.toLocaleString("en-US", {month: "long"});

        if(!user.account.isPopulated){
            let from = new Date();
            from.setDate(1);
            from = Format.transactionDate(from);
            let to = new Date();
            to = Format.transactionDate(to);
            
            Transaction.fetch(user.account.id, from, to)
                .then((transactions)=>{
                    user.account.addManyTransactions(transactions);
                    user.account.isPopulated = true;
                })
                .catch((err)=>{
                    new Notifier("error", "Unable to retrieve transactions");
                });
        }

        this.render(month);
    }

    render(month){
        new Elem("h1")
            .text(month)
            .appendTo(this.container);

        new Elem("dl")
            .append(new Elem("dt")
                .text("Balance: ")
            )
            .append(new Elem("dd")
                .text(Format.currency(user.account.balance))
            )
            .appendTo(this.container);

        new Elem("dl")
            .append(new Elem("dt")
                .text("Income: ")
            )
            .append(new Elem("dd")
                .text(Format.currency(user.account.incomeTotal()))
            )
            .appendTo(this.container);

        new Elem("dl")
            .append(new Elem("dt")
                .text("Bills: ")
            )
            .append(new Elem("dd")
                .text(Format.currency(user.account.billsTotal()))
            )
            .appendTo(this.container);
    }
}
