import Page from "./Page.js";
import Elem from "../Elem.js";

export default class CreateBill extends Page{
    constructor(){
        super("CreateBill", ["home", "back-addMenu", "logout"]);

        this.render();
    }

    async submit(event){
        event.preventDefault();

        await user.account.addBill(
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
                .text("Create Bill")
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
