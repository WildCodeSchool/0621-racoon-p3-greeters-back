const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //all description//
  const sql = `SELECT * FROM description`
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

router.put('/', (req, res) => {
  const descriptionToUpdate = req.body
  mysql.query(
    'UPDATE description SET ? WHERE description.description_id=1',
    [descriptionToUpdate],
    err => {
      if (err) {
        console.log(err)
        res.status(500).send('Error updating the description page')
      } else {
        res.status(200).json(descriptionToUpdate)
      }
    }
  )
})

module.exports = router
