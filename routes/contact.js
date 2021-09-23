const express = require('express')
const { Result } = require('express-validator')
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
    req.body.contact_email,
    req.body.contact_content,
    req.body.contact_object
  ]
  const sql = 'INSERT INTO contact'
  mysql.query('')
})

module.exports = router
