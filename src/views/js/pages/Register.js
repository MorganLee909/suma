import Page from "./Page.js";
import Elem from "../Elem.js";
import User from "../data/User.js";
import Notifier from "../Notifier.js";

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

        if(!this.isValidEmail(email)){
            new Notifier("error", "Invalid email address");
            return;
        }

        if(password.length < 10){
            new Notifier("error", "Password must contain at least 10 characters");
            return;
        }

        if(password !== confirmPassword){
            new Notifier("error", "Passwords do not match");
            return;
        }

        fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(await User.create(name, email, password))
        })
            .then(r=>r.json())
            .then((response)=>{
                if(response.error) throw response;

                window.user = new User(
                    response.id,
                    response.name,
                    response.email
                );
                return EncryptionHandler.create(password, response.encryption_salt);
            })
            .then((encryptionHandler)=>{
                window.encryptionHandler = encryptionHandler;
                changePage("home");
            })
            .catch((err)=>{
                if(err.error){
                    new Notifier("error", err.error.message);
                }else{
                    new Notifier("error", "Something went wrong, try refreshing the page");
                }
            });
    }

    isValidEmail(email){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
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
                    .required()
                    .focus()
                )
            )
            .append(new Elem("label")
                .text("Email")
                .append(new Elem("input")
                    .addClass("email")
                    .type("email")
                    .placeholder("Email")
                    .required()
                )
            )
            .append(new Elem("label")
                .text("Password")
                .append(new Elem("input")
                    .addClass("password")
                    .type("password")
                    .placeholder("Password")
                    .required()
                )
            )
            .append(new Elem("label")
                .text("Confirm Password")
                .append(new Elem("input")
                    .addClass("confirmPassword")
                    .type("password")
                    .placeholder("Confirm Password")
                    .required()
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
