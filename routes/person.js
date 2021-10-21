const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/filter', (req, res) => {
  const sql = `SELECT p.*, group_concat(distinct c.city_name) as person_city_name, group_concat(distinct l.language_name_fr) as person_language_fr, group_concat(distinct l.language_name_en) as person_language_en, group_concat(distinct t.thematic_name_fr) as person_thematic_fr, group_concat(distinct t.thematic_name_en) as person_thematic_en
  FROM person as p 
  JOIN city as c
    ON c.city_id=person_city_id 
  join person_has_thematic as pht 
    on p.person_id=pht.person_person_id 
  join thematic as t 
    on pht.thematic_thematic_id=t.thematic_id
  join person_has_language as phl 
    on p.person_id=phl.person_person_id  
  join languages as l 
    on phl.language_language_id=l.language_id
  group by p.person_id;`

  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

router.get('/', (req, res) => {
  let sql = `SELECT * FROM person as p JOIN city ON city.city_id=person_city_id`
  if (req.query.limit) {
    sql += ` LIMIT 6`
  }
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      mysql.query(
        //get thematic with greeter id
        'SELECT pht.person_person_id,t.* FROM person_has_thematic AS pht LEFT JOIN thematic AS t ON pht.thematic_thematic_id = t.thematic_id',
        (err, result2) => {
          if (err) {
            res.status(500).send('2nd error from database')
          } else {
            mysql.query(
              //get language with greeter id
              'SELECT phl.person_person_id,l.* FROM person_has_language AS phl LEFT JOIN languages AS l ON phl.language_language_id = l.language_id',
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
  })
})

//get a greeter by id
router.get('/:id', (req, res) => {
  const greeterId = req.params.id
  mysql.query(
    //get greeter by id
    'SELECT * FROM person as p JOIN city ON city.city_id=person_city_id WHERE p.person_id=? ',
    [greeterId],
    (err, result) => {
      if (err) {
        res.status(500).send(' 1st error from database')
      } else {
        mysql.query(
          //get thematic with greeter id
          'SELECT pht.person_person_id,t.* FROM person_has_thematic AS pht LEFT JOIN thematic AS t ON pht.thematic_thematic_id = t.thematic_id WHERE pht.person_person_id= ?',
          [greeterId],
          (err, result2) => {
            if (err) {
              res.status(500).send('2nd error from database')
            } else {
              mysql.query(
                //get language with greeter id
                'SELECT phl.person_person_id,l.* FROM person_has_language AS phl LEFT JOIN languages AS l ON phl.language_language_id = l.language_id WHERE phl.person_person_id= ?',
                [greeterId],
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
    req.body.person_catch_phrase_fr,
    req.body.person_description_fr,
    req.body.person_catch_phrase_en,
    req.body.person_description_en,
    req.body.person_city_id
  ]
  //Post into person
  const sql = `INSERT INTO person
    (person_firstname, person_lastname, person_photo, person_catch_phrase_fr, person_description_fr, person_catch_phrase_en, person_description_en, person_city_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  mysql.query(sql, bodyData, (err, result) => {
    if (err) {
      res.status(500).send('1st error from database')
    } else {
      //Post into person_has_thematic
      const sql2 = `INSERT INTO person_has_thematic
          (person_person_id, thematic_thematic_id)
          VALUES (?, ?)`
      const idperson = result.insertId
      const themData = [idperson, req.body.thematic_thematic_id]
      mysql.query(sql2, themData, (err, result2) => {
        if (err) {
          res.status(500).send(err)
        } else {
          //Post into person_has_language
          const sql3 = `INSERT INTO person_has_language
              (person_person_id, language_language_id)
              VALUES (?, ?)`
          const idperson = result.insertId
          const langData = [idperson, req.body.language_language_id]
          mysql.query(sql3, langData, (err, result3) => {
            if (err) {
              res.status(500).send('3rd error from database')
            } else {
              res.status(200).json({ result, result2, result3 })
            }
          })
        }
      })
    }
  })
})

router.put('/:id', (req, res) => {
  const personId = req.params.id
  const personPropsToUpdate = req.body
  mysql.query(
    'UPDATE person SET ?  WHERE person.person_id = ?',
    [personPropsToUpdate, personId],
    err => {
      if (err) {
        res.status(500).send(err + 'Error updating')
      } else {
        res.status(200).json(personPropsToUpdate)
      }
    }
  )
})

router.put('/them/:id', (req, res) => {
  const personId = req.params.id
  const personPropsToUpdate = req.body
  mysql.query(
    'UPDATE person_has_thematic SET ? WHERE person_has_thematic.person_person_id=?',
    [personPropsToUpdate, personId],
    (err, result) => {
      if (err) {
        res.status(500).send(err + '1st Error updating')
      } else {
        res.status(200).json(personPropsToUpdate)
      }
    }
  )
})

router.put('/lang/:id', (req, res) => {
  const personId = req.params.id
  const personPropsToUpdate = req.body
  mysql.query(
    'UPDATE person_has_language SET ? WHERE person_has_language.person_person_id=?',
    [personPropsToUpdate, personId],
    (err, result) => {
      if (err) {
        res.status(500).send(err + '1st Error updating')
      } else {
        res.status(200).json(personPropsToUpdate)
      }
    }
  )
})

//DELETE for person/:id//
router.delete('/:id', (req, res) => {
  const personId = req.params.id
  //DELETE into person_has_thematic
  const sql = `DELETE FROM person_has_thematic WHERE
        person_person_id=?`
  mysql.query(sql, personId, (err, result) => {
    if (err) {
      res.status(500).send('1st error')
    } else {
      //DELETE into person_has_language
      const sql2 = `DELETE FROM person_has_language WHERE
        person_person_id=?`
      mysql.query(sql2, personId, (err, result2) => {
        if (err) {
          res.status(500).send('2st error')
        } else {
          //DELETE into person
          const sql3 = 'DELETE FROM person WHERE person.person_id=?'
          mysql.query(sql3, personId, (err, result3) => {
            if (err) {
              res.status(500).send('Error deleting a greeter')
            } else {
              res.status(200).send('Greeter deleted!')
            }
          })
        }
      })
    }
  })
})

module.exports = router
