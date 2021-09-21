const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //get for all cities//
  mysql.query('SELECT * FROM city ', (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

//Get for City/:id//
router.get('/:id', (req, res) => {
  const cityId = req.params.id
  mysql.query(
    `SELECT * FROM city WHERE city.city_id=?`,
    [cityId],
    (err, result) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.status(200).json(result)
      }
    }
  )
})

//post for City//
router.post('/', (req, res) => {
  const cityData = [
    req.body.city_title_fr,
    req.body.city_title_en,
    req.body.city_name,
    req.body.city_photo,
    req.body.city_description_fr,
    req.body.city_description_en,
    req.body.city_legende_photo_fr,
    req.body.city_legende_photo_en,
    req.body.city_lien,
    req.body.city_longitude,
    req.body.city_latitude
  ]
  const sql = `INSERT INTO city (city_title_fr, city_title_en, city_name, city_photo, city_description_fr, city_description_en, city_legende_photo_fr, city_legende_photo_en, city_lien, city_longitude, city_latitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

  mysql.query(sql, cityData, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(result)
    }
  })
})

// create PUT for city/:id//

//DELETE for city/:id//
router.delete('/:id', (req, res) => {
  const cityId = req.params.id

  mysql.query(
    'DELETE FROM city WHERE city.city_id=?',
    [cityId],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error deleting a city')
      } else {
        res.status(200).send('City deleted!')
      }
    }
  )
})
module.exports = router
