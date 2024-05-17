const express = require('express')
const router = express.Router()
const models = require('../models');
const { Sequelize, Op } = require('sequelize');

const parcoursOptions = [
  { value: "IG", label: "IG" },
  { value: "GBD", label: "GBD" },
  { value: "ASR", label: "ASR" },
  { value: "GID", label: "GID" },
  { value: "OCC", label: "OCC" },
];

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0

  const listOfMatiere = await models.Matiere.findAll({
    attributes: ['id', 'nom_mat', 'credit', 'niveau_mat', 'parcours'],
    include: [
      {
        model: models.Enseignant,
        attributes: ['PersonneId'],
        include: [{
          model: models.Personne,
          attributes: ['nom', 'prenom'],
        }],
      },
      {
        model: models.Module,
        attributes: ['nom_module'],
        where: { delete: "false" },
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

router.get("/nom/:niveau", async (req, res) => {
  const niveau = req.params.niveau

  const nameOfMatiere = await models.Matiere.findAll({
    attributes: ['id', 'nom_mat'],
    where: { niveau_mat: niveau },
  })

  res.json(nameOfMatiere)
})

router.get("/byNiveau/:niveau/:parcours", async (req, res) => {
  const niveau = req.params.niveau;
  const parcours = req.params.parcours;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const listOfMatiereByNiveau = await models.Matiere.findAll({
    attributes: ['id', 'nom_mat', 'credit'],
    include: [
      {
        model: models.Enseignant,
        attributes: ['PersonneId'],
        include: [{
          model: models.Personne,
          attributes: ['nom', 'prenom'],
        }],
      },
      {
        model: models.Module,
        attributes: ['nom_module'],
        where: { delete: "false" },
      }
    ],
    where: {
      niveau_mat: niveau,
      parcours: { [Sequelize.Op.contains]: [parcours] } // Utilisation de l'opérateur de Sequelize pour vérifier si le parcours est contenu dans le tableau
    },
    order: [['id', 'DESC']],
    limit,
    offset
  });

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
    ],
    where: {
      niveau_mat: niveau,
      parcours: { [Sequelize.Op.contains]: [parcours] }
    }
  });

  res.json({ matieresParNiveau: listOfMatiereByNiveau, totalPage: Math.ceil(count / limit) });
});

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
    parcours,
    credit,
  } = req.body

  try {
    const newModule = await models.Matiere.create({
      EnseignantId: id_ens,
      ModuleId: id_module,
      nom_mat,
      niveau_mat,
      parcours: parcours.filter((parcours) => parcoursOptions.map((option) => option.value).includes(parcours)),
      credit
    })
    res.status(201).json(newModule)
  } catch (error) {
    console.error(error.name)
    res.json({ error: 'error' })
  }
})

router.put("/:id", async (req, res) => {
  const matiereId = req.params.id

  const {
    id_ens,
    id_module,
    nom_mat,
    niveau_mat,
    parcours,
    credit,
  } = req.body

  try {
    const updateMatiere = await models.Matiere.update(
      {
        EnseignantId: id_ens,
        ModuleId: id_module,
        nom_mat,
        niveau_mat,
        parcours: parcours.filter((parcours) => parcoursOptions.map((option) => option.value).includes(parcours)),
        credit
      },
      {
        where: { id: matiereId }
      }
    )
    res.status(201).json(updateMatiere)
  } catch (error) {
    res.json({ error: 'error' })
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