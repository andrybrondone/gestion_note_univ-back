const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/", async (req, res) => {
  const listOfEtudiant = await models.Etudiant.findAll({
    attributes: ['id'],
    include: [{
      model: models.Personne,
      attributes: ['prenom'],
    }]
  })
  res.json(listOfEtudiant)
})

router.get("/info", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  const listOfEtudiant = await models.Etudiant.findAll({
    attributes: ['id', 'matricule'],
    include: [{
      model: models.Personne,
      attributes: ['nom', 'prenom', 'email', 'photo'],
    }],
    order: [['matricule', 'ASC']],
    limit,
    offset
  })

  const count = await models.Etudiant.count({ include: [models.Personne] })

  res.json({ etudiants: listOfEtudiant, totalPage: Math.ceil(count / limit) })
})

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id
  const etudiant = await models.Etudiant.findByPk(id, {
    include: [{
      model: models.Personne,
      attributes: ['nom', 'prenom', 'email', 'adresse', 'date_nais', 'lieu_nais', 'photo'],
    }],
  })
  res.json(etudiant)
})

router.post("/", async (req, res) => {
  const {
    id_pers,
    matricule,
    niveau,
    parcours,
    statut,
  } = req.body

  try {
    const newEtudiant = await models.Etudiant.create({
      PersonneId: id_pers,
      matricule,
      niveau,
      parcours,
      statut,
    })
    res.status(201).json(newEtudiant)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put("/:id", async (req, res) => {
  const etudiantId = req.params.id
  const post = req.body
  await models.Etudiant.update(post, { where: { id: etudiantId } })
  res.json(post)
})

router.delete("/:id", async (req, res) => {
  const etudiantId = req.params.id
  await models.Etudiant.destroy({
    where: {
      id: etudiantId
    }
  })
  res.json("Delete ok")
})

module.exports = router