const express = require('express')
const router = express.Router()
const models = require('../models')
const bcryptjs = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { validateToken } = require('../middlewares/AuthMiddleware')
const { where } = require('sequelize')

require('dotenv').config();

router.get("/", async (req, res) => {
  const listOfPersonne = await models.Personne.findAll({
    order: [['id', 'DESC']],
    limit: 1
  })
  res.json(listOfPersonne)
})

router.get('/auth', validateToken, (req, res) => {
  res.json(req.personne)
})

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id
  const personne = await models.Personne.findByPk(id, {
    attributes: ['nom', 'prenom', 'phone', 'email', 'adresse', 'date_nais', 'lieu_nais', 'photo'],
  })
  res.json(personne)
})

router.get("/enseignant/byId/:id", async (req, res) => {
  const id = req.params.id
  const enseignant = await models.Personne.findOne({
    attributes: ['nom', 'prenom', 'phone', 'email', 'adresse', 'date_nais', 'lieu_nais', 'photo'],
    include: [{
      model: models.Enseignant,
      attributes: ['grade'],
    }],
    where: { id: id }
  })
  res.json(enseignant)
})

router.get("/etudiant/byId/:id", async (req, res) => {
  const id = req.params.id
  const personneEt = await models.Personne.findOne({
    attributes: ['nom', 'prenom', 'phone', 'email', 'adresse', 'date_nais', 'lieu_nais', 'photo'],
    include: [{
      model: models.Etudiant,
      attributes: ['matricule', 'niveau', 'parcours', 'statut'],
    }],
    where: { id: id }
  })
  res.json(personneEt)
})

router.post("/", async (req, res) => {
  const {
    nom,
    prenom,
    phone,
    email,
    adresse,
    lieu_nais,
    mdp,
    statue
  } = req.body


  // Transformation du format de la date
  const userDateString = req.body.date_nais
  const userDate = new Date(userDateString)
  const sequelizeDateFormattedDate = userDate.toISOString().split('T')[0]

  bcryptjs.hash(mdp, 10).then((hash) => {
    models.Personne.create({
      nom,
      prenom,
      phone,
      email,
      adresse,
      lieu_nais,
      date_nais: sequelizeDateFormattedDate,
      mdp: hash,
      statue
    })
    res.json("SUCCESS")
  })
})

router.post("/login", async (req, res) => {
  const { email, mdp } = req.body

  const personne = await models.Personne.findOne({
    include: [{
      model: models.Etudiant,
      attributes: ['matricule', 'niveau', 'parcours'],
    }],

    where: { email: email }
  })

  if (!personne) {
    res.json({ error: "Adresse e-mail invalide" })
  } else {
    bcryptjs.compare(mdp, personne.mdp).then((match) => {
      if (!match) {
        res.json({ error: "Mot de passe incorrect" })
      } else {
        const accessToken = sign(
          { id: personne.id, nom: personne.nom, statut: personne.statue },
          process.env.JWT_SIGN_SECRET,
          { expiresIn: '1h' }
        )
        if (personne.statue === "etudiant") {
          res.json({
            token: accessToken,
            nom: personne.nom,
            id: personne.id,
            statut: personne.statue,
            niveau: personne.Etudiants[0].niveau,
            matricule: personne.Etudiants[0].matricule,
            parcours: personne.Etudiants[0].parcours,
          })
        } else {
          res.json({ token: accessToken, nom: personne.nom, id: personne.id, statut: personne.statue, niveau: "", matricule: "", parcours: "" })
        }
      }
    }).catch((err) => {
      console.log(err);
    })
  }
})

router.put("/:id", async (req, res) => {
  const personneId = req.params.id
  const {
    nom,
    prenom,
    phone,
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
      phone,
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