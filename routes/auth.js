const express = require('express')
const connection = require('../db-config')
const jwt = require('jsonwebtoken')
const db = connection.promise()
const argon2 = require('argon2')
require('dotenv').config()
const mysql = require('../db-config')

const router = express.Router()

//Calculate Token with jwt
const calculateToken = (userEmail = '') => {
  return jwt.sign({ log: userEmail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1800s'
  })
}

//Find admin in DB
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

//Check password
const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions)
}

//Get token from req
const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  }
  return null
}

//Post route to check if password is valid
router.post('/', (req, res) => {
  const { log, password } = req.body
  findByLog(log).then(user => {
    if (!user) res.status(401).send('Invalid log')
    else {
      verifyPassword(password, user.admin_passw).then(passwC => {
        if (passwC) {
          const token = calculateToken(log)
          res.send(token)
        } else res.send('Invalid')
      })
    }
  })
})

//Post route, check if token is valid
router.post('/protected', (req, res) => {
  const token = getToken(req)
  jwt.verify(
    JSON.parse(token),
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).send('Error')
      }
      return res.status(200).send('Success')
    }
  )
})

module.exports = router
