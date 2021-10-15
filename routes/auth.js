const express = require('express')
const connection = require('../db-config')
const jwt = require('jsonwebtoken')
const db = connection.promise()
const argon2 = require('argon2')
require('dotenv').config()
const mysql = require('../db-config')

const router = express.Router()

const calculateToken = (userEmail = '') => {
  return jwt.sign({ log: userEmail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1800s'
  })
}

const findByLog = log => {
  return db
    .query('SELECT * FROM admin WHERE admin_log = ?', [log])

    .then(([results]) => results[0])
}

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1
}

const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions)
}

router.post('/', (req, res) => {
  let adminData
  mysql.query(`SELECT * FROM admin`, (err, result) => {
    if (err) {
      res.status(500).send(err)
    } else {
      adminData = result[0]
    }
    const { log, password } = req.body
    console.log(req.body)
    findByLog(log).then(u => {
      if (!u) res.status(401).send('Invalid log')
      else {
        verifyPassword(password, adminData.admin_passw).then(passwC => {
          if (passwC) {
            const token = calculateToken(log)
            res.send(token)
          } else res.send('Invalid')
        })
      }
    })
  })
})

module.exports = router
