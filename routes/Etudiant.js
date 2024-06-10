const express = require('express')
const router = express.Router()
const models = require('../models')
const { Sequelize } = require('sequelize')

async function promouvoirEtudiant(etudiantId) {
  try {
    await models.Etudiant.promouvoir(etudiantId);
    return { success: true, message: 'Etudiant promu avec succès' };
  } catch (err) {
    console.error('Erreur lors de la promotion de l\'étudiant :', err);
    return { success: false, message: 'Erreur lors de la promotion de l\'étudiant', error: err.message };
  }
}


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

router.get("/info/:niveau/:parcours", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0
  const niveau = req.params.niveau || "L1"
  const parcours = req.params.parcours || "IG"

  const listOfEtudiant = await models.Etudiant.findAll({
    attributes: ['id', 'matricule', 'niveau', 'parcours', 'moyenne_pratique'],
    include: [{
      model: models.Personne,
      attributes: ['id', 'nom', 'prenom', 'phone', 'email', 'photo'],
    }],
    where: { niveau: niveau, parcours: parcours },
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
      attributes: ['nom', 'prenom', 'phone', 'email', 'adresse', 'date_nais', 'lieu_nais', 'photo'],
    }],
  })
  res.json(etudiant)
})

router.get("/rechercher-etudiant/:niveau/:parcours/:recherche", async (req, res) => {
  const recherche = req.params.recherche;
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0
  const niveau = req.params.niveau || "L1"
  const parcours = req.params.parcours || "IG"

  const etudiants = await models.Etudiant.findAll({
    attributes: ['id', 'matricule', 'niveau', 'parcours'],
    include: [{
      model: models.Personne,
      attributes: ['id', 'nom', 'prenom', 'phone', 'email', 'photo'],
    }],
    where: {
      [Sequelize.Op.or]: [
        {
          '$Personne.nom$': {
            [Sequelize.Op.like]: `%${recherche}%`
          }
        },
        {
          '$Personne.prenom$': {
            [Sequelize.Op.like]: `%${recherche}%`
          }
        },
        {
          matricule: {
            [Sequelize.Op.like]: `%${recherche}%`
          }
        }
      ],
      niveau: niveau,
      parcours: parcours
    },
    order: [['matricule', 'ASC']],
    limit,
    offset
  });

  const count = await models.Etudiant.count({
    where: {
      [Sequelize.Op.or]: [
        {
          '$Personne.nom$': {
            [Sequelize.Op.like]: `%${recherche}%`
          }
        },
        {
          '$Personne.prenom$': {
            [Sequelize.Op.like]: `%${recherche}%`
          }
        },
        {
          matricule: {
            [Sequelize.Op.like]: `%${recherche}%`
          }
        }
      ],
      niveau: niveau,
      parcours: parcours
    },
    include: [models.Personne]
  })

  res.json({ etudiants: etudiants, totalPage: Math.ceil(count / limit) })
});


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
    console.log(error.name)
    if (error.name === "SequelizeUniqueConstraintError") {
      res.json({ error: "duplication" })
    }
  }
})

// Route pour promouvoir un étudiant
router.post('/promouvoir/:etudiantId', async (req, res) => {
  const etudiantId = req.params.etudiantId;

  try {
    const result = await promouvoirEtudiant(etudiantId);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
});

router.put("/moyenne-pratique", async (req, res) => {
  const {
    id_et,
    moyenne_pratique,
  } = req.body

  try {
    const moyenePratique = await models.Etudiant.update({
      moyenne_pratique: moyenne_pratique,
    }, { where: { id: id_et } })
    res.status(201).json(moyenePratique)
  } catch (error) {
    console.log(error.name)
  }
})

router.put("/:id", async (req, res) => {
  const etudiantId = req.params.id
  const {
    matricule,
    niveau,
    parcours,
    statut,
  } = req.body

  try {
    const updateEtudiant = await models.Etudiant.update({
      matricule,
      niveau,
      parcours,
      statut,
    }, { where: { id: etudiantId } })
    res.status(201).json(updateEtudiant)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put("/redoubler/:id/:label", async (req, res) => {
  const etudiantId = req.params.id
  const statut = req.params.label

  try {
    const updateStatutEtudiant = await models.Etudiant.update({
      statut: statut
    }, { where: { id: etudiantId } })
    res.status(201).json(updateStatutEtudiant)
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router