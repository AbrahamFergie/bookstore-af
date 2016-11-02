var express = require('express');
var router = express.Router();
var booky = require('../booky');

//method that adds an author to the database(booky)
router.post('/', function(req, res) {
  booky.createGenres(re.body.genres)
    .catch(function(error) {
      res.status(500).send(error)
    })
    .then(function(genre) {
      res.redirect('/genres/'+genres.id)
    })
});

//method that displays books by author and genre_id
router.get('/:bookId', function(req, res) {
  booky.getBookWithAuthorsAndGenresByBookId(req.params.booksId)
    .then(function(books){
      res.render('books/show', {
        books:books
      })
    })
    .catch(function(error){
      res.status(500).send(error)
    })
});


module.exports = router
