const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/", async (req, res) => {
  const listOfPersonne = await models.Personne.findAll({
    order: [['id', 'DESC']],
    limit: 1
  })
  res.json(listOfPersonne)
})

router.post("/", async (req, res) => {
  const {
    nom,
    prenom,
    email,
    adresse,
    lieu_nais,
    mdp,
    statue
  } = req.body

  const userDateString = req.body.date_nais
  const userDate = new Date(userDateString)

  const sequelizeDateFormattedDate = userDate.toISOString().split('T')[0]

  try {
    const newPersonne = await models.Personne.create({
      nom,
      prenom,
      email,
      adresse,
      lieu_nais,
      date_nais: sequelizeDateFormattedDate,
      mdp,
      statue
    })
    res.status(201).json(newPersonne)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }

})

router.put("/:id", async (req, res) => {
  const personneId = req.params.id
  const {
    nom,
    prenom,
    email,
    adresse,
    lieu_nais,
  } = req.body

  const userDateString = req.body.date_nais
  const userDate = new Date(userDateString)

  const sequelizeDateFormattedDate = userDate.toISOString().split('T')[0]

  try {
    const newPersonne = await models.Personne.update({
      nom,
      prenom,
      email,
      adresse,
      lieu_nais,
      date_nais: sequelizeDateFormattedDate,
    }, { where: { id: personneId } })
    res.status(201).json(newPersonne)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete("/:id", async (req, res) => {
  const personneId = req.params.id
  await models.Personne.destroy({
    where: {
      id: personneId
    }
  })
  res.json("Delete ok")
})

module.exports = router