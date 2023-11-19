"use strict"

import PageCreator from './PageCreator.js';
import PageManager from './PageManager.js';

/*
    POST PAGEMANAGER
    It contains methods to create a single post given the code and the user
*/

class PostPageManager extends PageManager {

    constructor(element_id, serverUrl, usefulFunctions) {
        super(element_id, serverUrl, usefulFunctions);
        this.email = "user-not-authenticated";
    }

    // ---------------------------------------------------------------------------------------------------------------
        //SINGLE POST
    // ---------------------------------------------------------------------------------------------------------------

    async createArtShowCasePost(result) {
        if (result && result !== null && result !== [] && result.length >0) {
            let requestURL = this.serverUrl.concat("db/utente-getusername/?Email=");
            
            console.log("result:");
            console.log(result);

            let parameters = {

                //default value : ''

                //Post details
                "user_email" : result[0]["Utente"] || '',
                "timestamp_post" : result[0]["TimestampPost"] || '',
                //Image
                "imgsrc_opera" : "../../img/artworks/" + (result[0]["ImageSrc"] || ''),
                //Artwork
                "codice_opera" : result[0]["Codice"] || '',
                "titolo_opera" : result[0]["Titolo"] || '',
                "anno_opera" : result[0]["AnnoRealizzazione"] || '',
                "descrizione_opera" : result[0]["Descrizione"] || '',
                //Artist
                "nome_artista" : result[0]["Nome"] || '',
                "id_artista" : result[0]["Id"] || '',
                "descrizione_artista" : result[0]["Descrizione:1"] || '',
                "data_morte_artista" : ' - ' + result[0]["DataMorte"] || '',
                "data_nascita_artista" : result[0]["DataNascita"] || '',
                //Emoji and hashtag
                "emoji" : result[0]["Emozione"] || '',
                "hashtag" : result[0]["Scritta"] || '',
                //Comment
                "mifapensare" : result[0]["MiFaPensare"] || '',
                "mifasentire" : result[0]["MiFaSentire"] || '',
                "miricorda" : result[0]["MiRicorda"] || ''
            }

            //takes the username so the email remains private
            if (parameters["user_email"] && parameters["user_email"] !== '' && parameters["user_email"] !== null) {
                let username = await this.executeFetchFunctionWithControl(requestURL.concat(parameters["user_email"]),'GET') || '';
                parameters["user"] = username[0]["Nome"];
            }
        
            //generates html
            let postHtml = `
            <ul id="art-showcase">
                <ul class="display-inline">
                    <li id="usercontainerpost">${parameters["user"]}</li>
                    <li id="timestampcontainerpost">${parameters["timestamp_post"]}</li>`
            
            let isadmin = await this.executeFetchFunctionWithControl(this.serverUrl.concat("db/utente-isadmin/?Email=",this.email),'GET');
            isadmin = isadmin["success"];
            console.log("Is Admin:");
            console.log(isadmin);

            //both users and admins can delete a post
            if (parameters["user_email"] === this.email || isadmin === true) {
                postHtml+=
                ` <li><button id="delete-artwork-${parameters["codice_opera"]}">Delete</button></li> `;
            }

            //only the user can update the post
            if (parameters["user_email"] === this.email) {
                postHtml+=
                ` <li><button id="update-artwork-${parameters["codice_opera"]}">Update</button></li> `;
            }

            postHtml +=
                `</ul>
                <br>
                <li>
                    <img src="${parameters["imgsrc_opera"]}" class="img-post">
                    <br>
                    <ul class="post-details-artwork no-pointed-ul">
                        <li>Codice: ${parameters["codice_opera"]}</li>
                        <li><h3>${parameters["titolo_opera"]}</h3></li>
                        <li>${parameters["anno_opera"]}</li>
                        <li>${parameters["descrizione_opera"]}</li>
                    </ul>
                </li>
            <br>
            <ul class="display-inline">
                <li>Artist  ${parameters["id_artista"]}: </li>
                <li>${parameters["nome_artista"]} </li>
                <li>(${parameters["data_nascita_artista"]}</li>`
                if (parameters["data_morte_artista"] && parameters["data_morte_artista"] !== null && parameters["data_morte_artista"] !== '' && parameters["data_morte_artista"] !== ' - null') {
                    postHtml +=
                `<li>${parameters["data_morte_artista"]}</li>`
                }
                postHtml +=
                `<li>)</li>
                <li>${parameters["descrizione_artista"]}</li>
            </ul>
            <br>
            <li>
                <p class="emoji-hashtag-showcase">Emoji: ${parameters["emoji"]}</p>
                <p class="emoji-hashtag-showcase">Hashtag: ${parameters["hashtag"]}</p>
            </li>
            <br>
            <li>
                <ul id="#comments-showcase" class="no-pointed-ul">
                    <li>mi fa pensare: ${parameters["mifapensare"]}</li>
                    <li>mi ricorda: ${parameters["miricorda"]}</li>
                    <li>mi fa sentire: ${parameters["mifasentire"]}</li>
                </ul>
            </li>
            </ul>`;
        
            // Trim the whitespace from the HTML string
            //Whitespace in this context is all the whitespace characters (space, tab, no-break space, etc.) and all the line terminator characters (LF, CR, etc.).
            postHtml = postHtml.trim();

            // Parse the HTML string into a DOM element
            let template = document.createElement('template');
            template.innerHTML = postHtml;
            let postElement = template.content.firstChild;

            // Append the generated post to the main element
            this.element_id.appendChild(postElement);

            //update an artwork
            try {    
                let update_button = document.getElementById("update-artwork-" + parameters["codice_opera"]);
                if (update_button && update_button !== null) {
                    update_button.addEventListener("click", async (event) => {
                    event.preventDefault();

                    console.log("This button will permit to modify " + parameters["titolo_opera"]);
                    // let body = {};

                    // //take data from a form

                    // //update the database as that form is sent
                    // let requestURL = this.serverUrl.concat("db/update-artwork/");
                    // const pageCreator = new PageCreator(this.element_id,this.serverUrl,this.usefulFunctions);
                    // await this.executeFetchFunctionWithControl(requestURL,'PUT',pageCreator.createPage('profile'),body);
                    });
                }
            }
            catch (err) {
                console.log(err)
            }

            //delete an artwork
            try {
                let delete_button = document.getElementById("delete-artwork-" + parameters["codice_opera"]);
                if (delete_button && delete_button !== null) {
                    delete_button.addEventListener("click", async (event) => {
                    event.preventDefault();

                    console.log("This button will permit the deletion of " + parameters["titolo_opera"]);
                    let body;

                    //update the database
                    let requestURL = this.serverUrl.concat("db/delete-artwork/?Codice=");
                    const pageCreator = new PageCreator(this.element_id,this.serverUrl,this.usefulFunctions);
                    //await this.executeFetchFunctionWithControl(requestURL.concat(parameters["codice_opera"]),'DELETE',pageCreator.createPage('profile'),body);
                    let pageCreationPromise = pageCreator.createPage('profile');
                    await this.executeFetchFunctionWithControl(requestURL.concat(parameters["codice_opera"]),'DELETE', pageCreationPromise, body);

                    })
                }
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    
    async createArtShowCase(codice) {

        //sends the request and creates a page that shows results
        let requestURL = this.serverUrl;
        this.email = this.usefulFunctions.getEmail();
        requestURL=requestURL.concat("db/create-art-showcase/?codice=");
        if (codice && codice !== null) {
            await this.executeFetchFunctionWithControl(requestURL.concat(codice),'GET',this.createArtShowCasePost.bind(this));
            //bind is because otherwise you loose track of this object (PageManager) when in UsefulFunctions
        }
    }

}

export default PostPageManager;
