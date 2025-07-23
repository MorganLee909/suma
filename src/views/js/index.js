import Login from "./pages/Login.js";

const pages = document.querySelector(".page");
let page;

const changePage = (page, data)=>{
    page.close();

    switch(page){
        case "login": page = new Login(); break;
    }
}

page = new Login();
