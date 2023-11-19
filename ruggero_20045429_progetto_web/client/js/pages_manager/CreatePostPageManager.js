"use strict"

import PageManager from "./PageManager.js";
import PostPageManager from "./PostPageManager.js";
import PageCreator from "./PageCreator.js";

/*
    ADD ARTWORK PAGEMANAGER
    It contains methods to create a form to add an artwork to your profile.
    Multer is used to upload the image of the artwork.
*/

class CreatePostPageManager extends PageManager {

    constructor(element_id, serverUrl, usefulFunctions) {
        super(element_id, serverUrl, usefulFunctions);
    }

    // ---------------------------------------------------------------------------------------------------------------
    // UPLOAD A NEW ART
    // ---------------------------------------------------------------------------------------------------------------

    async #getHtml(artists, emotions, email = null) {

        //generates HTML to create the form
        if (email === null) {
            email = await this.usefulFunctions.whichUserLoggedIn(this.serverUrl);
        };

        let form = `
        <div class="containerAddArtwork">
            <form id="addArtWorkForm" class="addArtwork">
                <fieldset>
                    <legend>Share an artwork</legend>
                    <input id="artwork-title" type="text"  name="title" placeholder="Title">
                    <input id="artwork-year"  type="text"  name="year" placeholder="Year of Realization">
                    <input id="artwork-image" type="file" name="imagesrc" placeholder="Image Name">
                </fieldset>
                <fieldset>
                    <legend>Details</legend>
                    <textarea id="artwork-description" name="description" placeholder="Description"></textarea>
                </fieldset>
                <fieldset>
                    <legend>Artist</legend>
                    <input id="inputsearchartist" type="hidden" disabled="" placeholder="Search Artist">
                    <input id="inputsearchartist-name" type="text" disabled="" placeholder="Search Artist">
                    <div class="artists">`;
        artists.forEach(elem => {
            form = form.concat(`<button id="btnArtist${elem.Id}">${elem.Id} ${elem.Nome}: ${elem.Descrizione}</button>`);
        });
        form = form.concat(` 
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Emotion and hashtag</legend>
                    <div id="emotion-container"  class="artists">
                        <input id="emoji-textarea" placeholder="Emoji" disabled></id>
                        <div class="display-inline list-none-type" id="emotions-buttons-search">
                `);

        emotions.forEach((emotion) => {
            form = form.concat(`<button id="btnEmotion${emotion}">${emotion}</button>`);
        });

        form = form.concat(`
                        </div>
                    </div>
                    <input id="hashtag-textarea" type="text" name="myTextField" placeholder="Hashtag">
                </fieldset>
                <fieldset>
                    <legend>The answers of three questions</legend>
                    <input id="it-makes-me-think" type="text" name="myTextField" placeholder="It makes me think">
                    <input id="it-remembers-me" type="text" name="myTextField" placeholder="It remembers me">
                    <input id="it-makes-me-feel" type="text" name="myTextField" placeholder="It makes me feel">
                </fieldset>
                <input id="sendButton" type="submit" value="Send">
            </form>
        </div>`);
        return form;
    }

    async #loadArtists() {
        // search in the database and show results
        let requestURL = this.serverUrl.concat("db/select-artists/");
        // console.log(requestURL);
        return await this.executeFetchFunctionWithControl(requestURL, 'GET');
    }

    async createArtUploader(email) {

        //takes the data needed
        let artists = await this.#loadArtists();
        const requestURL = this.serverUrl + 'db/select-emotions/';
        let emotions = await this.usefulFunctions.fetchFunction(requestURL, 'GET')

        //generates HTML
        this.element_id.innerHTML = await this.#getHtml(artists, emotions, email);

        //generates the artists buttons
        let textfield = document.getElementById("inputsearchartist");
        let textfield_name = document.getElementById("inputsearchartist-name");
        artists.forEach(elem => {
            document.getElementById(`btnArtist${elem.Id}`).addEventListener('click', (event) => {
                event.preventDefault();
                textfield.value = elem.Id; //clicking a button will insert the value of the artist's id in the textfield
                textfield_name.value = elem.Nome;
            })
        });

        //generates the emotions buttons
        let emotionstextfield = document.getElementById("emoji-textarea");
        emotions.forEach((emotion) => {
            document.getElementById(`btnEmotion${emotion}`).addEventListener('click', (event) => {
                event.preventDefault();
                emotionstextfield.value = emotion; //clicking a button it will insert the value of the artist's id in the textfield
            });
        });

        document.querySelector('#addArtWorkForm').addEventListener('submit', async (event) => {
            event.preventDefault(); //stops submit
            try {

                //takes the data from the fields of the form
                const formData = new FormData();
                let fields = {
                    "@Titolo": document.getElementById('artwork-title').value,
                    "@AnnoRealizzazione": document.getElementById('artwork-year').value,
                    "@Descrizione": document.getElementById('artwork-description').value,
                    "@Artista": document.getElementById('inputsearchartist').value,
                    "@ImageSrc": document.getElementById('artwork-image').files[0],
                    "@Email": email,
                    "@Emozione": document.getElementById('emoji-textarea').value,
                    "@Hashtag": document.getElementById('hashtag-textarea').value,
                    "@MiFaPensare": document.getElementById('it-makes-me-think').value,
                    "@MiRicorda": document.getElementById('it-remembers-me').value,
                    "@MiFaSentire": document.getElementById('it-makes-me-feel').value
                };

                let allValuesWritten = true;

                for (let key in fields) {
                    let value = fields[key];
                    if (!value) {
                        console.log(`The field ${key} is not written.`);
                        allValuesWritten = false;
                    }
                    else {
                        formData.append(key, value);
                    }
                }

                //if values are is valid
                if (formData && formData !== null && allValuesWritten === true) {
                    let requestURL = this.serverUrl.concat("db/add-artwork/");
                    const newPost = new PostPageManager(this.element_id, this.serverUrl, this.usefulFunctions);
                    //then create a new post
                    await this.usefulFunctions.fectchUpload(requestURL, formData, newPost.createArtShowCase);
                    const pageCreator = new PageCreator(this.element_id, this.serverUrl, this.usefulFunctions);
                    pageCreator.createPage('home');
                }
                else {
                    //show an error message
                    event.preventDefault();
                    console.log("Creating an alert block");
                    this.CreateAlertBlock("Il form non può essere vuoto, inserire tutti gli elementi richiesti.",true);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}

export default CreatePostPageManager;