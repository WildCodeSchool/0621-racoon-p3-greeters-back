const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  mysql.query('SELECT * FROM person', (err, result) => {
    if (err) {
      res.status(500).send('error from database')
    } else {
      res.status(200).json(result)
    }
  })
})

router.get('/:id', (req, res) => {
  //All greeters
  mysql.query(
    'SELECT p.* FROM person as p WHERE p.person_id=1',
    (err, result) => {
      if (err) {
        res.status(500).send('error from database')
      } else {
        console.log(result)
        mysql.query(
          'SELECT pht.thematic_fr_thematics_fr_id, t.thematic_fr_title, t.thematic_fr_name FROM person_has_thematic_fr as pht JOIN person as p ON pht.person_person_id=p.person_id JOIN thematic_fr as t ON pht.thematic_fr_thematics_fr_id = t.thematics_fr_id',
          (err, result2) => {
            if (err) {
              res.status(500).send('error from database')
            } else {
              console.log(result2)
              mysql.query(
                'SELECT pht.language_fr_language_fr_id, t.language_fr_title, t.language_fr_name FROM person_has_language_fr as pht JOIN person as p ON pht.person_person_id=p.person_id JOIN language_fr as t ON pht.language_fr_language_fr_id = t.language_fr_id',
                (err, result3) => {
                  if (err) {
                    res.status(500).send('error from database')
                  } else {
                    console.log(result3)
                    res.status(200).json({ result, result2, result3 })
                  }
              }
            )
          }
        }
      )
    }
  }
)

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
      const idperson = result.insertId
      const data = [
        idperson,
        req.body.thematic_fr,
        req.body.thematic_en,
        req.body.language_fr,
        req.body.language_en
      ]
      const sql2 = `
        INSERT INTO (person_has_thematic_fr, person_has_thematic_en, person_has_language_fr, person_has_language_en)
        (person_person_id, thematic_fr_thematics_fr_id, thematic_en_thematics_en_id, language_fr_language_fr_id, language_en_language_en_id)
        VALUES (?, ?, ?, ?, ?)
        `
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
