const express = require('express')
const mysql = require('../db-config')

const router = express.Router()

router.get('/', (req, res) => {
  //all commentaires//
  mysql.query('SELECT * FROM livre_or ', (err, result) => {
    if (err) {
      res.status(500).send('Error from Database')
    } else {
      res.status(200).json(result)
    }
  })
})
//AJOUTER UN GET PAR ID POUR APPELER UN COMM SEULEMENT//
router.get('/:id', (req, res) => {
  const livreOrId = req.params.id
  mysql.query(
    'SELECT * FROM livre_or WHERE id = ?',
    [livreOrId],
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).send('Error from Database')
      } else {
        res.status(200).json(result)
      }
    }
  )
})
//AJOUTER UN POST//
router.post('/', (req, res) => {
  const livreOrData = [
    req.livre_or_firstname,
    req.livre_or_object,
    req.livre_or_commentaire,
    req.livre_or_validation
  ]
  const sql = `INSERT INTO livreOr (livre_or_firstname, livre_or_object, livre_or_commentaire, livre_or_validation)
  VALUES (?, ?, ?, ?)`
  mysql.query(sql, livreOrData, (err, result) => {
    if (err) {
      res.status(500).send('Error from database')
    } else {
      res.status(200).json(result)
    }
  })
})
//AJOUT UN PUT PAR ID=> un comm a update?//
//AJOUT UN DELETE PAR ID//
router.delete('/:id', (req, res) => {
  const livreOrData = req.params.id
  mysql.query(`DELETE FROM * WHERE id = ?`, [livreOrData], (err, result) => {
    if (err) {
      res.status(500).send('Error deleted')
    } else {
      res.status(200).send('Post deleted')
    }
  })
})
module.exports = router
