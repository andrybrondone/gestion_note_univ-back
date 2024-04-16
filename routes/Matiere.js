const express = require('express')
const router = express.Router()
const models = require('../models')
//const { Sequelize } = require('sequelize')

router.get("/", async (req, res) => {
  const listOfMatiere = await models.Matiere.findAll({
    attributes: ['id', 'nom_mat']
  })
  res.json(listOfMatiere)
})

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id
  const matiere = await models.Matiere.findByPk(id)
  res.json(matiere)
})

router.post("/", async (req, res) => {
  const {
    id_ens,
    id_module,
    nom_mat,
    niveau_mat,
    credit,
  } = req.body

  try {
    const newModule = await models.Matiere.create({
      EnseignantId: id_ens,
      ModuleId: id_module,
      nom_mat,
      niveau_mat,
      credit
    })
    res.status(201).json(newModule)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put("/:id", async (req, res) => {
  const matiereId = req.params.id
  const post = req.body
  await models.Matiere.update(post, { where: { id: matiereId } })
  res.json(post)
})

router.delete("/:id", async (req, res) => {
  const matiereId = req.params.id
  await models.Matiere.destroy({
    where: {
      id: matiereId
    }
  })
  res.json("Delete ok")
})

module.exports = router