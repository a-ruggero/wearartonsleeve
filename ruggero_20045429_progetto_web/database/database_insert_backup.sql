/*  TABELLE INERENTI A PERSONE
    - Artista
    - Genere (M/F/X)
    - Curatore
    - Utente
*/

/* ARTISTA */
INSERT INTO Artista(DataNascita, Nome, Descrizione, AnnoMorte) VALUES ('1996-12-09', 'AleXa', 'Kpop singer', NULL);
INSERT INTO Artista(DataNascita, Nome, Descrizione, AnnoMorte) VALUES ('1933-02-18', 'Yōko Ono', 'Artist and musician', NULL);
INSERT INTO Artista(DataNascita, Nome, Descrizione, AnnoMorte) VALUES ('1907-07-06', 'Frida Kahlo', 'Painter', '1954-07-13');
INSERT INTO Artista(DataNascita, Nome, Descrizione, AnnoMorte) VALUES ('2022-02-15', 'Hoyoverse', 'Game makers', NULL);

/* GENERE */
INSERT INTO Genere
(Genere)
VALUES('M');
INSERT INTO Genere
(Genere)
VALUES('F');
INSERT INTO Genere
(Genere)
VALUES('X');


/* CURATORE */
INSERT INTO Curatore(Email) VALUES ("logan@prova.com")

/* UTENTE */
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('kanye@prova.com', '2002-12-09', 'M', 'kanye02', '$2b$10$bUyQM/duqFknhLquEUOYs.SQa9AD.MyawquWd1rhdKaJoDXmMrtC.');
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('logan@prova.com', '2001-03-17', 'X', 'logan00', '$2b$10$f4KVN9BNeYNnzwUtGRHIOunzi0eyPV/g8QFldZe0H0otlDv8e5yhi');
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('narses@prova.com', '2000-02-29', 'M', 'narses00', '$2b$10$FYipvt8Sxa.7G0IhhBJoN.6qIqGuou62Zf6GFhAGQR3.fWCtug/kK');
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('alexakpop@prova.com', '1996-12-09', 'F', 'alexakpop', '$2b$10$7Ef3SZU7ZOxipasrftCYO..1ADk5JpIprH9bOM7ljnxhRzqn0YgxO');
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('yoko.ono@prova.com', '1933-02-18', 'F', 'yoko_ono', '$2b$10$xJv6NkUfWrHbg9el622tYeOVO7CXTDtXKJ/LdVPnKjnuyUEaqALd6');
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('fridakahlo@prova.com', '1907-07-06', 'F', 'frida', '$2b$10$xwvyuK3KnNaHrSD0DROTfOroREP9iIbrf5d0DbWBy.CZ99gwOH7uy');
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('hoyoverse@prova.com', '2022-02-15', 'X', 'hoyoverse', '$2b$10$cbSnjTuNDVk7v2uZABHOE.q8z679ee3dv5ZGrSmkjaXzBah5wfT0y');
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('alex@prova.com', '2002-12-05', 'X', 'alex02', '$2b$10$aABTMbY0VZLw/gcfCd2KX.YI83DOWZnCbFUddTNjKavqZF.oqzhMy');
INSERT INTO Utente
(Email, DataNascita, Genere, Nome, Password)
VALUES('alex03@prova.com', '2002-12-05', 'X', 'alex03', '$2b$10$i0jvwruQUOe.O5ye2QyWGuo5Bl/K9XOY97ut/4XXvVKIjiWYJ7uRi');

/*
    OPERE D'ARTE
    - OperaDarte
    - Emozioni
    - Hashtag
    - TreRisposte
*/

/* OPERADARTE */
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(1, 'Le Due Frida', 'Dipinto "Le Due Frida"', 1939, '1694699186066.jpg');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(2, 'Decoherence', 'Decoherence', 2020, '1694699376762.jpeg');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(3, 'Xiao The Vigilant Yaksha', 'The Vigilant Yaksha', 2020, '1694699483077.gif');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(4, 'Arising', 'Arising', 1995, '1694699751604.webp');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(5, 'American Song Contest Winning Song "Wonderland (English Version)', 'American Song Contest Winning Song "Wonderland"', 2022, '1694699913780.jpg');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(6, '"ReviveR" album photoshooting', 'AleXa', 2021, '1694700061650.jpg');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(7, 'Bomb (Album)', 'Debut single album "Bomb"''', 2019, '1694700248388.webp');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(8, 'Photo of Frida Kahlo', 'Frida Kahlo', 1926, '1694700421928.jpg');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(9, 'Bomb (Rock Version) - Project 0 ERROR', 'Bomb (Rock Version)', 2019, '1694700547297.webp');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(10, 'MiHoYo Icon', 'Paimon', 2020, '1694700637998.webp');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(11, 'Do Or Die EP', 'Do Or Die', 2020, '1694700729829.webp');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(12, 'AleXa Trilogy:
- Bomb (+ rock version)
- Do Or Die
- Decoherence', 'AleXa Trilogy', 2020, '1694700829164.jpg');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(13, 'Yoko Ono and John Lennon aprotest peacefullly against the war in Vietnam', 'Bed In', 1969, '1694700981634.webp');
INSERT INTO OperaDArte
(Codice, Descrizione, Titolo, AnnoRealizzazione, ImageSrc)
VALUES(14, 'Tattoo special album', 'Tattoo', 2022, '1694701192306.webp');

/* EMOZIONI */

INSERT INTO Emozioni
(Emozione)
VALUES('rabbia');
INSERT INTO Emozioni
(Emozione)
VALUES('allerta');
INSERT INTO Emozioni
(Emozione)
VALUES('estasi');
INSERT INTO Emozioni
(Emozione)
VALUES('terrore');
INSERT INTO Emozioni
(Emozione)
VALUES('stupore');
INSERT INTO Emozioni
(Emozione)
VALUES('dolore');
INSERT INTO Emozioni
(Emozione)
VALUES('disgusto');

/* HASHTAG */
INSERT INTO Hashtag
(Scritta)
VALUES('kpop');
INSERT INTO Hashtag
(Scritta)
VALUES('art');
INSERT INTO Hashtag
(Scritta)
VALUES('painting');
INSERT INTO Hashtag
(Scritta)
VALUES('videogame');
INSERT INTO Hashtag
(Scritta)
VALUES('genshinimpact');
INSERT INTO Hashtag
(Scritta)
VALUES('memories');
INSERT INTO Hashtag
(Scritta)
VALUES('AleXa');
INSERT INTO Hashtag
(Scritta)
VALUES('gamemaking');
INSERT INTO Hashtag
(Scritta)
VALUES('genshin');
INSERT INTO Hashtag
(Scritta)
VALUES('activism');
INSERT INTO Hashtag
(Scritta)
VALUES('AleXaKpop');
INSERT INTO Hashtag
(Scritta)
VALUES('music');
INSERT INTO Hashtag
(Scritta)
VALUES('fridakahlo');
INSERT INTO Hashtag
(Scritta)
VALUES('rockmusic');
INSERT INTO Hashtag
(Scritta)
VALUES('kpopalbum');
INSERT INTO Hashtag
(Scritta)
VALUES('AleXatrilogy');

/* TRERISPOSTE */

INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(1, 'fridakahlo@prova.com', 'Art', 'Painting', 'Emotional');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(2, 'alexakpop@prova.com', 'New album', 'Debut Album', 'Excited');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(3, 'hoyoverse@prova.com', 'Gameplay', 'Gameplay nights on Dragonspine', ':D');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(4, 'yoko.ono@prova.com', 'Feminism', 'Activism against gender violence', '...');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(5, 'logan@prova.com', 'American Song Contest', 'AleXa winning :D', 'Super Happy :D');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(6, 'kanye@prova.com', 'ReviveR', 'AleXa''s comeback', 'ready for a concert');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(7, 'narses@prova.com', 'AleXa''s debut', 'AleXa Trilogy', 'Happy :D');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(8, 'alex@prova.com', 'Frida', 'arts', ':D');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(9, 'alex03@prova.com', 'Rock', 'AleXa''s debut', ':D');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(10, 'hoyoverse@prova.com', 'Paimon''s true identity is a mistery', 'Gameplay nights on Archon Quests', 'curious');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(11, 'alexakpop@prova.com', 'Kpop', 'Debut', ':D');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(12, 'alexakpop@prova.com', 'music', 'hard work', 'Super Happy :D');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(13, 'yoko.ono@prova.com', 'peace', 'activism', '...');
INSERT INTO TreRisposte
(CodiceOpera, Utente, MiFaPensare, MiRicorda, MiFaSentire)
VALUES(14, 'logan@prova.com', 'Tattoo', 'AleXa''s comeback', ':D');

/*
    RELAZIONI
    - Realizzazione: Artista-Opera
    - UtenteArtista: account da artista
    - Post: associa Utente e OperaDArte e contiene il timestamp (quando l'utente ha postato l'opera d'arte)
    - OperaEmoji: Opera-Emozioni (n opere - n emozioni)
    - OperaHashtag: Opera-Hashtag (n opere - n hashtag)
*/

/* REALIZZAZIONE */

INSERT INTO Realizzazione
(Artista, Opera)
VALUES(3, 1);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(1, 2);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(4, 3);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(2, 4);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(1, 5);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(1, 6);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(1, 7);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(3, 8);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(1, 9);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(4, 10);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(1, 11);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(1, 12);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(2, 13);
INSERT INTO Realizzazione
(Artista, Opera)
VALUES(1, 14);

/* UTENTEARTISTA */

INSERT INTO UtenteArtista(Email, Id) VALUES ('alexakpop@prova.com', 1);
INSERT INTO UtenteArtista(Email, Id) VALUES ('yoko.ono@prova.com', 2);
INSERT INTO UtenteArtista(Email, Id) VALUES ('fridakahlo@prova.com', 3);
INSERT INTO UtenteArtista(Email, Id) VALUES ('hoyoverse@prova.com', 4);

/* POST */

INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('fridakahlo@prova.com', 1, '2023-09-14 15:46:26');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('alexakpop@prova.com', 2, '2023-09-14 15:49:36');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('hoyoverse@prova.com', 3, '2023-09-14 15:51:23');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('yoko.ono@prova.com', 4, '2023-09-14 15:55:51');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('logan@prova.com', 5, '2023-09-14 15:58:33');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('kanye@prova.com', 6, '2023-09-14 16:01:01');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('narses@prova.com', 7, '2023-09-14 16:04:08');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('alex@prova.com', 8, '2023-09-14 16:07:01');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('alex03@prova.com', 9, '2023-09-14 16:09:07');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('hoyoverse@prova.com', 10, '2023-09-14 16:10:38');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('alexakpop@prova.com', 11, '2023-09-14 16:12:09');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('alexakpop@prova.com', 12, '2023-09-14 16:13:49');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('yoko.ono@prova.com', 13, '2023-09-14 16:16:21');
INSERT INTO Post
(Utente, Opera, TimestampPost)
VALUES('logan@prova.com', 14, '2023-09-14 16:19:52');


/* OPERAEMOJI */

INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(1, 'dolore');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(2, 'stupore');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(3, 'stupore');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(4, 'dolore');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(5, 'estasi');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(6, 'estasi');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(7, 'stupore');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(8, 'estasi');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(9, 'stupore');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(10, 'stupore');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(11, 'estasi');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(12, 'estasi');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(13, 'stupore');
INSERT INTO OperaEmoji
(CodiceOpera, Emoji)
VALUES(14, 'estasi');

/* OPERAHASHTAG */

INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(1, 'painting');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(2, 'kpop');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(3, 'genshinimpact');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(4, 'activism');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(5, 'AleXaKpop');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(6, 'AleXa');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(7, 'music');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(8, 'fridakahlo');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(9, 'rockmusic');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(10, 'genshinimpact');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(11, 'kpopalbum');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(12, 'AleXatrilogy');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(13, 'activism');
INSERT INTO OperaHashtag
(CodiceOpera, Scritta)
VALUES(14, 'AleXaKpop');
