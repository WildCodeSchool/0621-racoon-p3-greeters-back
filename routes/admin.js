const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//Get for admin
router.get('/', (req, res) => {
  const sql = `SELECT * FROM admin`
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(result)
    }
  })
})

module.exports = router
