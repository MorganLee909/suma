import Login from "./pages/Login.js";
import Register from "./pages/Register.js";

const pages = document.querySelector(".page");
let currentPage;

window.changePage = (page, data)=>{
    console.time("change page");
    currentPage.close();

    switch(page){
        case "login": currentPage = new Login(); break;
        case "register": currentPage = new Register(); break;
    }
    console.timeEnd("change page");
}

currentPage = new Login();
