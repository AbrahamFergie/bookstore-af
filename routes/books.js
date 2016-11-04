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
      res.render('error', {error})
    })
})

// NEW
router.get('/new', (req, res) => {
  res.render('books/new', {
    book: {}
  })
})

router.post( '/', (req, res) => {
  const { title, author, description, image } = req.body
  console.log(title)
  db.createBook(title, author, description, image)
    .then(book => {
      res.redirect( './books' + book.id)
    })
    .catch(error => {
      res.render('error', { error })
    })
})

// SHOW
router.get('/:id', (req, res) => {
  const { id } = req.params

  Promise.all([db.getBookByIdWithAuthors(id), db.getBookByIdWithGenres(id)])
    .then(book => {
          //res.send(book)
      res.render('books', {
        book: book
       })
    })
    .catch(error => {
      res.render('error', {error})
    })
})


router.get('/:id/delete', (req, res) => {
  db.deleteBook( req.params.id )
    .then( result => res.redirect ( '/' ))
    .catch( error => res.render( 'error', {error} ))
})


module.exports = router
