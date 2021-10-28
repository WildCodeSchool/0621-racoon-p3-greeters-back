const connection = require('./db-config')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const routes = require('./routes/index')

const app = express()

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

app.use(express.static('assets'))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/admin', routes.admin)
app.use('/auth', routes.auth)
app.use('/city', routes.city)
app.use('/concept', routes.concept)
app.use('/description', routes.description)
app.use('/languages', routes.lang)
app.use('/person', routes.person)
app.use('/photos', routes.photos)
app.use('/thematic', routes.them)
app.use('/value', routes.value)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
