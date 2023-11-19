CREATE VIEW view_art_showcase_1 AS
SELECT o.Codice, o.Descrizione, o.Titolo, o.AnnoRealizzazione, o.ImageSrc, a.Id, a.DataNascita, a.Nome, a.Descrizione, a.DataMorte, e.Emozione, h.Scritta, t.MiFaPensare, t.MiRicorda, t.MiFaSentire, p.Utente, p.TimestampPost
FROM OperaDArte as o
LEFT JOIN Realizzazione AS r ON o.Codice=r.Opera
LEFT JOIN Artista AS a ON a.Id=r.Artista
LEFT JOIN OperaEmoji As b ON b.CodiceOpera=o.Codice
LEFT JOIN Emozioni AS e ON  b.Emoji=e.Emozione
LEFT JOIN OperaHashtag As c ON c.CodiceOpera=o.Codice 
LEFT JOIN Hashtag AS h ON h.Scritta=c.Scritta
LEFT JOIN TreRisposte AS t ON t.CodiceOpera=O.Codice
LEFT JOIN Post AS p ON p.Opera=o.Codice;

CREATE VIEW view_art_showcase_2 AS
SELECT o.Codice, o.Descrizione, o.Titolo, o.AnnoRealizzazione, o.ImageSrc, a.Id, a.DataNascita, a.Nome, a.Descrizione, a.DataMorte, e.Emozione, h.Scritta, t.MiFaPensare, t.MiRicorda, t.MiFaSentire, p.Utente, p.TimestampPost
FROM Realizzazione AS r 
LEFT JOIN OperaDArte as o ON o.Codice=r.Opera
LEFT JOIN Artista AS a ON a.Id=r.Artista
LEFT JOIN OperaEmoji As b ON b.CodiceOpera=o.Codice
LEFT JOIN Emozioni AS e ON  b.Emoji=e.Emozione
LEFT JOIN OperaHashtag As c ON c.CodiceOpera=o.Codice 
LEFT JOIN Hashtag AS h ON h.Scritta=c.Scritta
LEFT JOIN TreRisposte AS t ON t.CodiceOpera=O.Codice
LEFT JOIN Post AS p ON p.Opera=o.Codice;

CREATE VIEW view_art_showcase AS
SELECT * FROM view_art_showcase_1 UNION SELECT * FROM view_art_showcase_2;

CREATE VIEW view_searchform AS
SELECT Codice,o.Titolo,Nome,Emozione,h.Scritta,MiFaPensare,MiRicorda,MiFaSentire
FROM OperaDArte as o
LEFT JOIN Realizzazione AS r ON o.Codice=r.Opera
LEFT JOIN Artista AS a ON a.Id=r.Artista
LEFT JOIN OperaEmoji As b ON b.CodiceOpera=o.Codice
LEFT JOIN Emozioni AS e ON  b.Emoji=e.Emozione
LEFT JOIN OperaHashtag As c ON c.CodiceOpera=o.Codice 
LEFT JOIN Hashtag AS h ON h.Scritta=c.Scritta
LEFT JOIN TreRisposte AS t ON t.CodiceOpera=O.Codice

UNION

SELECT Codice,o.Titolo,Nome,Emozione,h.Scritta,MiFaPensare,MiRicorda,MiFaSentire
FROM Realizzazione AS r 
LEFT JOIN OperaDArte as o ON o.Codice=r.Opera
LEFT JOIN Artista AS a ON a.Id=r.Artista
LEFT JOIN OperaEmoji As b ON b.CodiceOpera=o.Codice
LEFT JOIN Emozioni AS e ON  b.Emoji=e.Emozione
LEFT JOIN OperaHashtag As c ON c.CodiceOpera=o.Codice 
LEFT JOIN Hashtag AS h ON h.Scritta=c.Scritta
LEFT JOIN TreRisposte AS t ON t.CodiceOpera=O.Codice;
