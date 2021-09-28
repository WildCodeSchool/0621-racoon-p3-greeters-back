const express = require('express')
const { Result } = require('express-validator')
const Joi = require('joi')
const { contact } = require('.')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  mysql.query('SELECT * FROM contact', (err, result) => {
    if (err) {
      res.status(500).send('Error from database')
    } else {
      res.status(200).json(result)
    }
  })
})
router.post('/', (req, res) => {
  const bodyData = [
    req.body.contact_firstname,
    req.body.contact_lastname,
    req.body.contact_mail,
    req.body.contact_object,
    req.body.contact_message
  ]
  const sql =
    'SELECT INTO contact (contact_firstname, contact_lastname, contact_mail, contact_object, contact_message) VALUES (?, ?, ?, ?, ?)'
  mysql.query(sql, bodyData, (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error from database')
    } else {
      const { error } = Joi.object({
        contact_mail: Joi.string().mail().max(255).required(),
        contact_firstname: Joi.string().max(255).required(),
        contact_lastname: Joi.string().max(255).required()
      }).validate(
        { contact_mail, contact_firstname, contact_lastname },
        { abortEarly: false }
      )

      if (error) {
        res.status(422).json({ validationErrors: error.details })
      } else {
        const sql2 =
          'INSERT INTO contact (contact_object, contact_message, contact_lastname, contact_firstname, contact_mail, contact_treated, contact_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
        const contactData = [req.body.contact_treated, req.body.contact_date]
        mysql.query(sql2, contactData, (err, result2) => {
          if (err) {
            res.status(500).send('2nd Error from database')
          } else {
            res.status(200).json({ result, result2 })
          }
        })
      }
    }
  })
})

module.exports = router
