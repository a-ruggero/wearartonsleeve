"use strict"

//----------------------------------------------------------------------
// Require
//----------------------------------------------------------------------

/**
 * npm install express
 * npm install multer
 * npm install mime
 * npm install truncate-utf8-bytes
 * npm install sqlite3
 * npm install passport
 * npm install passport-local
 * npm install express-session
 * npm install morgan
 * npm install session-file-store
 */

//const http = require('http');
const express = require('express');
const multer = require('multer'); //to manage file loading
const fs = require('fs');  // 'file system'
const path = require('path');
const mime = require('mime'); //to work with a generic data type
const sanitize = require("./sanitize.js");
const socdb = require("./SocialDatabase.js");
const passport = require("passport"); //auth middleware
const LocalStrategy = require("passport-local").Strategy; //email and password
const morgan = require('morgan'); // logging middleware
const session = require("express-session");
const { check } = require('express-validator');
//const FileStore = require('session-file-store')(session);

const app = express();

const hostname = '127.0.0.1';
const port = 3000;

//----------------------------------------------------------------------
// Database constants
//----------------------------------------------------------------------

/* 
  Create all the Objects needed to manage the exchange of data with the Database.
  Every constant refers to a table, apart from:
  - db: it refers to the database itself
  - passwordManager: it provides useful functions to encrypt and check passwords.
 */

const db_file_path = path.join(__dirname, '../database/social.db');
const db = new socdb.SocialDatabase(db_file_path);

// Users related tables
const dbUtente = new socdb.DbTable(db, "Utente");
const dbAdmin = new socdb.DbTable(db, "Curatore");

//Artists related tables
const dbArtist = new socdb.DbTable(db, "Artista");

//PasswordsManagement
const passwordManagement = new socdb.PasswordManagement();

// Domains related tables
const dbEmozioni = new socdb.DbTable(db, "Emozioni");
const dbGenere = new socdb.DbTable(db, "Genere");

// Artwork related tables
const dbArtWork = new socdb.DbTable(db, "OperaDArte");
const dbArtWorkRealization = new socdb.DbTable(db, "Realizzazione");
const dbOperaHashtag = new socdb.DbTable(db, "OperaHashtag");
const dbOperaEmozioni= new socdb.DbTable(db, "OperaEmoji");
const dbTreRisposte = new socdb.DbTable(db, "TreRisposte");
const dbHashtag = new socdb.DbTable(db, "Hashtag");

//Post management related tables

const dbAddPostDetails = new socdb.DbTable(db, "Post");

// Views related tables
const dbSearchForm = new socdb.DbTable(db, "view_searchform");
const dbCreatePost = new socdb.DbTable(db, "view_art_showcase");

//----------------------------------------------------------------------

// Controls if the given parameters are valid

function bodyControl(fields, body) {
  let allFieldsValid = true;
  for (const field of fields) {
    if (!body[field] || body[field] === null || body[field] === '') {
      allFieldsValid = false;
      break;
    }
  }
  return allFieldsValid;
}

//----------------------------------------------------------------------
// MULTER
//----------------------------------------------------------------------

// This defines a storage engine for storing files on disk
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // return a unique file name for every file              
  }
});
// This creates a multer instance with the storage engine
const upload = multer({ storage });


//----------------------------------------------------------------------
// Passport initialization
//----------------------------------------------------------------------

// set up the "email and password" login strategy
// by setting a function to verify email and password
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
    try {
      if (email && password) {

        const where = {
          "$Email" : email,
        };
        const result = await dbUtente.select(where, ['Email','Password']);
        // for every line of result[] there's an array containing data from the line

        if (result.length === 0) {
          return done(null, false, { message: "Utente non trovato" });
        }

        const user = {};
        user['email'] = result[0]["Email"];
        user['password'] = result[0]["Password"];

        // confronts encrypted passwords
        if (!passwordManagement.passwordCheck(password, user.password)) {
          return done(null, false, { message: "Password errata" });
        }
        /**
         * The first argument of done() is an error object,
         * the second argument is the user object,
         * and the third argument is an optional message object.
        */
        return done(null, user);
      } else {
        throw new Error("Inserire utente e password");
      }
    } catch (err) {
      return done(err);
    }
  }
));

// serialize and de-serialize the user (user object <-> session)

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(async function(email, done) {
  try {
    testDbConnection();
    let result = null;
    if (email !== null && email !== '') {
      try {
        let where = { "$Email": email };
        result = await dbUtente.select(where, []);
      }
      catch (err) {
        console.log(err);
      }
      result = JSON.parse(JSON.stringify(result));
      if (result === null) {
        throw new Error ("error");
      }
      done(null, result);
    }
    else {
      throw new Error ("missing user email");
    }
  }
  catch (err) {
    console.log(err);
    done(err, null);
  }
});

// set up the middleware
/**
 * Morgan is a middleware for Node.js that logs HTTP requests
 * The string 'tiny' passed as an argument to morgan specifies
 * the default log format to use.
 * The 'tiny' format provides minimal output, showing only the HTTP
 * method, URL, response status, response content length,
 * and response time in milliseconds.
 * Morgan can be used to log HTTP requests in various predefined or
 * custom formats and can be configured to write logs to different
 * output streams. It is a useful tool for monitoring HTTP requests
 * and diagnosing any issues with an Express server.
 */
app.use(morgan('tiny'));

// check if a given request is coming from an authenticated user
const isLoggedIn = function (req, res, next) {
  if(req.isAuthenticated()){
      return next();
  }
  return res.status(401).json({"statusCode" : 401, "message" : "not authenticated"});
}


// set up the session
app.use(session({
  //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, //life of the cookie
    SameSite: 'lax',
  }
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

//----------------------------------------------------------------------
// Application
//----------------------------------------------------------------------

/*
  these methods allow the server to parse data sent from the client
  in JSON format or as URL-encoded form data
*/

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('client'));

// MULTER
// This function will take the incoming request payload and convert it into a Buffer,
// useful when you want to process the raw binary data in the request payload.
// (otherwise there's an error because it always tries to convert into JSON)
app.use(express.raw());

//--------------------------------------------------------------------
// Sessions management 
//--------------------------------------------------------------------

const expressValidators = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('email').notEmpty().withMessage('Email field cannot be empty'),
  check('password')
    .notEmpty().withMessage('Password field cannot be empty')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    //.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Sign up
app.post('/api/sessions/signup', expressValidators, async (req, res) => {
  try {
    testDbConnection();
    
    //insert the user in the database

    const fields = ['@Email', '@DataNascita', '@Genere', '@Nome', '@Password'];

    if (req.body && bodyControl(fields,req.body)) {
        let hash = await passwordManagement.passwordEncrypt(req.body["@Password"]);
        req.body["@Password"] = hash;
        await dbUtente.insert(req.body);
        res.set('Content-Type', 'text/plain');
        res.status(201).end("user " + req.body["@Email"] + " inserted in Utente");
    }
    else {
      throw new Error("Si è verificato un errore");
    }
  }
  catch (err) {
    res.set('Content-Type', 'text/plain');
    res.status(500).end("error: " + err);
    console.error("error: " + err);
  }
});

// POST /sessions 
// Login
app.post('/api/sessions/login', expressValidators, async function(req, res, next) {
  try {
    let user;
    if (req.body && bodyControl(["email","password"],req.body))
    {
      user = {
        "email" : req.body.email,
        "password" : req.body.password
      };
    }
    else {
      throw new Error("Insert email and password");
    }

    //confronts the credentials to do the login

    passport.authenticate('local',  function(err, user, info) {
      if (err) { next(err) }
      if (!user) {
          // display wrong login messages
          res.status(401).json(info);
      }
      //success, perform the login
      req.login(user, function(err) {
        if (err) { /* return */ next(err); }
        // req.user contains the authenticated user
        res.json(req.user.email);
      });
    })(req, res, next);
  }
  catch (err) {
    console.log("Error:");
    console.log(err);
  }
});

// DELETE /current session 
// Logout
app.delete('/api/sessions/logout', function(req, res){
  req.logout(function(err) {
      if (err) { return res.status(503).json(err); }
    });
  res.end();
});

// ISLOGGEDIN
// Returns to the client if a user is logged in
app.get('/api/sessions/loggedin', function(req, res) {
    res.send(req.isAuthenticated());
});


//WHICHLOGGEDIN
// Returns to the client which user is logged in
app.get('/api/sessions/which-user-is-logged-in', (req, res) => {
  try {
    if (isLoggedIn) {
      res.status(200);
      console.log(req.user.email + "Is the user logged in right now");
      res.end(req.user.email);
    }
  }
  catch (err) {
    //res.status(401).json({ error: 'Not authenticated' });
    res.status(200);
    res.end("user not authenticated");
  }
});


//--------------------------------------------------------------------
// Database routing definitions 
//--------------------------------------------------------------------

// ---------------------------------- USERS ----------------------------------

// ADD A NEW USER - INSERT INTO UTENTE: it was made with Signup

//UPDATE A USER - UPDATE TABLE UTENTE
//if it's your account, you can update informations about you
//(your artworks will not change)
app.put('/db/utente/*', isLoggedIn, async (req, res) => {+
  console.log(req.body);
  try {
    testDbConnection();

    let updateObj = {};

    //if there are new values to insert into the database

    if (bodyControl(["@DataNascita"],req.body) || bodyControl(["@Genere"],req.body) || bodyControl(["@Nome"],req.body)) {
      if (bodyControl(["@DataNascita"],req.body)){
        updateObj["@DataNascita"] = req.body["@DataNascita"];
      }
      if (bodyControl(["@Genere"],req.body)) {
        updateObj["@Genere"] = req.body["@Genere"];
      }
      if (bodyControl(["@Nome"],req.body)) {
        updateObj["@Nome"] = req.body["@Nome"];
      }
    }
    else {
      throw new Error("Si è verificato un errore");
    }

    // If you know the user you want to modify

    if (req.body["$Email"] && bodyControl(req.body["$Email"],req.body)) {
      await dbUtente.update(updateObj, {"$Email": req.body["$Email"]});
      res.set('Content-Type', 'text/plain');
      res.status(200).end("utente " + req.body["$Email"] + " modificato");
    }
    else {
      throw new Error("Si è verificato un errore");
    }
  }
  catch (err) {
    res.set('Content-Type', 'text/plain');
    res.status(500).end("utente " + req.params[0] + " error: " + err);
    console.error("utente " + req.params[0] + " error: " + err);
  }
});

//DELETE A USER - DELETE FROM UTENTE
//if it's your account or you are an admin, you can delete your account
//(your artworks will remain)
app.delete('/db/utente/*', isLoggedIn, async (req, res) => {
    try {
      testDbConnection();
      if (req.body && bodyControl(req.body["@Email"],req.body)) {
        await dbUtente.delete({"$Email": req.body["@Email"]});     
        res.set('Content-Type', 'text/plain');
        res.status(200).end("utente " + req.body["@Email"] + " cancellato");
      }
      else {
        throw new Error("Si è verificato un errore");
      }
    }
    catch (err) {
      res.set('Content-Type', 'text/plain');
      res.status(500).end("utente " + req.body["@Email"] + " error: " + err);
      console.error("utente " + req.body["@Email"] + " error: " + err);
    }
  }
);

//SELECT A USER - SELECT FROM UTENTE
//returns details about a user from the email
app.get('/db/utente/*', isLoggedIn, async (req, res) => {
  try {
    testDbConnection();
    let where = {};
    if (req.query && bodyControl(["Email"],req.query)) {
      where = { "$Email": req.query["Email"] };
      let result = await dbUtente.select(where, []);
      res.set('Content-Type', 'application/json');
      res.status((result.length == 0) ? 404 : 200).end(JSON.stringify(result));
    }
  }
  catch (err) {
    let message = (err) ? err.message : "generic error";
    res.set('Content-Type', 'text/plain');
    res.status(500).end(message);
    console.error(message);
  }
});

//SELECT A USER - SELECT FROM UTENTE
//returns the username related to the email
app.get('/db/utente-getusername/*', async (req, res) => {
  try {
    testDbConnection();
    let where = {};
    if (req.query && bodyControl(["Email"],req.query)) {
      where = { "$Email": req.query["Email"] };
      let result = await dbUtente.select(where, ["Nome"]);
      res.set('Content-Type', 'application/json');
      res.status((result.length == 0) ? 404 : 200).end(JSON.stringify(result));
    }
  }
  catch (err) {
    let message = (err) ? err.message : "generic error";
    res.set('Content-Type', 'text/plain');
    res.status(500).end(message);
    console.error(message);
  }
});

//SELECT AN ADMIN - SELECT FROM CURATORE
//returns if the user is an admin
app.get('/db/utente-isadmin/*', async (req, res) => {
  try {
    testDbConnection();
    let where = {};
    if (req.query["Email"] && req.query["Email"] !== null && req.query["Email"] !== "user-not-authenticated") {
      where = { "$Email": req.query["Email"]};
      let result = await dbAdmin.select(where, ["Email"]);
      res.set('Content-Type', 'application/json');
      if (result !== null && result.length>0) res.status(200).end(JSON.stringify({ success: true }));
    }
    res.status(200).end(JSON.stringify({ success: false }));
  }
  catch (err) {
    let message = (err) ? err.message : "generic error";
    res.set('Content-Type', 'text/plain');
    res.status((result.length == 0) ? 404 : 200).end(JSON.stringify({ success: false }));
    console.error(message);
  }
});

// ---------------------------------- SEARCH FORM ----------------------------------

//SELECT EMOTIONS TO GENERATE BUTTONS
app.get('/db/select-emotions/*', async (req, res) => {
  try {
    testDbConnection();
    let result = await dbEmozioni.select({}, ["Emozione"]);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    let tab = [];
    result.forEach(row => tab.push(row.Emozione));
    res.end(JSON.stringify(tab));
  }
  catch (err) {
    console.error(err.message);
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 500;
    res.end(err.message);
  }

});

//SUBMIT SEARCH FORM
app.get('/db/submit-search/*', async (req, res) => {
  try {
    testDbConnection();

    let where = {};

    //if there are search parameters
    if (req.query && req.query !== null) {

      //Search per emoji and hashtag
      if (req.query["Faccina"]) where["$Emozione"] = req.query["Faccina"];
      if (req.query["Scritta"]) where["$Scritta"] = req.query["Scritta"];

      let result = [];
      if (Object.keys(where).length !== 0) {
        result = await dbSearchForm.select(where, ["Codice"]);
      }

      console.log("Result: " + JSON.stringify(result));

      where = {};

      //Search per name and title of the artwork
      if (req.query["Titolo"]) where["$Titolo"] = req.query["Titolo"];
      if (req.query["Nome"]) where["$Nome"] = req.query["Nome"];

      let sql = "SELECT Codice FROM view_searchform WHERE ";
      if (where["$Nome"]) sql += "Nome LIKE '%" + where["$Nome"] + "%'";
      if (where["$Nome"] && where["$Titolo"]) sql += " AND ";
      if (where["$Titolo"]) sql += "Titolo LIKE '%" + where["$Titolo"] + "%'";

      console.log("SQL: " + sql);

      let result2 = [];
      if (Object.keys(where).length !== 0) {
        result2 = await db.executeQuery(sql,{});
      }

      console.log("Result2: " + JSON.stringify(result2));

      //Merging the results

      let finalResult;
      if (result && Array.isArray(result) && result2 && Array.isArray(result2)) {
        finalResult = result.concat(result2);
      }
      else {
        finalResult = [];
        if (result && Array.isArray(result)) {
          finalResult = finalResult.concat(result);
        }
        else {
          console.error('result is not an array:', result);
        }
        if (result2 && Array.isArray(result2)) {
          finalResult = finalResult.concat(result2);
        }
        else {
          console.error('result2 is not an array:', result2);
        }
      }

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(finalResult));
    }
    else {
      throw new Error("Si è verificato un errore");
    }
  }
  catch (err) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 500;
    res.end(err.message);
    console.error(err.message);
  }
});

// ---------------------------------- GENDERS ----------------------------------

//SELECT GENDERS TO GENERATE BUTTONS
//select all the codes of the artworks corresponding to the search
app.get('/db/select-gender/*', async (req, res) => {
  try {
    testDbConnection();
    let result = await dbGenere.select({}, ["Genere"]);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    let tab = [];
    result.forEach(row => tab.push(row.Genere));
    res.end(JSON.stringify(tab));
  }
  catch (err) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 500;
    res.end(err.message);
    console.error(err.message);
  }

});

// ---------------------------------- ARTWORKS ----------------------------------

//SELECT DATA TO GENERATE THE REQUIRED POST
//it shows all related details of the artworks in the database
app.get('/db/create-art-showcase/*', async (req, res) => {
  try {
    testDbConnection();

    let body = {};
    let result;
    
    if (req.query.codice && bodyControl(["codice"],req.query)) {
      body = {
        "$Codice" : req.query.codice
      };
      result = await dbCreatePost.select(body,[]);
    }
    else {
      throw new Error("error");
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  }
  catch (err) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 500;
    res.end(err.message);
    console.error(err.message);
  }
});

//SELECT POSTS TO SHOW ON THE HOMEPAGE
//it shows all related details of the artworks in the database
app.get('/db/select-art-for-home/*', async (req, res) => {
  try {
    testDbConnection();

    let result = await db.executeQuery("SELECT MAX(Codice) FROM OperaDArte;",{});

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;

    res.end(JSON.stringify(result[0]["MAX(Codice)"]));
  }
  catch (err) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 500;
    res.end(err.message);
    console.error(err.message);
  }
});

//SELECT POSTS TO SHOW ON THE PROFILE PAGE
//it shows all related details of the artworks in the database
app.get('/db/select-art-for-profile/*', isLoggedIn, async (req, res) => {
  try {
    testDbConnection();

    let result;

    if (req.query && bodyControl(["Email"],req.query)) {
      result = await dbCreatePost.select({"$Utente" : req.query["Email"]},[]);
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;

    res.end(JSON.stringify(result));
  }
  catch (err) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 500;
    res.end(err.message);
    console.error(err.message);
  }
});

//ADD A NEW ARTWORK

// MULTER
async function uploadImage(req, res, next) {
  upload.single('@ImageSrc')(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      console.log(err);
      next(err);
    }
    else {
      // Nessun errore si è verificato.
      next();
    }
  });
}

//given the data to the form, it adds an artwork to the database
app.post('/db/add-artwork/*', isLoggedIn, uploadImage,
  async (req, res) => {
    try {
      testDbConnection();

      let sourceImgPath = path.join(req.file.destination, req.file.filename);
      let destImgPath = path.join(__dirname, "../client/img/artworks/", req.file.filename);

      //it needs to be managed with an await or a promise
      fs.rename(sourceImgPath, destImgPath, (err) => {
        if (err) throw err;
        console.log('Rename complete!');
      });

      let params = {};

      // 1st: Insert the new artwork in the database

      //const fields = ["@Descrizione", "@Titolo", "@AnnoRealizzazione", "@ImageSrc", "@Artista"];
      const fields = ["@Descrizione", "@Titolo", "@AnnoRealizzazione", "@Artista","@Email","@Emozione","@Hashtag","@MiFaPensare","@MiRicorda","@MiFaSentire"];

      if (bodyControl(fields, req.body)) {
        
        console.log("Hashtag: " + req.body["@Hashtag"]);

        //"@Codice": req.body["@Codice"], //generated automatically
        params["@Descrizione"] = req.body["@Descrizione"];
        params["@Titolo"] = req.body["@Titolo"];
        params["@AnnoRealizzazione"] = req.body["@AnnoRealizzazione"];
        //params["@ImageSrc"] = path.join(__dirname, "../client/img/".concat(req.body["@ImageSrc"]) //replaced with multer
        params["@ImageSrc"] = req.file.filename;

        await dbArtWork.insert(params);

        // 2nd: assign the selected artist to the artwork and post details

        params = {};
        let lastArtwork = await db.executeQuery("SELECT MAX(Codice) FROM OperaDArte", {});

        // Adding the artist to the artwork's artists
        lastArtwork = lastArtwork[0]["MAX(Codice)"];
        params["@Opera"] = lastArtwork;
        params["@Artista"] = req.body["@Artista"];

        await dbArtWorkRealization.insert(params);
        
        // Adding post related details
        params = {};
        params["@Utente"] = req.body["@Email"];
        params["@Opera"] = lastArtwork;

        let timestamp = Date.now();
        let date = new Date(timestamp);
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
        let day = ("0" + date.getDate()).slice(-2);
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);
        let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        params["@TimestampPost"] = formattedDate;
        await dbAddPostDetails.insert(params)

        // 3rd: Adding other informations

        // Emoji
        params = {};
        params["@CodiceOpera"] = lastArtwork;
        params["@Emoji"] = req.body["@Emozione"];
        await dbOperaEmozioni.insert(params);

        // Hashtag
        params = {};
        params["$Scritta"] = req.body["@Hashtag"];
        let hashtag = await dbHashtag.select({},[]);
        let exists = hashtag.some(obj => obj.Scritta === params["$Scritta"]);
        if (!(exists)) {
          console.log("Hashtag " + params["$Scritta"] + "is not in database, adding...");
          await dbHashtag.insert(params);
          console.log("Hashtag added");
        }
        
        params = {};
        params["@CodiceOpera"] = lastArtwork;
        params["@Scritta"] = req.body["@Hashtag"];
        await dbOperaHashtag.insert(params);

        // Comments (Three answers)
        params = {};
        params["@CodiceOpera"] = lastArtwork;
        params["@Utente"] = req.body["@Email"];
        params["@MiFaPensare"] = req.body["@MiFaPensare"];
        params["@MiRicorda"] = req.body["@MiRicorda"];
        params["@MiFaSentire"] = req.body["@MiFaSentire"];
        await dbTreRisposte.insert(params);

        res.set('Content-Type', 'text/plain');
        res.status(201).end("artwork inserted");
      }
      else {
        throw new Error("Si è verificato un errore");
      }
    }
    catch (err) {
      res.set('Content-Type', 'text/plain');
      res.status(500).end("artwork " + req.body["@Email"] + " error: " + err);
      console.error("artwork " + req.body["@Email"] + " error: " + err);
    }
});

//UPDATE AN ARTWORK
//if it's your artwork or you're an admin, you can modify a post
//(artwork and relative details)
app.put('/db/update-artwork/*', isLoggedIn, async (req, res) => {
  console.log(req.body);
    try {
      testDbConnection();

      let updateObj = {};

      if (req.query && (bodyControl(["@Descrizione"],req.body)
                          || bodyControl(["@Titolo"],req.body)
                          || bodyControl(["@AnnoRealizzazione"],req.body)
                        )
        ) {
        if (bodyControl(["@Descrizione"],req.body)) {
          updateObj["@Descrizione"] = req.body["@Descrizione"];
        }
        if (bodyControl(["@Titolo"],req.body)) {
          updateObj["@Titolo"] = req.body["@Titolo"];
        }
        if (bodyControl(["@AnnoRealizzazione"],req.body)) {
          updateObj["@AnnoRealizzazione"] = req.body["@AnnoRealizzazione"];
        }

        await dbUtente.update(updateObj, {"$Codice": req.query[0]});
        res.set('Content-Type', 'text/plain');
        res.status(200).end("artwork " + req.query[0] + " modificata");
      }
      else {
        throw new Error("Si è verificato un errore");
      }
    }
    catch (err) {
      res.set('Content-Type', 'text/plain');
      res.status(500).end("artwork  " + req.query[0] + " error: " + err);
      console.error("artwork " + req.query[0] + " error: " + err);
    }
});

//DELETE AN ARTWORK
//if it's your artwork or you're an admin, you can delete a post
//(artwork and relative details)
app.delete('/db/delete-artwork/*', isLoggedIn, async (req, res) => {
    try {
      testDbConnection();
      if (req.query && req.query["Codice"] !==null) {

        let image_name = await dbArtWork.select({"$Codice": req.query.Codice},["ImageSrc"]);

        image_name = "./client/img/artworks/".concat(image_name[0].ImageSrc);

        await dbArtWork.delete({"$Codice": req.query.Codice});
        await dbArtWorkRealization.delete({"$Opera": req.query.Codice});
        await dbOperaEmozioni.delete({"$CodiceOpera": req.query.Codice});
        await dbOperaHashtag.delete({"$CodiceOpera": req.query.Codice});
        await dbTreRisposte.delete({"$CodiceOpera": req.query.Codice});
        console.log(req.query.Codice);
        await dbAddPostDetails.delete({"$Opera": req.query.Codice});

        // delete the image
        fs.unlink(image_name, err => {
          /* if (err) {
            throw err
          } */
          console.log('File is deleted.');
        })

        res.set('Content-Type', 'text/plain');
        res.status(200).end("artwork " + req.query[0] + " cancellata");
      }
      else {
        throw new Error("Si è verificato un errore");
      }
    }
    catch (err) {
      res.set('Content-Type', 'text/plain');
      res.status(500).end("artwork " + req.query[0] + " error: " + err);
      console.error("artwork " + req.query[0] + " error: " + err);
    }
});

// ---------------------------------- ARTISTS ----------------------------------

//SELECT ARTISTS
//shows the artists and some relative informations
app.get('/db/select-artists/*', async (req, res) => {
  try {
    testDbConnection();

    if (req.body) {
      let result = await dbArtist.select({},["Id","Nome","Descrizione"]);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(result));
    }
    else {
      throw new Error("Si è verificato un errore");
    }
  }
  catch (err) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 500;
    res.end(err.message);
    console.error(err.message);
  }
});

//--------------------------------------------------------------------
// gestisce il web server classico che serve files statici
//--------------------------------------------------------------------

app.get('/*', (req, res) => {
  let requestedFile = req.params[0];
  let file_path = "";
  try {
    if (requestedFile == "/" || requestedFile == "") {
      //if the path leads to the root or is empty
      file_path = path.join(__dirname, '../client/index.html');
    }
    else {
      //else generate the path to arrive there
      requestedFile = sanitize(requestedFile);
      file_path = path.join(__dirname, '../client/', requestedFile);
    }
    let mime_type = mime.getType(file_path) //obtain object type (text/html/js/css/...)
    console.log(mime_type + " -> " + requestedFile + " --> " + file_path);
    fs.readFile(file_path, (err, data) => {
      if (err) {
        if (err.code == 'ENOENT') {
          // res.set('Content-Type', 'text/plain');
          console.log("Error 404: page not found - redirecting to '/'")
          res.status(200);
          res.redirect("/");
          res.end();
        }
        else {
          res.set('Content-Type', 'text/plain');
          res.status(500).end("Internal Server Error");
        }
        console.error(err.message);
      } else {
        res.set('Content-Type', mime_type);
        res.status(200).end(data);
      }
    });
  }
  catch (err) {
    res.set('Content-Type', 'text/plain');
    res.status(500).end('Internal Server Error: ' + err.message);
  }

});

//--------------------------------------------------------------------
// CREATE WEB SERVER
//--------------------------------------------------------------------

/*
    The server listens for incoming requests on the specified hostname and port using the 
    http.createServer() method.
*/

// Start the server

app.listen(port, () => console.log(`server listening at http://${hostname}:${port}`));

//Test if the database is connected properly
function testDbConnection() {
  if (db.getStatus() == socdb.DB_STATUS_CLOSED) {
    throw new Error("Database non aperto");
  }
  if (db.getStatus() == socdb.DB_STATUS_ERROR) {
    throw db.getError();
  }
}