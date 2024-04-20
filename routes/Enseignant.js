const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/", async (req, res) => {
  const nameOfEnseignant = await models.Enseignant.findAll({
    attributes: ['id'],
    include: [{
      model: models.Personne,
      attributes: ['nom', 'prenom'],
    }]
  })
  res.json(nameOfEnseignant)
})

router.get("/info", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  const listOfEnseignant = await models.Enseignant.findAll({
    attributes: ['id', 'grade'],
    include: [{
      model: models.Personne,
      attributes: ['nom', 'prenom', 'email', 'photo'],
    }],
    order: [['id', 'DESC']],
    limit,
    offset
  })

  const count = await models.Enseignant.count({ include: [models.Personne] })

  res.json({ enseignants: listOfEnseignant, totalPage: Math.ceil(count / limit) })
})

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id
  const enseignant = await models.Enseignant.findByPk(id)
  res.json(enseignant)
})

router.post("/", async (req, res) => {
  const { id_pers, grade, } = req.body

  try {
    const newEnseignant = await models.Enseignant.create({
      PersonneId: id_pers,
      grade,
    })
    res.status(201).json(newEnseignant)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put("/:id", async (req, res) => {
  const enseignantId = req.params.id
  const post = req.body
  await models.Enseignant.update(post, { where: { id: enseignantId } })
  res.json(post)
})

router.delete("/:id", async (req, res) => {
  const enseignantId = req.params.id
  await models.Enseignant.destroy({
    where: {
      id: enseignantId
    }
  })
  res.json("Delete ok")
})

module.exports = router