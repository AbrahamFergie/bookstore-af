const pgp = require('pg-promise')()
const db = pgp({database: 'booky'})

const getAllBooks = (page = 1) => {
  const offset = (page-1) * 10
  const sql =`
  SELECT *
  FROM
    books
  LIMIT 10 OFFSET $1
  `
  const variables = [offset]
  return db.manyOrNone(sql, variables).then(addAuthorsToBooks)
}

const getBookById = (id) => {
  const sql =
    `SELECT *
    FROM
      books
    WHERE
      id=${id}`
  const variables = [id]
  return db.oneOrNone(sql, variables)
}

const getBookByIdWithAuthors = (id) => {
  return Promise.all([
    getBookById(id),
    getAuthorsByBookId(id)
  ]).then(details => {
    const book = details[0]
    book.authors = details[1]
    return book
  })
}

const getBookByIdWithGenres = (id) => {
  return Promise.all([
      getBookById(id),
    ]).then(details => {
      const book = details[0]
      book.genres = details[1]
      return book
    })
}

// const getAuthorsByBookId = (id) => {
//   const sql = `
//     SELECT *
//      FROM
//       authors
//      JOIN
//       book_authors
//      ON
//       book_authors.author_id=author_id
//      WHERE
//       book_authors.book_id=$1`
//   const variables = [id]
//   return db.manyOrNone(sql, variables)
// }

const getAuthorsByBookId = (id) => {
  const sql = `
  SELECT *
   FROM
    authors AS a
   JOIN
    book_authors
   ON
    book_authors.author_id=a.id
   WHERE
    book_authors.book_id=${id}`
  const variables = [id]
  return db.manyOrNone(sql, variables)
}

const getGenresByBookId = (id) => {
  const sql = `
  SELECT *
   FROM
    genres AS g
   JOIN
    book_genres
   ON
    book_genres.genre_id=a.id
   WHERE
    book_genres.book_id=${id}`
  const variables = [id]
  return db.manyOrNone(sql, variables)
}

const findBooks = (query, page = 1) => {
  const offset = (page-1) * 10
  const sql = `
  SELECT DISTINCT
    books.*
  FROM
    books
  JOIN
    book_authors
  ON
    book_authors.book_id = books.id
  JOIN
   authors
  ON
    book_authors.author_id = authors.id
    WHERE LOWER(title) LIKE ${query}
  JOIN
   genres
  ON
    book_genres.genre_id = genres.id
    WHERE LOWER(title) LIKE ${query}
  OR
   LOWER(description) LIKE ${query}
  OR
   LOWER(authors.name) LIKE ${query}
  LIMIT 10 OFFSET $2`
  const variables = [
    '%'+query.replace(/\s+/,'%').toLowerCase()+'%', offset
  ]
  return db.manyOrNone(sql, variables).then(addAuthorsToBooks, addGenresToBooks)
}

const addAuthorsToBooks = books => {
  return getAuthorsForBooks(books).then(authors => {
    books.forEach(book => {
      book.authors = authors.filter(author =>
      author.book_id === book.id
      )
    })
    return books
  })
}

const addGenresToBooks = books => {
  return getGenresForBooks(books).then(genres => {
    books.forEach(book => {
      book.genres = genres.filter(genres =>
      genre.book_id === book.id
      )
    })
    return books
  })
}


const getAuthorsForBooks = (books) => {
  if (books.length === 0) return Promise.resolve( [])
  const bookIds = books.map(book => book.id)
  const sql = `
    SELECT
      authors.*,
      book_authors.book_id
    FROM
      authors
    JOIN
      book_authors
    ON
      book_authors.author_id = authors.id
    WHERE
      authors.id IN ($1:csv)`

  return db.manyOrNone(sql, [bookIds])
}

const getGenresForBooks = (books) => {
  if (books.length === 0) return Promise.resolve( [])
  const bookIds = books.map(book => book.id)
  const sql = `
    SELECT
      genres.*,
      book_genres.book_id
    FROM
      genres
    JOIN
      book_genres
    ON
      book_genres.genre_id = genres.id
    WHERE
      genres.id IN ($1:csv)`

  return db.manyOrNone(sql, [bookIds])
}

const createBook = (attributes) => {
  const sql = `
    INSERT INTO
      books (title, description, image)
    VALUES
      ($1, $2, $3)
    RETURNING
      *
  `
  const variables = [
    attributes.title,
    attributes.description,
    attributes.image
  ]
  const insertBookQuery = db.one(sql, variables)
  const insertAuthorQuery = createAuthor(attributes.author)
  const insertGenreQuery = createGenre(attributes.genre)
  return Promise.all([
    insertBookQuery,
    insertAuthorQuery,
    insertGenreQuery
  ])
    .then(results => {
      const book = results[0]
      const author = results[1]
      const genre = results[2]
      return associateBookAndAuthor(book, author)
        .then(() => book)
    })
}

const associateBookAndAuthor = (book, author) => {
  const sql = `
    INSERT INTO
      book_authors(book_id, author_id)
    VALUES
      ($1, $2)
  `
  const variables = [book.id, author.id]
  return db.none(sql, variables)
}

const associateBookAndGenre = (book, genre) => {
  const sql = `
    INSERT INTO
      book_genres(book_id, genre_id)
    VALUES
      ($1, $2)
  `
  const variables = [book.id, genre.id]
  return db.none(sql, variables)
}

const createAuthor = (authorName) => {
  const sql = `
    INSERT INTO
      authors (name)
    VALUES
      ($1)
    RETURNING
      *
  `
  const variables = [authorName]
  return db.one(sql, variables)
}

const createGenre = (genreName) => {
  const sql = `
    INSERT INTO
      genres (name)
    VALUES
      ($1)
    RETURNING
      *
  `
  const variables = [genreName]
  return db.one(sql, variables)
}


const deleteBook = (bookIds) => {
  const sql = `
    DELETE FROM
      books
    WHERE
      id=${id}
  `
  const variables = [bookIds]
  return db.none(sql, variables)
}




module.exports = {
  getAllBooks,
  getBookById,
  getBookByIdWithAuthors,
  getAuthorsByBookId,
  findBooks
}
