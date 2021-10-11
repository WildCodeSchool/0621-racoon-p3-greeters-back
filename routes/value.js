const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//get for valeur fr and en//
router.get('/', (req, res) => {
  const sql = `SELECT * FROM value`
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

//put for valeur fr and en//
router.put('/:lang', (req, res) => {
  const lang = req.params.lang
  const langReq = [
    `value_title1_${lang}`,
    `value_title2_${lang}`,
    `value_content_${lang}`
  ]
  const sql = `SELECT value_id, ?, ?, value_photo, ? FROM value`
  mysql.query(sql, langReq, (err, selectResult) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error updating value')
    } else {
      const valueFromDb = selectResult[0]
      if (valueFromDb) {
        const valueToUpdate = req.body
        const sql2 = 'UPDATE value SET ? WHERE value.value_id=1'
        mysql.query(sql2, [valueToUpdate, lang], err => {
          if (err) {
            console.log(err)
            res.status(500).send('Error updating value')
          } else {
            //const updated = { ...cityFromDb, ...cityToUpdate }
            res.status(200).json(valueToUpdate)
          }
        })
      } else {
        res.status(404).send(`not found.`)
      }
    }
  })
})
module.exports = router
