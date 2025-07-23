import LoginPage from "./pages/login.js";

const pages = document.querySelector(".page");
let page;

const changePage = (page, data)=>{
    page.close();

    switch(page){
        case "login": page = new LoginPage(); break;
    }
}
