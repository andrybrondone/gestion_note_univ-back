const express = require('express')
const router = express.Router()
const models = require('../models')
const { Sequelize, where } = require('sequelize')

router.get("/:niveau", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0
  const niveau = req.params.niveau || "L1"

  const listOfNote = await models.Note.findAll({
    attributes: ['id', 'note'],
    include: [
      {
        model: models.Etudiant,
        attributes: ['matricule', 'parcours'],
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
    where: { '$Etudiant.niveau$': niveau },
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
    ],
    where: { '$Etudiant.niveau$': niveau },
  })

  res.json({ notes: listOfNote, totalPage: Math.ceil(count / limit) })
})

router.get("/recherche/:niveau/:search", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const niveau = req.params.niveau || "L1";
  const search = req.params.search;

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
        where: {
          matricule: {
            [Sequelize.Op.like]: `%${search}%`
          },
          niveau: niveau,
        },
      },
      {
        model: models.Matiere,
        attributes: ['nom_mat'],
      }
    ],
    limit,
    offset
  });

  const count = await models.Note.count({
    include: [
      {
        model: models.Etudiant,
        include: [{
          model: models.Personne,
        }],
        where: {
          matricule: {
            [Sequelize.Op.like]: `%${search}%`
          },
          niveau: niveau,
        },
      },
      {
        model: models.Matiere,
      }
    ]
  });

  res.json({ notes: listOfNote, totalPage: Math.ceil(count / limit) });
});

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

router.get("/byEns/:idPers/:niveau/:parcours", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const offset = parseInt(req.query.offset) || 0
  const idPers = req.params.idPers
  const niveau = req.params.niveau || "L1"
  const parcours = req.params.parcours || "IG"

  const enseignantId = await models.Enseignant.findOne({ attributes: ["id"], where: { PersonneId: idPers } })

  const listOfNote = await models.Note.findAll({
    attributes: ['id', 'note'],
    include: [
      {
        model: models.Etudiant,
        attributes: ['id', 'matricule', 'parcours'],
        include: [{
          model: models.Personne,
          attributes: ['nom', 'prenom'],
        }],
      },
      {
        model: models.Matiere,
        attributes: ['nom_mat'],
        where: { EnseignantId: enseignantId.id }
      }
    ],
    where: {
      '$Etudiant.niveau$': niveau,
      '$Etudiant.parcours$': parcours
    },
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
    ],
    where: {
      '$Etudiant.niveau$': niveau,
      '$Etudiant.parcours$': parcours
    },
  })

  res.json({ notes: listOfNote, totalPage: Math.ceil(count / limit), enseignantId })
})

router.get("/releverNote/:matricule/:niveau", async (req, res) => {
  const matricule = req.params.matricule;
  const niveau = req.params.niveau;

  try {
    // Trouver l'étudiant
    const etudiant = await models.Etudiant.findOne({
      where: { matricule: matricule },
      include: [
        {
          model: models.Personne,
          attributes: ['nom', 'prenom']
        }
      ]
    });

    if (!etudiant) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    // Récupérer les modules et leurs matières
    const modules = await models.Module.findAll({
      attributes: ['id', 'nom_module'],
      include: {
        model: models.Matiere,
        attributes: ['id', 'nom_mat', 'credit', 'niveau_mat'],
        where: { niveau_mat: niveau },
        include: {
          model: models.Note,
          attributes: ['note'],
          where: { EtudiantId: etudiant.id },
          required: false // Permet d'inclure les matières sans note
        }
      }
    });

    // Transformer les modules en objets simples pour y ajouter des propriétés
    const formattedModules = modules.map(module => {
      let totalCreditObtenu = 0;
      let totalCredit = 0;
      let totalNotes = 0;
      let matiereCount = 0;
      let allNotesAboveFive = true;

      module.Matieres.map(matiere => {
        totalCredit += matiere.credit;

        let note = 0
        if (matiere.Notes.length > 0) {
          note = matiere.Notes[0].note;
        }

        totalNotes += note;
        matiereCount++;
        if (note >= 5) {
          if (note >= 10) {
            totalCreditObtenu += matiere.credit;
          }
        } else {
          allNotesAboveFive = false;
        }

        return matiere.toJSON(); // Transformer la matière en objet simple
      });

      const moyenne = matiereCount > 0 ? totalNotes / matiereCount : 0;
      const totalCreditsObt = allNotesAboveFive ? totalCredit : totalCreditObtenu;
      const totalCredits = totalCredit;
      const validationUE = allNotesAboveFive && moyenne >= 10;

      // Transformer le module en objet simple et ajouter les propriétés calculées
      const moduleJson = module.toJSON();
      return {
        ...moduleJson,
        moyenne,
        totalCreditsObt,
        totalCredits,
        validationUE
      };
    });

    // Renvoyer les données formatées
    res.json({ modules: formattedModules });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des données" });
  }
});


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