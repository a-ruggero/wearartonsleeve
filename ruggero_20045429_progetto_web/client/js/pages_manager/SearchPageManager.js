"use strict"

import PageManager from './PageManager.js';
import PostPageManager from './PostPageManager.js';

/*
    SEARCH PAGEMANAGER
    It contains methods to create the search form and to show the results of a search.
*/

class SearchPageManager extends PageManager {

    constructor(element_id, serverUrl, usefulFunctions) {
        super(element_id, serverUrl, usefulFunctions);
    }

// ---------------------------------------------------------------------------------------------------------------
    //SEARCH
// ---------------------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------------------------------
        //SEARCH FORM
    // ---------------------------------------------------------------------------------------------------------------
      

    #addEmotionsButtons(emotions) {

        const textareaEmoji = document.getElementById('emoji-textarea');
        const ul = document.getElementById('emotions-buttons-search');

        try {
            emotions.forEach((emotion) => {
                const li = document.createElement('li');
                const button = document.createElement('button');
                button.textContent = emotion;
                button.onclick = (event) => {
                    event.preventDefault(); //prevents the form from being sent
                    textareaEmoji.textContent = emotion;
                };
                li.appendChild(button);
                ul.appendChild(li);
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    createSearchScreen_first_field(form) { // Title and artist's name
        form.innerHTML += 
        `<fieldset>
            <legend>Search by author or title of the art</legend>

            <input id="art-title" type="text" name="myTextField" placeholder="Title of the art">

            <input id="artist-name" type="text" name="myTextField" placeholder="Artist Name">
        </fieldset>`;
    }

    async createSearchScreen_second_field(form) { // Emotions and hashtags

        form.innerHTML += `
        <fieldset>
            <legend>Search by emotion or hashtag</legend>

            <div id="emotion-container">
                <textarea id="emoji-textarea" placeholder="Emoji" disabled></textarea>

                <ul class="display-inline list-none-type" id="emotions-buttons-search">
                    <!-- Add list items with buttons here for each emotion -->
                </ul>
            </div>

            <input id="hashtag-textarea" type="text" name="myTextField" placeholder="Hashtag">
        </fieldset>
        <fieldset>
            <button id="send-form-button">Send</button>
        </fieldset>`;
    
        // Search by emotions
        const requestURL = this.serverUrl + 'db/select-emotions/'; //SELECT * from Emozioni - call to the server to get all emotions dinamically
        await this.usefulFunctions.fetchFunction(requestURL,'GET',this.#addEmotionsButtons.bind(this))
    }

    // ---------------------------------------------------------------------------------------------------------------
        //SEARCH SCREEN
    // ---------------------------------------------------------------------------------------------------------------

    async createSearchScreen() {
        // Creates form
        const form = document.createElement('form');
        form.id = 'searchForm';

        // Creates fieldsets
        this.createSearchScreen_first_field(form);
        this.createSearchScreen_second_field(form);

        this.element_id.appendChild(form);

        // When submitting the form, a new page will appear, showing the results of the search
        form.addEventListener('submit', async (event) => {
            
            event.preventDefault(); //stops submit
            console.log(`Form sent`);

            //builds the request using data in the form

            let params = "";
            
            let form_elements = [];
            let form_element_keys = [];

            form_element_keys[0] = "Titolo";
            form_elements[0] = document.getElementById('art-title').value;
            form_element_keys[1] = "Nome";
            form_elements[1] = document.getElementById('artist-name').value;
            form_element_keys[3] = "Faccina";
            form_elements[3] = document.getElementById('emoji-textarea').value;
            form_element_keys[4] = "Scritta";
            form_elements[4]= document.getElementById('hashtag-textarea').value;

            let first=true;
            form_elements.forEach((elem,index) => {
                if (elem != "") {
                    params = params.concat(((first) ? '?' : '&'),form_element_keys[index],"=",elem);
                    first = false;
                }
            });

            //sends the request and creates a page that shows results
            let requestURL = this.serverUrl;
            requestURL=requestURL.concat("db/submit-search/",params);
            console.log("searchform requestURL");
            console.log(requestURL);
            await this.usefulFunctions.fetchFunction(requestURL,'GET',this.createSearchResultsScreen.bind(this));
            //bind is because otherwise you loose track of this object (SearchPageManager) when in UsefulFunctions
        });
    }

    // ---------------------------------------------------------------------------------------------------------------
        //RESULTS
    // ---------------------------------------------------------------------------------------------------------------

    createSearchResultsScreen(result) {
        this.emptyPage();

        //generate posts
        let resultContainer;
        console.log(result);
        //if there are no artworks
        if ((!result || result === null || !(result instanceof Array) || result.length === 0) ) {
            resultContainer = document.createElement('p');
            resultContainer.textContent = "No artworks found";
            this.element_id.appendChild(resultContainer);
        }
        else {
            //generate all the posts found
            const singlePost = new PostPageManager(this.element_id,this.serverUrl,this.usefulFunctions);
            result.forEach(res => {
                singlePost.createArtShowCase(res.Codice);
            })
        }
    }

}

export default SearchPageManager;