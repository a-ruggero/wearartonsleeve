"use strict"

import PageManager from './PageManager.js';
import PostPageManager from './PostPageManager.js';

/*
    HOME PAGEMANAGER
    It contains methods to create the homepage using PostPageManager
*/

class HomePageManager extends PageManager {

    constructor(element_id, serverUrl, usefulFunctions) {
        super(element_id, serverUrl, usefulFunctions);
        this.postPageManager = new PostPageManager(this.element_id,this.serverUrl);
    }
    
    // ---------------------------------------------------------------------------------------------------------------
        //HOMEPAGE
    // ---------------------------------------------------------------------------------------------------------------

    async createHome() {
        let requestURL = `${this.serverUrl}db/select-art-for-home/`;
        let result = await this.executeFetchFunctionWithControl(requestURL,'GET');
    
        let homeHtml = `
        <div class="row">
            <div class="col">
                <h3>Feed</h3>
            </div>
        </div>
        `;
        // Append the generated home to the main element
        this.element_id.innerHTML += homeHtml;
    
        if (result && result !== null && ((result.length>0 && result instanceof Array) || !(result instanceof Array))) {

            console.log("result : " + result);

            const postPageManager = new PostPageManager(this.element_id, this.serverUrl, this.usefulFunctions);
            for (let i = result; i >0; i--) {
                // console.log("Actual post:");
                // console.log(i);
                await postPageManager.createArtShowCase(i);
            }
        } else {
            this.element_id.innerHTML += "<p>Nessuna opera da mostrare</p>";
        }
    }
    
}

export default HomePageManager;