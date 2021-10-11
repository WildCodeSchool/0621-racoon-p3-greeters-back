const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//GET for all languages
router.get('/', (req, res) => {
  const sql = `SELECT * FROM languages`
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(result)
    }
  })
})

module.exports = router
