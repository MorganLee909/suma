import Page from "./Page.js";
import Elem from "../Elem.js";
import Transaction from "../data/Transaction.js";

export default class CreateTransaction extends Page{
    constructor(){
        super("CreateTransaction");

        this.render(
            user.account.listIncome(),
            user.account.listBills(),
            user.account.listAllowances()
        );

    }

    async submit(event){
        event.preventDefault();

        const transaction = Transaction.create(
            user.account,
            document.querySelector(".date").valueAsDate,
            document.querySelector(".amount").value,
            document.querySelector(".tags").value,
            document.querySelector(".location").value,
            document.querySelector(".note").value,
            document.querySelector(".category").value
        );
        await transaction.save(true);
        user.account.addTransaction(transaction);
        changePage("home");
   }

    render(income, bills, allowances){
        let select, incomeOpt, billsOpt, allowancesOpt;
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit.bind(this))
            .append(new Elem("h1")
                .text("Create Transaction")
            )
            .append(new Elem("label")
                .text("Amount")
                .append(new Elem("input")
                    .type("number")
                    .addClass("amount")
                    .step("0.01")
                    .placeholder("$0.00")
                    .required()
                    .focus()
                )
            )
            .append(new Elem("select")
                .addClass("category")
                .toVar((a)=>{select = a})
                .append(new Elem("option")
                    .value("discretionary")
                    .text("Discretionary")
                )
                .append(new Elem("optgroup")
                    .label("Allowances")
                    .toVar((e)=>{allowancesOpt = e})
                )
                .append(new Elem("optgroup")
                    .label("Bills")
                    .toVar((e)=>{billsOpt = e})
                )
                .append(new Elem("optgroup")
                    .label("Income")
                    .toVar((e)=>{incomeOpt = e})
                )
            )
            .append(new Elem("label")
                .text("Tags")
                .append(new Elem("input")
                    .type("text")
                    .addClass("tags")
                    .placeholder("tag")
                )
            )
            .append(new Elem("label")
                .text("Location")
                .append(new Elem("input")
                    .type("text")
                    .addClass("location")
                    .placeholder("location")
                )
            )
            .append(new Elem("label")
                .text("Date")
                .append(new Elem("input")
                    .type("date")
                    .addClass("date")
                    .valueAsDate(new Date())
                    .required()
                )
            )
            .append(new Elem("label")
                .text("Notes")
                .append(new Elem("textarea")
                    .addClass("note")
                    .rows(3)
                )
            )
            .append(new Elem("button")
                .text("Create")
            )
            .append(new Elem("button")
                .text("Cancel")
                .type("button")
                .addClass("cancel")
                .onclick(()=>{changePage("home")})
            )
            .appendTo(this.container);

        for(let i = 0; i < allowances.length; i++){
            allowancesOpt.append(new Elem("option").text(allowances[i].name).value(`allowance-${allowances[i].id}`));
        }

        for(let i = 0; i < bills.length; i++){
            billsOpt.append(new Elem("option").text(bills[i].name).value(`bill-${bills[i].id}`));
        }

        for(let i = 0; i < income.length; i++){
            incomeOpt.append(new Elem("option").text(income[i].name).value(`income-${income[i].id}`));
        }
    }
}
