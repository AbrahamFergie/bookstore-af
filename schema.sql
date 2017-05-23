DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id  SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  image_url VARCHAR NOT NULL,
  description VARCHAR NOT NULL
);

DROP TABLE IF EXISTS book_genres;

CREATE TABLE book_genres (
  book_id  INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS book_authors;

CREATE TABLE book_authors (
  book_id  INTEGER NOT NULL,
  author_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id  SERIAL PRIMARY KEY ,
  name VARCHAR NOT NULL
);

DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id  SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

ALTER TABLE book_genres ADD FOREIGN KEY (book_id) REFERENCES books.id;
ALTER TABLE book_authors ADD FOREIGN KEY (book_id) REFERENCES books.id;
ALTER TABLE book_genres ADD FOREIGN KEY (genre_id) REFERENCES genres.id;
ALTER TABLE book_authors ADD FOREIGN KEY (author_id) REFERENCES authors.id;
