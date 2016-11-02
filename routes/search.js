const express = require('express')
const router = express.Router()
const db = require('../database')


// search
router.get('/', (req, res) => {
  let page = ( parseInt( req.query.page, 10 ) ) || 1

  const sqlQuery = 'q' in req.query ?
    db.findBooks(req.query.q) : db.getAllBooks(page)

  sqlQuery.then(books => {
      res.render('search', {
        books: books,
        page: page,
        search: req.query.q
      })
    })
    .catch(error => {
      res.render('error', {error})
    })
})

module.exports = router
