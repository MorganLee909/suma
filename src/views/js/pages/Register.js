import Page from "./Page.js";
import Elem from "../Elem.js";

export default class Register extends Page{
    constructor(){
        super("Register");

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
                .text("Register")
            )
            .append(new Elem("label")
                .text("Name")
                .append(new Elem("input")
                    .addClass("name")
                    .type("text")
                    .placeholder("Name")
                )
            )
            .append(new Elem("label")
                .text("Email")
                .append(new Elem("input")
                    .addClass("email")
                    .type("email")
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
            .append(new Elem("label")
                .text("Confirm Password")
                .append(new Elem("input")
                    .addClass("confirmPassword")
                    .type("password")
                    .placeholder("Confirm Password")
                )
            )
            .append(new Elem("button")
                .text("Create Account")
            )
            .append(new Elem("button")
                .text("Log In")
                .addClass("link")
                .type("button")
                .onclick(()=>{changePage("login")})
            )
            .appendTo(this.container);
    }
}
