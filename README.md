# Wear Art On Sleeve

## Table of Contents
- [Introduction](#introduction)
- [Authorizations (English)](#authorizations-english)
- [Homepage and Single Post (English)](#homepage-and-single-post-english)
- [Creation of a Work of Art (and the Respective Post) (English)](#creation-of-a-work-of-art-and-the-respective-post-english)
- [Research (English)](#research-english)
- [Registration and Profile Page (English)](#registration-and-profile-page-english)
- [Login (English)](#login-english)
- [Test Account Credentials (English)](#test-account-credentials-english)
- [More Technical Details (English)](#more-technical-details-english)

## Indice
- [Introduzione](#introduzione)
- [Autorizzazioni (Italiano)](#autorizzazioni-italiano)
- [Homepage e Singolo Post (Italiano)](#homepage-e-singolo-post-italiano)
- [Creazione di un'Opera d'Arte (e del Rispettivo Post) (Italiano)](#creazione-di-unopera-darte-e-del-rispettivo-post-italiano)
- [Ricerca (Italiano)](#ricerca-italiano)
- [Iscrizione e Pagina del Profilo (Italiano)](#iscrizione-e-pagina-del-profilo-italiano)
- [Login (Italiano)](#login-italiano)
- [Credenziali degli Account di Prova (Italiano)](#credenziali-degli-account-di-prova-italiano)
- [Maggiori Dettagli Tecnici (Italiano)](#maggiori-dettagli-tecnici-italiano)
- [Planned Improvements](#planned-improvements)

## Introduction

Wear Art On Sleeve is a social media platform focused on sharing artworks by users. It caters to artists of various genres, such as musicians, singers, and painters, providing a space for the observation and study of their works.

## Authorizations (English)
- All works, homepage, and the search page are visible without an account.
- Profile page and the form for adding a post require login.
- Users can post, modify, or delete their own works.
- Admins (curators) can delete others' works.

## Homepage and Single Post (English)
The homepage displays posts from most to least recent, detailing:
- User's username
- Time of publication
- Image, title, year, and description of the work
- Artist's information
- Emoji and hashtag
- Answers to three questions ("What does it make me think of?", "What does it remind me of?", "What does it make me feel?")
- Update and delete buttons if logged in.

## Creation of a Work of Art (and the Respective Post) (English)
To create, modify, or delete a work, an account is needed. Admins can delete others' posts.

## Research (English)
Search for a work by tag using a form with:
- Title of the work
- Name of the artist
- Emoji
- Hashtag

## Registration and Profile Page (English)
Register by filling out a form with data visible on your profile page. Artists or admins must be added directly to the database.

Registration form requires:
- Email
- Date of birth
- Gender (M/F/X)
- Username (unique)
- Password (at least 5 characters, repeated twice)

## Login (English)
Use email and password for login. Afterward, you can access your profile page and the form for creating a new post.

## Test Account Credentials (English)
**Admin / Curators:**
- logan@prova.com: prova2

**Users:**
- kanye@prova.com: prova
- narses@prova.com: prova3
- alex@prova.com: prova
- alex03@prova.com: prova
- kai@prova.com : _kai_

**User Artists:**
- bingai@prova.com : bingai

## More Technical Details (English)
- Direct access to the server leads to the homepage.
- Pages generated when clicking corresponding links in the menu bar.
- Various classes extend PageManager for page generation.
- UsefulFunctions class for general functions.
- InitRouter initializes page.js.
- AddOnClickEvent adds events to menu bar buttons.

## Introduzione

Wear Art On Sleeve è un social media orientato alla condivisione di opere d’arte (artwork) da parte di utenti. Le opere sono create da artisti di vario genere (musicisti, cantanti, pittori...) e il social ne favorisce l'osservazione e lo studio. Sono disponibili un tema chiaro e un tema scuro. Il sito è stato studiato per essere visualizzabile chiaramente sia da dispositivi mobili sia da computer, ma è studiato per essere principalmente desktop-first.

## Autorizzazioni (Italiano)
- Tutte le opere, la homepage e la pagina di ricerca sono visibili anche senza un account;
- Per vedere la pagina del profilo e il form per l'aggiunta di un post è necessario effettuare il login;
- Un utente, che sia o meno anche un artista, può postare una nuova opera, modificare le proprie opere o eliminarle;
- Un admin (detto anche curatore) può eliminare anche le opere altrui.

## Homepage e Singolo Post (Italiano)
La homepage mostra tutti i post pubblicati dal più al meno recente, mostrando i dettagli ad essi correlati.
Per ogni post, vengono indicati:
- Lo username (Nome) dell'utente;
- Il momento della pubblicazione;
- L'immagine dell'opera, il suo titolo, l'anno di realizzazione e una descrizione;
- I dati relativi all'artista come il nome, l'id che lo contrassegna, una breve descrizione e le sue date di nascita ed, eventualmente, di morte;
- I relativi emoji (detta anche Emozione) e hashtag (detto anche Scritta poichè è il suo nome nel database): è possibile indicare un'emoji e un hashtag per descrivere l'opera o come l'utente si sente a riguardo;
- Le relative risposte a tre domande ("A cosa mi fa pensare?", "Cosa mi ricorda?" e "Cosa mi fa sentire?") considerate come commenti all'opera.
- Se si è loggati, eventualmente, i tasti update e delete dell'opera d'arte. (Il form di update non è ancora stato implementato)

## Creazione di un'Opera d'Arte (e del Rispettivo Post) (Italiano)
Per creare un post e condividere un'opera d'arte è necessario avere un account, come anche per modificare o eliminare le proprie opere. Se si ha un account da amministratore, si possono eliminare anche i post altrui.

## Ricerca (Italiano)
La ricerca di un'opera d'arte avviene per tag, compilando un form per raccogliere i seguenti dati:
- Titolo dell'opera (la parola inserita dev'essere contenuta nel titolo dell'opera, non è necessario scrivere l'intero titolo);
- Nome dell'artista (la parola inserita dev'essere contenuta nel nome dell'opera, non è necessario scrivere l'intero nome);
- Emoji;
- Hashtag;

La ricerca restituisce tutte le opere che hanno tutte le caratteristiche indicate.

## Iscrizione e Pagina del Profilo (Italiano)
Per iscriversi è necessario compilare un form con alcuni dati, tra cui username, email e password.
Per essere aggiunti all’elenco degli artisti o degli admin bisogna essere aggiunti direttamente dal database.

Nel form di iscrizione sono richiesti dati che saranno visibili nella propria pagina del profilo:
- Email (identificatore univoco di un utente)
- Data di nascita
- Genere (M/F/X)
- Nome (username) (anch'esso unico per ogni utente)
- Password di almeno 5 caratteri da ripetere due volte

## Login (Italiano)
Per il login sono necessarie l’email e la password con cui ci si è iscritti al sito. Una volta effettuato, saranno visibili la pagina del profilo dell'utente loggato e il form per la creazione di un nuovo post.

## Credenziali degli Account di Prova (Italiano)
**Admin/Curatori:**
- logan@prova.com : prova2

**Utenti:**
- kanye@prova.com : prova
- narses@prova.com : prova3
- alex@prova.com : prova
- alex03@prova.com : prova
- kai@prova.com : _kai_

**Utenti Artisti:**
- bingai@prova.com : bingai

## Maggiori Dettagli Tecnici (Italiano)
- Accedendo al server, si viene direttamente portati alla home.
- Le pagine sono generate al momento in cui si clicca il link corrispondente nella barra del menu.

Per generare le pagine del social, sono utilizzate varie classi che estendono PageManager.
Altre classi utili, sempre dalla parte del client, sono UsefulFunctions, che contiene un insieme di funzioni utili come una generalizzazione della fetch o per il login/logout, InitRouter per inizializzare page.js e AddOnClickEvent che aggiunge gli eventi ai bottoni nella barra del menu.

Il Database contiene utenti e post di prova con cui testare il sito web.

## Planned Improvements
- Controllare hashtag in addartwork
- Testare upload artwork e update/delete utente con postman
- aggiungere alert block dove necessario
- finire update art
- finire css
- Revisione codice (togliere name dei tag e classi inutili)
- Finire insert coi commenti (trerisposte)
- aggiungere controlli file multer
- per operation in fetchFunction: function isFunction(functionToCheck) { return typeof functionToCheck === 'function';}
- ottimizzare fetch (fare in modo che fetchfunction e uploadfetchfunction rimangano separate ma chiamino la stessa funzione nella parte comune)