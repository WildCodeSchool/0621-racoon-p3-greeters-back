const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//Get for all concept
router.get('/', (req, res) => {
  const sql = `SELECT * FROM concept`
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

//PUT for concept
router.put('/', (req, res) => {
  const conceptToUpdate = req.body
  const id = 1
  mysql.query(
    'UPDATE concept SET ? WHERE concept.concept_id=?',
    [conceptToUpdate, id],
    err => {
      if (err) {
        res.status(500).send('Error updating the concept page')
      } else {
        res.status(200).json(conceptToUpdate)
      }
    }
  )
})

module.exports = router
