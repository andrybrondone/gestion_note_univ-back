const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/", async (req, res) => {
  const listOfEnseignant = await models.Enseignant.findAll({
    attributes: ['id'],
    include: [{
      model: models.Personne,
      attributes: ['prenom'],
    }]
  })
  res.json(listOfEnseignant)
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