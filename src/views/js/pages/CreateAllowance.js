import Page from "./Page.js";
import Elem from "../Elem.js";

export default class CreateAllowance extends Page{
    constructor(){
        super("CreateAllowance", ["home", "back-addMenu", "logout"]);

        this.render();
    }

    async submit(event){
        event.preventDefault();

        await user.account.addAllowance(
            this.container.querySelector(".name").value,
            this.container.querySelector(".amount").value,
            this.container.querySelector(".isPercent").checked
        );
        changePage("home");
    }

    updateAmount(){
        let text, titleText, step;
        if(event.target.checked){
            text = "Amount (%)";
            titleText = "(Percent of Income)"
            step = "1"
        }else{
            text = "Amount ($)";
            titleText = "(Fixed Amount)";
            step = "0.01";
        }

        new Elem(this.container.querySelector("h2"))
            .text(titleText);

        new Elem(this.container.querySelector(".amountLabel"))
            .text(text)
            .append(new Elem("input")
                .type("number")
                .addClass("amount")
                .min("0")
                .step(step)
                .placeholder(text)
                .required()
            );
    }

    render(){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit.bind(this))
            .append(new Elem("h1")
                .text("Create Allowance")
            )
            .append(new Elem("h2")
                .text("(Fixed Amount)")
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
                .addClass("switch")
                .append(new Elem("input")
                    .type("checkbox")
                    .addClass("isPercent")
                    .onchange(()=>{this.updateAmount()})
                )
                .append(new Elem("span")
                    .addClass("slider")
                )
            )
            .append(new Elem("label")
                .text("Amount ($)")
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
            .appendTo(this.container);
    }
}
