import Page from "./Page.js";
import Elem from "../Elem.js";
import Format from "../Format.js";

export default class ViewBills extends Page{
    constructor(){
        super("ViewBills", ["home", "back-viewMenu", "logout"]);

        this.render(false);
    }

    generateColor(spent, amount){
        if(amount <= 0) return "hsl(0, 100%, 50%)";

        const percent = Math.min(spent / amount, 1); 
        let hue;
        if(percent < 0.5){
            hue = percent / 0.5 * 45;
        }else{
            hue = 45 + (percent - 0.5) / 0.5 * (120 -45);
        }

        const saturation = 65 - percent * 15;
        const lightness = 28 + (1 - Math.abs(percent - 0.5) * 2) * 10;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    toggleActive(){
        const showArchived = this.container.querySelector(".archiveCheckbox").checked;
        this.renderItems(showArchived);
    }

    renderItems(showArchived){
        const container = this.container.querySelector(".categoryContainer");
        while(container.children.length > 0){
            container.removeChild(container.lastChild);
        }

        const bills = user.account.bills;
        for(let i = 0; i < bills.length; i++){
            if(!showArchived && !bills[i].active) continue;
            const spent = user.account.categorySpent(bills[i]);
            const spentAsCurrency = Format.currency(spent);
            const amount = bills[i].amount;
            const amountAsCurrency = Format.currency(amount);

            new Elem("button")
                .addClass("viewCategoryItem")
                .onclick(()=>{changePage("editBill", bills[i])})
                .append(new Elem("p")
                    .text(bills[i].name)
                    .addClass(bills[i].active ? "none" : "strike")
                )
                .append(new Elem("p")
                    .addClass("categoryItemSpent")
                    .append(new Elem("span")
                        .text(spentAsCurrency)
                        .addStyle("color", this.generateColor(spent, amount))
                    )
                    .append(new Elem("span")
                        .text(" / ")
                    )
                    .append(new Elem("span")
                        .text(amountAsCurrency)
                        .addStyle("color", "hsl(120, 50%, 28%)")
                    )
                )
                .appendTo(container);
        }
    }

    render(showArchived){
        new Elem("h1")
            .text(`${user.account.name} Bills`)
            .appendTo(this.container);

        new Elem("label")
            .addClass("switch")
            .append(new Elem("p")
                .text("Show Archived")
            )
            .append(new Elem("input")
                .type("checkbox")
                .addClass("archiveCheckbox")
                .checked(false)
                .onchange(this.toggleActive.bind(this))
            )
            .append(new Elem("span")
                .addClass("slider")
            )
            .appendTo(this.container);

        new Elem("div")
            .addClass("categoryContainer")
            .appendTo(this.container);

        this.renderItems(showArchived);
    }
}
