import EncryptionHandler from "./EncryptionHandler.js";
import User from "./data/User.js";

import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Home from "./pages/Home.js";
import AddMenu from "./pages/AddMenu.js";

const pages = document.querySelector(".page");
let currentPage;

window.changePage = (page, data)=>{
    console.time("change page");
    currentPage.close();

    switch(page){
        case "login": currentPage = new Login(); break;
        case "register": currentPage = new Register(); break;
        case "home": currentPage = new Home(); break;
        case "addMenu": currentPage = new AddMenu(); break;
    }
    console.timeEnd("change page");
}

fetch("/api/user", {
    method: "GET",
    headers: {"Content-Type": "application/json"},
})
    .then(r=>r.json())
    .then((response)=>{
        if(response.error) throw response;
        let key = localStorage.getItem("key");
        if(!key) throw null;

        window.user = new User(
            response.id,
            response.name,
            response.email,
            response.accounts
        );

        window.encryptionHandler = new EncryptionHandler(key);
        currentPage = new Home();
    })
    .catch((err)=>{
        currentPage = new Login();
    });
