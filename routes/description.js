const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//all description//
router.get('/', (req, res) => {
  const id = 1
  const sql = `SELECT * FROM description WHERE description.description_id=?`
  mysql.query(sql, id, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

//PUT for description
router.put('/', (req, res) => {
  const descriptionToUpdate = req.body
  const id = 1
  mysql.query(
    'UPDATE description SET ? WHERE description.description_id=?',
    [descriptionToUpdate, id],
    err => {
      if (err) {
        res.status(500).send('Error updating the description page')
      } else {
        res.status(200).json(descriptionToUpdate)
      }
    }
  )
})

module.exports = router
