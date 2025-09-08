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

    submitOnEnter(event){
        console.log(event);
        if(event.key === "Enter"){
            user.account.balance = Format.dollarsToCents(this.container.querySelector(".balance input").value);
            user.account.save();

            new Elem(this.container.querySelector(".balance dd"))
                .clear()
                .text(Format.currency(user.account.balance));
        }
    }

    editBalance(){
        this.balanceContainer.removeOnclick();

        new Elem(this.container.querySelector(".balance dd"))
            .text("")
            .append(new Elem("input")
                .type("number")
                .step("0.01")
                .value(user.account.balance / 100)
                .onkeydown(this.submitOnEnter.bind(this))
                .focus()
            );
    }

    generateColor(spent, amount){
        if(amount <= 0) return "hsl(0, 100%, 50%)";

        const percent = Math.min(spent / amount, 1); 
        let hue;
        if(percent < 0.5){
            hue = percent / 0.5 * 45;
        }else{
            hue = 45 + (percent - 0.5) / 0.5 * (120 -45);
        }

        const saturation = 65 - percent * 15;
        const lightness = 28 + (1 - Math.abs(percent - 0.5) * 2) * 10;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    renderData(){
        for(let i = 0; i < user.account.allowances.length; i++){
            const a = user.account.allowances[i];
            const spent = user.account.categorySpent(a);
            const total = a.currencyAmount(this.incomeTotal);
            new Elem(this.container.querySelector(`[class="${a.id}"] dd`))
                .text("")
                .clear()
                .append(new Elem("span")
                    .text(Format.currency(spent))
                    .addStyle("color", this.generateColor(spent, total))
                )
                .append(new Elem("span")
                    .text(` / ${Format.currency(total)}`)
                    .addClass("amountFull")
                );
        }

        this.container.querySelector(".discretionary").replaceWith(this.createDiscretionary().get());
    }

    createDiscretionary(){
        const discretionary = user.account.getDiscretionary();
        const remaining = discretionary - user.account.getDiscretionarySpent();
        return new Elem("dl")
            .addClass("discretionary")
            .append(new Elem("dt")
                .text("Remaining Discretionary:")
            )
            .append(new Elem("dd")
                .append(new Elem("span")
                    .text(Format.currency(remaining))
                    .addStyle("color", this.generateColor(remaining, discretionary))
                )
                .append(new Elem("span")
                    .addClass("amountFull")
                    .text(` / ${Format.currency(discretionary)}`)
                )
            );
    }

    render(month){
        new Elem("h1")
            .text(month)
            .appendTo(this.container);

        this.balanceContainer = new Elem("dl")
            .addClass("balance")
            .append(new Elem("dt")
                .text("Balance: ")
            )
            .append(new Elem("dd")
                .text(Format.currency(user.account.balance))
            )
            .onclick(this.editBalance.bind(this))
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

        this.createDiscretionary().appendTo(this.container);

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
