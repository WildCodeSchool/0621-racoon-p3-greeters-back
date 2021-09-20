const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //All greeters
  mysql.query('SELECT * FROM livre_or ', (err, result) => {
    if (err) {
      res.status(500).send('error from database')
    } else {
      res.status(200).json(result)
    }
  })
})

//mettre post livre d'or

module.exports = router
