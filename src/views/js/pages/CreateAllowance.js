import Page from "./Page.js";
import Elem from "../Elem.js";

export default class CreateAllowance extends Page{
    constructor(){
        super("CreateAllowance");

        this.render();
    }

    async submit(event){
        event.preventDefault();

        await user.account.addIncome(
            this.container.querySelector(".name").value,
            this.container.querySelector(".amount").value,
            this.container.querySelector(".isPercent").value
        );
        changePage("home");
    }

    render(){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit.bind(this))
            .append(new Elem("h1")
                .text("Create Income")
            )
            .append(new Elem("label")
                .text("Name")
                .append(new Elem("input")
                    .type("text")
                    .addClass("name")
                    .placeholder("Name")
                    .required()
                    .focus()
                )
            )
            .append(new Elem("label")
                .text("Percent of Income")
                .append(new Elem("input")
                    .type("checkbox")
                    .addClass("isPercent")
                    .onchange(()=>{this.updateAmount()})
                )
            )
            .append(new Elem("label")
                .text("Amount")
                .addClass("amountLabel")
                .append(new Elem("input")
                    .type("number")
                    .addClass("amount")
                    .placeholder("Amount")
                    .min("0")
                    .step("0.01")
                    .required()
                )
            )
            .append(new Elem("button")
                .text("Create")
            )
            .append(new Elem("button")
                .text("Cancel")
                .addClass("cancel")
                .type("button")
                .onclick(()=>{changePage("home")})
            )
            .appendTo(this.container);
    }
}
