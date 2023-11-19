-- Artista definition

CREATE TABLE Artista (
	Id INTEGER,
	DataNascita DATE,
	Nome VARCHAR DEFAULT ('artist_name'),
	Descrizione VARCHAR DEFAULT ('movement'),
	DataMorte DATE,
	CONSTRAINT ARTISTA_PK PRIMARY KEY (Id)
);

-- Curatore definition

CREATE TABLE Curatore
(
	Email							varchar(20) primary key,
	foreign key (Email) references Utente(Email)
		on update cascade on delete cascade
);

-- Emozioni definition

CREATE TABLE Emozioni (
    Emozione TEXT PRIMARY KEY
);


-- Genere definition

CREATE TABLE Genere (
    Genere TEXT PRIMARY KEY
);


-- Hashtag definition

CREATE TABLE Hashtag (
	Scritta TEXT PRIMARY KEY
);


-- OperaDArte definition

CREATE TABLE OperaDArte (
	Codice INTEGER,
	Descrizione VARCHAR,
	Titolo VARCHAR,
	AnnoRealizzazione INTEGER DEFAULT (0),
	ImageSrc TEXT,
	CONSTRAINT OPERADARTE_PK PRIMARY KEY (Codice)
);


-- OperaEmoji definition

CREATE TABLE OperaEmoji (
	CodiceOpera INTEGER,
	Emoji TEXT,
	CONSTRAINT OPERAEMOJI_PK PRIMARY KEY (CodiceOpera,Emoji),
	CONSTRAINT FK_OperaEmoji_OperaDArte_2 FOREIGN KEY (CodiceOpera) REFERENCES OperaDArte(Codice) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT OperaEmoji_FK FOREIGN KEY (Emoji) REFERENCES Emozioni(Emozione) ON DELETE CASCADE ON UPDATE CASCADE
);


-- OperaHashtag definition

CREATE TABLE OperaHashtag (
	CodiceOpera INTEGER,
	Scritta TEXT,
	CONSTRAINT OPERAHASHTAG_PK PRIMARY KEY (CodiceOpera,Scritta),
	CONSTRAINT OperaHashtag_FK FOREIGN KEY (CodiceOpera) REFERENCES OperaDArte(Codice) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT OperaHashtag_FK_1 FOREIGN KEY (Scritta) REFERENCES Hashtag(Scritta) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Post definition

CREATE TABLE Post (
    -- Un utente crea un'opera e la posta in un determinato istante
    Utente TEXT REFERENCES Utente(Email) on update cascade on delete cascade,
    Opera  INTEGER REFERENCES OperaDArte(Codice) on update cascade on delete cascade,
    TimestampPost DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Utente, Opera),
    UNIQUE (Utente, Opera, TimestampPost)
);


-- Realizzazione definition

CREATE TABLE Realizzazione -- Artista-OperaDArte
(
	Artista 						integer,
	Opera							integer,
	foreign key (Artista) references Artista(Id)
		on update cascade on delete cascade,
	foreign key (Opera) references OperaDArte(Codice)
		on update cascade on delete cascade,
	primary key (Artista, Opera)
);


-- TreRisposte definition

CREATE TABLE TreRisposte
(
	CodiceOpera							integer,
	Utente							varchar(20),
	MiFaPensare						varchar(20) default null,
	MiRicorda						varchar(20) default null,
	MiFaSentire						varchar(20) default null,
	foreign key (CodiceOpera) references OperaDarte(Codice)
		on update cascade on delete cascade,
	primary key (CodiceOpera,Utente)
);


-- Utente definition

CREATE TABLE Utente (
    Email TEXT DEFAULT '-guest-' PRIMARY KEY,
    DataNascita DATE NOT NULL,
    Genere TEXT NOT NULL,
    Nome TEXT DEFAULT '-guest_username-' NOT NULL,
    Password TEXT NOT NULL,
    FOREIGN KEY (Genere) REFERENCES Genere (Genere),
    UNIQUE (Nome),
    UNIQUE (Email, Nome),
    UNIQUE (Email, Password)
);


-- UtenteArtista definition

CREATE TABLE UtenteArtista (
    Email TEXT NOT NULL UNIQUE,
    Id INTEGER NOT NULL UNIQUE,
    PRIMARY KEY (Email, Id),
    FOREIGN KEY (Email) REFERENCES Utente(Email) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (Id) REFERENCES Artista(Id) ON UPDATE CASCADE ON DELETE CASCADE
);