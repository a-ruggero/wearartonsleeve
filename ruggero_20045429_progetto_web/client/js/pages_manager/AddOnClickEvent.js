"use strict"

import UsefulFunctions from "./UsefulFunctions.js";

/*
    ON CLICK EVENT ADDER
    It adds an onclick event to all the buttons in the Menu navbar (menu-nav).
*/

class AddOnClickEvent {

    constructor (pageCreator) {
        this.pageCreator = pageCreator;
        this.usefulFunctions = new UsefulFunctions();
    }

    buttonEventsAdder() {
        const nav = document.getElementById('menu-nav');
        const buttons = nav.querySelectorAll('button');

        //for each button add an event listener - to check when they are clicked
        buttons.forEach(button => {
            //button.addEventListener("click", this.buttonEventManager);
            button.addEventListener("click", this.buttonEventManager.bind(this));
            //bind is needed to have this corresponding to the instance of AddOnClickEvent
        });
    }

    buttonEventManager(event) {

        event.stopPropagation();

        switch(event.currentTarget.id) {
            case 'set-light-theme-button':
                this.usefulFunctions.setTheme('theme-light');
                break;
            case 'set-dark-theme-button':
                this.usefulFunctions.setTheme('theme-dark');
                break;
            default:
                break;
        }
    }
}

export default AddOnClickEvent;