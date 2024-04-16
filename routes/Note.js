const express = require('express')
const router = express.Router()
const models = require('../models')
//const { Sequelize } = require('sequelize')

router.get("/", async (req, res) => {
  /*const listOfNote = await Note.findAll({
    attributes: [
      'nom_mat',
      'niveau_mat',
      'credit',
      [Sequelize.col('enseignants.nom_ens'), 'nom_ens'],
      [Sequelize.col('enseignants.prenom_ens'), 'prenom_ens'],
      [Sequelize.col('modules.nom_module'), 'nom_module'],
    ],
    include: [
      {
        model: Enseignant,
        attributes: ['nom_ens', 'prenom_ens'],
      },
      {
        model: Module,
        attributes: ['nom_module'],
      }
    ],
    where: {
      [Sequelize.literal('notes.id_ens')]: Sequelize.col('enseignants.id_ens'),
      [Sequelize.literal('notes.id_module')]: Sequelize.col('modules.id_module'),
    },
    order: [['id_mat', 'DESC']]
  })
  res.json(listOfNote)*/
})

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id
  const note = await models.Note.findByPk(id)
  res.json(note)
})

router.post("/", async (req, res) => {
  const {
    id_et,
    id_mat,
    note,
  } = req.body

  try {
    const newModule = await models.Note.create({
      EtudiantId: id_et,
      MatiereId: id_mat,
      note,
    })
    res.status(201).json(newModule)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put("/:id", async (req, res) => {
  const noteId = req.params.id
  const post = req.body
  await models.Note.update(post, { where: { id: noteId } })
  res.json(post)
})

router.delete("/:id", async (req, res) => {
  const noteId = req.params.id
  await models.Note.destroy({
    where: {
      id: noteId
    }
  })
  res.json("Delete ok")
})

module.exports = router