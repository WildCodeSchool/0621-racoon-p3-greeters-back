const express = require('express')
const connection = require('./db-config')
const app = express()

connection.connect(err => {
  if (err) {
    console.error('error connecting: ' + err.stack)
  } else {
    console.log('connected as id ' + connection.threadId)
  }
})

const port = process.env.PORT || 3000

app.use(express.json())

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
