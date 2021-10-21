const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

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

router.put('/', (req, res) => {
  const conceptToUpdate = req.body
  mysql.query(
    'UPDATE concept SET ? WHERE concept.concept_id=1',
    [conceptToUpdate],
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
