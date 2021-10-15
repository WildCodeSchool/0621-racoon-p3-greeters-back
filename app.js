const express = require('express')
const connection = require('./db-config')
const serve = require('express-static')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const routes = require('./routes/index')
const jwt = require('jsonwebtoken')
require('dotenv').config()

require('dotenv').config()

const port = process.env.PORT || 3000

app.use(express.json())

//connexion Mysql
connection.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack)
  } else {
    console.log('connected as id ' + connection.threadId)
  }
})

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('assets'))
app.use('/person', routes.person)
app.use('/city', routes.city)
app.use('/description', routes.description)
app.use('/value', routes.value)
app.use('/concept', routes.concept)
app.use('/thematic', routes.them)
app.use('/languages', routes.lang)
app.use('/photos', routes.photos)
app.use('/admin', routes.admin)
app.use('/auth', routes.auth)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
