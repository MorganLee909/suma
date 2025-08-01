import Page from "./Page.js";
import Elem from "../Elem.js";

export default class EditTransaction extends Page{
    constructor(transaction){
        super("EditTransaction", ["home", "back-viewTransactions", "logout"]);

        this.render(
            transaction,
            user.account.listIncome(),
            user.account.listBills(),
            user.account.listAllowances()
        );
    }

    submit(event){
        event.preventDefault();

        console.log("submit");
    }

    render(transaction, income, bills, allowances){
        let select, incomeOpt, billsOpt, allowancesOpt;
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit.bind(this))
            .append(new Elem("h1")
                .text("Edit Transaction")
            )
            .append(new Elem("label")
                .text("Amount")
                .append(new Elem("input")
                    .type("number")
                    .value(transaction.amount)
                    .addClass("amount")
                    .step("0.01")
                    .required()
                    .focus()
                )
            )
            .append(new Elem("select")
                .addClass("category")
                .toVar((a)=>{select = a})
                .append(new Elem("option")
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
                    .value(transaction.tags.join(","))
                    .addClass("tags")
                )
            )
            .append(new Elem("label")
                .text("Location")
                .append(new Elem("input")
                    .type("text")
                    .value(transaction.location)
                    .addClass("location")
                )
            )
            .append(new Elem("label")
                .text("Date")
                .append(new Elem("input")
                    .type("date")
                    .value(transaction.date)
                    .addClass("date")
                    .required()
                )
            )
            .append(new Elem("label")
                .text("Notes")
                .append(new Elem("textarea")
                    .addClass("note")
                    .value(transaction.note)
                    .rows(3)
                )
            )
            .append(new Elem("button")
                .text("Update")
            )
            .appendTo(this.container);

        for(let i = 0; i < allowances.length; i++){
            allowancesOpt.append(new Elem("option").text(allowances[i].name).value(`allowance:${allowances[i].id}`));
        }

        for(let i = 0; i < bills.length; i++){
            billsOpt.append(new Elem("option").text(bills[i].name).value(`bill:${bills[i].id}`));
        }

        for(let i = 0; i < income.length; i++){
            incomeOpt.append(new Elem("option").text(income[i].name).value(`income:${income[i].id}`));
        }

        select.value(transaction.selectValue());
    }
}
