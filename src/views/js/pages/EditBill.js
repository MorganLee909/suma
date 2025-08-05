import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";

export default class EditBill extends Page{
    constructor(bill){
        super("EditBill", ["home", "back-viewBills", "logout"]);
        console.log("billing");

        this.render(bill);
    }

    submit(bill){
        event.preventDefault();

        bill.name = this.container.querySelector(".name").value;
        bill.amount = this.container.querySelector(".amount").value;

        user.account.save();
        changePage("viewBills");
    }

    archive(bill){
        bill.active = !bill.active;
        user.account.save();
        changePage("viewBills");
    }

    render(bill){
        new Elem("h1")
            .text("Edit Bill")
            .appendTo(this.container);

        new Elem("form")
            .addClass("standardForm")
            .onsubmit(()=>{this.submit(bill)})
            .append(new Elem("label")
                .text("Name")
                .append(new Elem("input")
                    .type("text")
                    .addClass("name")
                    .value(bill.name)
                    .focus()
                    .required()
                )
            )
            .append(new Elem("label")
                .text("Amount")
                .append(new Elem("input")
                    .type("number")
                    .addClass("amount")
                    .value(Format.centsToDollars(bill.amount))
                    .min("0")
                    .step("0.01")
                    .required()
                )
            )
            .append(new Elem("button")
                .text("Update")
            )
            .append(new Elem("button")
                .text(bill.active ? "Archive": "Restore")
                .type("button")
                .addClass("archive")
                .onclick(()=>{this.archive(bill)})
            )
            .appendTo(this.container);
    }
}
