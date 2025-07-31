import Notifier from "./Notifier.js";
import Elem from "./Elem.js";

export default class Navigator{
    constructor(container, options){
        const navBox = new Elem("div")
            .addClass("navigator")
            .appendTo(container);

        for(let i = 0; i < options.length; i++){
            const option = options[i].split("-");
            switch(option[0]){
                case "home": navBox.append(this.homeButton()); break;
                case "back": navBox.append(this.backButton(option[1])); break;
                case "logout": navBox.append(this.logoutButton()); break;
                case "viewMenu": navBox.append(this.viewMenuButton()); break;
                case "addMenu": navBox.append(this.addMenuButton()); break;
            }
        }
    }

    homeButton(){
        const homeSvg = '<svg viewBox="0 0 24 24" stroke-width="2.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.0497 12.2683 3.13416L22 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        return new Elem("button")
            .innerHtml(homeSvg)
            .addClass("navButton")
            .onclick(()=>{changePage("home")});
    }

    backButton(page){
        const backSvg = '<svg viewBox="0 0 24 24" stroke-width="2.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        return new Elem("button")
            .innerHtml(backSvg)
            .addClass("navButton")
            .onclick(()=>{changePage(page)});
    }

    logoutButton(){
        const logoutSvg = '<svg stroke-width="2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M12 12H19M19 12L16 15M19 12L16 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        return new Elem("button")
            .innerHtml(logoutSvg)
            .addClass("navButton")
            .onclick(this.logout);
    }

    viewMenuButton(){
        const viewSvg = '<svg viewBox="0 0 24 24" stroke-width="2.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M3 13C6.6 5 17.4 5 21 13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        return new Elem("button")
            .innerHtml(viewSvg)
            .addClass("navButton")
            .onclick(()=>{changePage("viewMenu")});
    }

    addMenuButton(){
        const addSvg = '<svg stroke-width="2.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M6 12H12M18 12H12M12 12V6M12 12V18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        return new Elem("button")
            .innerHtml(addSvg)
            .addClass("navButton")
            .onclick(()=>{changePage("addMenu")});
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
}
