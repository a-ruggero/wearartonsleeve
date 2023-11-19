"use strict"

//import AddOnClickEvent from './AddOnClickEvent.js';
import UsefulFunctions from './UsefulFunctions.js';

/*
    PAGE MANAGER
    Parent class for most of the classes in pages_manager folder (the ones useful to create pages):
    - CreatePostPageManager: it creates the form to add a new artwork
    - HomePageManager: it creates the homepage, showing posts from the most recent to the least recent
    - LoginRegisterPageManager: it creates the login and the register pages
    - PostPageManager: it creates the single post to show an artwork and relative details
    - ProfilePageManager: given the user, it creates their profile page
    - SearchPageManager: it creates the form for the search by tags
    - PageCreator: based on the value of page (a string containing the name of the page to create) it uses the other classes to create the page needed
*/

class PageManager {
    constructor(element_id, serverUrl, usefulFunctions) {
        if (typeof element_id === 'string') {
            this.element_id = document.getElementById(element_id);
        }
        else {
            this.element_id =element_id;
        }
        this.serverUrl = serverUrl;
        this.usefulFunctions = usefulFunctions;
    }

    emptyPage(){
        this.element_id.innerHTML = "";
    }

    async CreateAlertBlock(message,before=false){

        const id = document.getElementById("main");
        const alert = document.createElement("div");
        alert.className = "alert alert-dark";
        alert.setAttribute("role", "alert");
        alert.textContent = message;

        if (before === false) id.insertBefore(alert, id.firstChild);
        else id.appendChild(alert);

        try {
            setTimeout(() => {
                if (id.contains(alert)) {
                    id.removeChild(alert);
                }
            },3000);
        }
        catch (err) {
            console.log(err);
        }
    }

    async executeFetchFunctionWithControl(url,method,operation=null,bodyofreq=null) {
        try {
            let result = await this.usefulFunctions.fetchFunction(url,method,operation,bodyofreq);
            if (!result || result === null) {
                return [];
            }
            else {
                return result;
            }
        }
        catch (err) {
            console.log(err);
            return [];
        }
    }
}

export default PageManager;