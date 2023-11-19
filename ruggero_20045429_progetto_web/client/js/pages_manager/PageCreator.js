"use strict"

import HomePageManager from './HomePageManager.js';
import SearchPageManager from './SearchPageManager.js';
import CreatePostPageManager from './CreatePostPageManager.js';
import ProfilePageManager from './ProfilePageManager.js';
import PageManager from './PageManager.js';
import LoginRegisterPageManager from './LoginRegisterPageManager.js';


/*
    PAGE CREATOR
    It extends PageManager.
    It manages the dinamic creation of HTML pages such as:
    - HomePage
    - Search
    - Add Art
    - Profile Page
    - Login and Register Pages
*/

class PageCreator extends PageManager {
    constructor(element_id, serverUrl, usefulFunctions) {
        super(element_id, serverUrl, usefulFunctions);
    }

// ---------------------------------------------------------------------------------------------------------------
    // CREATE PAGE
// ---------------------------------------------------------------------------------------------------------------

    async createPage(page) {
        //page indicates what's the next page to create

        //Empties the element considered
        this.emptyPage();

        try {
            switch (page) {
                case 'home':
                    const home = new HomePageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                    await home.createHome();
                    break;
                case 'search-screen':
                    const search = new SearchPageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                    search.createSearchScreen();
                    break;
                case 'login':
                    const login = new LoginRegisterPageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                    await login.createLoginPage();
                    break;
                case 'signup':
                    const signup = new LoginRegisterPageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                    await signup.createRegisterPage();
                    break;
                case 'error-page':
                    throw new Error("si è verificato un errore");
                case 'add-artwork':
                    if (!(await this.usefulFunctions.isLoggedIn())){
                        const login = new LoginRegisterPageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                        login.createLoginPage();
                    }
                    else {
                        const artAdder = new CreatePostPageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                        await artAdder.createArtUploader(this.usefulFunctions.getEmail());
                    }
                    break;
                case 'profile':
                    if (!(await this.usefulFunctions.isLoggedIn())) {
                        const login = new LoginRegisterPageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                        login.createLoginPage();
                    }
                    else {
                        const profile = new ProfilePageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                        await profile.createProfilePage();
                    }
                    break;
                default:
                    break;
            }

        }
        catch (err) {
            console.log(err);
        }
    }

}

export default PageCreator;