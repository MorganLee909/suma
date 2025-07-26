import Page from "./Page.js";
import Elem from "../Elem.js";

export default class CreateAccount extends Page{
    constructor(){
        super("CreateAccount");

        this.render();
    }

    async submit(){
        event.preventDefault();

        const data = {
            name: this.container.querySelector(".name").value,
            balance: this.container.querySelector(".balance").value
        };
        const iv = encryptionHandler.generateIv();
        const encryptedData = await encryptionHandler.encrypt(data, iv);
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
                .onclick(()=>{changePage("home")})
            )
            .appendTo(this.container);
    }
}
