const express = require('express')
const mysql = require('../db-config')

// const { Result } = require('express-validator')
const Joi = require('joi')
// const { contact } = require('.')

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
  const { firstname, lastname, mail, object, message } = req.body

  const { error } = Joi.object({
    mail: Joi.string().email().max(255).required(),
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required()
  }).validate({ mail, firstname, lastname }, { abortEarly: false })

  if (error) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    const sql =
      'INSERT INTO contact (contact_object, contact_message, contact_lastname, contact_firstname, contact_mail, contact_treated, contact_date) VALUES (?, ?, ?, ?, ?, false, NOW())'
    mysql.query(
      sql,
      [object, message, lastname, firstname, mail],
      (err, result) => {
        if (err) {
          console.log(err)
          res.status(500).send('Error from database')
        } else {
          res.status(200).json(result)
        }
      }
    )
  }
})

module.exports = router
