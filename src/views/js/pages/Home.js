import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";

export default class Home extends Page{
    constructor(){
        super("Home");
        const date = new Date();
        const month = date.toLocaleString("en-US", {month: "long"});

        this.render(month);
    }

    render(month){
        new Elem("div")
            .addClass("buttonBox")
            .append(new Elem("button")
                .text("+")
                .addClass("button", "circle")
                .onclick(()=>{changePage("addMenu")})
            )
            .appendTo(this.container);

        new Elem("h1")
            .text(month)
            .appendTo(this.container);

        new Elem("dl")
            .append(new Elem("dt")
                .text("Balance: ")
            )
            .append(new Elem("dd")
                .text(Format.currency(user.account.balance))
            )
            .appendTo(this.container);

        new Elem("dl")
            .append(new Elem("dt")
                .text("Income: ")
            )
            .append(new Elem("dd")
                .text(Format.currency(user.account.incomeTotal()))
            )
            .appendTo(this.container);

        new Elem("dl")
            .append(new Elem("dt")
                .text("Bills: ")
            )
            .append(new Elem("dd")
                .text(Format.currency(user.account.billsTotal()))
            )
            .appendTo(this.container);
    }
}
