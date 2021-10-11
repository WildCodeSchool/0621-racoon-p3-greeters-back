const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('', (req, res) => {
  const sql = `SELECT * FROM concept`
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

router.put('/', (req, res) => {
  const lang = req.params.lang
  const value = [
    `concept_title1_${lang}`,
    `concept_title2_${lang}`,
    `concept_title3_${lang}`,
    `concept_content_${lang}`
  ]
  const sql = `SELECT ?, ?, ?, concept_photo, ? FROM concept WHERE concept_id=1`
  mysql.query(sql, value, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error updating')
    } else {
      const conceptFromDb = result[0]
      if (conceptFromDb) {
        const conceptPropsToUpdate = req.body
        mysql.query('UPDATE concept SET ?'[conceptPropsToUpdate], err => {
          if (err) {
            console.log(err)
            res.status(500).send('Error updating')
          } else {
            //const updated = { ...personFromDb, ...personPropsToUpdate }//
            res.status(200).json(conceptPropsToUpdate)
          }
        })
      }
    }
  })
})

module.exports = router
