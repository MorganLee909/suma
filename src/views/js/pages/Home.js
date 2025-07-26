import Page from "./Page.js";
import Elem from "../Elem.js";

export default class Home extends Page{
    constructor(){
        super("Home");

        this.render();
    }

    render(){
        new Elem("h1")
            .text("Home page")
            .appendTo(this.container);
    }
}
