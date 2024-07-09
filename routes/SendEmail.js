const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

require('dotenv').config();

// Configuration de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andriambololomananabrondone@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

// Fonction pour envoyer l'e-mail
const sendEmail = (to, subject, emailContent, callback) => {
  // Options de l'e-mail
  const mailOptions = {
    from: 'no-reply@gmail.com',
    to: to,
    subject: subject,
    html: emailContent
  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, info.response);
    }
  });
};

router.get('/promouvoir/:email/:nom/:niveau', (req, res) => {
  const to = req.params.email;
  const nom = req.params.nom;
  const niveau = req.params.niveau;
  const subject = "Résultat des examens";

  // Construction du contenu de l'e-mail en HTML
  const emailContent = `
    <div>
      <h1>Félicitation ${nom.toUpperCase()}</h1>
      <p style="font-size: 17px; max-width: 850px">Nous sommes heureux de vous annoncer que vous avez été admis définitivement en ${niveau}.</p>
      <p style="font-size: 16px">Cordialement,</p>
      <p style="font-size: 16px">La direction de l'Ecole Nationale d'Informatique (ENI) Fianarantsoa</p>
    </div>
  `;

  // Envoyer l'e-mail et gérer la réponse
  sendEmail(to, subject, emailContent, (error, response) => {
    if (error) {
      res.status(500).json({ error: 'error network' });
    } else {
      res.send('E-mail envoyé avec succès');
    }
  });
});

router.get('/redoubler/:email/:nom/:niveau', (req, res) => {
  const to = req.params.email;
  const nom = req.params.nom;
  const niveau = req.params.niveau;
  const subject = "Résultat des examens";

  // Construction du contenu de l'e-mail en HTML
  const emailContent = `
    <div>
      <h1>Cher ${nom.toUpperCase()}</h1>
      <p style="font-size: 17px; max-width: 850px">Nous sommes désolés de vous annoncer que vous avez êtes autorisé à redoubler en ${niveau}.</p>
      <p style="font-size: 16px">Cordialement,</p>
      <p style="font-size: 16px">La direction de l'Ecole Nationale d'Informatique (ENI) Fianarantsoa</p>
    </div>
  `;

  // Envoyer l'e-mail et gérer la réponse
  sendEmail(to, subject, emailContent, (error, response) => {
    if (error) {
      res.status(500).json({ error: 'error network' });
    } else {
      res.send('E-mail envoyé avec succès');
    }
  });
});

module.exports = router;
