const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //all greteers//
  mysql.query(
    'SELECT * FROM person JOIN thematic_fr JOIN thematic_en JOIN language_fr JOIN language_en JOIN city ON city.city_id=person_city_id',
    (err, result) => {
      if (err) {
        res.status(500).send('Error from Database')
      } else {
        res.status(200).json(result)
      }
    }
  )
})

router.get('/:id', (req, res) => {
  const personId = req.params.id
  mysql.query(
    // 'SELECT * FROM person JOIN person.thematic_fr, JOIN thematic_en JOIN language_fr JOIN language_en',
    'SELECT p.* FROM person as p WHERE p.person_id= ?',
    [personId],
    (err, result) => {
      if (err) {
        res.status(500).send('error from database')
      } else {
        console.log(result)
        mysql.query(
          'SELECT pht.thematic_fr_thematics_fr_id, t.thematic_fr_title, t.thematic_fr_name FROM person_has_thematic_fr AS pht JOIN person AS p ON pht.person_person_id=p.person_id JOIN thematic_fr AS t ON pht.thematic_fr_thematics_fr_id = t.thematics_fr_id',
          (err, result2) => {
            if (err) {
              res.status(500).send('error from database')
            } else {
              //AJOUTER UN SELECT POUR LANGAGE ICI//
              console.log(result2)
              //SELECT phl.language_fr_language_fr_id, l.language_fr_title, l.language_fr_name FROM person_has_language_fr AS phl JOIN person AS p ON phl.person_person_id=p.person_id JOIN language_fr AS l ON phl.language_fr_language_fr_id=l.language_fr_id;//
              res.status(200).json({ result, result2 })
            }
          }
        )
      }
    }
  )
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

  const sql = `INSERT INTO person
    (person_firstname, person_lastname, person_photo, person_catch_phrase_FR, person_description_FR, person_catch_phrase_EN, person_description_EN, person_city_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

  mysql.query(sql, bodyData, (err, result) => {
    if (err) {
      res.status(500).send('error from database')
    } else {
      console.log(result)
      const idperson = result.insertId
      const sql2 = `INSERT INTO (person_has_thematic_fr, person_has_thematic_en, person_has_language_fr, person_has_language_en
        (person_person_id, thematic_fr_thematics_fr_id, language_fr_language_fr_id)
        VALUES ?`

      const data = [
        idperson,
        req.body.thematic_fr,
        req.body.thematic_en,
        req.body.language_fr,
        req.body.language_en
      ]
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
//update un greeter via son ID//
router.put('./:id', (req, res) => {
  const personId = req.params.id
  mysql.query(
    'SELECT * FROM person WHERE person_id = ?',
    [personId],
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error updating')
      } else {
        const personFromDb = result[0]
        if (personFromDb) {
          const personPropsToUpdate = req.body
          mysql.query(
            'UPDATE person SET ? WHERE person_id = ?'[
              (personPropsToUpdate, personId)
            ],
            err => {
              if (err) {
                console.log(err)
                res.status(500).send('Error updating')
              } else {
                //const updated = { ...personFromDb, ...personPropsToUpdate }//
                res.status(200).json(personPropsToUpdate)
              }
            }
          )
        } else {
          res.status(404).send(`Movies from id ${personId} not found`)
        }
      }
    }
  )
})

module.exports = router
