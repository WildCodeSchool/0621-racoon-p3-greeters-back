const express = require('express')
const connection = require('./db-config')
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
app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/person', routes.person)
app.use('/city', routes.city)
<<<<<<< HEAD
app.use('/concept', routes.concept)
app.use('/contact', routes.contact)
=======
app.use('/description', routes.description)
app.use('/valeur', routes.valeur)
>>>>>>> 04b5187bbd3f8e2b2f1aed4e1e9f701ddb18f09a

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
