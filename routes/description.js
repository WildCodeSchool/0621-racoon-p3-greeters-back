const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  mysql.query('SELECT * FROM description', (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

router.put('/', (req, res) => {
  const data = [
    req.body.description_title1_fr,
    req.body.description_title1_en,
    req.body.description_title2_fr,
    req.body.description_title2_en,
    req.body.description_content_fr,
    req.body.description_content_en,
    req.body.description_photo
  ]
  console.log(data)
  const sql =
    'UPDATE description SET description_title1_fr = ?, description_title1_en = ?, description_title2_fr = ?, description_title2_en = ?, description_content_fr = ?, description_content_en = ?, description_photo = ? WHERE description_id = 1'
  mysql.query(sql, data, (err, result) => {
    if (err) {
      res.status(500).send('Error while updating datas')
    } else {
      res.status(200).json(result)
    }
  })
})

module.exports = router
