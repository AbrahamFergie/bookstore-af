DROP TABLE IF EXISTS user;

CREATE TABLE "user" (
"id"  SERIAL ,
"username" VARCHAR ,
"password" VARCHAR ,
"admin" BOOLEAN DEFAULT 'False' ,
PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS cart;

CREATE TABLE "cart" (
"cart_id"  SERIAL ,
"book_id" INTEGER ,
"user_id" INTEGER ,
"quantity" INTEGER ,
KEY ("cart_id")
);

DROP TABLE IF exists book;

CREATE TABLE "books" (
"id"  SERIAL ,
"description" VARCHAR,
"title" VARCHAR ,
"img" VARCHAR ,
PRIMARY KEY ("id")
);

CREATE TABLE "book_genres" (
"book_id"  SERIAL ,
"genre_id" INTEGER ,
PRIMARY KEY ("book_id")
);

CREATE TABLE "book_authors" (
"book_id"  SERIAL ,
"author_id" INTEGER ,
PRIMARY KEY ("book_id")
);

CREATE TABLE "authors" (
"id"  SERIAL ,
"name" VARCHAR ,
PRIMARY KEY ("id")
);

CREATE TABLE "genres" (
"id"  SERIAL ,
"name" VARCHAR ,
PRIMARY KEY ("id")
);

ALTER TABLE "cart" ADD FOREIGN KEY ("books_id") REFERENCES "books" ("id");
ALTER TABLE "cart" ADD FOREIGN KEY ("users_id") REFERENCES "users" ("id");
ALTER TABLE "books" ADD FOREIGN KEY ("id") REFERENCES "book_authors" ("books_id");
ALTER TABLE "books" ADD FOREIGN KEY ("id") REFERENCES "book_genres" ("book_id");
ALTER TABLE "book_genres" ADD FOREIGN KEY ("genres_id") REFERENCES "genres" ("id");
ALTER TABLE "book_authors" ADD FOREIGN KEY ("authors_id") REFERENCES "authors" ("id");
