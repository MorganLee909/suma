import Page from "./Page.js";
import Elem from "../Elem.js";
import EncryptionHandler from "../EncryptionHandler.js";

export default class Register extends Page{
    constructor(){
        super("Register");

        this.render();
    }

    async submit(){
        event.preventDefault();

        const name = this.container.querySelector(".name").value;
        const email = this.container.querySelector(".email").value;
        const password = this.container.querySelector(".password").value;
        const confirmPassword = this.container.querySelector(".confirmPassword").value;

        return;
        fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password_hash: passwordHash,
                password_salt: passwordSalt,
                encryption_salt: encryption.salt,
            })
        })
            .then(r=>r.json())
            .then((response)=>{
                if(response.error){
                    console.log(response.error);
                }else{
                    changePage("login");
                }
            })
            .catch((err)=>{
                console.log(err);
            });
    }

    render(){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(()=>{this.submit()})
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
