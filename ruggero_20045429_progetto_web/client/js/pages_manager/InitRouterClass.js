"use strict"

import page from "//unpkg.com/page/page.mjs";

/*
    INITROUTERCLASS
    Given the PageCreator's address, it uses page (method InitRouter) to generate the desired page of the website
*/

class InitRouterClass {
    constructor (pageCreator,usefulFunctions) {
        this.PageCreator = pageCreator;
        this.usefulFunctions = usefulFunctions;
    }

    // Initialize routing
    initRouter() {

        // Configure routes
        page('/', () => {
            console.log('root route activated');
            page.redirect('/home');
        });
        page('/home', () => {
            console.log('Home route activated');
            this.PageCreator.createPage('home');
        });
        page('/search', () => {
            console.log('Search route activated');
            this.PageCreator.createPage('search-screen');
        });
        page('/add-artwork', () => {
            console.log('Add artwork page route activated');
            if (this.usefulFunctions.isLoggedIn()) {
                this.PageCreator.createPage('add-artwork');
            }
            else {
                this.PageCreator.createPage('login');
            }
        });
        page('/profile', () => {
            console.log('Profile page route activated');
            if (this.usefulFunctions.isLoggedIn()) {
                this.PageCreator.createPage('profile');
            }
            else {
                this.PageCreator.createPage('login');
            }
        });

        page('*', () => {
            console.log('Error page route activated');
            page.redirect('/')
        });

        // Starts page
        page();

    }
}

export default InitRouterClass;