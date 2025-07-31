import Page from "./Page.js";
import Elem from "../Elem.js";

export default class CreateIncome extends Page{
    constructor(){
        super("CreateIncome", ["home", "back-addMenu", "logout"]);

        this.render();
    }

    async submit(event){
        event.preventDefault();

        await user.account.addIncome(
            this.container.querySelector(".name").value,
            this.container.querySelector(".amount").value
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
                .text("Amount")
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
