const pgp = require('pg-promise')()
const db = pgp({database: 'booky'})

const getAllBooks = ( page = 1 ) => {
  const offset = ( page - 1 ) * 10
  const sql =`
  SELECT
    *
  FROM
    books
  LIMIT 10
  OFFSET $1
  `
  const variables = [offset]

  return db.manyOrNone( sql, variables ).then( addAuthorsToBooks ).then( addGenresToBooks )
}

const truncatedDesc = ( str ) => {
  let counter = 0
  let description = ''
  for(let des of str){
    if( counter == 20 ) break
    description += des
  }
  return description
}

const getBookById = ( id ) => {
  const sql =
    `SELECT
      *
     FROM
      books
    WHERE
      id=${id}`
  const variables = [id]
  return db.oneOrNone( sql, variables )
}

const getBookByIdWithAuthors = ( id ) => {
  return Promise.all([
    getBookById( id ),
    getAuthorsByBookId( id )
  ]).then(details => {
    const book = details [0]
    book.authors = details[1]
    return book
  })
}

const getBookByIdWithGenres = ( id ) => {
  return Promise.all([
      getBookById( id ),
      getGenresByBookId( id )
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

const getAuthorsByBookId = ( id ) => {
  const sql = `
  SELECT
    *
  FROM
    authors AS a
  JOIN
    book_authors
  ON
    book_authors.author_id=a.id
  WHERE
    book_authors.book_id= ${ id }`
  const variables = [id]
  return db.manyOrNone( sql, variables )
}

const getGenresByBookId = ( id ) => {
  const sql = `
  SELECT *
   FROM
    genres AS g
   JOIN
    book_genres
   ON
    book_genres.genre_id=g.id
   WHERE
    book_genres.book_id=${id}`
  const variables = [id]
  return db.manyOrNone( sql, variables )
}

const findBooks = ( query, page = 1 ) => {
  const offset = ( page-1 ) * 10
  console.log('im in findBooks');
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
    JOIN
      book_genres
    ON
      book_genres.book_id = books.id
    JOIN
      genres
    ON
      book_genres.genre_id = genres.id
    WHERE
      LOWER(books.title) LIKE $1
    OR
      LOWER(books.description) LIKE $1
    OR
      LOWER(authors.name) LIKE $1
    OR
      LOWER(genres.name) LIKE $1
    LIMIT
      10
    OFFSET
      $2
  `
  const variables = [
    '%'+query.replace(/\s+/,'%').toLowerCase()+'%',
    offset,
  ]

  return db.manyOrNone( sql, variables ).then( addAuthorsToBooks ).then( addGenresToBooks )

}

const addAuthorsToBooks = ( books ) => {
  return getAuthorsForBooks( books ).then( authors => {
    books.forEach( book => {
      book.authors = authors.filter( author =>
      author.book_id === book.id
      )
    })
    return books
  })
}

const addGenresToBooks = ( books ) => {
  return getGenresForBooks( books ).then( genres => {
    books.forEach(book => {
      book.genres = genres.filter( genre =>
        genre.book_id === book.id
      )
    })

    return books
  })
}


const getAuthorsForBooks = ( books ) => {
  if ( books.length === 0 ) return Promise.resolve([])
  const bookIds = books.map( book => book.id )
  const sql = `
    SELECT
      authors.name,
      book_authors.book_id
    FROM
      authors
    JOIN
      book_authors
    ON
      book_authors.author_id = authors.id
    WHERE
      book_authors.book_id IN ($1:csv)`
  return db.manyOrNone( sql, [bookIds] )
}

const getGenresForBooks = ( books ) => {
  if (books.length === 0) return Promise.resolve( [])
  const bookIds = books.map( book => book.id )
  const sql = `
    SELECT
      genres.name,
      book_genres.book_id
    FROM
      genres
    JOIN
      book_genres
    ON
      book_genres.genre_id = genres.id
    WHERE
      book_genres.book_id IN ($1:csv)
  `

  return db.manyOrNone( sql, [bookIds] )
}

const createBook = ( title, author,genre,
  description, image ) => {

  const sql = `
    INSERT INTO
      books (title, description, image_url)
    VALUES
      ($1, $2, $3)
    RETURNING
      *
  `
  const variables = [
    title,
    description,
    image
  ]
  return Promise.all([
    createAuthor( author ).catch( error => { console.log( 'A', error ); throw error }),
    createGenre( genre ).catch( error => { console.log( 'B', error ); throw error }),
    db.one( sql, variables ).catch( error => { console.log( 'C', error  ); throw error })
  ])
    .then(( [ author, genre, book ] ) => {
      return Promise.all([
        associateBookWithAuthor( book, author ),
        associateBookWithGenre( book, genre ),
      ]).then(() => book )
    })
    .catch( error => {console.log( 'E', error ); throw error})
}

const associateBookWithAuthor = ( book, author ) => {
  const sql = `
    INSERT INTO
      book_authors( book_id, author_id )
    VALUES
      ( $1, $2 )
  `
  return db.any( sql, [book.id, author.id] )
}

const associateBookWithGenre = ( book, genre ) => {
  const sql = `
    INSERT INTO
      book_genres( book_id, genre_id )
    VALUES
      ( $1, $2 )
  `
  return db.any( sql, [book.id, genre.id] )
}

//const associateBookAuthorAndGenre = (book, author, genre) => {
  // const sql = `
  //   BEGIN TRANSACTION;
  //   INSERT INTO
  //     book_authors(book_id, author_id)
  //   VALUES
  //     ($1, $2)
  //   INSERT INTO
  //       book_genres(book_id, genre_id)
  //   VALUES
  //     (${book}, ${genre});
  //   COMMIT
  // `
  // const variables = [book.id, author.id, genre.id]
  // return db.none(sql, variables)
//}

const associateBookAndGenre = ( book, genre ) => {
  const sql = `
    INSERT INTO
      book_genres( book_id, genre_id )
    VALUES
      ( $1, $2 )
  `
  const variables = [book.id, genre.id]
  return db.none( sql, variables )
}

const createAuthor = ( authorName ) => {
  const sql = `
    INSERT INTO
      authors (name)
    VALUES
      ($1)
    RETURNING
      *
  `
  const variables = [authorName]
  return db.one( sql, variables )
}

const createGenre = ( genreName ) => {
  const sql = `
    INSERT INTO
      genres (name)
    VALUES
      ($1)
    RETURNING
      *
  `
  const variables = [genreName]
  return db.one( sql, variables )
}


const deleteBook = ( bookId ) => {
  const sql = `
    DELETE FROM
      books
    WHERE
      id=${bookId}
  `
  const variables = [bookId]
  return db.none( sql, variables )
}

const getAuthorForBookId = ( bookId ) => {
  const sql = `
    SELECT
      *
    FROM
      authors
    JOIN
      book_authors
    ON authors.id = book_authors.author_id
    WHERE
      book_authors.book_id = ${bookId}
  `
  return db.any( sql, [ bookId ] )
}
  const getGenreForBookId = ( bookId ) => {
  const sql = `
  SELECT
      *
  FROM
    genres
  JOIN
    book_genres
  ON
    genres.id = book_genres.genre_id
  WHERE
    book_genres.book_id = ${bookId}
  `
  return db.any( sql, [bookId] )
}

const getBookWithAuthorsAndGenres = ( bookId ) => {
  return Promise.all([
    getBookById( bookId ),
    getAuthorForBookId( bookId ),
    getGenreForBookId( bookId ),
  ]).then(( [book, authors, genres] ) => {
    // book.authors = authors
    // book.genres = genres
    const bookInfo = {
      book,
      authors,
      genres
    }
    return bookInfo
  })

}



module.exports = {
  getAllBooks,
  getBookById,
  getBookWithAuthorsAndGenres,
  getGenreForBookId,
  getAuthorForBookId,
  getGenresByBookId,
  createBook,
  createGenre,
  createAuthor,
  findBooks,
  deleteBook
}
