var express = require('express');
var router = express.Router();
var booky = require('../booky');

//index
router.get('/', function(req, res, next) {
  res.redirect('/')
});

router.post('/', function(req, res) {
  database.createBook(req.body.book)
})
