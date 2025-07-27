import Page from "./Page.js";
import Elem from "../Elem.js";
import Notifier from "../Notifier.js";
import Account from "../data/Account.js";

export default class CreateAccount extends Page{
    constructor(){
        super("CreateAccount");

        this.render();
    }

    async submit(){
        event.preventDefault();

        let account = await Account.create(
            this.container.querySelector(".name").value,
            this.container.querySelector(".balance").value
        );

        user.addAccount(account);
        user.changeAccount(account);
        changePage("home");
    }

    render(){
        new Elem("form")
            .addClass("standardForm")
            .onsubmit(this.submit.bind(this))
            .append(new Elem("h1")
                .text("Create Account")
            )
            .append(new Elem("label")
                .text("Account Name")
                .append(new Elem("input")
                    .type("text")
                    .addClass("name")
                    .placeholder("Account Name")
                    .required()
                    .focus()
                )
            )
            .append(new Elem("label")
                .text("Current Balance")
                .append(new Elem("input")
                    .type("number")
                    .addClass("balance")
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
                .addClass("cancel")
                .onclick(()=>{changePage("home")})
            )
            .appendTo(this.container);
    }
}
