const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/byEtudiantId/:id", async (req, res) => {
  const id = req.params.id
  const moyennePratique = await models.HistoriqueNiveau.findOne({
    attributes: ['moyenne_pratique'],
    where: { EtudiantId: id }
  })
  res.json(moyennePratique)
})

module.exports = router