const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

//get for valeur fr and en//
router.get('/:lang', (req, res) => {
  const lang = req.params.lang
  const sql = `SELECT value__id, value_title1_${lang}, value_title2_${lang}, value_photo, value_content_${lang} FROM value`
  mysql.query(sql, (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})

// router.put('/:id', (req, res) => {
//   const cityId = req.params.id
//   mysql.query(
//     'SELECT * FROM valeur_greeter_fr ',
//     [cityId],
//     (err, selectResult) => {
//       if (err) {
//         console.log(err)
//         res.status(500).send('Error updating a city')
//       } else {
//         const cityFromDb = selectResult[0]
//         if (cityFromDb) {
//           const cityToUpdate = req.body
//           mysql.query(
//             'UPDATE city SET ? WHERE city.city_id=?',
//             [cityToUpdate, cityId],
//             err => {
//               if (err) {
//                 console.log(err)
//                 res.status(500).send('Error updating a city')
//               } else {
//                 //const updated = { ...cityFromDb, ...cityToUpdate }
//                 res.status(200).json(cityToUpdate)
//               }
//             }
//           )
//         } else {
//           res.status(404).send(`City with id ${cityId} not found.`)
//         }
//       }
//     }
//   )
// })
module.exports = router
