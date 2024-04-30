const express = require('express')
const router = express.Router()
const models = require('../models')

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  const listOfMatiere = await models.Matiere.findAll({
    attributes: ['id', 'nom_mat', 'credit', 'niveau_mat'],
    include: [
      {
        model: models.Enseignant,
        attributes: ['personneId'],
        include: [{
          model: models.Personne,
          attributes: ['nom', 'prenom'],
        }],
      },
      {
        model: models.Module,
        attributes: ['nom_module'],
        //where: { delete: "false" },
      }
    ],
    order: [['id', 'DESC']],
    limit,
    offset
  })

  const count = await models.Matiere.count({
    include: [
      {
        model: models.Enseignant,
        include: [{
          model: models.Personne,
        }],
      },
      {
        model: models.Module,
      }
    ]
  })

  res.json({ matieres: listOfMatiere, totalPage: Math.ceil(count / limit) })
})

router.get("/nom", async (req, res) => {
  const nameOfMatiere = await models.Matiere.findAll({
    attributes: ['id', 'nom_mat']
  })
  res.json(nameOfMatiere)
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

  const {
    id_ens,
    id_module,
    nom_mat,
    niveau_mat,
    credit,
  } = req.body

  try {
    const updateMatiere = await models.Matiere.update(
      {
        EnseignantId: id_ens,
        ModuleId: id_module,
        nom_mat,
        niveau_mat,
        credit
      },
      {
        where: { id: matiereId }
      }
    )
    res.status(201).json(updateMatiere)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }

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