const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //All greeters
  mysql.query('SELECT * FROM person', (err, result) => {
    if (err) {
      res.status(500).send('error from database')
    } else {
      res.status(200).json(result)
    }
  })
  res.status(200).send('je suis dans /persons')
})

router.post('/', (req, res) => {
  const bodyData = [
    req.body.person_firstname,
    req.body.person_lastname,
    req.body.person_photo,
    req.body.person_catch_phrase_FR,
    req.body.person_description_FR,
    req.body.person_catch_phrase_EN,
    req.body.person_description_EN,
    req.body.person_city_id
  ]
  console.log('poulet', bodyData)
  //All greeters

  const sql = `
    INSERT INTO person
    (person_firstname, person_lastname, person_photo, person_catch_phrase_FR, person_description_FR, person_catch_phrase_EN, person_description_EN, person_city_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
  mysql.query(sql, bodyData, (err, result) => {
    if (err) {
      res.status(500).send('error from database')
    } else {
      console.log(result)
      const sql2 = `
        INSERT INTO person_has_thematic_fr
        (person_person_id, thematic_fr_thematics_fr_id)
        VALUES (?, ?)
        `
      const idperson = result.insertId

      const data = [idperson, req.body.thematic_fr]

      mysql.query(sql2, data, (err, result2) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).json({ result, result2 })
        }
      })
    }
  })
})

module.exports = router
