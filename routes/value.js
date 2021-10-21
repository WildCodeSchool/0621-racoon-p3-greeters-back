const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//get for valeur fr and en//
router.get('/', (req, res) => {
  const sql = `SELECT * FROM value`
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

router.put('/', (req, res) => {
  const valueToUpdate = req.body
  mysql.query(
    'UPDATE value SET ? WHERE value.value_id=1',
    [valueToUpdate],
    err => {
      if (err) {
        res.status(500).send('Error updating the value page')
      } else {
        res.status(200).json(valueToUpdate)
      }
    }
  )
})

module.exports = router
