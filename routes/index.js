const admin = require('./admin')
const auth = require('./auth')
const city = require('./city')
const concept = require('./concept')
const description = require('./description')
const lang = require('./language')
const person = require('./person')
const photos = require('./photos')
const them = require('./thematic')
const value = require('./value')

module.exports = {
  person,
  city,
  value,
  description,
  concept,
  them,
  lang,
  photos,
  admin,
  auth
}
