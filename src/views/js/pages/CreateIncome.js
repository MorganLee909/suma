import Page from "./Page.js";
import Elem from "../Elem.js";

export default class CreateIncome extends Page{
    constructor(){
        super("CreateIncome");

        this.render();
    }

    submit(event){
        event.preventDefault();
        console.log("submitting");
    }

    render(){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit.bind())
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
            .append(new Elem("button")
                .text("Cancel")
                .addClass("cancel")
                .type("button")
                .onclick(()=>{changePage("home")})
            )
            .appendTo(this.container);
    }
}
