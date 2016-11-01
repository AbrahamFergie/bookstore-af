const pgp = require('pg-promise')()
const db = pgp{database: 'booky'})

const getAllBooks = (page = 1) => {
  const offset = (page-1) * 10
  const sql =`
  SELECT * FROM books LIMIT 10 OFFSET $1
  `
  const variables = [offset]
  return db.manyOrNone(sql, variables).then(addAuthorsToBooks)
}

const getBookById = (id) => {
  const sql =
    `SELECT * FROM books WHERE id=$1`
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

const getAuthorsByBookId = (id) => {
  const sql = `
    SELECT * FROM authors JOIN book_authors ON book_authors.author_id=author_id WHERE book_authors.book_id=$1`
  const variables = [id]
  return db.manyOrNone(sql, variables)
}

const findBooks = (query, page = 1) => {
  const offset = (page-1) * 10
  const sql = `SELECT DISTINCT books.* FROM books JOIN book_authors ON book_authors.book_id = books.id JOIN authors ON book_authors.author_id = authors.id WHERE LOWER(title) LIKE $1
  OR LOWER(description) LIKE $1 OR LOWER(authors.name) LIKE $1
  LIMIT 10 OFFSET $2`
  const variables = [
    '%'+query.replace(/\s+/,'%').toLowerCase()+'%', offset
  ] return db.manyOrNone(sql, variables).then(addAuthorsToBooks)
}
