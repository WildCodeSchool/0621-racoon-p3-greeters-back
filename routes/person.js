const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //all greteers//
  mysql.query(
    'SELECT * FROM person JOIN thematic JOIN language JOIN city ON city.city_id=person_city_id',
    (err, result) => {
      if (err) {
        res.status(500).send('Error from Database')
      } else {
        res.status(200).json(result)
      }
    }
  )
})

//All greeters
router.get('/:id', (req, res) => {
  const cityId = req.params.id
  mysql.query(
    //get greeter by id
    'SELECT p.* FROM person as p WHERE p.person_id=?',
    [cityId],
    (err, result) => {
      if (err) {
        res.status(500).send(' 1st error from database')
      } else {
        console.log(result)
        mysql.query(
          //get thematic_fr with greeter id
          'SELECT pht.person_person_id,t.* FROM person_has_thematic AS pht LEFT JOIN thematic AS t ON pht.thematic_thematic_id = t.thematic_id WHERE person_person_id= ?',
          [cityId],
          (err, result2) => {
            if (err) {
              res.status(500).send('2nd error from database')
            } else {
              console.log(result2)
              mysql.query(
                //get language_fr with greeter id
                'SELECT phl.person_person_id,l.* FROM person_has_language AS phl LEFT JOIN language AS l ON phl.language_language_id = l.language_id WHERE person_person_id= ?',
                [cityId],
                (err, result3) => {
                  if (err) {
                    res.status(500).send('3rd error from database')
                  } else {
                    res.status(200).json({
                      result,
                      result2,
                      result3
                    })
                  }
                }
              )
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
      const sql2 = `INSERT INTO person_has_thematic_fr
        (person_person_id, thematic_fr_thematics_fr_id)
        VALUES ?`

      const data = [
        idperson,
        req.body.thematic_fr_thematics_fr_id
        // req.body.thematic_en,
        // req.body.language_fr,
        // req.body.language_en
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
router.put('/:id', (req, res) => {
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
