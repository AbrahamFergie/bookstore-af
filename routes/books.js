const express = require('express')
const router = express.Router()
const db = require('../database')


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
  console.log(title)
  db.createBook(title, author, genre, description, image)
    .then(book => {
      res.redirect('/books/' + book.id)
    })
    .catch(error => {
      console.log('im an error2!')
      res.render('error', { error })
    })
})

// details
router.get('/:bookId', (req, res) => {
  const { bookId } = req.params
  db.getBookWithAuthorsAndGenres(bookId)
    .then(bookInfo => {
      console.log('made it');
      res.render('./details', {
        bookInfo
       })
    })
    .catch(error => {
      console.log('im an error3!')
      res.render('error', {error})
    })
})


router.get('/:id/delete', (req, res) => {
  db.deleteBook( req.params.id )
    .then( result => res.redirect ( '/' ))
    .catch( error => res.render( 'error', {error} ))
})


module.exports = router
