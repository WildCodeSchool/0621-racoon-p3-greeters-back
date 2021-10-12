const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //get for photos
  mysql.query(
    'SELECT * FROM photos JOIN city ON city.city_id=city_city_id',
    (err, result) => {
      if (err) {
        res.status(500).send('Error from Database')
      } else {
        res.status(200).json(result)
      }
    }
  )
})

//Get for photso by id//
router.get('/:id', (req, res) => {
  const photoId = req.params.id
  const sql = `SELECT * FROM photos JOIN city ON city.city_id=city_city_id WHERE photos.photos_id=?`
  mysql.query(sql, [photoId], (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(result)
    }
  })
})

module.exports = router
