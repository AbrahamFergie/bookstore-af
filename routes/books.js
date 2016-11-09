const express = require('express')
const router = express.Router()
const db = require('../database')


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

      res.render('error', {error})
    })
})


router.get('bookInfo.book.id', (req, res) => {
  const { bookId } = req.params
  db.none( bookId )
    .then( result => {
      res.redirect ( '/' )})
    .catch( error => {
      console.log('im an error3!')
      res.render( 'error', {error} )})
})


module.exports = router
