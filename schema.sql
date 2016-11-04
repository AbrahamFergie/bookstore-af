DROP DATABASE IF EXISTS booky;
CREATE DATABASE booky;

\c booky;

DROP TABLE IF EXISTS carts;

CREATE TABLE carts (
  id  SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL ,
  user_id INTEGER NOT NULL ,
  quantity INTEGER NOT NULL
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id  SERIAL PRIMARY KEY ,
  username VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  admin BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id  SERIAL PRIMARY KEY,
  description VARCHAR NOT NULL,
  image_url VARCHAR(255),
  title VARCHAR NOT NULL
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

ALTER TABLE carts ADD FOREIGN KEY (book_id) REFERENCES books (id);
ALTER TABLE carts ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE book_genres ADD FOREIGN KEY (book_id) REFERENCES books.id;
ALTER TABLE book_authors ADD FOREIGN KEY (book_id) REFERENCES books.id;
ALTER TABLE book_genres ADD FOREIGN KEY (genre_id) REFERENCES genres.id;
ALTER TABLE book_authors ADD FOREIGN KEY (author_id) REFERENCES authors.id;
