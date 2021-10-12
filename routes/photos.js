const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //Get for photos
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

//Get for photos by id//
router.get('/:id', (req, res) => {
  const photoId = req.params.id
  const sql = `SELECT * FROM photos JOIN city ON city.city_id=city_city_id WHERE photos.city_city_id=?`
  mysql.query(sql, [photoId], (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(result)
    }
  })
})

//POST for photos
router.post('/', (req, res) => {
  const bodyData = [
    req.body.photos_img,
    req.body.photos_leg_fr,
    req.body.photos_leg_en,
    req.body.city_city_id
  ]
  const sql = `INSERT INTO photos (photos_img, photos_leg_fr, photos_leg_en, city_city_id) VALUES (?, ?, ?, ?)`
  mysql.query(sql, bodyData, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).json(result)
    }
  })
})

//PUT for photo by ID
router.put('/:id', (req, res) => {
  const photosId = req.params.id
  const photosPropsToUpdate = req.body
  mysql.query(
    'UPDATE photos SET ?  WHERE photos.photos_id = ?',
    [photosPropsToUpdate, photosId],
    err => {
      if (err) {
        res.status(500).send(err + 'Error updating')
      } else {
        res.status(200).json(photosPropsToUpdate)
      }
    }
  )
})

//DELETE photo by Id
router.delete('/:id', (req, res) => {
  const photoId = req.params.id
  const sql = `DELETE FROM photos WHERE photos.photos_id=?`
  mysql.query(sql, photoId, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send('Photo deleted!')
    }
  })
})

module.exports = router
