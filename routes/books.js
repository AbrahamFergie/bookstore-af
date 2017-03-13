const express = require('express');
const router = express.Router();
const db = require('../database');


// INDEX
router.get('/', (req, res) => {
  let page = ( parseInt( req.query.page, 10 ) ) || 1
  db.getAllBooks(page)
    .then(books => {
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
      res.render('error', { error })
    })
})

// Details
router.get('/:bookId', (req, res) => {
  const { bookId } = req.params
  db.getBookWithAuthorsAndGenres( bookId )
    .then(bookInfo => {
      res.render('../views/details', { bookInfo } )
    })
    .catch(error => {
      console.log('im an error2!')
      res.render('error', {error})
    })
})

//Edit
router.get('/:bookId/edit', (req, res) => {
  const { bookId } = req.params
  db.getBookWithAuthorsAndGenres( bookId )
    .then( bookInfo => {
      res.render ('books/edit', {bookInfo})
    })
    .catch( error => {
      console.log('im an error4!')
      res.render( 'error', {error} )
    })
})

router.post('/:bookId/edit', (req, res) => {
  const { bookId } = req.params
  const { id, title, image, description  } = req.body.bookId
  const { author, genre } = req.body.book
  db.editWholeBook( bookId, title, author, genre, image, description )
    .then( bookInfo => {
      res.redirect( '/books/' + bookId )
    })
    .catch( error => {
      console.log('im an error3!')
      res.render( 'error', {error} )
    })
})

//DELETE
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
