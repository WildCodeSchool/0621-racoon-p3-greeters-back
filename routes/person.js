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

//get All greeters
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
          //get thematic with greeter id
          'SELECT pht.person_person_id,t.* FROM person_has_thematic AS pht LEFT JOIN thematic AS t ON pht.thematic_thematic_id = t.thematic_id WHERE pht.person_person_id= ?',
          [cityId],
          (err, result2) => {
            if (err) {
              res.status(500).send('2nd error from database')
            } else {
              console.log(result2)
              mysql.query(
                //get language with greeter id
                'SELECT phl.person_person_id,l.* FROM person_has_language AS phl LEFT JOIN language AS l ON phl.language_language_id = l.language_id WHERE phl.person_person_id= ?',
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
      res.status(500).send('1st error from database')
    } else {
      console.log(result)
      const sql2 = `INSERT INTO person_has_thematic_fr
        (person_person_id, thematic_fr_thematics_fr_id)
        VALUES (?, ?)`

      const idperson = result.insertId
      console.log(idperson)

      const data = [
        idperson,
        req.body.thematic_fr_thematics_fr_id
        // req.body.language_fr_language_fr_id,
        // req.body.language_en_language_en_id,
        // req.body.thematic_en_thematics_en_id
      ]
      console.log(data)
      mysql.query(sql2, data, (err, result2) => {
        if (err) {
          res.status(500).send('2nd')
        } else {
          res.status(200).json({ result, result2 })
        }
      })
    }
  })
})
//update un greeter via son ID//
router.put('./api/person/:id', (req, res) => {
  const personId = req.params.id
  mysql.query(
    'SELECT * FROM person WHERE id = ?',
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
            'UPDATE person SET ? WHERE id = ?'[(personPropsToUpdate, personId)],
            err => {
              if (err) {
                console.log(err)
                res.status(500).send('Error updating')
              } else {
                const updated = { ...personFromDb, ...personPropsToUpdate }
                res.status(200).json(updated)
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

//DELETE for person/:id//
router.delete('/:id', (req, res) => {
  const personId = req.params.id
  mysql.query(
    'DELETE FROM person WHERE person.person_id=?',
    [personId],
    (err, results) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error deleting a greeter')
      } else {
        res.status(200).send('Greeter deleted!')
      }
    }
  )
})

module.exports = router
