import Page from "./Page.js";
import Elem from "../Elem.js";

export default class Login extends Page{
    constructor(){
        super("Login");

        this.render();
    }

    submit(){
        event.preventDefault();
        console.log("submitting");
    }

    render(){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit)
            .append(new Elem("h1")
                .text("Login")
            )
            .append(new Elem("label")
                .text("Email")
                .append(new Elem("input")
                    .addClass("email")
                    .type("text")
                    .placeholder("Email")
                )
            )
            .append(new Elem("label")
                .text("Password")
                .append(new Elem("input")
                    .addClass("password")
                    .type("password")
                    .placeholder("Password")
                )
            )
            .append(new Elem("button")
                .text("Login")
            )
            .appendTo(this.container);
    }
}
