import Page from "./Page.js";
import Elem from "../Elem.js";

export default class CreateAccount extends Page{
    constructor(){
        super("CreateAccount");

        this.render();
    }

    submit(event){
        event.preventDefault();
        console.log("submit");
    }

    render(){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit.bind())
            .append(new Elem("h1")
                .text("Create Account")
            )
            .append(new Elem("label")
                .text("Account Name")
                .append(new Elem("input")
                    .type("text")
                    .placeholder("Account Name")
                    .required()
                    .focus()
                )
            )
            .append(new Elem("label")
                .text("Current Balance")
                .append(new Elem("input")
                    .type("number")
                    .placeholder("Current Balance")
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
                .type("button")
                .onclick(()=>{changePage("home")})
            )
            .appendTo(this.container);
    }
}
