import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";

export default class EditAllowance extends Page{
    constructor(allowance){
        super("EditAllowance", ["home", "back-viewAllowances", "logout"]);
        this.incomeTotal = user.account.incomeTotal();
        this.isPercent = allowance.isPercent;

        this.render(allowance);
    }

    submit(allowance){
        event.preventDefault();

        const select = this.container.querySelector.bind(this.container);
        allowance.name = select(".name").value;
        allowance.isPercent = select(".isPercent").checked;
        allowance.amount = select(".amount").value;

        user.account.save();
        changePage("viewAllowances");
    }

    updateAmount(allowance){
        let text, titleText, step, value;
        if(event.target.checked){
            text = "Amount (%)";
            titleText = "(Percent of Income)";
            step = "1";
            value = allowance.rawAmount();
        }else{
            text = "Amount ($)";
            titleText = "(Fixed Amount)";
            step = "0.01";
            value = Format.centsToDollars(allowance.currencyAmount(this.incomeTotal));
        }

        new Elem(this.container.querySelector("h2"))
            .text(titleText);

        new Elem(this.container.querySelector(".amountLabel"))
            .clear()
            .append(new Elem("p")
                .text(text)
            )
            .append(new Elem("input")
                .type("number")
                .addClass("amount")
                .value(value)
                .min("0")
                .step(step)
                .required()
            );
    }

    archive(allowance){
        allowance.active = !allowance.active;
        user.account.save();
        changePage("viewAllowances");
    }

    render(allowance){
        let value = allowance.isPercent ? allowance.rawAmount() : Format.currency(allowance.currencyAmount(this.incomeTotal));
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(()=>{this.submit(allowance)})
            .append(new Elem("h1")
                .text("Edit Allowance")
            )
            .append(new Elem("h2")
                .text(allowance.isPercent ? "(Percent of Income)" : "(Fixed Amount)")
            )
            .append(new Elem("label")
                .append(new Elem("p")
                    .text("Name")
                )
                .append(new Elem("input")
                    .type("text")
                    .addClass("name")
                    .value(allowance.name)
                    .required()
                )
            )
            .append(new Elem("label")
                .addClass("switch")
                .append(new Elem("input")
                    .type("checkbox")
                    .addClass("isPercent")
                    .checked(allowance.isPercent)
                    .onchange(()=>{this.updateAmount(allowance)})
                )
                .append(new Elem("span")
                    .addClass("slider")
                )
            )
            .append(new Elem("label")
                .addClass("amountLabel")
                .append(new Elem("p")
                    .text(allowance.isPercent ? "Amount (%)" : "Amount ($)")
                )
                .append(new Elem("input")
                    .type("number")
                    .addClass("amount")
                    .value(value)
                    .min("0")
                    .step(allowance.isPercent ? "1" : "0.01")
                    .required()
                )
            )
            .append(new Elem("button")
                .text("Update")
            )
            .append(new Elem("button")
                .text(allowance.active ? "Archive" : "Restore")
                .type("button")
                .onclick(()=>{this.archive(allowance)})
            )
            .appendTo(this.container);
    }
}
