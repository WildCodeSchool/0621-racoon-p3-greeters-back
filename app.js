const express = require('express')
const connection = require('./db-config')
const serve = require('express-static')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const routes = require('./routes/index')

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

app.use(serve(__dirname + '/assets'))
app.use(express.static('assets'))
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/person', routes.person)
app.use('/city', routes.city)
app.use('/description', routes.description)
app.use('/valeur', routes.valeur)
app.use('/concept', routes.concept)

const server = app.listen(3001, function () {
  console.log('server is running at %s', server.address(3001))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
