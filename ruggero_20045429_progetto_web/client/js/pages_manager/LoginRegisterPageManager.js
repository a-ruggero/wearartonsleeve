"use strict"

import PageCreator from './PageCreator.js';
import PageManager from './PageManager.js';

/*
    LOGIN AND REGISTER PAGEMANAGER
    It contains functions to create the login and the register page.
*/

class LoginRegisterPageManager extends PageManager {

    constructor(element_id, serverUrl, usefulFunctions) {
        super(element_id, serverUrl, usefulFunctions);
        this.logged_in_email = null;
    }

    // ---------------------------------------------------------------------------------------------------------------
        //REGISTER AND LOGIN
    // ---------------------------------------------------------------------------------------------------------------

    #createLoginForm() {
        return `<form id="login-form" class="col-6 mx-auto">            
        <div class="form-group">
          <label for="email">Email</label>
          <input id = "email-input" type="email" name="email" class="form-control" required />
        </div>
    
        <div class="form-group">
          <label for="password">Password (at least 5 characters)</label>
          <input id = "password-input" type="password" name="password" class="form-control" required autocomplete/>
        </div>
        <button id = "login-button" type="submit" class="btn btn-primary">Login</button>
      </form>`;
    }
    
    createLoginPage() {
        this.emptyPage();

        this.element_id.innerHTML = this.#createLoginForm();

        const form = document.getElementById("login-form");
        const loginbutton = document.getElementById("login-button");

        const signUpButton = document.createElement("button");
        signUpButton.className = "btn btn-primary";
        signUpButton.textContent = "Sign Up";
        signUpButton.onclick = (event) => {
            event.preventDefault(); //prevents the form to be sent
            this.createRegisterPage();
        };

        form.appendChild(signUpButton);

        this.element_id.appendChild(form);

        loginbutton.addEventListener('click', async (event) => {
            
            event.preventDefault(); //stops submit

            //builds the request using data in the form

            let body = {}
            
            let email = document.getElementById('email-input').value;
            if (email != null && email != ''){
                body['email'] = email;
            }
            else {
                //create an alert block
                this.CreateAlertBlock("Inserire email");
            }

            let password = document.getElementById('password-input').value;
            if (password != null && password != '') {
                body['password'] = password;
            }
            else {
                //create an alert block
                this.CreateAlertBlock("Inserire password");
            }

            if (body['email'] && body['password'] ) {

                //sends the request and creates a page that shows results

                await this.usefulFunctions.loginFetch(this.serverUrl,body); //does the login
                const pageCreator = new PageCreator(this.element_id,this.serverUrl,this.usefulFunctions);
                pageCreator.createPage('profile');
            }
            else {
                this.CreateAlertBlock("Il form non deve essere vuoto");
            }
        });
    }

    #addGenderButtons(genders) {

        const ul = document.getElementById("genders-buttons-search");
        const textareaGender = document.getElementById("gender-input");        

        genders.forEach(gender => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = gender;
            button.onclick = (event) => {
                event.preventDefault(); //prevents the form to be sent
                textareaGender.textContent = gender;
            };
            li.appendChild(button);
            ul.appendChild(li);
        });
    }

    #createRegisterForm() {
        return `
        <h1>Registration</h1>
        <form id="signup-form" enctype="multipart/form-data">
            <fieldset>
                <legend>Login Information</legend>

                <strong>username:</strong><br>
                <input id="nome-signup-input" type="text" name="username"><br>

                <strong>email:</strong><br>
                <input id="email-signup-input" type="email" name="email" placeholder="joe@example.com"><br>

                <strong>password (at least 5 characters):</strong><br>
                <input id="password-signup-input" type="password" name="password1"><br>

                <strong>repeat your password:</strong><br>
                <input id="password2-signup-input" type="password" name="password2"><br>
            </fieldset>

            <fieldset id="fieldset2-signupform">
                <legend>Additional Infomation</legend>

                <strong>birth date:</strong><br>
                <input id="birthdate-signup-input" type="date" name="birthdate"><br>

                <div id='gender-container'>
                 <strong>gender:</strong><br>
                    <textarea id='gender-input' placeholder='Gender' disabled></textarea>

                    <ul class='display-inline list-none-type' id='genders-buttons-search'>
                        <!-- Add list items with buttons here for each gender -->
                    </ul>
                </div>
            </fieldset>

            <fieldset>
                <legend>Complete your Subscription</legend>

                <input id="signup-button" type="submit" value="Sign Up">
            </fieldset>
        </form>
        `
    }
    
    async createRegisterPage() {
        this.emptyPage();

        this.element_id.innerHTML =this.#createRegisterForm();
        
        const requestURL = this.serverUrl + 'db/select-gender/'; //SELECT * from Genere - call to the server to get all possible genders dinamically
        this.executeFetchFunctionWithControl(requestURL,'GET',this.#addGenderButtons.bind(this));

        //login button
        const loginButton = document.createElement("button");
        loginButton.className = "btn btn-primary";
        loginButton.textContent = "Already have an account? Login";
        loginButton.onclick = (event) => {
            event.preventDefault(); //prevents the form to be sent
            this.createLoginPage();
        };

        this.element_id.appendChild(loginButton);

        const signupform = document.getElementById("signup-form");
        signupform.addEventListener('submit', async (event) => {
            
            event.preventDefault(); //stops submit

            //builds the request using data in the form
            
            let body = {}

            let email = document.getElementById('email-signup-input').value;
            if (email != null && email != '') {
                body["@Email"] = email;
            }
            else {
                //create an alert block
                this.CreateAlertBlock("Inserire email");
            }

            let nome = document.getElementById('nome-signup-input').value;
            if (nome != null && nome != '') {
                body["@Nome"] = nome;
            }
            else {
                //create an alert block
                this.CreateAlertBlock("Inserire nome");
            }

            let data = document.getElementById('birthdate-signup-input').value;
            if (data != null && data != '') {
                body["@DataNascita"] = data;
            }
            else {
                //create an alert block
                this.CreateAlertBlock("Inserire data di nascita");
            }

            let gender = document.getElementById('gender-input').value;
            if (gender != null && gender != '') {
                body["@Genere"] = gender;
            }
            else {
                //create an alert block
                this.CreateAlertBlock("Inserire genere");
            }

            let password = document.getElementById('password-signup-input').value;
            let password2 = document.getElementById('password2-signup-input').value;
            if (password2 == password) {
                body["@Password"] = password;
            }
            else {
                //create an alert block
                this.CreateAlertBlock("Le password non corrispondono o non è stata inserita alcuna password");
            }

            if (body) {
                //sends the request and creates a page that shows results
                console.log(body);
                let requestURL = this.serverUrl;
                requestURL=requestURL.concat("api/sessions/signup/");
                console.log(requestURL);

                //Perform the signup
                
                console.log(body);
                await this.executeFetchFunctionWithControl(requestURL,'POST',null,body);
                this.createLoginPage();
            }
            else {
                this.CreateAlertBlock("Il form non può essere vuoto"); 
            }
        });
    }
    
}

export default LoginRegisterPageManager;