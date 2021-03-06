const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //get for all cities//
  mysql.query('SELECT * FROM city', (err, result) => {
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
    `SELECT c.* FROM city as c JOIN photos as p ON p.city_city_id=c.city_id WHERE c.city_id=?`,
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
    req.body.city_name,
    req.body.city_description_fr,
    req.body.city_description_en,
    req.body.city_lien,
    req.body.city_longitude,
    req.body.city_latitude,
    req.body.city_banner
  ]
  const sql = `INSERT INTO city (city_name, city_description_fr, city_description_en, city_lien, city_longitude, city_latitude, city_banner) VALUES (?, ?, ?, ?, ?, ?, ?)`

  mysql.query(sql, cityData, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(result)
    }
  })
})

//PUT for city/:id//
router.put('/:id', (req, res) => {
  const cityId = req.params.id
  mysql.query(
    'SELECT * FROM city WHERE city.city_id=?',
    [cityId],
    (err, selectResult) => {
      if (err) {
        res.status(500).send('Error updating a city')
      } else {
        const cityFromDb = selectResult[0]
        if (cityFromDb) {
          const cityToUpdate = req.body
          mysql.query(
            'UPDATE city SET ? WHERE city.city_id=?',
            [cityToUpdate, cityId],
            err => {
              if (err) {
                res.status(500).send('Error updating a city')
              } else {
                res.status(200).json(cityToUpdate)
              }
            }
          )
        } else {
          res.status(404).send(`City with id ${cityId} not found.`)
        }
      }
    }
  )
})

//DELETE for city/:id//
router.delete('/:id', (req, res) => {
  const cityId = req.params.id
  mysql.query('DELETE FROM city WHERE city.city_id=?', [cityId], err => {
    if (err) {
      res.status(500).send('Error deleting a city')
    } else {
      res.status(200).send('City deleted!')
    }
  })
})

module.exports = router
