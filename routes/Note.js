const express = require('express')
const router = express.Router()
const models = require('../models')
const { Sequelize } = require('sequelize')

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  const listOfNote = await models.Note.findAll({
    attributes: ['id', 'note'],
    include: [
      {
        model: models.Etudiant,
        attributes: ['matricule'],
        include: [{
          model: models.Personne,
          attributes: ['nom', 'prenom'],
        }],
      },
      {
        model: models.Matiere,
        attributes: ['nom_mat'],
      }
    ],
    order: [['id', 'DESC']],
    limit,
    offset
  })

  const count = await models.Note.count({
    include: [
      {
        model: models.Etudiant,
        include: [{
          model: models.Personne,
        }],
      },
      {
        model: models.Matiere,
      }
    ]
  })

  res.json({ notes: listOfNote, totalPage: Math.ceil(count / limit) })
})

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id
  const note = await models.Note.findByPk(id)
  res.json(note)
})

router.get("/byEtudiant/:matricule", async (req, res) => {
  const matricule = req.params.matricule
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  const listOfNoteByEt = await models.Note.findAll({
    attributes: ['id', 'note'],
    include: [
      {
        model: models.Etudiant,
        attributes: ['matricule'],
        where: { matricule: matricule },
      },
      {
        model: models.Matiere,
        attributes: ['nom_mat'],
        order: [['nom_mat', 'ASC']],
      }
    ],
    limit,
    offset
  })

  const count = await models.Note.count({
    include: [
      {
        model: models.Etudiant,
      },
      {
        model: models.Matiere,
      }
    ]
  })

  res.json({ noteParEtudiant: listOfNoteByEt, totalPage: Math.ceil(count / limit) })
})

router.get("/releverNote/:matricule", async (req, res) => {
  const matricule = req.params.matricule

  // Trouver l'étudiant
  const etudiant = await models.Etudiant.findOne({
    attributes: ['id'],
    where: { matricule: matricule },
    include: [{
      model: models.Personne,
      attributes: ['nom', 'prenom', 'date_nais', 'lieu_nais'],
    }]
  })

  // Trouver les notes de l'étudiant
  const notesEtudiant = await models.Note.findAll({
    where: { EtudiantId: etudiant.id }, // Utilise l'id de l'étudiant
    attributes: ['id', 'note'],
    include: [{
      model: models.Matiere,
      attributes: ['nom_mat', 'credit'],
      include: [{
        model: models.Module,
        attributes: ['id', 'nom_module'],
      }],
      group: ['ModuleId']
    }],
  })

  // Renvoyer l'étudiant avec ses notes
  res.json({ etudiant, notes: notesEtudiant })
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
    res.json({ error: 'error' })
  }
})

router.put("/:id", async (req, res) => {
  const noteId = req.params.id

  const {
    id_et,
    id_mat,
    note,
  } = req.body

  try {
    const updateNote = await models.Note.update(
      {
        EtudiantId: id_et,
        MatiereId: id_mat,
        note
      },
      {
        where: { id: noteId }
      }
    )
    res.status(201).json(updateNote)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
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