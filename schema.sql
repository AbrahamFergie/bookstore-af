CREATE TABLE "user" (
"id"  SERIAL ,
"username" VARCHAR ,
"password" VARCHAR ,
"admin" BOOLEAN DEFAULT 'False' ,
PRIMARY KEY ("id")
);

CREATE TABLE "cart" (
"cart_id"  SERIAL ,
"book_id" INTEGER ,
"user_id" INTEGER ,
"quantity" INTEGER ,
KEY ("cart_id")
);

CREATE TABLE "book" (
"id"  SERIAL ,
"title" VARCHAR ,
"img" VARCHAR ,
PRIMARY KEY ("id")
);

CREATE TABLE "bookGenre" (
"book_id"  SERIAL ,
"genre_id" INTEGER ,
PRIMARY KEY ("book_id")
);

CREATE TABLE "bookAuthor" (
"book_id"  SERIAL ,
"author_id" INTEGER ,
PRIMARY KEY ("book_id")
);

CREATE TABLE "author" (
"id"  SERIAL ,
"name" VARCHAR ,
PRIMARY KEY ("id")
);

CREATE TABLE "genre" (
"id"  SERIAL ,
"name" VARCHAR ,
PRIMARY KEY ("id")
);

ALTER TABLE "cart" ADD FOREIGN KEY ("book_id") REFERENCES "book" ("id");
ALTER TABLE "cart" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
ALTER TABLE "book" ADD FOREIGN KEY ("id") REFERENCES "bookAuthor" ("book_id");
ALTER TABLE "book" ADD FOREIGN KEY ("id") REFERENCES "bookGenre" ("book_id");
ALTER TABLE "bookGenre" ADD FOREIGN KEY ("genre_id") REFERENCES "genre" ("id");
ALTER TABLE "bookAuthor" ADD FOREIGN KEY ("author_id") REFERENCES "author" ("id");
