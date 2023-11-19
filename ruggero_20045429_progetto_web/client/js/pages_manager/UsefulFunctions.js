"use strict"

/*
    USEFUL FUNCTIONS
    - fetchUpload: fetch for the upload of an image
    - fetchFunction: it generalizes fetch
    - setTheme: it sets a given color-scheme in other to change to a darker or a lighter theme
    - getTheme: it returns the current color theme
    - isLoggedIn: it checks if a session cookie exists in the user’s browser
    - loginFetch: it uses #loginFetchFunction to send the login request
    - whichUserLoggedIn: it returns the user currently logged in
    - getEmail: returns this.email, that should contain the currently logged in user
    - doLogOut: it logs out of the current session
*/

class UsefulFunctions {

    constructor(current_theme = 'theme-light') {
        this.current_theme = current_theme;
        this.email = "user-not-authenticated";
    }

    //fetch for image upload
    async fectchUpload(url, formData, operation = null) {
        try {
            let response;
            response = await fetch(url, {
                //header would cause troubles to determine the boundaries of the stream of data

                /*
                    When using FormData to submit POST requests using XMLHttpRequest or the Fetch_API with the multipart/form-data Content-Type
                    (e.g. when uploading Files and Blobs to the server), do not explicitly set the Content-Type header on the request.
                    Doing so will prevent the browser from being able to set the Content-Type header with the boundary expression it will
                    use to delimit form fields in the request body.

                 */

                method: 'POST',
                body: formData
            });
            //Managing the answer
            if (response !== null) {
                response = await response.json();
                console.log("In fetchFunction");
                console.log(response);
            }
            else {
                return {};
            }
            //If response exists
            if (operation === null) {
                return response;
            }
            else {
                return operation(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    //generalizes fetch
    async fetchFunction(url, method, operation = null, bodyofreq = null) {

        // console.log(url); //URL
        // console.log(method); //(GET/POST/PUT/DELETE/...)
        // console.log(operation); //What to do with the result
        // console.log(bodyofreq); //Body of the request

        try {
            let response;
            //using parameters in URL request
            if (bodyofreq === null) {
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            //Using the body of the request
            else {
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyofreq)
                });
            }

            //Managing the answer

            if (response !== null) {
                response = await response.json();
                // console.log("In fetchFunction");
                // console.log(response);
            }
            else {
                return {};
            }

            //If response exists

            if (operation === null) {
                return response;
            }
            else {
                return operation(response);
            }

        } catch (error) {
            console.error(error);
        }
    }

    // function to set a given theme/color-scheme
    setTheme(themeName) {
        localStorage.setItem('theme', themeName);
        document.documentElement.className = themeName; //the name corresponds to a css class's name
        this.current_theme = themeName;
    }

    //getter for the current theme
    getTheme() {
        return this.current_theme;
    }

    //Functions related to Login

    //checks if a user is logged in
    async isLoggedIn() {
        let value = await this.fetchFunction('/api/sessions/loggedin/', 'GET');
        console.log("check log in: " + value); // logs the value of the loggedIn property
        return value;
    }

    //Performs the login
    async #loginFetchFunction(serverUrl,body){
        let requestURL = serverUrl.concat("api/sessions/login/");
        console.log(requestURL);
        /**
         * Performs the login.
         * It returns the username logged in.
         */
        this.email = await this.fetchFunction(requestURL,'POST',null,body);
        console.log ("Currently logged in (client side, login function): " + this.email)
    }

    async loginFetch(serverUrl,body) {
        await this.#loginFetchFunction(serverUrl,body);
    }

    //returns which user is logged in
    async whichUserLoggedIn(serverUrl) {
        if (this.email === "user-not-authenticated") {
            let requestURL = serverUrl.concat("/api/sessions/which-user-is-logged-in");
            this.email = await this.fetchFunction(requestURL,'GET');
        }
        return this.email;
    }

    getEmail() {
        return this.email;
    }

    /**
     * Perform the logout
     */
    static doLogout = async () => {
        this.email = "user-not-authenticated";
        await fetch('/api/sessions/logout', { method: 'DELETE' });

        window.location = window.location.origin;

        
    }

}

export default UsefulFunctions;