var express = require('express');
var router = express.Router();
var booky = require('../booky');

//method that adds an author to the database(booky)
router.post('/', function(req, res) {
  booky.createAuthor(re.body.author)
    .catch(function(error) {
      res.status(500).send(error)
    })
    .then(function(author) {
      res.redirect('/authors/'+author.id)
    })
});

//method that displays books by author and genre_id
router.get('/:bookId', function(req, res) {
  booky.getBookWithAuthorsAndGenresByBookId(req.params.bookId)
    .then(function(book){
      res.render('books/show', {
        book:book
      })
    })
    .catch(function(error){
      res.status(500).send(error)
    })
});

//
