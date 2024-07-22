const express = require('express')
const router = express.Router()
const models = require('../models')
const bcryptjs = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { validateToken } = require('../middlewares/AuthMiddleware')
const { upload } = require('../middlewares/UploadMiddleware')
const fs = require('fs');
const path = require('path');

require('dotenv').config();

router.get("/", async (req, res) => {
  const listOfPersonne = await models.Personne.findOne({
    attributes: ['id', 'nom', 'prenom'],
    order: [['id', 'DESC']],
  })
  res.json(listOfPersonne)
})

router.get('/auth', validateToken, (req, res) => {
  res.json(req.personne)
})

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id
  const personne = await models.Personne.findByPk(id, {
    attributes: ['id', 'nom', 'prenom', 'phone', 'email', 'adresse', 'date_nais', 'lieu_nais', 'photo'],
  })
  res.json(personne)
})

router.get("/photo/:id", async (req, res) => {
  const id = req.params.id
  const personne = await models.Personne.findByPk(id, {
    attributes: ['photo'],
  })
  res.json(personne)
})

router.get("/enseignant/byId/:id", async (req, res) => {
  const id = req.params.id
  const enseignant = await models.Personne.findOne({
    attributes: ['id', 'nom', 'prenom', 'phone', 'email', 'adresse', 'date_nais', 'lieu_nais', 'photo'],
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
    attributes: ['id', 'nom', 'prenom', 'phone', 'email', 'adresse', 'date_nais', 'lieu_nais', 'photo'],
    include: [{
      model: models.Etudiant,
      attributes: ['id', 'matricule', 'niveau', 'parcours', 'statut'],
    }],
    where: { id: id }
  })
  res.json(personneEt)
})

router.post("/", (req, res) => {
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


  bcryptjs.hash(mdp, 10).then(async (hash) => {
    try {
      await models.Personne.create({
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
      res.status(201).json("success")
    } catch (error) {
      console.log(error.name)
      if (error.name === "SequelizeUniqueConstraintError") {
        res.json({ error: "duplication" })
      }
    }
  })
})

router.post("/login", async (req, res) => {
  const { email, mdp } = req.body;

  const personne = await models.Personne.findOne({
    where: { email: email }
  });

  if (!personne) {
    return res.json({ error: "Adresse e-mail invalide" });
  }

  const etudiant = await models.Etudiant.findOne({
    attributes: ['matricule', 'niveau', 'parcours'],
    where: { PersonneId: personne.id }
  });

  bcryptjs.compare(mdp, personne.mdp).then((match) => {
    if (!match) {
      return res.json({ error: "Mot de passe incorrect" });
    } else {
      const accessToken = sign(
        {
          id: personne.id, nom: personne.nom, statut: personne.statue, niveau: etudiant ? etudiant.niveau : '',
          matricule: etudiant ? etudiant.matricule : '',
          parcours: etudiant ? etudiant.parcours : '',
        },
        process.env.JWT_SIGN_SECRET,
        { expiresIn: '1h' }
      );
      if (personne.statue === "etudiant") {
        return res.json({
          token: accessToken,
          nom: personne.nom,
          id: personne.id,
          statut: personne.statue,
          niveau: etudiant ? etudiant.niveau : '',
          matricule: etudiant ? etudiant.matricule : '',
          parcours: etudiant ? etudiant.parcours : '',
        });
      } else {
        return res.json({
          token: accessToken,
          nom: personne.nom,
          id: personne.id,
          statut: personne.statue,
          niveau: "",
          matricule: "",
          parcours: ""
        });
      }
    }
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  });
});


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

router.put('/updatephoto/:id', upload.single('photo'), async (req, res) => {
  const personneId = req.params.id
  const image = req.file.filename;

  try {
    const personne = await models.Personne.findOne({ where: { id: personneId } });

    if (!personne) {
      return res.json({ error: 'Utilisateur invalide' });
    }

    const imagePath = path.join(__dirname, '..', 'public', 'images', personne.photo);

    if (personne.photo !== "default_photo.jpg") {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image: ', err);
          return res.status(500).json({ error: 'Internal server error while deleting image' });
        }
        console.log('Image deleted successfully');

        personne.photo = image;
        personne.save();
        res.status(200).json({ Status: 'Success', message: 'Image change successfully' });
      });
    } else {
      personne.photo = image;
      personne.save();
      res.status(200).json({ Status: 'Success', message: 'Image change successfully' });
    }
  } catch (error) {
    console.error('Error : ', error)
    res.status(500).json({ error: 'Internal server error' })
  }

})

router.put('/delete-photo/:id', upload.single('photo'), async (req, res) => {
  const personneId = req.params.id

  try {
    const personne = await models.Personne.findOne({ where: { id: personneId } });

    if (!personne) {
      return res.json({ error: 'Utilisateur invalide' });
    }

    const imagePath = path.join(__dirname, '..', 'public', 'images', personne.photo);

    if (personne.photo !== "default_photo.jpg") {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image: ', err);
          return res.status(500).json({ error: 'Internal server error while deleting image' });
        }
        console.log('Image deleted successfully');

        personne.photo = "default_photo.jpg";
        personne.save();
        res.status(200).json({ Status: 'Success', message: 'Image deleted successfully' });
      });
    } else {
      res.json({ Status: 'empty', message: "Aucune photo à supprimer" })
    }
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