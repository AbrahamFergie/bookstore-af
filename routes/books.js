const express = require('express');
const router = express.Router();
const db = require('../database');


// INDEX
router.get('/', (req, res) => {
  let page = ( parseInt( req.query.page, 10 ) ) || 1
  db.getAllBooks(page)

    .then(books => {
      //db.truncatedDesc(books.description)
      res.render('books', { books, page })
    })
    .catch(error => {
      console.log('im an error1!')
      res.render('error', {error})
    })
})

// NEW
router.get('/new', (req, res) => {
  res.render('books/new' )
})

router.post( '/new', (req, res) => {
  const { title, author, genre, description, image } = req.body

  db.createBook(title, author, genre, description, image)
    .then(book => {
      res.redirect('/books/' + book.id)
    })
    .catch(error => {
      console.log('im an error2!')
      res.render('error', { error })
    })
})

// Details
router.get('/:bookId', (req, res) => {
  const { bookId } = req.params
  db.getBookWithAuthorsAndGenres(bookId)
    .then(bookInfo => {

      res.render('./details', {
        bookInfo
       })
    })
    .catch(error => {

      res.render('error', {error})
    })
})

//Edit
router.get('/:bookId/edit', (req, res) => {
  const { bookId } = req.params
  console.log('BookId: ' + bookId)
  db.getBookById( bookId )
    .then( book => {
      res.render ('books/edit', {book})
    })
})

router.post('/:bookId/edit', (req, res) => {
  const{ title, author, genre, image, description  } = req.body
  const { bookId } = req.params
  console.log('bookId: ' + bookId)
  db.editBook( bookId, title, author, genre, description, image )
    .then( book => {
      res.render( '/details', {book} )
    })
    .catch( error => {
      console.log('im an error3!')
      res.render( 'error', {error} )
    })
})

router.get('/:bookId/delete', (req, res) => {
  const { bookId } = req.params
  db.deleteBook( bookId )
    .then( result => {
      res.redirect ( '/' )
    })
    .catch( error => {

      res.render( 'error', {error} )
    })
})

module.exports = router;
