import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";
import Notifier from "../Notifier.js";

export default class Home extends Page{
    constructor(){
        super("Home");
        const date = new Date();
        const month = date.toLocaleString("en-US", {month: "long"});
        let logoutSvg = '<svg width="24px" height="24px" stroke-width="2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M12 12H19M19 12L16 15M19 12L16 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        this.render(month, logoutSvg);
    }

    async logout(){
        let response;
        try{
            response = await fetch("/api/user/logout", {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            });
        }catch(e){
            new Notifier("error", "Something went wrong, try refreshing the page");
        }

        if(!response.ok) return new Notifier("error", response.error.message);

        changePage("login");
    }

    render(month, logoutSvg){
        new Elem("div")
            .addClass("buttonBox")
            .append(new Elem("button")
                .text("+")
                .addClass("button", "circle")
                .onclick(()=>{changePage("addMenu")})
            )
            .append(new Elem("button")
                .innerHtml(logoutSvg)
                .addClass("button", "circle")
                .onclick(this.logout)
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
