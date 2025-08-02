import Page from "./Page.js";
import Elem from "../Elem.js";
import EncryptionHandler from "../EncryptionHandler.js";
import User from "../data/User.js";
import Notifier from "../Notifier.js";

export default class Login extends Page{
    constructor(){
        super("Login", []);

        this.render();
    }

    submit(){
        event.preventDefault();

        const email = this.container.querySelector(".email").value;
        const password = this.container.querySelector(".password").value;

        fetch("/api/user/salt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email})
        })
            .then(r=>r.json())
            .then((response)=>{
                if(response.error) throw response;

                let hashPromise = EncryptionHandler.hashPassword(password, response.password_salt);
                return Promise.all([hashPromise, email, response.password_salt]);
            })
            .then((data)=>{
                return fetch("/api/user/login", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        password_hash: data[0],
                        email: data[1],
                        password_salt: data[2]
                    })
                });
            })
            .then(r=>r.json())
            .then((response)=>{
                if(response.error) throw response;

                window.user = new User(
                    response.id,
                    response.name,
                    response.email
                );

                return Promise.all([
                    EncryptionHandler.create(password, response.encryption_salt),
                    response.accounts
                ]);
            })
            .then(([encryptionHandler, accounts])=>{
                window.encryptionHandler = encryptionHandler;

                let promises = [];
                for(let i = 0; i < accounts.length; i++){
                    promises.push(user.decryptAndAddAccount(accounts[i]));
                }

                return Promise.all(promises);
            })
            .then((response)=>{
                changePage("home");
            })
            .catch((err)=>{
                console.log(err);
                if(err.error){
                    new Notifier("error", err.error.message);
                }else{
                    new Notifier("error", "Something went wrong, try refreshing the page");
                }
            });
    }

    render(){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit.bind(this))
            .append(new Elem("h1")
                .text("Login")
            )
            .append(new Elem("label")
                .text("Email")
                .append(new Elem("input")
                    .addClass("email")
                    .type("text")
                    .placeholder("Email")
                    .required()
                    .focus()
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
            .append(new Elem("button")
                .text("Login")
            )
            .append(new Elem("button")
                .text("Create Account")
                .addClass("link")
                .type("button")
                .onclick(()=>{changePage("register")})
            )
            .appendTo(this.container);
    }
}
