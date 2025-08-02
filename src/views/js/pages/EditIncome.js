import Page from "./Page.js";
import Elem from "../Elem.js";

export default class EditIncome extends Page{
    constructor(income){
        super("EditIncome", ["home", "back-viewIncome", "logout"]);

        this.render(income);
    }

    submit(income){
        event.preventDefault();

        income.name = this.container.querySelector(".name").value;
        income.amount = this.container.querySelector(".amount").value;

        user.account.save();
        changePage("viewIncome");
    }

    archive(income){
        income.active = !income.active;
        user.account.save();
        new Elem(this.container.querySelector(".archive"))
            .text(income.active ? "Archive" : "Restore");
        changePage("viewIncome");
    }

    render(income){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(()=>{this.submit(income)})
            .append(new Elem("h1")
                .text(income.name)
            )
            .append(new Elem("h3")
                .text("Income")
            )
            .append(new Elem("label")
                .text("Name")
                .append(new Elem("input")
                    .type("text")
                    .addClass("name")
                    .value(income.name)
                    .required()
                    .focus()
                )
            )
            .append(new Elem("label")
                .text("Amount")
                .append(new Elem("input")
                    .type("number")
                    .addClass("amount")
                    .value(income.amount)
                    .step("0.01")
                    .min("0")
                    .required()
                )
            )
            .append(new Elem("button")
                .text("Update")
            )
            .append(new Elem("button")
                .text(income.active ? "Archive" : "Restore")
                .addClass("archive")
                .type("button")
                .onclick(()=>{this.archive(income)})
            )
            .appendTo(this.container);
    }
}
