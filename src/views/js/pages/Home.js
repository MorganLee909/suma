import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";
import Notifier from "../Notifier.js";
import Transaction from "../data/Transaction.js";

export default class Home extends Page{
    constructor(){
        super("Home", ["addMenu", "viewMenu", "logout"]);

        this.incomeTotal = user.account.incomeTotal();

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
                    if(transactions.length > 0) user.account.addManyTransactions(transactions);
                    user.account.isPopulated = true;
                    this.renderData();
                })
                .catch((err)=>{
                    new Notifier("error", "Unable to retrieve transactions");
                });
        }

        this.render(month);
    }

    renderData(){
        for(let i = 0; i < user.account.allowances.length; i++){
            const a = user.account.allowances[i];
            const spent = Format.currency(user.account.categorySpent(a));
            new Elem(this.container.querySelector(`[class="${a.id}"] dd`))
                .text(`${spent} / ${Format.currency(a.currencyAmount(this.incomeTotal))}`);
        }

        const discretionary = user.account.getDiscretionary();
        const remaining = discretionary - user.account.getDiscretionarySpent();
        new Elem(this.container.querySelector(".discretionary dd"))
            .text("")
            .append(new Elem("span")
                .text(Format.currency(remaining))
            )
            .append(new Elem("span")
                .text(` / ${Format.currency(discretionary)}`)
            );
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
                .text(Format.currency(this.incomeTotal))
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

        const discretionary = Format.currency(user.account.getDiscretionary());
        new Elem("dl")
            .addClass("discretionary")
            .append(new Elem("dt")
                .text("Remaining Discretionary:")
            )
            .append(new Elem("dd")
                .text(`${discretionary} / ${discretionary}`)
            )
            .appendTo(this.container);

        let allowances;
        new Elem("h3").text("Allowances:").appendTo(this.container);
        new Elem("div")
            .addClass("allowances")
            .toVar((e)=>{allowances = e})
            .appendTo(this.container);

        for(let i = 0; i < user.account.allowances.length; i++){
            const a = user.account.allowances[i];
            new Elem("dl")
                .addClass(a.id)
                .append(new Elem("dt")
                    .text(`${a.name}: `)
                )
                .append(new Elem("dd")
                    .text(`$0.00 / ${Format.currency(a.currencyAmount(this.incomeTotal))}`)
                )
                .appendTo(this.container);
        }
    }
}
