const express = require('express')
const jwt = require('jsonwebtoken')
const connection = require('../db-config')
const db = connection.promise()
const argon2 = require('argon2')
const crypto = require('crypto')
require('dotenv').config()
const mysql = require('../db-config')

const router = express.Router()

const calculateToken = (userEmail = '') => {
  return crypto
    .createHash('md5')
    .update(userEmail + process.env.ACCESS_TOKEN_SECRET)
    .digest('hex')
}

const findByLog = log => {
  return db
    .query('SELECT * FROM admin WHERE admin_log = ?', [log])

    .then(
      ([results]) => console.log('poulet ou autres', results[0]) || results[0]
    )
}

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1
}

const hashPassword = plainPassword => {
  return argon2.hash(plainPassword, hashingOptions)
}

const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions)
}

// function generateAccesToken(adminData) {
//   return jwt.sign(adminData, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: '1800s'
//   })
// }

router.post('/', (req, res) => {
  let adminData
  mysql.query(`SELECT * FROM admin`, (err, result) => {
    if (err) {
      status(500).send(err)
    } else {
      adminData = result[0]
    }
    const { log, password } = req.body
    console.log(req.body)
    findByLog(log).then(u => {
      if (!u) res.status(401).send('Invalid log')
      else {
        console.log('on est dedans!' + password)
        verifyPassword(password, adminData.admin_passw).then(passwC => {
          if (passwC) {
            const token = calculateToken(log)
            console.log(token)
            res.cookie('user_token', token)
            res.send('bijou' + token)
          } else res.status(401).send('Invalid password')
        })
      }
    })
  })
})

module.exports = router
