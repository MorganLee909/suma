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
        const isPercent = select(".isPercent").checked;
        const amount = select(".amount").value;
        allowance.updateAmount(amount, isPercent);

        user.account.save();
        changePage("viewAllowances");
    }

    amountDisplay(displayPercent, allowance){
        if(displayPercent && allowance.isPercent){
            return allowance.amount;
        }
        if(displayPercent && !allowance.isPercent){
            return Format.amountToPercent(allowance.amount, this.incomeTotal).toFixed(2);
        }
        if(!displayPercent && allowance.isPercent){
            return Format.centsToDollars(Format.percentToAmount(allowance.amount, this.incomeTotal));
        }
        if(!displayPercent && !allowance.isPercent){
            return Format.centsToDollars(allowance.amount);
        }
    }

    updateAmount(allowance){
        let value = this.amountDisplay(event.target.checked, allowance);
        let text, titleText;
        if(event.target.checked){
            text = "Amount (%)";
            titleText = "(Percent of Income)";
        }else{
            text = "Amount ($)";
            titleText = "(Fixed Amount)";
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
                .required()
            );
    }

    archive(allowance){
        allowance.active = !allowance.active;
        user.account.save();
        changePage("viewAllowances");
    }

    render(allowance){
        const value = this.amountDisplay(allowance.isPercent, allowance);
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
                    .step("0.01")
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
