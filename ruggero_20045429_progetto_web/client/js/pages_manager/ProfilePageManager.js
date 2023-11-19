"use strict"

import PageCreator from './PageCreator.js';
import PageManager from './PageManager.js';
import PostPageManager from './PostPageManager.js';
import UsefulFunctions from './UsefulFunctions.js';

/*
    PROFILE PAGEMANAGER
    It contains functions to create the profile page.
    When logged into you profile, you can see details about you.
*/

class ProfilePageManager extends PageManager {

    constructor(element_id, serverUrl, usefulFunctions) {
        super(element_id, serverUrl, usefulFunctions);
        this.email = this.usefulFunctions.getEmail();
    }

    // ---------------------------------------------------------------------------------------------------------------
        //PROFILE PAGE
    // ---------------------------------------------------------------------------------------------------------------

    async createProfilePage() {
            this.emptyPage();
        
            // Logged in check
            if (!this.email || this.email === "user-not-authenticated") {
                this.email = await this.usefulFunctions.whichUserLoggedIn(this.serverUrl);
                if (!this.email || this.email === null){
                    const pageCreator = new PageCreator(this.element_id,this.serverUrl,this.usefulFunctions);
                    pageCreator.createPage('login');
                }
            }

            console.log("Email in profile page: " + this.email);
        
            if (this.email && this.email !== "user-not-authenticated") {
                let requestURL = `${this.serverUrl}db/utente/?Email=${this.email}`;
                let res = await this.executeFetchFunctionWithControl(requestURL,'GET');
        
                console.log("Profile page of:")
                console.log(res);
        
                //Starts generating the profile page
                let profilePage = `
                <div id="header">
                    <span>${res[0]["Email"]}</span>
                    <button id = "logout-button-${res[0]["Nome"]}">Logout</button>
                </div>
                <div id="username-bio-container">
                    <h2>${res[0]["Nome"]}</h2>
                    <p>Data di nascita: ${res[0]["DataNascita"]} Genere: ${res[0]["Genere"]}</p>
                </div>
                <div id="user-posts"></div>
                `;

                this.element_id.innerHTML += profilePage;

                //logout button
                let logout_button = document.getElementById("logout-button-" + res[0]["Nome"]);
                console.log("button logout: " + logout_button.id);
                if (logout_button && logout_button !== null)
                {
                    logout_button.addEventListener("click", async (event) => {
                        console.log("BUTTON LOGOUT CLICKED");
                        event.preventDefault();
                        await UsefulFunctions.doLogout();
                        const pageCreator = new PageCreator(this.element_id,this.serverUrl,this.usefulFunctions);
                        pageCreator.createPage('home');
                    })
                }
        
                // Logged in user's posts
                requestURL = `${this.serverUrl}db/select-art-for-profile/?Email=${this.email}`;
                let result = await this.executeFetchFunctionWithControl(requestURL,'GET');
        
                if (result && result.length > 0) {
                    const postPageManager = new PostPageManager(this.element_id,this.serverUrl,this.usefulFunctions);
                    for (let i = result.length-1; i >= 0; i--) {
                        await postPageManager.createArtShowCase(result[i]["Codice"],this.email);
                    }
                } else {
                    profilePage = "<p>Non hai postato ancora nessuna opera</p>";
                    this.element_id.innerHTML += profilePage;
                }
            }
        }
        
}

export default ProfilePageManager;