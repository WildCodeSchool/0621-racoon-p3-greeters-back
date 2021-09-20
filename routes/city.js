const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  mysql.query('SELECT * FROM city', (err, result) => {
    if (err) {
      res.status(500).send('error from database')
    } else {
      res.status(200).json(result)
    }
  })
})

module.exports = router
