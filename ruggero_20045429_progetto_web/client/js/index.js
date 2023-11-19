"use strict"

import PageCreator from './pages_manager/PageCreator.js';
import UsefulFunctions from './pages_manager/UsefulFunctions.js';
import AddOnClickEvent from './pages_manager/AddOnClickEvent.js';
import InitRouterClass from './pages_manager/InitRouterClass.js'

// About the server
const hostname = window.location.hostname;
const port = window.location.port;
const serverUrl = `http://${hostname}:${port}/`; //'http://localhost:3000';
console.log(serverUrl);

// Creates an instance of UsefulFunctions
const usefulFunctions = new UsefulFunctions();
// Creates an instance of pageCreator that can create pages in the main tag of index.html
const pageCreator = new PageCreator('main', serverUrl, usefulFunctions);
// Creates an instance of InitRouterClass
const initRouterObj = new InitRouterClass(pageCreator,usefulFunctions);
// Creates an instance of AddOnClickEvent Buttons
const menuButtonsEventManager = new AddOnClickEvent(pageCreator);

// Inizializza il routing
initRouterObj.initRouter();

// Initializes Menu Buttons
menuButtonsEventManager.buttonEventsAdder();

// Creates the homepage - (page.js does)
//pageCreator.createPage('home');

// Sets the light theme
usefulFunctions.setTheme('theme-light');

console.log('La pagina è completamente caricata!');

